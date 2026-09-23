import apiClient from '../../../lib/apiClient.js';

export const authService = {
  /**
   * Register user with selected role and details
   */
  async register(payload) {
    return apiClient.post('/auth/register', payload);
  },

  /**
   * Request OTP dispatch (Mock 123456)
   */
  async sendOtp(identifier, purpose = 'REGISTRATION') {
    return apiClient.post('/auth/otp/send', { identifier, purpose });
  },

  /**
   * Verify entered OTP and activate account
   */
  async verifyOtp({ identifier, otp, purpose = 'REGISTRATION' }) {
    return apiClient.post('/auth/otp/verify', { identifier, otp, purpose });
  },

  /**
   * Login with email or mobile and password
   */
  async login({ identifier, password }) {
    return apiClient.post('/auth/login', { identifier, password });
  },

  /**
   * Refresh current authentication session
   */
  async refreshSession() {
    return apiClient.post('/auth/refresh');
  },

  /**
   * Logout user and invalidate sessions
   */
  async logout() {
    return apiClient.post('/auth/logout');
  },

  /**
   * Fetch current authenticated user and profile
   */
  async getMe() {
    return apiClient.get('/auth/me');
  },

  /**
   * Request password reset code
   */
  async forgotPassword(identifier) {
    return apiClient.post('/auth/password/forgot', { identifier });
  },

  /**
   * Verify password reset OTP
   */
  async verifyPasswordResetOtp({ identifier, otp }) {
    return apiClient.post('/auth/password/verify-otp', { identifier, otp });
  },

  /**
   * Submit new password after OTP verification
   */
  async resetPassword({ identifier, otp, newPassword, confirmNewPassword }) {
    return apiClient.post('/auth/password/reset', {
      identifier,
      otp,
      newPassword,
      confirmNewPassword,
    });
  },

  /**
   * Fetch complete profile with dynamic completion & permissions (PHASE 2.0)
   */
  async getProfile() {
    return apiClient.get('/profile/me');
  },

  /**
   * Update authenticated profile (PHASE 2.0)
   */
  async updateProfile(payload) {
    return apiClient.patch('/profile/me', payload);
  },

  /**
   * Upload user avatar using R2 (PHASE 2.0)
   */
  async uploadAvatar(payload) {
    if (payload instanceof FormData) {
      return apiClient.post('/profile/avatar', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.post('/profile/avatar', payload);
  },

  /**
   * Delete user avatar (PHASE 2.0)
   */
  async deleteAvatar() {
    return apiClient.delete('/profile/avatar');
  },

  /**
   * Change user password (PHASE 2.0)
   */
  async changePassword({ currentPassword, newPassword }) {
    return apiClient.patch('/profile/password', { currentPassword, newPassword });
  },
};

export default authService;
