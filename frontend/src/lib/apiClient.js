import axios from 'axios';
import { env } from '../config/env.js';
import { useAuthStore } from '../features/auth/store/authStore.js';

/**
 * Enterprise Axios Client for KrishiSetu Frontend
 * Supports bearer authorization, credentials, and token refresh
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach current access token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto-refresh access token on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Normalize error shape
    const customError = {
      message: error.response?.data?.message || error.message || 'Network error occurred',
      statusCode: error.response?.status || 500,
      code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      details: error.response?.data?.error?.details || null,
      raw: error,
    };

    // If 401 and not already retried and not an authentication endpoint
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/otp') ||
      originalRequest?.url?.includes('/auth/me');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${env.apiBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        const user = refreshResponse.data?.data?.user;
        const role = refreshResponse.data?.data?.role || user?.role;

        if (newAccessToken && user) {
          useAuthStore.getState().setAuth({
            user,
            accessToken: newAccessToken,
            role,
          });

          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh token invalid');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        useAuthStore.getState().logout();
        return Promise.reject(customError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(customError);
  }
);

export default apiClient;
