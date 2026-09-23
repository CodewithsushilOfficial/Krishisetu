export const ROLES = {
  FARMER: 'FARMER',
  FPO: 'FPO',
  LOGISTICS: 'LOGISTICS',
  BULK_BUYER: 'BULK_BUYER',
  CONSUMER: 'CONSUMER',
  ADMIN: 'ADMIN',
  CONTROL_ADMIN: 'CONTROL_ADMIN',
};

export const ROLE_LABELS = {
  [ROLES.FARMER]: 'Farmer',
  [ROLES.FPO]: 'FPO',
  [ROLES.LOGISTICS]: 'Logistics Partner',
  [ROLES.BULK_BUYER]: 'Bulk Buyer',
  [ROLES.CONSUMER]: 'Consumer',
  [ROLES.ADMIN]: 'Platform Administrator',
  [ROLES.CONTROL_ADMIN]: 'Control Administration',
};

export const USER_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DEACTIVATED: 'DEACTIVATED',
};

export const OTP_CONFIG = {
  MOCK_OTP: '123456',
  EXPIRY_SECONDS: 5 * 60, // 5 minutes
  MAX_ATTEMPTS: 5,
  RESEND_COOLDOWN_SECONDS: 30,
};

export const AUTH_COOKIES = {
  REFRESH_TOKEN: 'krishisetu_refresh_token',
};
