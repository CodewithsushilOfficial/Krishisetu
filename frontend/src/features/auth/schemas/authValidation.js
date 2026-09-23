import { z } from 'zod';

const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+={}\[\]:;<>,.?/~`|\\-]).{8,}$/;

export const basicAccountClientSchema = z
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
      .regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordRegex,
        'Password requires 1 uppercase, 1 lowercase, 1 number, and 1 special symbol'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const farmerProfileClientSchema = z.object({
  village: z.string().trim().min(2, 'Village is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
  addressLine: z.string().trim().optional(),
  postOffice: z.string().trim().optional(),
  farmerType: z.string().default('Individual Farmer'),
  farmName: z.string().trim().optional(),
  totalLandArea: z.coerce.number().positive('Land area must be greater than 0'),
  landUnit: z.string().default('Acre'),
  farmingType: z.string().default('Conventional'),
  primaryCrops: z.string().min(2, 'Please specify at least one primary crop'),
  secondaryCrops: z.string().optional(),
  irrigationType: z.string().default('Rainfed'),
});

export const fpoProfileClientSchema = z.object({
  fpoName: z.string().trim().min(2, 'FPO / Company name is required'),
  fpoType: z.string().default('Farmer Producer Organization'),
  registrationNumber: z.string().trim().min(3, 'Registration number is required'),
  establishedYear: z.coerce.number().min(1900).max(new Date().getFullYear(), 'Invalid established year'),
  cityTownVillage: z.string().trim().min(2, 'City/Town/Village is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
  representativeName: z.string().trim().min(2, 'Representative name is required'),
  designation: z.string().trim().min(2, 'Designation is required'),
  representativeMobile: z.string().trim().optional(),
  numberOfFarmers: z.coerce.number().min(1, 'Number of farmers must be at least 1'),
  primaryCrops: z.string().min(2, 'Primary crops are required'),
  storageAvailable: z.boolean().default(false),
  aggregationCapacity: z.coerce.number().min(0).default(0),
});

export const logisticsProfileClientSchema = z.object({
  businessName: z.string().trim().min(2, 'Business or fleet name is required'),
  businessType: z.string().default('Transport Company'),
  contactPerson: z.string().trim().min(2, 'Contact person name is required'),
  city: z.string().trim().min(2, 'City is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
  vehicleTypes: z.string().min(2, 'Specify vehicle types (e.g. Pickup, Truck)'),
  numberOfVehicles: z.coerce.number().min(1, 'At least 1 vehicle is required'),
  serviceAreas: z.string().optional(),
  minLoadCapacity: z.coerce.number().min(0).default(0),
  maxLoadCapacity: z.coerce.number().positive('Maximum load capacity is required'),
  capacityUnit: z.string().default('Tons'),
});

export const bulkBuyerProfileClientSchema = z.object({
  businessName: z.string().trim().min(2, 'Business / Company name is required'),
  businessType: z.string().default('Wholesaler'),
  gstNumber: z.string().trim().optional(),
  contactPerson: z.string().trim().min(2, 'Contact person name is required'),
  designation: z.string().trim().default('Procurement Manager'),
  city: z.string().trim().min(2, 'City is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
  primaryCrops: z.string().min(2, 'Primary procurement crops are required'),
  expectedVolume: z.coerce.number().min(0).default(0),
  volumeUnit: z.string().default('Tons/Month'),
  procurementFrequency: z.string().default('Monthly'),
  preferredProcurementArea: z.string().trim().optional(),
});

export const consumerProfileClientSchema = z.object({
  houseFlat: z.string().trim().optional(),
  streetArea: z.string().trim().min(2, 'Street or area is required'),
  city: z.string().trim().min(2, 'City is required'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(pincodeRegex, 'Pincode must be 6 digits'),
  deliveryInstructions: z.string().trim().optional(),
});

export const loginClientSchema = z.object({
  identifier: z.string().trim().min(3, 'Please enter your registered email or mobile number'),
  password: z.string().min(1, 'Please enter your password'),
});
