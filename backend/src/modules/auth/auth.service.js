import bcrypt from 'bcrypt';
import prisma from '../../db/prisma.js';
import { ROLES, USER_STATUS } from './auth.constants.js';
import { TokenService } from './token.service.js';
import { OtpService } from './otp.service.js';
import { ConflictError, UnauthorizedError, BadRequestError, NotFoundError } from '../../lib/errors.js';
import { normalizePhone } from './auth.schema.js';
import logger from '../../lib/logger.js';

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

function findUserByIdentifier(identifier) {
  const norm = identifier.trim().toLowerCase();
  const phone = normalizePhone(identifier);

  return prisma.user.findFirst({
    where: {
      OR: [
        { email: norm },
        ...(phone ? [{ phone }] : []),
      ],
    },
    include: {
      farmerProfile: true,
      fpoProfile: true,
      logisticsProfile: true,
      bulkBuyerProfile: true,
      consumerProfile: true,
    },
  });
}

export class AuthService {
  /**
   * Register a new user with role and role-specific profile inside a transaction
   */
  static async register({ role, account, profile }) {
    if (role === ROLES.ADMIN || role === ROLES.CONTROL_ADMIN) {
      throw new BadRequestError('Privileged administrative roles cannot be self-registered.', 'UNAUTHORIZED_ROLE');
    }

    const normalizedEmail = account.email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(account.phone);

    // 1. Duplicate check
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmail) {
      throw new ConflictError('An account with this email already exists.', 'EMAIL_ALREADY_EXISTS');
    }

    const existingPhone = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });
    if (existingPhone) {
      throw new ConflictError('This mobile number is already registered.', 'PHONE_ALREADY_EXISTS');
    }

    // 2. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(account.password, saltRounds);

    // 3. PostgreSQL Transaction: Create User + Role Profile
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: account.fullName,
          email: normalizedEmail,
          phone: normalizedPhone,
          passwordHash,
          role,
          status: USER_STATUS.PENDING,
          emailVerified: false,
          phoneVerified: false,
        },
      });

      // Attach matching role profile
      if (role === ROLES.FARMER) {
        await tx.farmerProfile.create({
          data: {
            user: { connect: { id: user.id } },
            village: profile.village,
            district: profile.district,
            state: profile.state,
            pincode: profile.pincode,
            addressLine: profile.addressLine || null,
            postOffice: profile.postOffice || null,
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
            gender: profile.gender || null,
            farmerType: profile.farmerType || 'Individual Farmer',
            farmName: profile.farmName || null,
            totalLandArea: profile.totalLandArea,
            landUnit: profile.landUnit || 'Acre',
            farmingType: profile.farmingType || 'Conventional',
            primaryCrops: Array.isArray(profile.primaryCrops) ? profile.primaryCrops : [profile.primaryCrops],
            secondaryCrops: Array.isArray(profile.secondaryCrops) ? profile.secondaryCrops : [],
            irrigationType: profile.irrigationType || 'Rainfed',
            profilePhoto: profile.profilePhoto || null,
          },
        });
      } else if (role === ROLES.FPO) {
        await tx.fpoProfile.create({
          data: {
            user: { connect: { id: user.id } },
            fpoName: profile.fpoName,
            fpoType: profile.fpoType || 'Farmer Producer Organization',
            registrationNumber: profile.registrationNumber,
            establishedYear: profile.establishedYear,
            officialEmail: profile.officialEmail || null,
            officialPhone: profile.officialPhone || null,
            website: profile.website || null,
            logo: profile.logo || null,
            representativeName: profile.representativeName || account.fullName,
            designation: profile.designation,
            representativeMobile: profile.representativeMobile || normalizedPhone,
            representativeEmail: profile.representativeEmail || normalizedEmail,
            addressLine: profile.addressLine || null,
            villageTownCity: profile.cityTownVillage || profile.villageTownCity || '',
            district: profile.district,
            state: profile.state,
            pincode: profile.pincode,
            memberCount: profile.numberOfFarmers ? Number(profile.numberOfFarmers) : 0,
            primaryCrops: Array.isArray(profile.primaryCrops) ? profile.primaryCrops : [profile.primaryCrops],
            operatingDistricts: Array.isArray(profile.operatingDistricts) ? profile.operatingDistricts : [],
            storageAvailable: Boolean(profile.storageAvailable),
            aggregationCapacity: profile.aggregationCapacity || 0,
            verificationStatus: 'PENDING',
          },
        });
      } else if (role === ROLES.LOGISTICS) {
        await tx.logisticsProfile.create({
          data: {
            user: { connect: { id: user.id } },
            businessName: profile.businessName,
            businessType: profile.businessType || 'Transport Company',
            contactPerson: profile.contactPerson || account.fullName,
            addressLine: profile.addressLine || null,
            city: profile.city,
            district: profile.district,
            state: profile.state,
            pincode: profile.pincode,
            vehicleTypes: Array.isArray(profile.vehicleTypes) ? profile.vehicleTypes : [profile.vehicleTypes],
            vehicleCount: profile.numberOfVehicles ? Number(profile.numberOfVehicles) : 1,
            serviceAreas: Array.isArray(profile.serviceAreas) ? profile.serviceAreas : [],
            minCapacityKg: profile.minLoadCapacity ? Number(profile.minLoadCapacity) : 0,
            maxCapacityKg: profile.maxLoadCapacity ? Number(profile.maxLoadCapacity) : 0,
          },
        });
      } else if (role === ROLES.BULK_BUYER) {
        await tx.bulkBuyerProfile.create({
          data: {
            user: { connect: { id: user.id } },
            businessName: profile.businessName,
            businessType: profile.businessType || 'Wholesaler',
            gstNumber: profile.gstNumber || null,
            businessEmail: profile.businessEmail || null,
            businessPhone: profile.businessPhone || null,
            website: profile.website || null,
            contactPersonName: profile.contactPerson || account.fullName,
            designation: profile.designation || 'Procurement Manager',
            addressLine: profile.addressLine || null,
            city: profile.city,
            district: profile.district,
            state: profile.state,
            pincode: profile.pincode,
            primaryCrops: Array.isArray(profile.primaryCrops) ? profile.primaryCrops : [profile.primaryCrops],
            expectedVolume: profile.expectedVolume || 0,
            volumeUnit: profile.volumeUnit || 'Tons/Month',
            procurementFrequency: profile.procurementFrequency || 'Monthly',
            preferredArea: profile.preferredProcurementArea || null,
          },
        });
      } else if (role === ROLES.CONSUMER) {
        await tx.consumerProfile.create({
          data: {
            user: { connect: { id: user.id } },
            houseFlat: profile.houseFlat || null,
            streetArea: profile.streetArea,
            city: profile.city,
            district: profile.district,
            state: profile.state,
            pincode: profile.pincode,
            deliveryInstructions: profile.deliveryInstructions || null,
            profilePhoto: profile.profilePhoto || null,
          },
        });
      }

      return user;
    });

    // 4. Send initial mock OTP to mobile and email identifier
    await OtpService.sendOtp(normalizedPhone, 'REGISTRATION');

    logger.info(`User registered successfully: [${newUser.id}] role [${newUser.role}]`);

    return {
      user: sanitizeUser(newUser),
      identifier: normalizedPhone,
      otpPurpose: 'REGISTRATION',
    };
  }

  /**
   * Verify registration OTP and activate account with session tokens
   */
  static async verifyRegistrationOtp({ identifier, otp }) {
    // 1. Verify OTP with backend rules
    await OtpService.verifyOtp(identifier, otp, 'REGISTRATION');

    // 2. Find user
    const user = await findUserByIdentifier(identifier);
    if (!user) {
      throw new NotFoundError('User associated with this phone or email was not found.', 'USER_NOT_FOUND');
    }

    // 3. Activate user account
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: USER_STATUS.ACTIVE,
        phoneVerified: true,
        emailVerified: true,
        lastLoginAt: new Date(),
      },
      include: {
        farmerProfile: true,
        fpoProfile: true,
        logisticsProfile: true,
        bulkBuyerProfile: true,
        consumerProfile: true,
      },
    });

    // 4. Generate Auth Tokens & Persistent Session
    const accessToken = TokenService.generateAccessToken(updatedUser);
    const { rawToken: refreshToken } = await TokenService.createSession(updatedUser.id);

    return {
      user: sanitizeUser(updatedUser),
      accessToken,
      refreshToken,
      role: updatedUser.role,
    };
  }

  /**
   * Login user with identifier and password
   */
  static async login({ identifier, password, meta = {} }) {
    const user = await findUserByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedError('Invalid email/mobile or password.', 'INVALID_CREDENTIALS');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email/mobile or password.', 'INVALID_CREDENTIALS');
    }

    // Check account status
    if (user.status === USER_STATUS.SUSPENDED || user.status === USER_STATUS.DEACTIVATED) {
      throw new UnauthorizedError('Your account has been suspended or deactivated. Please contact support.', 'ACCOUNT_LOCKED');
    }

    // If pending verification, send OTP again
    if (user.status === USER_STATUS.PENDING) {
      await OtpService.sendOtp(user.phone, 'REGISTRATION');
      return {
        pendingVerification: true,
        identifier: user.phone,
        message: 'Account activation pending. Verification OTP sent to mobile.',
      };
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens & persistent session
    const accessToken = TokenService.generateAccessToken(user);
    const { rawToken: refreshToken } = await TokenService.createSession(user.id, meta);

    // Profile detail according to role
    const profile =
      user.farmerProfile ||
      user.fpoProfile ||
      user.logisticsProfile ||
      user.bulkBuyerProfile ||
      user.consumerProfile;

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
      role: user.role,
      profile,
    };
  }

  /**
   * Refresh access session using refresh token with rotation
   */
  static async refreshSession(rawRefreshToken, meta = {}) {
    const storedSession = await TokenService.verifySession(rawRefreshToken);
    const user = storedSession.user;

    // Rotate refresh token: revoke old session and create fresh one
    await TokenService.revokeSession(rawRefreshToken);
    const { rawToken: newRefreshToken } = await TokenService.createSession(user.id, meta);
    const accessToken = TokenService.generateAccessToken(user);

    const profile =
      user.farmerProfile ||
      user.fpoProfile ||
      user.logisticsProfile ||
      user.bulkBuyerProfile ||
      user.consumerProfile;

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken: newRefreshToken,
      role: user.role,
      profile,
    };
  }

  /**
   * Logout user and invalidate refresh session
   */
  static async logout(rawRefreshToken) {
    if (rawRefreshToken) {
      await TokenService.revokeSession(rawRefreshToken);
    }
    return { success: true };
  }

  /**
   * Get current authenticated user details
   */
  static async getCurrentUser(userId) {
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

    if (user.status === USER_STATUS.SUSPENDED || user.status === USER_STATUS.DEACTIVATED) {
      throw new UnauthorizedError('Your account has been suspended or deactivated.', 'ACCOUNT_LOCKED');
    }

    const profile =
      user.farmerProfile ||
      user.fpoProfile ||
      user.logisticsProfile ||
      user.bulkBuyerProfile ||
      user.consumerProfile;

    return {
      ...sanitizeUser(user),
      profile,
    };
  }

  /**
   * Forgot password: Send OTP to identifier if user exists
   */
  static async forgotPassword(identifier) {
    const user = await findUserByIdentifier(identifier);
    if (user) {
      await OtpService.sendOtp(user.phone, 'PASSWORD_RESET');
    }

    // Always return safe generic success message to prevent user enumeration
    return {
      success: true,
      message: 'If an account matches that email or mobile number, a 6-digit OTP has been sent.',
    };
  }

  /**
   * Verify password reset OTP
   */
  static async verifyPasswordResetOtp({ identifier, otp }) {
    await OtpService.verifyOtp(identifier, otp, 'PASSWORD_RESET');
    return {
      success: true,
      verified: true,
      identifier,
    };
  }

  /**
   * Reset user password after OTP verification
   */
  static async resetPassword({ identifier, otp, newPassword }) {
    // 1. Verify user exists
    const user = await findUserByIdentifier(identifier);
    if (!user) {
      throw new NotFoundError('User account not found', 'USER_NOT_FOUND');
    }

    // 2. Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // 3. Update password and invalidate previous sessions
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await TokenService.revokeAllUserTokens(user.id);

    logger.info(`Password reset successfully for user [${user.id}]`);

    return {
      success: true,
      message: 'Password has been updated successfully. Please log in with your new credentials.',
    };
  }

  /**
   * Update authenticated user profile
   */
  static async updateProfile(userId, updateData) {
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

    const { fullName, profilePhoto, addressLine, village, district, state, pincode, contactPerson, farmName, businessName } = updateData;

    // Update base user
    if (fullName) {
      await prisma.user.update({
        where: { id: userId },
        data: { fullName },
      });
    }

    // Update role profile
    if (user.role === 'FARMER' && user.farmerProfile) {
      await prisma.farmerProfile.update({
        where: { userId },
        data: {
          ...(profilePhoto !== undefined ? { profilePhoto } : {}),
          ...(farmName !== undefined ? { farmName } : {}),
          ...(addressLine !== undefined ? { addressLine } : {}),
          ...(village !== undefined ? { village } : {}),
          ...(district !== undefined ? { district } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(pincode !== undefined ? { pincode } : {}),
        },
      });
    } else if (user.role === 'FPO' && user.fpoProfile) {
      await prisma.fpoProfile.update({
        where: { userId },
        data: {
          ...(profilePhoto !== undefined ? { logo: profilePhoto } : {}),
          ...(addressLine !== undefined ? { addressLine } : {}),
          ...(district !== undefined ? { district } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(pincode !== undefined ? { pincode } : {}),
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
        },
      });
    } else if (user.role === 'BULK_BUYER' && user.bulkBuyerProfile) {
      await prisma.bulkBuyerProfile.update({
        where: { userId },
        data: {
          ...(businessName !== undefined ? { businessName } : {}),
          ...(addressLine !== undefined ? { addressLine } : {}),
          ...(district !== undefined ? { district } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(pincode !== undefined ? { pincode } : {}),
        },
      });
    } else if (user.role === 'CONSUMER' && user.consumerProfile) {
      await prisma.consumerProfile.update({
        where: { userId },
        data: {
          ...(fullName !== undefined ? { fullName } : {}),
          ...(profilePhoto !== undefined ? { profilePhoto } : {}),
          ...(addressLine !== undefined ? { addressLine } : {}),
          ...(district !== undefined ? { district } : {}),
          ...(state !== undefined ? { state } : {}),
          ...(pincode !== undefined ? { pincode } : {}),
        },
      });
    }

    return await AuthService.getCurrentUser(userId);
  }

  /**
   * Change user password
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
      message: 'Password updated successfully.',
    };
  }
}

export default AuthService;
