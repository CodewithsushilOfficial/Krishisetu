import { Router } from 'express';
import { MarketplaceController } from './marketplace.controller.js';

const marketplaceRouter = Router();

// Public marketplace discovery endpoints (also accessible authenticated)
marketplaceRouter.get('/crops', MarketplaceController.getCrops);
marketplaceRouter.get('/inventory', MarketplaceController.getInventory);
marketplaceRouter.get('/prices', MarketplaceController.getMarketPrices);

export default marketplaceRouter;
