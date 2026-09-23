import prisma from '../../db/prisma.js';

export class ControlTowerController {
  static async getOverview(req, res, next) {
    try {
      const [
        totalAlerts,
        criticalAlerts,
        supplyGaps,
        activeShipments,
        forecasts,
      ] = await Promise.all([
        prisma.controlTowerAlert.count(),
        prisma.controlTowerAlert.count({ where: { severity: 'CRITICAL' } }),
        prisma.aISupplyGap.findMany({
          include: { crop: true },
          orderBy: { gapKg: 'desc' },
          take: 5,
        }),
        prisma.shipment.findMany({
          where: { status: 'IN_TRANSIT' },
          include: {
            vehicle: true,
            logistics: true,
            routeOptimizations: true,
            tracking: {
              take: 1,
              orderBy: { recordedAt: 'desc' },
            },
          },
          take: 5,
        }),
        prisma.aIForecast.findMany({
          include: { crop: true },
          orderBy: { forecastDate: 'desc' },
          take: 5,
        }),
      ]);

      return res.json({
        success: true,
        data: {
          metrics: {
            totalAlerts,
            criticalAlerts,
            totalSupplyGaps: await prisma.aISupplyGap.count(),
            activeShipmentsCount: await prisma.shipment.count({ where: { status: 'IN_TRANSIT' } }),
          },
          topSupplyGaps: supplyGaps,
          activeShipments,
          recentForecasts: forecasts,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAlerts(req, res, next) {
    try {
      const { severity, status } = req.query;
      const alerts = await prisma.controlTowerAlert.findMany({
        where: {
          ...(severity ? { severity } : {}),
          ...(status ? { status } : {}),
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json({ success: true, data: alerts });
    } catch (err) {
      next(err);
    }
  }

  static async getSupplyGaps(req, res, next) {
    try {
      const { cropId, region } = req.query;
      const gaps = await prisma.aISupplyGap.findMany({
        where: {
          ...(cropId ? { cropId } : {}),
          ...(region ? { region: { contains: region, mode: 'insensitive' } } : {}),
        },
        include: { crop: true },
        orderBy: { gapKg: 'desc' },
      });

      return res.json({ success: true, data: gaps });
    } catch (err) {
      next(err);
    }
  }

  static async getForecasts(req, res, next) {
    try {
      const { cropId, market } = req.query;
      const forecasts = await prisma.aIForecast.findMany({
        where: {
          ...(cropId ? { cropId } : {}),
          ...(market ? { market: { contains: market, mode: 'insensitive' } } : {}),
        },
        include: { crop: true },
        orderBy: { forecastDate: 'asc' },
      });

      return res.json({ success: true, data: forecasts });
    } catch (err) {
      next(err);
    }
  }
}
