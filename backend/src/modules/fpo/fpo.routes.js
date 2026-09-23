import { Router } from 'express';
import { FpoController } from './fpo.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { resolveFpoContext, requireFpoAccess, requireFpoPermission } from './fpo.middleware.js';

const fpoRouter = Router();

// Apply Authentication & FPO Tenant Isolation Context to all FPO routes
fpoRouter.use(requireAuth);
fpoRouter.use(resolveFpoContext);
fpoRouter.use(requireFpoAccess);

// --- Dashboard Aggregations ---
fpoRouter.get('/dashboard/overview', FpoController.getDashboardOverview);
fpoRouter.get('/dashboard/kpis', FpoController.getDashboardOverview);
fpoRouter.get('/dashboard/summary', FpoController.getDashboardOverview);

// --- Farmers Management ---
fpoRouter.get('/farmers', FpoController.getFarmers);
fpoRouter.post('/farmers', requireFpoPermission('farmer.create'), FpoController.createFarmer);

// --- Staff Management & RBAC ---
fpoRouter.get('/staff', FpoController.getStaff);
fpoRouter.post('/staff', requireFpoPermission('staff.create'), FpoController.inviteStaff);
fpoRouter.post('/staff/invite', requireFpoPermission('staff.create'), FpoController.inviteStaff);
fpoRouter.patch('/staff/:id', requireFpoPermission('staff.update'), FpoController.updateStaff);

// --- Collection Centers ---
fpoRouter.get('/collection-centers', FpoController.getCollectionCenters);
fpoRouter.post('/collection-centers', requireFpoPermission('centers.create'), FpoController.createCollectionCenter);
fpoRouter.patch('/collection-centers/:id', requireFpoPermission('centers.update'), FpoController.updateCollectionCenter);

// --- Produce & Aggregation ---
fpoRouter.get('/produce', FpoController.getProduce);
fpoRouter.post('/produce', requireFpoPermission('produce.create'), FpoController.recordProduceCollection);

// --- Inventory & Lots ---
fpoRouter.get('/inventory', FpoController.getInventory);
fpoRouter.get('/inventory/lots', FpoController.getInventory);

// --- Buyer Demands & Matching ---
fpoRouter.get('/demands', FpoController.getBuyerDemands);
fpoRouter.get('/demands/match', FpoController.getBuyerDemands);

// --- Orders & Contracts ---
fpoRouter.get('/orders', FpoController.getOrders);
fpoRouter.patch('/orders/:id/status', requireFpoPermission('orders.update'), FpoController.updateOrderStatus);

// --- Logistics & Tracking ---
fpoRouter.get('/shipments', FpoController.getShipments);
fpoRouter.get('/logistics', FpoController.getShipments);
fpoRouter.get('/logistics/active', (req, res, next) => {
  return FpoController.getDashboardOverview(req, res, next);
});
fpoRouter.get('/logistics/:id', FpoController.getShipmentById);
fpoRouter.get('/logistics/:id/location', FpoController.getShipmentLocation);
fpoRouter.get('/logistics/:id/route', FpoController.getShipmentRoute);
fpoRouter.patch('/logistics/:id/status', requireFpoPermission('orders.update'), FpoController.updateShipmentStatus);

// --- Payments & Settlements ---
fpoRouter.get('/payments', FpoController.getPayments);
fpoRouter.get('/settlements', FpoController.getSettlements);

// --- Notifications & Messages ---
fpoRouter.get('/notifications', FpoController.getNotifications);
fpoRouter.patch('/notifications/:id/read', FpoController.markNotificationRead);
fpoRouter.get('/messages/unread-count', FpoController.getUnreadMessageCount);
fpoRouter.get('/messages', FpoController.getMessages);
fpoRouter.post('/messages', FpoController.sendMessage);

// --- Organization Profile ---
fpoRouter.get('/profile', FpoController.getProfile);
fpoRouter.patch('/profile', requireFpoPermission('fpo.profile.update'), FpoController.updateProfile);

// --- Backward Compatibility ---
fpoRouter.get('/me', FpoController.getMe);
fpoRouter.get('/me/members', FpoController.getMembers);
fpoRouter.get('/me/produce', FpoController.getProduce);
fpoRouter.get('/me/inventory', FpoController.getInventory);

export default fpoRouter;
