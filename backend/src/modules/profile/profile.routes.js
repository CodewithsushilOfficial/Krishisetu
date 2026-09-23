import { Router } from 'express';
import multer from 'multer';
import { ProfileController } from './profile.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const profileRouter = Router();

// Memory storage for avatar processing & R2 dispatch
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

// Profile endpoints (PHASE 2.0)
profileRouter.get('/me', requireAuth, ProfileController.getMe);
profileRouter.patch('/me', requireAuth, ProfileController.updateMe);
profileRouter.post('/avatar', requireAuth, upload.single('avatar'), ProfileController.uploadAvatar);
profileRouter.delete('/avatar', requireAuth, ProfileController.deleteAvatar);
profileRouter.patch('/password', requireAuth, ProfileController.changePassword);

export default profileRouter;
