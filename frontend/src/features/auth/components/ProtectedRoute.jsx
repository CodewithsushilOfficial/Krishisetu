import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { getDashboardRouteForRole } from '../utils/roleRoutes.js';

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isInitializing, isInitialized, user, role } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // If auth is still initializing on page load/refresh, wait for session restoration
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

  // Not authenticated: redirect to login preserving attempted destination
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Authenticated but wrong role: show clean Access Restricted state
  if (allowedRoles && !allowedRoles.includes(role)) {
    const userDashboard = getDashboardRouteForRole(role);

    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 max-w-md w-full text-center shadow-xl shadow-stone-900/5">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4 font-bold">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-stone-900">Access Restricted</h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600">
            Your current account role (<strong>{role}</strong>) does not have authorization to view this operational zone.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => navigate(userDashboard, { replace: true })}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Go to My {role} Dashboard</span>
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
