import { Router } from 'express';
import { BuyerController } from './buyer.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const buyerRouter = Router();

buyerRouter.use(requireAuth);
buyerRouter.use(requireRole(['BULK_BUYER', 'ADMIN', 'CONTROL_ADMIN']));

buyerRouter.get('/me', BuyerController.getMe);
buyerRouter.get('/me/demands', BuyerController.getDemands);
buyerRouter.get('/me/orders', BuyerController.getOrders);

export default buyerRouter;
