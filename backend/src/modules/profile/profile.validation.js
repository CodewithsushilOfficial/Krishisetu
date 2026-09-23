import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').optional(),
  profilePhoto: z.string().url().or(z.string().length(0)).optional(),

  // Role profile fields
  addressLine: z.string().max(255).optional(),
  village: z.string().max(100).optional(),
  postOffice: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid 6-digit PIN code').optional(),

  // Farmer specific
  farmerType: z.string().max(50).optional(),
  farmName: z.string().max(100).optional(),
  farmingType: z.string().max(50).optional(),
  irrigationType: z.string().max(50).optional(),
  totalLandArea: z.number().nonnegative().optional(),
  landUnit: z.string().max(20).optional(),
  primaryCrops: z.array(z.string()).optional(),

  // FPO specific
  fpoName: z.string().max(150).optional(),
  representativeName: z.string().max(100).optional(),
  designation: z.string().max(100).optional(),
  memberCount: z.number().int().nonnegative().optional(),
  aggregationCapacity: z.number().nonnegative().optional(),
  storageAvailable: z.boolean().optional(),

  // Logistics specific
  businessName: z.string().max(150).optional(),
  contactPerson: z.string().max(100).optional(),
  serviceArea: z.string().max(100).optional(),
  serviceAreas: z.array(z.string()).optional(),
  vehicleTypes: z.array(z.string()).optional(),
  vehicleCount: z.number().int().nonnegative().optional(),

  // Bulk Buyer specific
  gstNumber: z.string().max(30).optional(),
  preferredArea: z.string().max(100).optional(),
  procurementFrequency: z.string().max(50).optional(),
  expectedVolume: z.number().nonnegative().optional(),

  // Consumer specific
  houseFlat: z.string().max(100).optional(),
  streetArea: z.string().max(150).optional(),
  deliveryInstructions: z.string().max(255).optional(),
}).strict(); // strictly prevent injecting unallowed fields like 'role', 'status', 'passwordHash', etc.

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  confirmPassword: z.string().optional(),
});
