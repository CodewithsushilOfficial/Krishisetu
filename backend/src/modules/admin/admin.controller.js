import prisma from '../../db/prisma.js';

export class AdminController {
  static async getOverview(req, res, next) {
    try {
      const [
        totalUsers,
        totalFarmers,
        totalFpos,
        totalLogistics,
        totalBuyers,
        totalConsumers,
        totalCrops,
        totalFarms,
        totalProduce,
        totalLots,
        totalOrders,
        totalPayments,
        totalShipments,
        totalAlerts,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.farmerProfile.count(),
        prisma.fpoProfile.count(),
        prisma.logisticsProfile.count(),
        prisma.bulkBuyerProfile.count(),
        prisma.consumerProfile.count(),
        prisma.crop.count(),
        prisma.farm.count(),
        prisma.produce.count(),
        prisma.inventoryLot.count(),
        prisma.order.count(),
        prisma.payment.count(),
        prisma.shipment.count(),
        prisma.controlTowerAlert.count(),
      ]);

      // Calculate total order value
      const orders = await prisma.order.findMany({ select: { totalAmount: true } });
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

      // Available inventory volume
      const lots = await prisma.inventoryLot.findMany({
        where: { status: 'AVAILABLE' },
        select: { availableQtyKg: true },
      });
      const totalAvailableKg = lots.reduce((sum, l) => sum + Number(l.availableQtyKg), 0);

      return res.json({
        success: true,
        data: {
          counts: {
            users: totalUsers,
            farmers: totalFarmers,
            fpos: totalFpos,
            logistics: totalLogistics,
            buyers: totalBuyers,
            consumers: totalConsumers,
            farms: totalFarms,
            orders: totalOrders,
            shipments: totalShipments,
            alerts: totalAlerts,
            produce: totalProduce,
            lots: totalLots,
            crops: totalCrops,
            payments: totalPayments,
          },
          totalRevenue,
          totalAvailableKg,
          metrics: {
            totalUsers,
            totalFarmers,
            totalFpos,
            totalLogistics,
            totalBuyers,
            totalConsumers,
            totalCrops,
            totalFarms,
            totalProduce,
            totalInventoryLots: totalLots,
            totalOrders,
            totalPayments,
            totalShipments,
            totalAlerts,
            totalRevenue,
            totalAvailableKg,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const { role, status, limit = 50 } = req.query;
      const users = await prisma.user.findMany({
        where: {
          ...(role ? { role } : {}),
          ...(status ? { status } : {}),
        },
        select: {
          id: true,
          email: true,
          phone: true,
          fullName: true,
          role: true,
          status: true,
          emailVerified: true,
          phoneVerified: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
      });

      return res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  }
}
