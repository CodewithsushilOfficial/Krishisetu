import { FpoService } from './fpo.service.js';

export class FpoController {
  /**
   * GET /api/v1/fpo/dashboard/overview
   */
  static async getDashboardOverview(req, res, next) {
    try {
      const data = await FpoService.getDashboardOverview(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/farmers
   */
  static async getFarmers(req, res, next) {
    try {
      const { search, village, status, page, limit } = req.query;
      const data = await FpoService.getFarmers(req.fpo.id, {
        search,
        village,
        status,
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/fpo/farmers
   */
  static async createFarmer(req, res, next) {
    try {
      const data = await FpoService.createFarmer(req.fpo.id, req.body);
      return res.status(201).json({ success: true, data, message: 'Farmer registered successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/staff
   */
  static async getStaff(req, res, next) {
    try {
      const data = await FpoService.getStaff(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/fpo/staff/invite
   */
  static async inviteStaff(req, res, next) {
    try {
      const data = await FpoService.inviteStaff(req.fpo.id, req.body);
      return res.status(201).json({ success: true, data, message: 'Staff member added successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/fpo/staff/:id
   */
  static async updateStaff(req, res, next) {
    try {
      const data = await FpoService.updateStaff(req.fpo.id, req.params.id, req.body);
      return res.json({ success: true, data, message: 'Staff updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/collection-centers
   */
  static async getCollectionCenters(req, res, next) {
    try {
      const data = await FpoService.getCollectionCenters(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/fpo/collection-centers
   */
  static async createCollectionCenter(req, res, next) {
    try {
      const data = await FpoService.createCollectionCenter(req.fpo.id, req.body);
      return res.status(201).json({ success: true, data, message: 'Collection center created' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/fpo/collection-centers/:id
   */
  static async updateCollectionCenter(req, res, next) {
    try {
      const data = await FpoService.updateCollectionCenter(req.fpo.id, req.params.id, req.body);
      return res.json({ success: true, data, message: 'Collection center updated' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/fpo/produce
   */
  static async recordProduceCollection(req, res, next) {
    try {
      const data = await FpoService.recordProduceCollection(req.fpo.id, req.body);
      return res.status(201).json({ success: true, data, message: 'Produce intake recorded and inventory lot updated' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/produce
   */
  static async getProduce(req, res, next) {
    try {
      const data = await FpoService.getProduce(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/inventory
   */
  static async getInventory(req, res, next) {
    try {
      const data = await FpoService.getInventory(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/demands
   */
  static async getBuyerDemands(req, res, next) {
    try {
      const data = await FpoService.getBuyerDemands(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/orders
   */
  static async getOrders(req, res, next) {
    try {
      const data = await FpoService.getOrders(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/fpo/orders/:id/status
   */
  static async updateOrderStatus(req, res, next) {
    try {
      const data = await FpoService.updateOrderStatus(req.fpo.id, req.params.id, req.body.status);
      return res.json({ success: true, data, message: 'Order status updated' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/shipments
   */
  static async getShipments(req, res, next) {
    try {
      const data = await FpoService.getShipments(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/logistics/:id
   */
  static async getShipmentById(req, res, next) {
    try {
      const data = await FpoService.getShipmentById(req.fpo.id, req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Shipment not found' });
      }
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/logistics/:id/location
   */
  static async getShipmentLocation(req, res, next) {
    try {
      const data = await FpoService.getShipmentLocation(req.fpo.id, req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Shipment location not found' });
      }
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/logistics/:id/route
   */
  static async getShipmentRoute(req, res, next) {
    try {
      const data = await FpoService.getShipmentRoute(req.fpo.id, req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Shipment route not found' });
      }
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/fpo/logistics/:id/status
   */
  static async updateShipmentStatus(req, res, next) {
    try {
      const data = await FpoService.updateShipmentStatus(req.fpo.id, req.params.id, req.body.status);
      return res.json({ success: true, data, message: 'Shipment status updated' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/payments
   */
  static async getPayments(req, res, next) {
    try {
      const data = await FpoService.getPayments(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/settlements
   */
  static async getSettlements(req, res, next) {
    try {
      const data = await FpoService.getSettlements(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/notifications
   */
  static async getNotifications(req, res, next) {
    try {
      const data = await FpoService.getNotifications(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/fpo/notifications/:id/read
   */
  static async markNotificationRead(req, res, next) {
    try {
      const data = await FpoService.markNotificationRead(req.fpo.id, req.params.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/messages/unread-count
   */
  static async getUnreadMessageCount(req, res, next) {
    try {
      const data = await FpoService.getUnreadMessageCount(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/messages
   */
  static async getMessages(req, res, next) {
    try {
      const data = await FpoService.getMessages(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/fpo/messages
   */
  static async sendMessage(req, res, next) {
    try {
      const data = await FpoService.sendMessage(req.fpo.id, req.body);
      return res.status(201).json({ success: true, data, message: 'Message sent' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/fpo/profile
   */
  static async getProfile(req, res, next) {
    try {
      const data = await FpoService.getProfile(req.fpo.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/fpo/profile
   */
  static async updateProfile(req, res, next) {
    try {
      const data = await FpoService.updateProfile(req.fpo.id, req.body);
      return res.json({ success: true, data, message: 'Profile updated' });
    } catch (err) {
      next(err);
    }
  }

  // --- Backward Compatibility Handlers ---
  static async getMe(req, res, next) {
    return FpoController.getDashboardOverview(req, res, next);
  }

  static async getMembers(req, res, next) {
    try {
      const result = await FpoService.getFarmers(req.fpo.id, { limit: 100 });
      return res.json({ success: true, data: result.farmers });
    } catch (err) {
      next(err);
    }
  }
}
