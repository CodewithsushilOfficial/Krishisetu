import { create } from 'zustand';
import { authService } from '../services/authService.js';

// Multi-Tab Authentication Broadcast Channel
const authChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('krishisetu_auth_channel')
    : null;

// Module-scoped singleton promise for deduplicating in-flight session restorations
let activeRestorePromise = null;

export const useAuthStore = create((set, get) => {
  // Listen for multi-tab synchronization events
  if (authChannel) {
    authChannel.onmessage = (event) => {
      if (event.data?.type === 'LOGOUT') {
        set({
          user: null,
          role: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          isInitializing: false,
        });
      } else if (event.data?.type === 'SESSION_SYNC') {
        // Tab A logged in or refreshed; Tab B re-verifies session
        get().restoreSession().catch(() => {});
      }
    };
  }

  return {
    user: null,
    role: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true, // Centralized startup state: true until session verification completes
    isInitialized: false,

    setAuth: ({ user, accessToken, role }) => {
      set({
        user,
        accessToken,
        role: role || user?.role || null,
        isAuthenticated: Boolean(user),
        isLoading: false,
        isInitializing: false,
        isInitialized: true,
      });
    },

    updateUser: (user) =>
      set((state) => ({
        user: state.user ? { ...state.user, ...user } : user,
        role: user?.role || state.role,
      })),

    setAccessToken: (accessToken) =>
      set((state) => ({
        accessToken,
        isAuthenticated: Boolean(state.user || accessToken),
      })),

    setLoading: (isLoading) => set({ isLoading }),

    setInitializing: (isInitializing) => set({ isInitializing }),

    /**
     * Authenticate user with credentials via backend API
     */
    login: async ({ identifier, password }) => {
      set({ isLoading: true });
      try {
        const response = await authService.login({ identifier, password });
        if (response?.pendingVerification) {
          set({ isLoading: false });
          return response;
        }

        const { user, accessToken, role } = response.data;
        get().setAuth({ user, accessToken, role });

        // Broadcast successful login to synchronize other tabs
        authChannel?.postMessage({ type: 'SESSION_SYNC' });

        return response;
      } finally {
        set({ isLoading: false });
      }
    },

    /**
     * Restore authentication session on page load / refresh (Section 4 flow)
     * Flow:
     * 1. GET /api/v1/auth/me
     * 2. If valid -> restore user + role + accessToken -> Dashboard
     * 3. If invalid -> POST /api/v1/auth/refresh
     * 4. If valid -> restore user + role + accessToken -> Dashboard
     * 5. If invalid -> logout -> Login page
     */
    restoreSession: async () => {
      // If a restore request is already in-flight, reuse its promise (deduplication)
      if (activeRestorePromise) {
        return activeRestorePromise;
      }

      activeRestorePromise = (async () => {
        set({ isInitializing: true, isLoading: true });

        // Phase 1: Try GET /api/v1/auth/me (validates existing cookie session or token)
        try {
          const meRes = await authService.getMe();
          if (meRes?.data?.user) {
            const { user, role, accessToken } = meRes.data;
            get().setAuth({
              user,
              accessToken: accessToken || get().accessToken,
              role: role || user.role,
            });
            return meRes.data;
          }
        } catch {
          // Token expired or not present in memory, continue to Phase 2 refresh
        }

        // Phase 2: Try POST /api/v1/auth/refresh (validates persistent refresh session)
        try {
          const refreshRes = await authService.refreshSession();
          if (refreshRes?.data?.user) {
            const { user, accessToken, role } = refreshRes.data;
            get().setAuth({
              user,
              accessToken,
              role: role || user.role,
            });
            return refreshRes.data;
          }
          throw new Error('Invalid refresh payload');
        } catch (refreshErr) {
          // Session does not exist or has expired
          set({
            user: null,
            role: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            isInitializing: false,
            isInitialized: true,
          });
          return null;
        } finally {
          set({ isInitializing: false, isInitialized: true, isLoading: false });
          activeRestorePromise = null;
        }
      })();

      return activeRestorePromise;
    },

    /**
     * Alias for restoreSession to preserve backward compatibility
     */
    refreshSession: async () => {
      return get().restoreSession();
    },

    /**
     * Terminate active session on backend and clear local state
     */
    logout: async () => {
      set({ isLoading: true });
      try {
        await authService.logout();
      } catch {
        // Ignore network errors during logout
      } finally {
        set({
          user: null,
          role: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          isInitializing: false,
        });

        // Broadcast logout event to all other open tabs
        authChannel?.postMessage({ type: 'LOGOUT' });
      }
    },
  };
});

export default useAuthStore;
