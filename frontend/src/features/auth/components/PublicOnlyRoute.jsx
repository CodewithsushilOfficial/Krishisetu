import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { getDashboardRouteForRole } from '../utils/roleRoutes.js';

/**
 * Route guard for public-only pages (Login, Register, Role Selection, Forgot Password).
 * If the user is already authenticated, redirects them to their canonical role dashboard.
 * Prevents authenticated users from landing on login screens when pressing browser Back.
 */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isInitializing, isInitialized, user } = useAuthStore();

  // If session is still being restored, wait for initialization
  if (isInitializing || !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-white select-none">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-emerald-500/20">
              <span className="text-xl">🌾</span>
            </div>
            <span className="text-2xl font-black tracking-tight">
              Krishi<span className="text-emerald-400">Setu</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-stone-400 text-xs font-medium">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            <span>Restoring session...</span>
          </div>
        </div>
      </div>
    );
  }

  // If already authenticated, redirect to active role dashboard
  if (isAuthenticated && user?.role) {
    return <Navigate to={getDashboardRouteForRole(user.role)} replace />;
  }

  return children;
}

export default PublicOnlyRoute;
