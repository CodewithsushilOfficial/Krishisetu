import { Router } from 'express';
import MarketPriceController from './marketPrice.controller.js';
import { TokenService } from '../auth/token.service.js';

const marketPriceRouter = Router();

// Middleware: Optional Authentication (Extracts user if present, but doesn't block guests)
async function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    try {
      const decoded = TokenService.verifyAccessToken(token);
      req.user = {
        id: decoded.sub,
        role: decoded.role,
        email: decoded.email,
      };
    } catch {
      // Ignore token decode errors for optional auth
    }
  }
  next();
}

marketPriceRouter.use(optionalAuth);

// 1. Core Variety-wise Live Mandi Prices & Analytics
marketPriceRouter.get('/', MarketPriceController.getMarketPrices);

// 2. Discoverable Commodities (Sorted unique list)
marketPriceRouter.get('/commodities', MarketPriceController.getCommodities);

// 3. Indian States
marketPriceRouter.get('/states', MarketPriceController.getStates);

// 4. Districts for a State
marketPriceRouter.get('/districts', MarketPriceController.getDistricts);

// 5. Mandis / Markets for a District
marketPriceRouter.get('/mandis', MarketPriceController.getMandis);
marketPriceRouter.get('/markets', MarketPriceController.getMandis);

// 6. Location Hierarchy (Combined for backward compatibility)
marketPriceRouter.get('/locations', MarketPriceController.getLocations);

// 7. Price Trend Timeseries for Charts
marketPriceRouter.get('/trend', MarketPriceController.getPriceTrend);
marketPriceRouter.get('/trends', MarketPriceController.getPriceTrend);

// 8. Market Comparison across mandis for a commodity
marketPriceRouter.get('/comparison', MarketPriceController.getMarketComparison);

// 9. Multi-Crop Live Rate Overview Ticker / All Crops
marketPriceRouter.get('/overview', MarketPriceController.getOverview);

// 10. Force Sync from Upstream
marketPriceRouter.post('/sync', MarketPriceController.syncPrices);

export default marketPriceRouter;
