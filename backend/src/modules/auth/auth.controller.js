import { AuthService } from './auth.service.js';
import { OtpService } from './otp.service.js';
import { TokenService } from './token.service.js';
import { AUTH_COOKIES } from './auth.constants.js';
import {
  registerSchema,
  sendOtpSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyPasswordResetOtpSchema,
  resetPasswordSchema,
} from './auth.schema.js';
import { ValidationError, UnauthorizedError } from '../../lib/errors.js';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static async register(req, res, next) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Registration validation failed', parsed.error.format());
      }

      const result = await AuthService.register(parsed.data);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully. Please enter the 6-digit OTP sent to your phone to activate.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/otp/send
   */
  static async sendOtp(req, res, next) {
    try {
      const parsed = sendOtpSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid request payload', parsed.error.format());
      }

      const result = await OtpService.sendOtp(parsed.data.identifier, parsed.data.purpose);

      return res.status(200).json({
        success: true,
        message: 'A 6-digit verification code has been dispatched.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/otp/verify
   */
  static async verifyOtp(req, res, next) {
    try {
      const parsed = verifyOtpSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid OTP verification request', parsed.error.format());
      }

      const result = await AuthService.verifyRegistrationOtp(parsed.data);

      // Set secure HTTP-only refresh token cookie
      if (result.refreshToken) {
        TokenService.setRefreshTokenCookie(res, result.refreshToken);
      }

      return res.status(200).json({
        success: true,
        message: 'Account verified and activated successfully.',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          role: result.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  static async login(req, res, next) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid login request', parsed.error.format());
      }

      const meta = {
        ipAddress: req.ip || req.headers['x-forwarded-for'],
        userAgent: req.headers['user-agent'],
      };

      const result = await AuthService.login({ ...parsed.data, meta });

      if (result.pendingVerification) {
        return res.status(200).json({
          success: true,
          pendingVerification: true,
          message: result.message,
          data: {
            identifier: result.identifier,
          },
        });
      }

      // Set secure HTTP-only cookie
      TokenService.setRefreshTokenCookie(res, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Sign in successful.',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          role: result.role,
          profile: result.profile,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  static async refresh(req, res, next) {
    try {
      const rawRefreshToken =
        req.cookies[AUTH_COOKIES.REFRESH_TOKEN] || req.body?.refreshToken;

      if (!rawRefreshToken) {
        throw new UnauthorizedError('Session expired. Please log in again.', 'TOKEN_MISSING');
      }

      const meta = {
        ipAddress: req.ip || req.headers['x-forwarded-for'],
        userAgent: req.headers['user-agent'],
      };

      const result = await AuthService.refreshSession(rawRefreshToken, meta);

      TokenService.setRefreshTokenCookie(res, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Session refreshed successfully.',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          role: result.role,
          profile: result.profile,
        },
      });
    } catch (err) {
      TokenService.clearRefreshTokenCookie(res);
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  static async logout(req, res, next) {
    try {
      const rawRefreshToken =
        req.cookies[AUTH_COOKIES.REFRESH_TOKEN] || req.body?.refreshToken;

      if (rawRefreshToken) {
        await AuthService.logout(rawRefreshToken);
      }
      TokenService.clearRefreshTokenCookie(res);

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully.',
      });
    } catch (err) {
      TokenService.clearRefreshTokenCookie(res);
      next(err);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  static async me(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      const accessToken = TokenService.generateAccessToken(user);

      return res.status(200).json({
        success: true,
        data: {
          user,
          role: user.role,
          profile: user.profile,
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/password/forgot
   */
  static async forgotPassword(req, res, next) {
    try {
      const parsed = forgotPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid request payload', parsed.error.format());
      }

      const result = await AuthService.forgotPassword(parsed.data.identifier);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/password/verify-otp
   */
  static async verifyPasswordResetOtp(req, res, next) {
    try {
      const parsed = verifyPasswordResetOtpSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid verification request', parsed.error.format());
      }

      const result = await AuthService.verifyPasswordResetOtp(parsed.data);

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/auth/password/reset
   */
  static async resetPassword(req, res, next) {
    try {
      const parsed = resetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid password reset payload', parsed.error.format());
      }

      const result = await AuthService.resetPassword(parsed.data);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/v1/auth/profile
   */
  static async updateProfile(req, res, next) {
    try {
      const updatedUser = await AuthService.updateProfile(req.user.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/v1/auth/password/change
   */
  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        throw new ValidationError('Current password and new password are required');
      }

      if (newPassword.length < 8) {
        throw new ValidationError('New password must be at least 8 characters long');
      }

      const result = await AuthService.changePassword(req.user.id, { currentPassword, newPassword });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
