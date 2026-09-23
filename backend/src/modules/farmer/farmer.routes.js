import { Router } from 'express';
import { FarmerController } from './farmer.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const farmerRouter = Router();

// Strict RBAC: Authenticated Farmer or System Admins
farmerRouter.use(requireAuth);
farmerRouter.use(requireRole(['FARMER', 'ADMIN', 'CONTROL_ADMIN']));

// 1. Dashboard Aggregation
farmerRouter.get('/dashboard', FarmerController.getDashboardSummary);
farmerRouter.get('/dashboard/summary', FarmerController.getDashboardSummary);

// 2. Farms Management (RESTful CRUD)
farmerRouter.get('/farms', FarmerController.getFarms);
farmerRouter.post('/farms', FarmerController.createFarm);
farmerRouter.get('/farms/:farmId', FarmerController.getFarmById);
farmerRouter.patch('/farms/:farmId', FarmerController.updateFarm);
farmerRouter.delete('/farms/:farmId', FarmerController.deleteFarm);

// 3. Crops Cultivation & Catalogs
farmerRouter.get('/crops', FarmerController.getCrops);
farmerRouter.post('/crops', FarmerController.addCrop);
farmerRouter.get('/crops/:cropId', FarmerController.getCropById);

// 4. Produce Listings & Inventory Lots (RESTful CRUD)
farmerRouter.get('/produce', FarmerController.getProduce);
farmerRouter.post('/produce', FarmerController.createProduce);
farmerRouter.get('/produce/:produceId', FarmerController.getProduceById);
farmerRouter.patch('/produce/:produceId', FarmerController.updateProduce);
farmerRouter.delete('/produce/:produceId', FarmerController.deleteProduce);

// 5. Market Price Trends & Historical Analytics
farmerRouter.get('/market-prices', FarmerController.getMarketPrices);
farmerRouter.get('/market-prices/:cropId', FarmerController.getMarketPricesByCrop);

// 6. Buyer Demand Pools & Direct Offers
farmerRouter.get('/buyer-demand', FarmerController.getBuyerDemand);
farmerRouter.get('/buyer-demand/:demandId', FarmerController.getBuyerDemandById);

// 7. Orders & Shipments Telemetry
farmerRouter.get('/orders', FarmerController.getOrders);
farmerRouter.get('/orders/:orderId', FarmerController.getOrderById);

// 8. Financials, Escrow & Earnings
farmerRouter.get('/payments', FarmerController.getPayments);
farmerRouter.get('/payments/:paymentId', FarmerController.getPaymentById);
farmerRouter.get('/earnings', FarmerController.getEarnings);

// 9. AI Insights & Decision Intelligence
farmerRouter.get('/ai-insights', FarmerController.getAiInsights);
farmerRouter.post('/ai-insights/refresh', FarmerController.refreshAiInsights);
farmerRouter.get('/ai/insights', FarmerController.getAiInsights);
farmerRouter.post('/ai/insights/refresh', FarmerController.refreshAiInsights);

// 10. Microclimate Weather & Meteorological Advisories
farmerRouter.get('/weather', FarmerController.getWeather);
farmerRouter.get('/weather/forecast', FarmerController.getWeatherForecast);

// 11. Real-time Farmer Conversations
farmerRouter.get('/messages', FarmerController.getMessages);
farmerRouter.get('/messages/:conversationId', FarmerController.getMessageConversation);
farmerRouter.post('/messages/:conversationId/messages', FarmerController.sendMessage);

// 12. Notification Counters
farmerRouter.get('/notifications/unread-count', FarmerController.getUnreadNotificationCount);

// Backward Compatibility Endpoints
farmerRouter.get('/harvests', FarmerController.getHarvests);
farmerRouter.get('/me', FarmerController.getMe);
farmerRouter.get('/me/farms', FarmerController.getFarms);
farmerRouter.get('/me/produce', FarmerController.getProduce);

export default farmerRouter;
