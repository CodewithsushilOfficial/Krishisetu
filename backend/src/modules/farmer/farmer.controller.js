import FarmerService from './farmer.service.js';

export class FarmerController {
  /**
   * Complete Aggregated Dashboard Summary
   */
  static async getDashboardSummary(req, res, next) {
    try {
      const summary = await FarmerService.getDashboardSummary(req.user.id);
      return res.json({
        success: true,
        data: summary,
        message: 'Farmer dashboard summary retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Farmer Profile with Metrics
   */
  static async getMe(req, res, next) {
    try {
      const farmer = await FarmerService.getFarmerByUserId(req.user.id);
      return res.json({
        success: true,
        data: farmer,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * FARMS: Get Registered Farms
   */
  static async getFarms(req, res, next) {
    try {
      const farms = await FarmerService.getFarms(req.user.id, req.query);
      return res.json({
        success: true,
        data: farms,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * FARMS: Get Farm By ID
   */
  static async getFarmById(req, res, next) {
    try {
      const farm = await FarmerService.getFarmById(req.user.id, req.params.farmId);
      return res.json({
        success: true,
        data: farm,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * FARMS: Create New Farm
   */
  static async createFarm(req, res, next) {
    try {
      const farm = await FarmerService.createFarm(req.user.id, req.body);
      return res.status(201).json({
        success: true,
        data: farm,
        message: 'Farm registered successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * FARMS: Update Farm
   */
  static async updateFarm(req, res, next) {
    try {
      const farm = await FarmerService.updateFarm(req.user.id, req.params.farmId, req.body);
      return res.json({
        success: true,
        data: farm,
        message: 'Farm details updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * FARMS: Delete Farm
   */
  static async deleteFarm(req, res, next) {
    try {
      const result = await FarmerService.deleteFarm(req.user.id, req.params.farmId);
      return res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * CROPS: Get Farmer's Cultivated & Platform Crops
   */
  static async getCrops(req, res, next) {
    try {
      const crops = await FarmerService.getCrops(req.user.id);
      return res.json({
        success: true,
        data: crops,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * CROPS: Get Crop By ID
   */
  static async getCropById(req, res, next) {
    try {
      const crop = await FarmerService.getCropById(req.params.cropId);
      return res.json({
        success: true,
        data: crop,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * CROPS: Add Crop to Cultivation
   */
  static async addCrop(req, res, next) {
    try {
      const result = await FarmerService.addCrop(req.user.id, req.body);
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PRODUCE: Get Produce (Data Isolated, with search, filters, pagination)
   */
  static async getProduce(req, res, next) {
    try {
      const result = await FarmerService.getProduce(req.user.id, req.query);
      return res.json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PRODUCE: Get Produce by ID
   */
  static async getProduceById(req, res, next) {
    try {
      const produce = await FarmerService.getProduceById(req.user.id, req.params.produceId);
      return res.json({
        success: true,
        data: produce,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PRODUCE: Create New Produce
   */
  static async createProduce(req, res, next) {
    try {
      const newProduce = await FarmerService.createProduce(req.user.id, req.body);
      return res.status(201).json({
        success: true,
        data: newProduce,
        message: 'Produce listed and inventory lot created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PRODUCE: Update Produce
   */
  static async updateProduce(req, res, next) {
    try {
      const updated = await FarmerService.updateProduce(req.user.id, req.params.produceId, req.body);
      return res.json({
        success: true,
        data: updated,
        message: 'Produce listing updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PRODUCE: Delete Produce
   */
  static async deleteProduce(req, res, next) {
    try {
      const result = await FarmerService.deleteProduce(req.user.id, req.params.produceId);
      return res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * MARKET: Market Prices with historical timeseries and trends
   */
  static async getMarketPrices(req, res, next) {
    try {
      let { cropId, period = '30d', location = 'Varanasi' } = req.query;
      if (!cropId) {
        const farmer = await prisma.farmerProfile.findUnique({
          where: { userId: req.user.id },
          select: { primaryCrops: true },
        });
        cropId = (Array.isArray(farmer?.primaryCrops) && farmer.primaryCrops[0]) || 'Tomato';
      }
      const data = await FarmerService.getMarketPrices(cropId, period, location);
      return res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * MARKET: Single Crop Market Price
   */
  static async getMarketPricesByCrop(req, res, next) {
    try {
      const { period = '30d', location = 'Varanasi' } = req.query;
      const data = await FarmerService.getMarketPrices(req.params.cropId, period, location);
      return res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * BUYER DEMAND: Get Open Buyer Demands
   */
  static async getBuyerDemand(req, res, next) {
    try {
      const result = await FarmerService.getBuyerDemand(req.user.id, req.query);
      return res.json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * BUYER DEMAND: Get Single Demand
   */
  static async getBuyerDemandById(req, res, next) {
    try {
      const demand = await FarmerService.getBuyerDemandById(req.params.demandId);
      return res.json({
        success: true,
        data: demand,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * ORDERS: Get Farmer Orders
   */
  static async getOrders(req, res, next) {
    try {
      const result = await FarmerService.getOrders(req.user.id, req.query);
      return res.json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * ORDERS: Get Order By ID
   */
  static async getOrderById(req, res, next) {
    try {
      const order = await FarmerService.getOrderById(req.user.id, req.params.orderId);
      return res.json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PAYMENTS: Get Farmer Payments & Revenue
   */
  static async getPayments(req, res, next) {
    try {
      const payments = await FarmerService.getPayments(req.user.id, req.query);
      return res.json({
        success: true,
        data: payments,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PAYMENTS: Get Payment by ID
   */
  static async getPaymentById(req, res, next) {
    try {
      const payment = await FarmerService.getPaymentById(req.user.id, req.params.paymentId);
      return res.json({
        success: true,
        data: payment,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * HARVESTS: Upcoming Harvest Schedules
   */
  static async getHarvests(req, res, next) {
    try {
      const summary = await FarmerService.getDashboardSummary(req.user.id);
      return res.json({
        success: true,
        data: summary.upcomingHarvests,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * EARNINGS: Historical Overview
   */
  static async getEarnings(req, res, next) {
    try {
      const { period = '6m' } = req.query;
      const earnings = await FarmerService.getEarnings(req.user.id, period);
      return res.json({
        success: true,
        data: earnings,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * WEATHER: Microclimate & Meteorological Data
   */
  static async getWeather(req, res, next) {
    try {
      const farmer = await FarmerService.getFarmerByUserId(req.user.id);
      const { latitude, longitude } = req.query;
      const weather = await FarmerService.getWeather(
        farmer.district || 'Varanasi',
        farmer.state || 'Uttar Pradesh',
        latitude,
        longitude
      );
      return res.json({
        success: true,
        data: weather,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * WEATHER: Forecast & Agricultural Advisories
   */
  static async getWeatherForecast(req, res, next) {
    try {
      const farmer = await FarmerService.getFarmerByUserId(req.user.id);
      const { latitude, longitude } = req.query;
      const weather = await FarmerService.getWeather(
        farmer.district || 'Varanasi',
        farmer.state || 'Uttar Pradesh',
        latitude,
        longitude
      );
      return res.json({
        success: true,
        data: {
          location: weather.location,
          forecast: weather.forecast,
          advisories: weather.advisories,
          alert: weather.alert,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * AI INSIGHTS: Decision Intelligence
   */
  static async getAiInsights(req, res, next) {
    try {
      const farmer = await FarmerService.getFarmerByUserId(req.user.id);
      const insights = await FarmerService.getAiInsights(farmer);
      return res.json({
        success: true,
        data: { insights },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * AI INSIGHTS: Refresh Intelligence
   */
  static async refreshAiInsights(req, res, next) {
    try {
      const farmer = await FarmerService.getFarmerByUserId(req.user.id);
      const insights = await FarmerService.getAiInsights(farmer);
      return res.json({
        success: true,
        data: { insights },
        message: 'AI agricultural intelligence refreshed',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * MESSAGES: List Farmer Conversations
   */
  static async getMessages(req, res, next) {
    try {
      const conversations = await FarmerService.getMessages(req.user.id);
      return res.json({
        success: true,
        data: conversations,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * MESSAGES: Get Single Conversation
   */
  static async getMessageConversation(req, res, next) {
    try {
      const conv = await FarmerService.getMessageConversation(req.user.id, req.params.conversationId);
      return res.json({
        success: true,
        data: conv,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * MESSAGES: Send New Message
   */
  static async sendMessage(req, res, next) {
    try {
      const newMsg = await FarmerService.sendMessage(req.user.id, req.params.conversationId, req.body);
      return res.status(201).json({
        success: true,
        data: newMsg,
        message: 'Message sent successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * NOTIFICATIONS: Live Unread Count
   */
  static async getUnreadNotificationCount(req, res, next) {
    try {
      const counts = await FarmerService.getUnreadNotificationCount(req.user.id);
      return res.json({
        success: true,
        data: counts,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default FarmerController;
