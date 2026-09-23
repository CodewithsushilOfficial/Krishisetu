import prisma from '../../db/prisma.js';
import { NotFoundError } from '../../lib/errors.js';

export class BuyerController {
  static async getMe(req, res, next) {
    try {
      const buyer = await prisma.bulkBuyerProfile.findFirst({
        where: { userId: req.user.id },
      });

      if (!buyer) {
        throw new NotFoundError('Bulk buyer profile not found for authenticated user', 'PROFILE_NOT_FOUND');
      }

      const demandCount = await prisma.demand.count({ where: { buyerId: buyer.id } });
      const orderCount = await prisma.order.count({ where: { buyerId: buyer.id } });

      return res.json({
        success: true,
        data: {
          ...buyer,
          metrics: {
            totalDemands: demandCount,
            totalOrders: orderCount,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDemands(req, res, next) {
    try {
      const buyer = await prisma.bulkBuyerProfile.findFirst({ where: { userId: req.user.id } });
      if (!buyer) throw new NotFoundError('Bulk buyer profile not found', 'PROFILE_NOT_FOUND');

      const demands = await prisma.demand.findMany({
        where: { buyerId: buyer.id },
        include: {
          crop: true,
          matchings: {
            include: {
              lot: {
                include: {
                  produce: true,
                  farmer: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const transformedDemands = demands.map((d) => ({
        ...d,
        requiredQuantity: Number(d.requiredQtyKg),
        targetPrice: Number(d.targetPricePerKg),
        crop: {
          ...d.crop,
          name: d.crop?.cropName,
        },
        matchings: d.matchings.map((m) => ({
          ...m,
          matchStatus: m.status,
          matchedQuantity: Number(m.lot?.availableQtyKg || 0),
          lot: {
            ...m.lot,
            lotNumber: m.lot?.id,
          },
        })),
      }));

      return res.json({ success: true, data: transformedDemands });
    } catch (err) {
      next(err);
    }
  }

  static async getOrders(req, res, next) {
    try {
      const buyer = await prisma.bulkBuyerProfile.findFirst({ where: { userId: req.user.id } });
      if (!buyer) throw new NotFoundError('Bulk buyer profile not found', 'PROFILE_NOT_FOUND');

      const orders = await prisma.order.findMany({
        where: { buyerId: buyer.id },
        include: {
          crop: true,
          lot: {
            include: {
              farmer: true,
            },
          },
          payments: true,
          shipments: {
            include: {
              logistics: true,
              tracking: {
                take: 1,
                orderBy: { recordedAt: 'desc' },
              },
            },
          },
        },
        orderBy: { orderDate: 'desc' },
      });

      const transformedOrders = orders.map((o) => ({
        ...o,
        orderNumber: o.id,
        totalQuantity: Number(o.quantityKg),
        totalAmount: Number(o.totalAmount),
        unitPrice: Number(o.unitPrice),
        crop: {
          ...o.crop,
          name: o.crop?.cropName,
        },
        payment: o.payments?.[0] || null,
        shipment: o.shipments?.[0]
          ? {
              ...o.shipments[0],
              trackingNumber: o.shipments[0].id,
            }
          : null,
      }));

      return res.json({ success: true, data: transformedOrders });
    } catch (err) {
      next(err);
    }
  }
}
