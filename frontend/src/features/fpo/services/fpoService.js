import apiClient from '../../../lib/apiClient.js';

const unwrap = (res) => (res && typeof res === 'object' && 'data' in res && 'success' in res ? res.data : res);

export const fpoService = {
  // Dashboard Aggregation
  getOverview: async () => {
    const res = await apiClient.get('/fpo/dashboard/overview');
    return unwrap(res);
  },

  // Farmers
  getFarmers: async (params = {}) => {
    const res = await apiClient.get('/fpo/farmers', { params });
    return unwrap(res);
  },
  createFarmer: async (data) => {
    const res = await apiClient.post('/fpo/farmers', data);
    return unwrap(res);
  },

  // Collection Centers
  getCollectionCenters: async () => {
    const res = await apiClient.get('/fpo/collection-centers');
    return unwrap(res);
  },
  createCollectionCenter: async (data) => {
    const res = await apiClient.post('/fpo/collection-centers', data);
    return unwrap(res);
  },
  updateCollectionCenter: async (id, data) => {
    const res = await apiClient.patch(`/fpo/collection-centers/${id}`, data);
    return unwrap(res);
  },

  // Produce
  getProduce: async () => {
    const res = await apiClient.get('/fpo/produce');
    return unwrap(res);
  },
  recordProduce: async (data) => {
    const res = await apiClient.post('/fpo/produce', data);
    return unwrap(res);
  },

  // Inventory & Lots
  getInventory: async () => {
    const res = await apiClient.get('/fpo/inventory');
    return unwrap(res);
  },

  // Buyer Demands
  getDemands: async () => {
    const res = await apiClient.get('/fpo/demands');
    return unwrap(res);
  },

  // Orders
  getOrders: async () => {
    const res = await apiClient.get('/fpo/orders');
    return unwrap(res);
  },
  updateOrderStatus: async (id, status) => {
    const res = await apiClient.patch(`/fpo/orders/${id}/status`, { status });
    return unwrap(res);
  },

  // Logistics & Real-time Tracking
  getShipments: async () => {
    const res = await apiClient.get('/fpo/logistics');
    return unwrap(res);
  },
  getShipmentById: async (id) => {
    const res = await apiClient.get(`/fpo/logistics/${id}`);
    return unwrap(res);
  },
  getShipmentLocation: async (id) => {
    const res = await apiClient.get(`/fpo/logistics/${id}/location`);
    return unwrap(res);
  },
  getShipmentRoute: async (id) => {
    const res = await apiClient.get(`/fpo/logistics/${id}/route`);
    return unwrap(res);
  },
  updateShipmentStatus: async (id, status) => {
    const res = await apiClient.patch(`/fpo/logistics/${id}/status`, { status });
    return unwrap(res);
  },

  // Payments & Settlements
  getPayments: async () => {
    const res = await apiClient.get('/fpo/payments');
    return unwrap(res);
  },
  getSettlements: async () => {
    const res = await apiClient.get('/fpo/settlements');
    return unwrap(res);
  },

  // Staff & RBAC
  getStaff: async () => {
    const res = await apiClient.get('/fpo/staff');
    return unwrap(res);
  },
  inviteStaff: async (data) => {
    const res = await apiClient.post('/fpo/staff/invite', data);
    return unwrap(res);
  },
  updateStaff: async (id, data) => {
    const res = await apiClient.patch(`/fpo/staff/${id}`, data);
    return unwrap(res);
  },

  // Notifications
  getNotifications: async () => {
    const res = await apiClient.get('/fpo/notifications');
    return unwrap(res);
  },
  markNotificationRead: async (id) => {
    const res = await apiClient.patch(`/fpo/notifications/${id}/read`);
    return unwrap(res);
  },

  // Messages
  getMessages: async () => {
    const res = await apiClient.get('/fpo/messages');
    return unwrap(res);
  },
  getUnreadMessageCount: async () => {
    const res = await apiClient.get('/fpo/messages/unread-count');
    return unwrap(res);
  },
  sendMessage: async (data) => {
    const res = await apiClient.post('/fpo/messages', data);
    return unwrap(res);
  },

  // Profile
  getProfile: async () => {
    const res = await apiClient.get('/fpo/profile');
    return unwrap(res);
  },
  updateProfile: async (data) => {
    const res = await apiClient.patch('/fpo/profile', data);
    return unwrap(res);
  },
};

export default fpoService;
