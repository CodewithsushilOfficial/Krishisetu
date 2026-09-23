import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requireRole(['ADMIN', 'CONTROL_ADMIN']));

adminRouter.get('/overview', AdminController.getOverview);
adminRouter.get('/users', AdminController.getUsers);

export default adminRouter;
