import { Router } from 'express';
import { LogisticsController } from './logistics.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import {
  resolveLogisticsContext,
  requireLogisticsAccess,
  requireVehicleOwnership,
} from './logistics.middleware.js';

const logisticsRouter = Router();

// Base protection: Must be authenticated and have LOGISTICS or ADMIN role
logisticsRouter.use(requireAuth);
logisticsRouter.use(requireRole(['LOGISTICS', 'ADMIN', 'CONTROL_ADMIN']));
logisticsRouter.use(resolveLogisticsContext);
logisticsRouter.use(requireLogisticsAccess);

// 1. Dashboard Aggregation Endpoint (Single request for high performance)
logisticsRouter.get('/dashboard', LogisticsController.getDashboard);

// 2. Partner Profile & Availability
logisticsRouter.get('/profile', LogisticsController.getProfile);
logisticsRouter.patch('/profile', LogisticsController.updateProfile);
logisticsRouter.patch('/availability', LogisticsController.updateAvailability);
logisticsRouter.get('/me', LogisticsController.getMe); // Legacy compatibility

// 3. Vehicles Management
logisticsRouter.get('/vehicles', LogisticsController.getVehicles);
logisticsRouter.post('/vehicles', LogisticsController.createVehicle);
logisticsRouter.get('/vehicles/:id', requireVehicleOwnership, LogisticsController.getVehicleById);
logisticsRouter.patch('/vehicles/:id', requireVehicleOwnership, LogisticsController.updateVehicle);
logisticsRouter.delete('/vehicles/:id', requireVehicleOwnership, LogisticsController.deleteVehicle);
logisticsRouter.get('/me/vehicles', LogisticsController.getVehicles); // Legacy compatibility

// 4. Available Shipments & Acceptance Flow
logisticsRouter.get('/shipments', LogisticsController.getShipments);
logisticsRouter.get('/shipments/:id', LogisticsController.getShipmentById);
logisticsRouter.post('/shipments/:id/accept', LogisticsController.acceptShipment);
logisticsRouter.post('/shipments/:id/reject', LogisticsController.rejectShipment);
logisticsRouter.get('/me/shipments', LogisticsController.getShipments); // Legacy compatibility

// 5. Trip Management & Lifecycle
logisticsRouter.get('/trips', LogisticsController.getTrips);
logisticsRouter.get('/trips/:id', LogisticsController.getTripById);
logisticsRouter.post('/trips/:id/start', LogisticsController.startTrip);
logisticsRouter.post('/trips/:id/pickup-complete', LogisticsController.completePickup);
logisticsRouter.post('/trips/:id/start-delivery', LogisticsController.startDelivery);
logisticsRouter.post('/trips/:id/complete', LogisticsController.completeTrip);

// 6. Live Tracking & Telemetry
logisticsRouter.post('/trips/:id/location', LogisticsController.recordLocation);
logisticsRouter.get('/trips/:id/live-location', LogisticsController.getLiveLocation);
logisticsRouter.get('/trips/:id/route', LogisticsController.getRoute);
logisticsRouter.get('/shipments/:id/tracking', LogisticsController.getLiveLocation); // Legacy compatibility

// 7. Route Optimization Foundation
logisticsRouter.post('/routes/optimize', LogisticsController.optimizeRoute);

// 8. Financials, Earnings & Expenses
logisticsRouter.get('/earnings', LogisticsController.getEarnings);
logisticsRouter.get('/expenses', LogisticsController.getExpenses);
logisticsRouter.post('/expenses', LogisticsController.createExpense);

// 9. Maintenance Records & Scheduling
logisticsRouter.get('/maintenance', LogisticsController.getMaintenanceRecords);
logisticsRouter.post('/maintenance', LogisticsController.createMaintenanceRecord);

// 10. Ratings & Historical Records
logisticsRouter.get('/ratings', LogisticsController.getRatings);
logisticsRouter.get('/load-history', LogisticsController.getLoadHistory);

export default logisticsRouter;
