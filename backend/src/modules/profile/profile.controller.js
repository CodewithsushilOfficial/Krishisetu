import { ProfileService } from './profile.service.js';
import { updateProfileSchema, changePasswordSchema } from './profile.validation.js';
import { ValidationError } from '../../lib/errors.js';

export class ProfileController {
  /**
   * GET /api/v1/profile/me
   */
  static async getMe(req, res, next) {
    try {
      const data = await ProfileService.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/profile/me
   */
  static async updateMe(req, res, next) {
    try {
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid profile update data', parsed.error.format());
      }

      const data = await ProfileService.updateProfile(req.user.id, parsed.data);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/profile/avatar
   */
  static async uploadAvatar(req, res, next) {
    try {
      let buffer = null;
      let mimeType = null;
      let originalName = 'avatar.jpg';

      if (req.file) {
        buffer = req.file.buffer;
        mimeType = req.file.mimetype;
        originalName = req.file.originalname;
      } else if (req.body?.imageBase64) {
        const matches = req.body.imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw new ValidationError('Invalid base64 image format.');
        }
        mimeType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        throw new ValidationError('No image file or imageBase64 payload provided.');
      }

      const result = await ProfileService.uploadAvatar(req.user.id, {
        buffer,
        mimeType,
        originalName,
      });

      return res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/v1/profile/avatar
   */
  static async deleteAvatar(req, res, next) {
    try {
      const result = await ProfileService.deleteAvatar(req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Avatar removed successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/profile/password
   */
  static async changePassword(req, res, next) {
    try {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Invalid password payload', parsed.error.format());
      }

      const result = await ProfileService.changePassword(req.user.id, parsed.data);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default ProfileController;
