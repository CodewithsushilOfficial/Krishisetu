import apiClient from '../../../lib/apiClient.js';

export const marketPriceService = {
  /**
   * Fetch latest mandi prices, trends, and series from KrishiSetu backend
   * (Backed by Government of India Data.gov.in Mandi API)
   */
  async getMarketPrices(params = {}) {
    const res = await apiClient.get('/market-prices', { params });
    return res.data;
  },

  /**
   * Fetch dynamically discoverable commodities list
   */
  async getCommodities(search = '') {
    const res = await apiClient.get('/market-prices/commodities', {
      params: { search },
    });
    return res.data;
  },

  /**
   * Fetch available location hierarchy (States, Districts, Mandis)
   */
  async getLocations(params = {}) {
    const res = await apiClient.get('/market-prices/locations', { params });
    return res.data;
  },

  /**
   * Fetch multi-crop live rates overview for ticker
   */
  async getOverview(params = {}) {
    const res = await apiClient.get('/market-prices/overview', { params });
    return res.data;
  },

  /**
   * Fetch unique sorted list of Indian States
   */
  async getStates() {
    const res = await apiClient.get('/market-prices/states');
    return res.data;
  },

  /**
   * Fetch districts for a selected state
   */
  async getDistricts(state = 'Uttar Pradesh') {
    const res = await apiClient.get('/market-prices/districts', { params: { state } });
    return res.data;
  },

  /**
   * Fetch mandis for a state & district
   */
  async getMandis(state = 'Uttar Pradesh', district = '') {
    const res = await apiClient.get('/market-prices/mandis', { params: { state, district } });
    return res.data;
  },

  /**
   * Fetch price trend timeseries for charts
   */
  async getPriceTrend(params = {}) {
    const res = await apiClient.get('/market-prices/trend', { params });
    return res.data;
  },

  /**
   * Fetch market comparison across mandis for a commodity
   */
  async getMarketComparison(params = {}) {
    const res = await apiClient.get('/market-prices/comparison', { params });
    return res.data;
  },

  /**
   * Trigger on-demand sync from Data.gov.in upstream
   */
  async syncPrices(payload = {}) {
    const res = await apiClient.post('/market-prices/sync', payload);
    return res.data;
  },
};

export default marketPriceService;
