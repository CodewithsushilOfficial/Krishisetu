import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const authRouter = Router();

// Registration & OTP
authRouter.post('/register', AuthController.register);
authRouter.post('/otp/send', AuthController.sendOtp);
authRouter.post('/otp/verify', AuthController.verifyOtp);

// Login, Refresh & Logout
authRouter.post('/login', AuthController.login);
authRouter.post('/refresh', AuthController.refresh);
authRouter.post('/logout', AuthController.logout);

// Protected Session Endpoints
authRouter.get('/me', requireAuth, AuthController.me);
authRouter.put('/profile', requireAuth, AuthController.updateProfile);
authRouter.put('/password/change', requireAuth, AuthController.changePassword);

// Password Recovery
authRouter.post('/password/forgot', AuthController.forgotPassword);
authRouter.post('/password/verify-otp', AuthController.verifyPasswordResetOtp);
authRouter.post('/password/reset', AuthController.resetPassword);

export default authRouter;
