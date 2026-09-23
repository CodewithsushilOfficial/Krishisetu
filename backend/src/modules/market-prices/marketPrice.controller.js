import { z } from 'zod';
import MarketPriceService from './marketPrice.service.js';
import prisma from '../../db/prisma.js';
import logger from '../../lib/logger.js';

const marketPriceQuerySchema = z.object({
  commodity: z.string().trim().optional(),
  crop: z.string().trim().optional(),
  state: z.string().trim().optional(),
  district: z.string().trim().optional(),
  market: z.string().trim().optional(),
  variety: z.string().trim().optional(),
  arrivalDate: z.string().trim().optional(),
  date: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
  days: z.coerce.number().int().optional().default(30),
});

export class MarketPriceController {
  /**
   * GET /api/v1/market-prices
   * Variety-wise daily mandi prices & statistical summaries
   */
  static async getMarketPrices(req, res, next) {
    try {
      const validated = marketPriceQuerySchema.parse(req.query);

      let crop = validated.commodity || validated.crop;
      let state = validated.state;
      let district = validated.district;

      // If user is authenticated farmer, prioritize their registered profile if omitted
      if (req.user?.id) {
        try {
          const farmer = await prisma.farmerProfile.findUnique({
            where: { userId: req.user.id },
            select: { state: true, district: true, primaryCrops: true },
          });

          if (farmer) {
            if (!state && farmer.state) state = farmer.state;
            if (!district && farmer.district) district = farmer.district;
            if (!crop && Array.isArray(farmer.primaryCrops) && farmer.primaryCrops.length > 0) {
              crop = farmer.primaryCrops[0];
            }
          }
        } catch (err) {
          logger.debug('Skipping farmer profile lookup for market query', { error: err.message });
        }
      }

      // Default fallback if still undefined
      if (!crop) crop = 'Tomato';
      if (!state) state = 'Uttar Pradesh';

      const data = await MarketPriceService.getMarketPrices({
        commodity: crop,
        state,
        district: district || '',
        market: validated.market || '',
        variety: validated.variety || '',
        arrivalDate: validated.arrivalDate || validated.date || '',
        page: validated.page,
        limit: validated.limit,
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Invalid query parameters',
          },
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/v1/market-prices/commodities
   * Dynamic unique sorted list of all available crops
   */
  static async getCommodities(req, res, next) {
    try {
      const search = req.query.search || '';
      const commodities = await MarketPriceService.getCommodities(search);

      return res.status(200).json({
        success: true,
        data: commodities,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/market-prices/states
   * Dynamic sorted list of all Indian States
   */
  static async getStates(req, res, next) {
    try {
      const states = await MarketPriceService.getStates();

      return res.status(200).json({
        success: true,
        data: states,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/market-prices/districts
   * Districts dependent on selected state
   */
  static async getDistricts(req, res, next) {
    try {
      const state = req.query.state || 'Uttar Pradesh';
      const districts = await MarketPriceService.getDistricts(state);

      return res.status(200).json({
        success: true,
        data: districts,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/market-prices/mandis
   * Mandis for a given state & district
   */
  static async getMandis(req, res, next) {
    try {
      const state = req.query.state || 'Uttar Pradesh';
      const district = req.query.district || '';
      const mandis = await MarketPriceService.getMandis(state, district);

      return res.status(200).json({
        success: true,
        data: mandis,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/market-prices/locations
   * Combined location hierarchy for backward compatibility
   */
  static async getLocations(req, res, next) {
    try {
      const state = req.query.state || 'Uttar Pradesh';
      const district = req.query.district || '';

      const [states, districts, mandis] = await Promise.all([
        MarketPriceService.getStates(),
        MarketPriceService.getDistricts(state),
        MarketPriceService.getMandis(state, district),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          states,
          districts,
          markets: mandis,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/market-prices/trend
   * Historical timeseries for charts reacting to selected crop & location
   */
  static async getPriceTrend(req, res, next) {
    try {
      const validated = marketPriceQuerySchema.parse(req.query);
      const crop = validated.commodity || validated.crop || 'Tomato';
      const state = validated.state || 'Uttar Pradesh';
      const district = validated.district || '';
      const market = validated.market || '';
      const days = validated.days || 30;

      const data = await MarketPriceService.getPriceTrend({
        commodity: crop,
        state,
        district,
        market,
        days,
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/market-prices/overview
   * Multi-crop live rates ticker for state/district
   */
  static async getOverview(req, res, next) {
    try {
      const state = req.query.state || 'Uttar Pradesh';
      const district = req.query.district || '';

      const data = await MarketPriceService.getAllCropsOverview({
        state,
        district,
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/market-prices/comparison
   * Market-wise comparison for a commodity in a state/district
   */
  static async getMarketComparison(req, res, next) {
    try {
      const commodity = req.query.commodity || req.query.crop || 'Tomato';
      const state = req.query.state || 'Uttar Pradesh';
      const district = req.query.district || '';

      const data = await MarketPriceService.getMarketComparison({
        commodity,
        state,
        district,
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/market-prices/sync
   * Trigger on-demand sync from Data.gov.in
   */
  static async syncPrices(req, res, next) {
    try {
      const { crop = 'Tomato', commodity, state = 'Uttar Pradesh', district } = req.body || {};
      const cropToSync = commodity || crop;

      const result = await MarketPriceService.getMarketPrices({
        commodity: cropToSync,
        state,
        district,
        limit: 100,
      });

      return res.status(200).json({
        success: true,
        message: `Synced ${result.records?.length || 0} live mandi records for ${cropToSync}`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default MarketPriceController;
