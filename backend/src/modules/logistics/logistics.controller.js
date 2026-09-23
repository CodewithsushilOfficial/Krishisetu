import { LogisticsService } from './logistics.service.js';

export class LogisticsController {
  static async getDashboard(req, res, next) {
    try {
      const data = await LogisticsService.getDashboardOverview(req.logistics.id);
      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const profile = await LogisticsService.getProfile(req.logistics.id);
      return res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const updated = await LogisticsService.updateProfile(req.logistics.id, req.body);
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async updateAvailability(req, res, next) {
    try {
      const { status } = req.body;
      const updated = await LogisticsService.updateAvailability(req.logistics.id, status);
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getVehicles(req, res, next) {
    try {
      const vehicles = await LogisticsService.getVehicles(req.logistics.id);
      return res.json({ success: true, data: vehicles });
    } catch (err) {
      next(err);
    }
  }

  static async getVehicleById(req, res, next) {
    try {
      const vehicle = await LogisticsService.getVehicleById(req.logistics.id, req.params.id);
      return res.json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  }

  static async createVehicle(req, res, next) {
    try {
      const vehicle = await LogisticsService.createVehicle(req.logistics.id, req.body);
      return res.status(201).json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  }

  static async updateVehicle(req, res, next) {
    try {
      const vehicle = await LogisticsService.updateVehicle(req.logistics.id, req.params.id, req.body);
      return res.json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  }

  static async deleteVehicle(req, res, next) {
    try {
      const result = await LogisticsService.deleteVehicle(req.logistics.id, req.params.id);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getShipments(req, res, next) {
    try {
      const shipments = await LogisticsService.getAvailableShipments(req.query);
      return res.json({ success: true, data: shipments });
    } catch (err) {
      next(err);
    }
  }

  static async getShipmentById(req, res, next) {
    try {
      const shipment = await LogisticsService.getShipmentById(req.params.id);
      return res.json({ success: true, data: shipment });
    } catch (err) {
      next(err);
    }
  }

  static async acceptShipment(req, res, next) {
    try {
      const { vehicleId } = req.body;
      const result = await LogisticsService.acceptShipment(req.logistics.id, req.params.id, vehicleId);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async rejectShipment(req, res, next) {
    try {
      const result = await LogisticsService.rejectShipment(req.logistics.id, req.params.id);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getTrips(req, res, next) {
    try {
      const trips = await LogisticsService.getTrips(req.logistics.id, req.query);
      return res.json({ success: true, data: trips });
    } catch (err) {
      next(err);
    }
  }

  static async getTripById(req, res, next) {
    try {
      const trip = await LogisticsService.getTripById(req.logistics.id, req.params.id);
      return res.json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }

  static async startTrip(req, res, next) {
    try {
      const updated = await LogisticsService.startTrip(req.logistics.id, req.params.id);
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async completePickup(req, res, next) {
    try {
      const updated = await LogisticsService.completePickup(req.logistics.id, req.params.id);
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async startDelivery(req, res, next) {
    try {
      const updated = await LogisticsService.startDelivery(req.logistics.id, req.params.id);
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async completeTrip(req, res, next) {
    try {
      const { proofUrl } = req.body;
      const updated = await LogisticsService.completeTrip(req.logistics.id, req.params.id, proofUrl);
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async recordLocation(req, res, next) {
    try {
      const update = await LogisticsService.recordLocation(req.logistics.id, req.params.id, req.body);
      return res.status(201).json({ success: true, data: update });
    } catch (err) {
      next(err);
    }
  }

  static async getLiveLocation(req, res, next) {
    try {
      const location = await LogisticsService.getLiveLocation(req.logistics.id, req.params.id);
      return res.json({ success: true, data: location });
    } catch (err) {
      next(err);
    }
  }

  static async getRoute(req, res, next) {
    try {
      const route = await LogisticsService.getRoute(req.logistics.id, req.params.id);
      return res.json({ success: true, data: route });
    } catch (err) {
      next(err);
    }
  }

  static async optimizeRoute(req, res, next) {
    try {
      const { stops } = req.body;
      const result = await LogisticsService.optimizeRoute(req.logistics.id, stops);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getEarnings(req, res, next) {
    try {
      const earnings = await LogisticsService.getEarnings(req.logistics.id);
      return res.json({ success: true, data: earnings });
    } catch (err) {
      next(err);
    }
  }

  static async getExpenses(req, res, next) {
    try {
      const expenses = await LogisticsService.getExpenses(req.logistics.id);
      return res.json({ success: true, data: expenses });
    } catch (err) {
      next(err);
    }
  }

  static async createExpense(req, res, next) {
    try {
      const expense = await LogisticsService.createExpense(req.logistics.id, req.body);
      return res.status(201).json({ success: true, data: expense });
    } catch (err) {
      next(err);
    }
  }

  static async getMaintenanceRecords(req, res, next) {
    try {
      const records = await LogisticsService.getMaintenanceRecords(req.logistics.id);
      return res.json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  }

  static async createMaintenanceRecord(req, res, next) {
    try {
      const record = await LogisticsService.createMaintenanceRecord(req.logistics.id, req.body);
      return res.status(201).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }

  static async getRatings(req, res, next) {
    try {
      const ratings = await LogisticsService.getRatings(req.logistics.id);
      return res.json({ success: true, data: ratings });
    } catch (err) {
      next(err);
    }
  }

  static async getLoadHistory(req, res, next) {
    try {
      const history = await LogisticsService.getLoadHistory(req.logistics.id, req.query);
      return res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }

  // Backward compatibility alias for /me
  static async getMe(req, res, next) {
    try {
      const profile = await LogisticsService.getProfile(req.logistics.id);
      return res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }
}

export default LogisticsController;
