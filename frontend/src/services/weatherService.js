import apiClient from '../lib/apiClient.js';

export const weatherService = {
  /**
   * Get complete forecast dataset (current, 24h hourly, 7d daily, alerts, insights)
   */
  getForecast: async (latitude, longitude, options = {}) => {
    if (latitude == null || longitude == null) {
      throw new Error('Latitude and Longitude are required to fetch weather');
    }
    const res = await apiClient.get('/weather/forecast', {
      params: {
        latitude,
        longitude,
        timezone: options.timezone || 'auto',
        locationName: options.locationName,
      },
    });
    return res?.data || res;
  },

  /**
   * Get current weather
   */
  getCurrentWeather: async (latitude, longitude) => {
    const res = await apiClient.get('/weather/current', {
      params: { latitude, longitude },
    });
    return res?.data || res;
  },

  /**
   * Get hourly weather
   */
  getHourlyWeather: async (latitude, longitude) => {
    const res = await apiClient.get('/weather/hourly', {
      params: { latitude, longitude },
    });
    return res?.data || res;
  },

  /**
   * Get daily weather
   */
  getDailyForecast: async (latitude, longitude) => {
    const res = await apiClient.get('/weather/daily', {
      params: { latitude, longitude },
    });
    return res?.data || res;
  },

  /**
   * Search location by name (city, district, state)
   */
  searchLocation: async (query) => {
    if (!query || query.trim().length < 2) return [];
    const res = await apiClient.get('/weather/search', {
      params: { query: query.trim() },
    });
    return res?.data || [];
  },

  /**
   * Reverse geocode coordinates
   */
  reverseGeocode: async (latitude, longitude) => {
    const res = await apiClient.get('/weather/reverse-geocode', {
      params: { latitude, longitude },
    });
    return res?.data || res;
  },
};

export default weatherService;
