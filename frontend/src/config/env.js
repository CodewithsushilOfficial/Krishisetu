/**
 * KrishiSetu Frontend Environment Configuration
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
