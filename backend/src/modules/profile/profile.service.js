import bcrypt from 'bcrypt';
import prisma from '../../db/prisma.js';
import { uploadToR2, deleteFromR2 } from '../../lib/storage.js';
import logger from '../../lib/logger.js';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  ForbiddenError,
} from '../../lib/errors.js';

// Canonical RBAC Permissions Mapping
const ROLE_PERMISSIONS = {
  FARMER: [
    'profile.read',
    'profile.update',
    'farmer.dashboard',
    'farmer.farm',
    'farmer.produce',
    'farmer.inventory',
    'farmer.recommendations',
  ],
  FPO: [
    'profile.read',
    'profile.update',
    'fpo.dashboard',
    'fpo.members',
    'fpo.produce',
    'fpo.inventory',
  ],
  LOGISTICS: [
    'profile.read',
    'profile.update',
    'logistics.dashboard',
    'logistics.vehicles',
    'logistics.shipments',
  ],
  BULK_BUYER: [
    'profile.read',
    'profile.update',
    'buyer.dashboard',
    'buyer.demands',
    'buyer.orders',
  ],
  CONSUMER: [
    'profile.read',
    'profile.update',
    'consumer.marketplace',
    'consumer.orders',
  ],
  ADMIN: [
    'profile.read',
    'profile.update',
    'admin.dashboard',
    'admin.users',
    'admin.platform',
    'admin.system',
  ],
  CONTROL_ADMIN: [
    'profile.read',
    'profile.update',
    'control.dashboard',
    'control.alerts',
    'control.signals',
    'control.gaps',
    'control.forecasts',
  ],
};

function calculateProfileCompletion(user, roleProfile) {
  if (user.role === 'ADMIN' || user.role === 'CONTROL_ADMIN') {
    return { percentage: 100, missingFields: [] };
  }

  const p = roleProfile || {};
  let checks = [];

  // Common user fields
  checks.push({ field: 'fullName', filled: Boolean(user.fullName && user.fullName.trim()) });
  checks.push({ field: 'email', filled: Boolean(user.email && user.email.trim()) });
  checks.push({ field: 'phone', filled: Boolean(user.phone && user.phone.trim()) });

  if (user.role === 'FARMER') {
    checks.push({ field: 'village', filled: Boolean(p.village) });
    checks.push({ field: 'district', filled: Boolean(p.district) });
    checks.push({ field: 'state', filled: Boolean(p.state) });
    checks.push({ field: 'pincode', filled: Boolean(p.pincode) });
    checks.push({ field: 'farmName', filled: Boolean(p.farmName) });
    checks.push({ field: 'farmingType', filled: Boolean(p.farmingType) });
    checks.push({ field: 'primaryCrops', filled: Array.isArray(p.primaryCrops) && p.primaryCrops.length > 0 });
    checks.push({ field: 'profilePhoto', filled: Boolean(p.profilePhoto) });
  } else if (user.role === 'FPO') {
    checks.push({ field: 'fpoName', filled: Boolean(p.fpoName) });
    checks.push({ field: 'registrationNumber', filled: Boolean(p.registrationNumber) });
    checks.push({ field: 'district', filled: Boolean(p.district) });
    checks.push({ field: 'state', filled: Boolean(p.state) });
    checks.push({ field: 'pincode', filled: Boolean(p.pincode) });
    checks.push({ field: 'memberCount', filled: Boolean(p.memberCount && p.memberCount > 0) });
    checks.push({ field: 'logo', filled: Boolean(p.logo) });
  } else if (user.role === 'LOGISTICS') {
    checks.push({ field: 'businessName', filled: Boolean(p.businessName) });
    checks.push({ field: 'contactPerson', filled: Boolean(p.contactPerson) });
    checks.push({ field: 'district', filled: Boolean(p.district) });
    checks.push({ field: 'state', filled: Boolean(p.state) });
    checks.push({ field: 'vehicleCount', filled: Boolean(p.vehicleCount && p.vehicleCount > 0) });
    checks.push({ field: 'vehicleTypes', filled: Array.isArray(p.vehicleTypes) && p.vehicleTypes.length > 0 });
  } else if (user.role === 'BULK_BUYER') {
    checks.push({ field: 'businessName', filled: Boolean(p.businessName) });
    checks.push({ field: 'district', filled: Boolean(p.district) });
    checks.push({ field: 'state', filled: Boolean(p.state) });
    checks.push({ field: 'pincode', filled: Boolean(p.pincode) });
    checks.push({ field: 'gstNumber', filled: Boolean(p.gstNumber) });
  } else if (user.role === 'CONSUMER') {
    checks.push({ field: 'houseFlat', filled: Boolean(p.houseFlat) });
    checks.push({ field: 'streetArea', filled: Boolean(p.streetArea) });
    checks.push({ field: 'district', filled: Boolean(p.district) });
    checks.push({ field: 'state', filled: Boolean(p.state) });
    checks.push({ field: 'pincode', filled: Boolean(p.pincode) });
  }

  const filledCount = checks.filter((c) => c.filled).length;
  const percentage = Math.round((filledCount / checks.length) * 100);
  const missingFields = checks.filter((c) => !c.filled).map((c) => c.field);

  return { percentage, missingFields };
}

function sanitizeUser(user) {
  const { passwordHash, refreshTokens, ...safe } = user;
  return safe;
}

export class ProfileService {
  /**
   * Fetch complete user profile with role attributes, verification, permissions, and completion score
   */
  static async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        fpoProfile: true,
        logisticsProfile: true,
        bulkBuyerProfile: true,
        consumerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    const roleProfile =
      user.farmerProfile ||
      user.fpoProfile ||
      user.logisticsProfile ||
      user.bulkBuyerProfile ||
      user.consumerProfile ||
      {};

    const completion = calculateProfileCompletion(user, roleProfile);
    const permissions = ROLE_PERMISSIONS[user.role] || ['profile.read'];

    const verification = {
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      accountStatus: user.status,
      kycStatus: roleProfile.kycStatus || roleProfile.verificationStatus || 'VERIFIED',
    };

    return {
      user: sanitizeUser(user),
      profile: roleProfile,
      role: user.role,
      permissions,
      verification,
      completion,
    };
  }

  /**
   * Update authenticated profile (rejects unauthorized role/status elevation)
   */
  static async updateProfile(userId, data) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        fpoProfile: true,
        logisticsProfile: true,
        bulkBuyerProfile: true,
        consumerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    const {
      fullName,
      phone,
      profilePhoto,
      addressLine,
      village,
      postOffice,
      district,
      state,
      pincode,
      farmerType,
      farmName,
      farmingType,
      irrigationType,
      totalLandArea,
      landUnit,
      primaryCrops,
      fpoName,
      representativeName,
      designation,
      memberCount,
      aggregationCapacity,
      storageAvailable,
      businessName,
      contactPerson,
      serviceArea,
      serviceAreas,
      vehicleTypes,
      vehicleCount,
      gstNumber,
      preferredArea,
      procurementFrequency,
      expectedVolume,
      houseFlat,
      streetArea,
      deliveryInstructions,
    } = data;

    // 1. Update Base User fields if provided
    const userUpdates = {};
    if (fullName !== undefined) userUpdates.fullName = fullName;
    if (phone !== undefined) userUpdates.phone = phone;

    if (Object.keys(userUpdates).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: userUpdates,
      });
    }

    // 2. Update Role Profile fields
    if (user.role === 'FARMER' && user.farmerProfile) {
      await prisma.farmerProfile.update({
        where: { userId },
        data: {
          ...(profilePhoto !== undefined ? { profilePhoto } : {}),
          ...(addressLine !== undefined ? { addressLine } : {}),
          ...(village !== undefined ? { village } : {}),
          ...(postOffice !== undefined ? { postOffice } : {}),
          ...(district !== undefined ? { district } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(pincode !== undefined ? { pincode } : {}),
          ...(farmerType !== undefined ? { farmerType } : {}),
          ...(farmName !== undefined ? { farmName } : {}),
          ...(farmingType !== undefined ? { farmingType } : {}),
          ...(irrigationType !== undefined ? { irrigationType } : {}),
          ...(totalLandArea !== undefined ? { totalLandArea } : {}),
          ...(landUnit !== undefined ? { landUnit } : {}),
          ...(primaryCrops !== undefined ? { primaryCrops } : {}),
        },
      });
    } else if (user.role === 'FPO' && user.fpoProfile) {
      await prisma.fpoProfile.update({
        where: { userId },
        data: {
          ...(profilePhoto !== undefined ? { logo: profilePhoto } : {}),
          ...(fpoName !== undefined ? { fpoName } : {}),
          ...(representativeName !== undefined ? { representativeName } : {}),
          ...(designation !== undefined ? { designation } : {}),
          ...(addressLine !== undefined ? { addressLine } : {}),
          ...(district !== undefined ? { district } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(pincode !== undefined ? { pincode } : {}),
          ...(memberCount !== undefined ? { memberCount } : {}),
          ...(aggregationCapacity !== undefined ? { aggregationCapacity } : {}),
          ...(storageAvailable !== undefined ? { storageAvailable } : {}),
          ...(primaryCrops !== undefined ? { primaryCrops } : {}),
        },
      });
    } else if (user.role === 'LOGISTICS' && user.logisticsProfile) {
      await prisma.logisticsProfile.update({
        where: { userId },
        data: {
          ...(businessName !== undefined ? { businessName } : {}),
          ...(contactPerson !== undefined ? { contactPerson } : {}),
          ...(addressLine !== undefined ? { addressLine } : {}),
          ...(district !== undefined ? { district } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(pincode !== undefined ? { pincode } : {}),
          ...(serviceArea !== undefined ? { serviceArea } : {}),
          ...(serviceAreas !== undefined ? { serviceAreas } : {}),
          ...(vehicleTypes !== undefined ? { vehicleTypes } : {}),
          ...(vehicleCount !== undefined ? { vehicleCount } : {}),
        },
      });
    } else if (user.role === 'BULK_BUYER' && user.bulkBuyerProfile) {
      await prisma.bulkBuyerProfile.update({
        where: { userId },
        data: {
          ...(businessName !== undefined ? { businessName } : {}),
          ...(contactPerson !== undefined ? { contactPersonName: contactPerson } : {}),
          ...(addressLine !== undefined ? { addressLine } : {}),
          ...(district !== undefined ? { district } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(pincode !== undefined ? { pincode } : {}),
          ...(gstNumber !== undefined ? { gstNumber } : {}),
          ...(preferredArea !== undefined ? { preferredArea } : {}),
          ...(procurementFrequency !== undefined ? { procurementFrequency } : {}),
          ...(expectedVolume !== undefined ? { expectedVolume } : {}),
          ...(primaryCrops !== undefined ? { primaryCrops } : {}),
        },
      });
    } else if (user.role === 'CONSUMER' && user.consumerProfile) {
      await prisma.consumerProfile.update({
        where: { userId },
        data: {
          ...(fullName !== undefined ? { fullName } : {}),
          ...(profilePhoto !== undefined ? { profilePhoto } : {}),
          ...(houseFlat !== undefined ? { houseFlat } : {}),
          ...(streetArea !== undefined ? { streetArea } : {}),
          ...(addressLine !== undefined ? { addressLine } : {}),
          ...(district !== undefined ? { district } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(pincode !== undefined ? { pincode } : {}),
          ...(deliveryInstructions !== undefined ? { deliveryInstructions } : {}),
        },
      });
    }

    logger.info(`Profile updated for user [${userId}]`);
    return await ProfileService.getProfile(userId);
  }

  /**
   * Upload user avatar using Cloudflare R2
   */
  static async uploadAvatar(userId, { buffer, mimeType, originalName }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        fpoProfile: true,
        logisticsProfile: true,
        bulkBuyerProfile: true,
        consumerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    // Validation
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(mimeType)) {
      throw new ValidationError('Only JPEG, PNG, WEBP, and GIF images are allowed.');
    }

    if (buffer.length > 5 * 1024 * 1024) {
      throw new ValidationError('Image size cannot exceed 5MB.');
    }

    const extension = mimeType.split('/')[1] || 'jpg';
    const key = `avatars/${userId}-${Date.now()}.${extension}`;

    const { url } = await uploadToR2({
      key,
      buffer,
      contentType: mimeType,
    });

    // Update profile with new avatar URL
    if (user.role === 'FARMER' && user.farmerProfile) {
      await prisma.farmerProfile.update({ where: { userId }, data: { profilePhoto: url } });
    } else if (user.role === 'FPO' && user.fpoProfile) {
      await prisma.fpoProfile.update({ where: { userId }, data: { logo: url } });
    } else if (user.role === 'CONSUMER' && user.consumerProfile) {
      await prisma.consumerProfile.update({ where: { userId }, data: { profilePhoto: url } });
    }

    logger.info(`Avatar uploaded for user [${userId}] -> ${url}`);
    return {
      avatarUrl: url,
      profile: await ProfileService.getProfile(userId),
    };
  }

  /**
   * Delete user avatar
   */
  static async deleteAvatar(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        fpoProfile: true,
        consumerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    const currentUrl =
      user.farmerProfile?.profilePhoto ||
      user.fpoProfile?.logo ||
      user.consumerProfile?.profilePhoto;

    if (currentUrl) {
      const parts = currentUrl.split('/');
      const key = `avatars/${parts[parts.length - 1]}`;
      await deleteFromR2(key);
    }

    if (user.role === 'FARMER' && user.farmerProfile) {
      await prisma.farmerProfile.update({ where: { userId }, data: { profilePhoto: null } });
    } else if (user.role === 'FPO' && user.fpoProfile) {
      await prisma.fpoProfile.update({ where: { userId }, data: { logo: null } });
    } else if (user.role === 'CONSUMER' && user.consumerProfile) {
      await prisma.consumerProfile.update({ where: { userId }, data: { profilePhoto: null } });
    }

    return await ProfileService.getProfile(userId);
  }

  /**
   * Change user password securely
   */
  static async changePassword(userId, { currentPassword, newPassword }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedError('Current password is incorrect.', 'INVALID_PASSWORD');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    logger.info(`Password changed successfully for user [${userId}]`);

    return {
      success: true,
      message: 'Password changed successfully. Your active session remains verified.',
    };
  }
}

export default ProfileService;
