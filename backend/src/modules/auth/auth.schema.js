import { z } from 'zod';
import { ROLES } from './auth.constants.js';

// Reusable regex helpers
const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+={}\[\]:;<>,.?/~`|\\-]).{8,}$/;

// Helper to normalize phone numbers to clean 10 digits
export function normalizePhone(phone) {
  if (!phone) return '';
  const digits = phone.toString().replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits;
}

// Basic Account schema
export const basicAccountSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full Name must be at least 2 characters')
      .max(100, 'Full Name cannot exceed 100 characters'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number')
      .transform(normalizePhone),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordRegex,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Farmer profile schema
export const farmerProfileSchema = z.object({
  village: z.string().trim().min(2, 'Village is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be a 6-digit postal code'),
  addressLine: z.string().trim().optional().default(''),
  postOffice: z.string().trim().optional().default(''),
  dateOfBirth: z.string().optional().default(''),
  gender: z.string().optional().default(''),
  farmerType: z.string().trim().min(2, 'Farmer type is required').default('Individual Farmer'),
  farmName: z.string().trim().optional().default(''),
  totalLandArea: z.coerce.number().positive('Total land area must be a positive number'),
  landUnit: z.string().trim().default('Acre'),
  farmingType: z.string().trim().default('Conventional'),
  primaryCrops: z.union([z.array(z.string()), z.string()]).transform((val) =>
    Array.isArray(val) ? val : val.split(',').map((s) => s.trim()).filter(Boolean)
  ),
  secondaryCrops: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (!val) return [];
    return Array.isArray(val) ? val : val.split(',').map((s) => s.trim()).filter(Boolean);
  }).default([]),
  irrigationType: z.string().trim().default('Rainfed'),
  profilePhoto: z.string().optional().default(''),
});

// FPO profile schema
export const fpoProfileSchema = z.object({
  fpoName: z.string().trim().min(2, 'FPO / Company name is required'),
  fpoType: z.string().trim().min(2, 'FPO type is required').default('Farmer Producer Organization'),
  registrationNumber: z.string().trim().min(3, 'Registration number is required'),
  establishedYear: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  officialEmail: z.string().trim().toLowerCase().email().optional().or(z.literal('')).default(''),
  officialPhone: z.string().trim().optional().default(''),
  website: z.string().trim().optional().default(''),
  logo: z.string().optional().default(''),
  representativeName: z.string().trim().min(2, 'Authorized representative name is required'),
  designation: z.string().trim().min(2, 'Designation is required'),
  representativeMobile: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter valid 10-digit mobile number')
    .transform(normalizePhone)
    .optional()
    .or(z.literal(''))
    .default(''),
  representativeEmail: z.string().trim().toLowerCase().email().optional().or(z.literal('')).default(''),
  addressLine: z.string().trim().optional().default(''),
  cityTownVillage: z.string().trim().min(2, 'City/Town/Village is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
  numberOfFarmers: z.coerce.number().int().nonnegative().default(0),
  primaryCrops: z.union([z.array(z.string()), z.string()]).transform((val) =>
    Array.isArray(val) ? val : val.split(',').map((s) => s.trim()).filter(Boolean)
  ),
  operatingDistricts: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (!val) return [];
    return Array.isArray(val) ? val : val.split(',').map((s) => s.trim()).filter(Boolean);
  }).default([]),
  storageAvailable: z.boolean().default(false),
  aggregationCapacity: z.coerce.number().nonnegative().default(0),
});

// Logistics profile schema
export const logisticsProfileSchema = z.object({
  businessName: z.string().trim().min(2, 'Business or fleet name is required'),
  businessType: z.string().trim().default('Transport Company'),
  contactPerson: z.string().trim().min(2, 'Contact person name is required'),
  addressLine: z.string().trim().optional().default(''),
  city: z.string().trim().min(2, 'City is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
  vehicleTypes: z.union([z.array(z.string()), z.string()]).transform((val) =>
    Array.isArray(val) ? val : val.split(',').map((s) => s.trim()).filter(Boolean)
  ),
  numberOfVehicles: z.coerce.number().int().positive('Number of vehicles must be at least 1'),
  serviceAreas: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (!val) return [];
    return Array.isArray(val) ? val : val.split(',').map((s) => s.trim()).filter(Boolean);
  }).default([]),
  preferredOperatingAreas: z.union([z.array(z.string()), z.string()]).optional().transform((val) => {
    if (!val) return [];
    return Array.isArray(val) ? val : val.split(',').map((s) => s.trim()).filter(Boolean);
  }).default([]),
  minLoadCapacity: z.coerce.number().nonnegative().default(0),
  maxLoadCapacity: z.coerce.number().positive('Maximum load capacity is required'),
  capacityUnit: z.string().trim().default('Tons'),
});

// Bulk Buyer profile schema
export const bulkBuyerProfileSchema = z.object({
  businessName: z.string().trim().min(2, 'Business / Company name is required'),
  businessType: z.string().trim().default('Wholesaler'),
  gstNumber: z.string().trim().optional().default(''),
  businessEmail: z.string().trim().toLowerCase().email().optional().or(z.literal('')).default(''),
  businessPhone: z.string().trim().optional().default(''),
  website: z.string().trim().optional().default(''),
  contactPerson: z.string().trim().min(2, 'Contact person name is required'),
  designation: z.string().trim().optional().default('Procurement Manager'),
  addressLine: z.string().trim().optional().default(''),
  city: z.string().trim().min(2, 'City is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
  primaryCrops: z.union([z.array(z.string()), z.string()]).transform((val) =>
    Array.isArray(val) ? val : val.split(',').map((s) => s.trim()).filter(Boolean)
  ),
  expectedVolume: z.coerce.number().nonnegative().default(0),
  volumeUnit: z.string().trim().default('Tons/Month'),
  procurementFrequency: z.string().trim().default('Monthly'),
  preferredProcurementArea: z.string().trim().optional().default(''),
});

// Consumer profile schema
export const consumerProfileSchema = z.object({
  houseFlat: z.string().trim().optional().default(''),
  streetArea: z.string().trim().min(2, 'Street or area is required'),
  city: z.string().trim().min(2, 'City is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
  deliveryInstructions: z.string().trim().optional().default(''),
  profilePhoto: z.string().optional().default(''),
});

// Master Registration payload validation
export const registerSchema = z
  .object({
    role: z.enum([
      ROLES.FARMER,
      ROLES.FPO,
      ROLES.LOGISTICS,
      ROLES.BULK_BUYER,
      ROLES.CONSUMER,
      ROLES.ADMIN,
      ROLES.CONTROL_ADMIN,
    ]),
    account: basicAccountSchema,
    profile: z.record(z.any()),
  })
  .superRefine((data, ctx) => {
    let result;
    if (data.role === ROLES.FARMER) {
      result = farmerProfileSchema.safeParse(data.profile);
    } else if (data.role === ROLES.FPO) {
      result = fpoProfileSchema.safeParse(data.profile);
    } else if (data.role === ROLES.LOGISTICS) {
      result = logisticsProfileSchema.safeParse(data.profile);
    } else if (data.role === ROLES.BULK_BUYER) {
      result = bulkBuyerProfileSchema.safeParse(data.profile);
    } else if (data.role === ROLES.CONSUMER) {
      result = consumerProfileSchema.safeParse(data.profile);
    }

    if (result && !result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ['profile', ...issue.path],
        });
      });
    }
  });

// OTP send schema
export const sendOtpSchema = z.object({
  identifier: z.string().trim().min(3, 'Email or mobile number is required'),
  purpose: z.enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET']).default('REGISTRATION'),
});

// OTP verify schema
export const verifyOtpSchema = z.object({
  identifier: z.string().trim().min(3, 'Email or mobile number is required'),
  otp: z.string().trim().length(6, 'OTP must be exactly 6 digits'),
  purpose: z.enum(['REGISTRATION', 'LOGIN', 'PASSWORD_RESET']).default('REGISTRATION'),
});

// Login schema
export const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Email or mobile number is required'),
  password: z.string().min(1, 'Password is required'),
});

// Password reset schemas
export const forgotPasswordSchema = z.object({
  identifier: z.string().trim().min(3, 'Email or mobile number is required'),
});

export const verifyPasswordResetOtpSchema = z.object({
  identifier: z.string().trim().min(3, 'Email or mobile number is required'),
  otp: z.string().trim().length(6, 'OTP must be exactly 6 digits'),
});

export const resetPasswordSchema = z
  .object({
    identifier: z.string().trim().min(3, 'Email or mobile number is required'),
    otp: z.string().trim().length(6, 'OTP must be exactly 6 digits'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(
        passwordRegex,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });
