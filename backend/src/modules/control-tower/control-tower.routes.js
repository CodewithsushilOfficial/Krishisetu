import { Router } from 'express';
import { ControlTowerController } from './control-tower.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const controlTowerRouter = Router();

controlTowerRouter.use(requireAuth);
controlTowerRouter.use(requireRole(['CONTROL_ADMIN', 'ADMIN']));

controlTowerRouter.get('/overview', ControlTowerController.getOverview);
controlTowerRouter.get('/alerts', ControlTowerController.getAlerts);
controlTowerRouter.get('/supply-gaps', ControlTowerController.getSupplyGaps);
controlTowerRouter.get('/forecasts', ControlTowerController.getForecasts);

export default controlTowerRouter;
