import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRouter from '../modules/auth/auth.routes.js';
import profileRouter from '../modules/profile/profile.routes.js';
import farmerRouter from '../modules/farmer/farmer.routes.js';
import fpoRouter from '../modules/fpo/fpo.routes.js';
import logisticsRouter from '../modules/logistics/logistics.routes.js';
import buyerRouter from '../modules/buyer/buyer.routes.js';
import marketplaceRouter from '../modules/marketplace/marketplace.routes.js';
import adminRouter from '../modules/admin/admin.routes.js';
import controlTowerRouter from '../modules/control-tower/control-tower.routes.js';
import marketPriceRouter from '../modules/market-prices/marketPrice.routes.js';
import weatherRouter from '../modules/weather/weather.routes.js';

const apiRouter = Router();

// Health Check Subsystem
apiRouter.use('/health', healthRoutes);

// Auth & Identity Subsystem
apiRouter.use('/auth', authRouter);
apiRouter.use('/profile', profileRouter);

// Domain Subsystems
apiRouter.use('/farmers', farmerRouter);
apiRouter.use('/farmer', farmerRouter);
apiRouter.use('/fpo', fpoRouter);
apiRouter.use('/logistics', logisticsRouter);
apiRouter.use('/buyers', buyerRouter);
apiRouter.use('/marketplace', marketplaceRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/control-tower', controlTowerRouter);
apiRouter.use('/market-prices', marketPriceRouter);
apiRouter.use('/weather', weatherRouter);

export default apiRouter;
