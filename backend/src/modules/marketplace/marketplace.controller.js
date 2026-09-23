import prisma from '../../db/prisma.js';

export class MarketplaceController {
  static async getCrops(req, res, next) {
    try {
      const crops = await prisma.crop.findMany({
        where: { active: true },
        include: {
          inventoryLots: {
            where: { status: 'AVAILABLE' },
            select: {
              availableQtyKg: true,
              askingPricePerKg: true,
            },
          },
        },
      });

      const transformed = crops.map((c) => {
        const totalQty = c.inventoryLots.reduce((acc, lot) => acc + Number(lot.availableQtyKg), 0);
        const prices = c.inventoryLots.map((l) => Number(l.askingPricePerKg));
        const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 0;
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const maxPrice = prices.length ? Math.max(...prices) : 0;

        return {
          id: c.id,
          cropCode: c.cropCode,
          cropName: c.cropName,
          category: c.category,
          unit: c.unit,
          season: c.season,
          imageUrl: c.imageUrl,
          totalAvailableKg: totalQty,
          avgPricePerKg: Number(avgPrice),
          priceRange: { min: minPrice, max: maxPrice },
        };
      });

      return res.json({ success: true, data: transformed });
    } catch (err) {
      next(err);
    }
  }

  static async getInventory(req, res, next) {
    try {
      const { cropId, location } = req.query;

      const lots = await prisma.inventoryLot.findMany({
        where: {
          status: 'AVAILABLE',
          ...(cropId ? { cropId } : {}),
          ...(location ? { warehouseLocation: { contains: location, mode: 'insensitive' } } : {}),
        },
        include: {
          crop: true,
          farmer: {
            select: {
              id: true,
              village: true,
              district: true,
              state: true,
              farmerType: true,
              user: {
                select: { fullName: true },
              },
            },
          },
          produce: {
            select: {
              grade: true,
              harvestDate: true,
              qualityScore: true,
              organic: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json({ success: true, data: lots });
    } catch (err) {
      next(err);
    }
  }

  static async getMarketPrices(req, res, next) {
    try {
      const { cropId } = req.query;
      const prices = await prisma.marketPrice.findMany({
        where: {
          ...(cropId ? { cropId } : {}),
        },
        include: {
          crop: true,
        },
        orderBy: { date: 'desc' },
        take: 50,
      });

      return res.json({ success: true, data: prices });
    } catch (err) {
      next(err);
    }
  }
}
