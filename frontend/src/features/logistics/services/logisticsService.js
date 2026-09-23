import apiClient from '../../../lib/apiClient.js';

export const logisticsService = {
  // 1. Dashboard Overview Aggregated Payload
  async getDashboardOverview() {
    const res = await apiClient.get('/logistics/dashboard');
    return res.data?.data || res.data;
  },

  // 2. Profile & Availability
  async getProfile() {
    const res = await apiClient.get('/logistics/profile');
    return res.data?.data || res.data;
  },

  async updateProfile(data) {
    const res = await apiClient.patch('/logistics/profile', data);
    return res.data?.data || res.data;
  },

  async updateAvailability(status) {
    const res = await apiClient.patch('/logistics/availability', { status });
    return res.data?.data || res.data;
  },

  // 3. Vehicles
  async getVehicles() {
    const res = await apiClient.get('/logistics/vehicles');
    return res.data?.data || res.data;
  },

  async getVehicleById(id) {
    const res = await apiClient.get(`/logistics/vehicles/${id}`);
    return res.data?.data || res.data;
  },

  async createVehicle(data) {
    const res = await apiClient.post('/logistics/vehicles', data);
    return res.data?.data || res.data;
  },

  async updateVehicle(id, data) {
    const res = await apiClient.patch(`/logistics/vehicles/${id}`, data);
    return res.data?.data || res.data;
  },

  async deleteVehicle(id) {
    const res = await apiClient.delete(`/logistics/vehicles/${id}`);
    return res.data?.data || res.data;
  },

  // 4. Available Shipments & Acceptance
  async getAvailableShipments(params = {}) {
    const res = await apiClient.get('/logistics/shipments', { params });
    return res.data?.data || res.data;
  },

  async getShipmentById(id) {
    const res = await apiClient.get(`/logistics/shipments/${id}`);
    return res.data?.data || res.data;
  },

  async acceptShipment(shipmentId, vehicleId) {
    const res = await apiClient.post(`/logistics/shipments/${shipmentId}/accept`, { vehicleId });
    return res.data?.data || res.data;
  },

  async rejectShipment(shipmentId) {
    const res = await apiClient.post(`/logistics/shipments/${shipmentId}/reject`);
    return res.data?.data || res.data;
  },

  // 5. Trips
  async getTrips(params = {}) {
    const res = await apiClient.get('/logistics/trips', { params });
    return res.data?.data || res.data;
  },

  async getTripById(id) {
    const res = await apiClient.get(`/logistics/trips/${id}`);
    return res.data?.data || res.data;
  },

  async startTrip(id) {
    const res = await apiClient.post(`/logistics/trips/${id}/start`);
    return res.data?.data || res.data;
  },

  async completePickup(id) {
    const res = await apiClient.post(`/logistics/trips/${id}/pickup-complete`);
    return res.data?.data || res.data;
  },

  async startDelivery(id) {
    const res = await apiClient.post(`/logistics/trips/${id}/start-delivery`);
    return res.data?.data || res.data;
  },

  async completeTrip(id, proofUrl = null) {
    const res = await apiClient.post(`/logistics/trips/${id}/complete`, { proofUrl });
    return res.data?.data || res.data;
  },

  // 6. Live Tracking & Telemetry
  async recordLocation(tripId, data) {
    const res = await apiClient.post(`/logistics/trips/${tripId}/location`, data);
    return res.data?.data || res.data;
  },

  async getLiveLocation(tripId) {
    const res = await apiClient.get(`/logistics/trips/${tripId}/live-location`);
    return res.data?.data || res.data;
  },

  async getRoute(tripId) {
    const res = await apiClient.get(`/logistics/trips/${tripId}/route`);
    return res.data?.data || res.data;
  },

  // 7. Route Optimization
  async optimizeRoute(stops = []) {
    const res = await apiClient.post('/logistics/routes/optimize', { stops });
    return res.data?.data || res.data;
  },

  // 8. Financials
  async getEarnings() {
    const res = await apiClient.get('/logistics/earnings');
    return res.data?.data || res.data;
  },

  async getExpenses() {
    const res = await apiClient.get('/logistics/expenses');
    return res.data?.data || res.data;
  },

  async createExpense(data) {
    const res = await apiClient.post('/logistics/expenses', data);
    return res.data?.data || res.data;
  },

  // 9. Maintenance
  async getMaintenanceRecords() {
    const res = await apiClient.get('/logistics/maintenance');
    return res.data?.data || res.data;
  },

  async createMaintenanceRecord(data) {
    const res = await apiClient.post('/logistics/maintenance', data);
    return res.data?.data || res.data;
  },

  // 10. Ratings & History
  async getRatings() {
    const res = await apiClient.get('/logistics/ratings');
    return res.data?.data || res.data;
  },

  async getLoadHistory(params = {}) {
    const res = await apiClient.get('/logistics/load-history', { params });
    return res.data?.data || res.data;
  },
};

export default logisticsService;
