import apiClient from '../../../lib/apiClient.js';

export const farmerService = {
  // 1. Dashboard
  getDashboardSummary: async () => {
    const res = await apiClient.get('/farmer/dashboard');
    return res.data;
  },

  getSummary: async () => {
    const res = await apiClient.get('/farmer/dashboard');
    return res.data;
  },

  // 2. Farms
  getFarms: async (params = {}) => {
    const res = await apiClient.get('/farmer/farms', { params });
    return res.data;
  },

  getFarmById: async (farmId) => {
    const res = await apiClient.get(`/farmer/farms/${farmId}`);
    return res.data;
  },

  createFarm: async (farmData) => {
    const res = await apiClient.post('/farmer/farms', farmData);
    return res.data;
  },

  updateFarm: async (farmId, farmData) => {
    const res = await apiClient.patch(`/farmer/farms/${farmId}`, farmData);
    return res.data;
  },

  deleteFarm: async (farmId) => {
    const res = await apiClient.delete(`/farmer/farms/${farmId}`);
    return res.data;
  },

  // 3. Crops
  getCrops: async () => {
    const res = await apiClient.get('/farmer/crops');
    return res.data;
  },

  getCropById: async (cropId) => {
    const res = await apiClient.get(`/farmer/crops/${cropId}`);
    return res.data;
  },

  addCrop: async (cropData) => {
    const res = await apiClient.post('/farmer/crops', cropData);
    return res.data;
  },

  // 4. Produce
  getProduce: async (params = {}) => {
    const res = await apiClient.get('/farmer/produce', { params });
    return res.data;
  },

  getProduceById: async (produceId) => {
    const res = await apiClient.get(`/farmer/produce/${produceId}`);
    return res.data;
  },

  createProduce: async (produceData) => {
    const res = await apiClient.post('/farmer/produce', produceData);
    return res.data;
  },

  updateProduce: async (produceId, produceData) => {
    const res = await apiClient.patch(`/farmer/produce/${produceId}`, produceData);
    return res.data;
  },

  deleteProduce: async (produceId) => {
    const res = await apiClient.delete(`/farmer/produce/${produceId}`);
    return res.data;
  },

  // 5. Market Prices
  getMarketPrices: async (params = {}) => {
    const res = await apiClient.get('/farmer/market-prices', { params });
    return res.data;
  },

  getMarketPricesByCrop: async (cropId, params = {}) => {
    const res = await apiClient.get(`/farmer/market-prices/${cropId}`, { params });
    return res.data;
  },

  // 6. Buyer Demand
  getBuyerDemand: async (params = {}) => {
    const res = await apiClient.get('/farmer/buyer-demand', { params });
    return res.data;
  },

  getBuyerDemandById: async (demandId) => {
    const res = await apiClient.get(`/farmer/buyer-demand/${demandId}`);
    return res.data;
  },

  // 7. Orders
  getOrders: async (params = {}) => {
    const res = await apiClient.get('/farmer/orders', { params });
    return res.data;
  },

  getOrderById: async (orderId) => {
    const res = await apiClient.get(`/farmer/orders/${orderId}`);
    return res.data;
  },

  getHarvests: async () => {
    const res = await apiClient.get('/farmer/harvests');
    return res.data;
  },

  // 8. Payments & Earnings
  getPayments: async (params = {}) => {
    const res = await apiClient.get('/farmer/payments', { params });
    return res.data;
  },

  getPaymentById: async (paymentId) => {
    const res = await apiClient.get(`/farmer/payments/${paymentId}`);
    return res.data;
  },

  getEarnings: async (period = '6m') => {
    const res = await apiClient.get('/farmer/earnings', { params: { period } });
    return res.data;
  },

  // 9. Weather
  getWeather: async () => {
    const res = await apiClient.get('/farmer/weather');
    return res.data;
  },

  getWeatherForecast: async () => {
    const res = await apiClient.get('/farmer/weather/forecast');
    return res.data;
  },

  // 10. AI Insights
  getAiInsights: async () => {
    const res = await apiClient.get('/farmer/ai-insights');
    return res.data;
  },

  refreshAiInsights: async () => {
    const res = await apiClient.post('/farmer/ai-insights/refresh');
    return res.data;
  },

  // 11. Messages
  getMessages: async () => {
    const res = await apiClient.get('/farmer/messages');
    return res.data;
  },

  getMessageConversation: async (conversationId) => {
    const res = await apiClient.get(`/farmer/messages/${conversationId}`);
    return res.data;
  },

  sendMessage: async (conversationId, messageData) => {
    const res = await apiClient.post(`/farmer/messages/${conversationId}/messages`, messageData);
    return res.data;
  },

  // 12. Notifications
  getUnreadNotificationCount: async () => {
    const res = await apiClient.get('/farmer/notifications/unread-count');
    return res.data;
  },
};

export default farmerService;
