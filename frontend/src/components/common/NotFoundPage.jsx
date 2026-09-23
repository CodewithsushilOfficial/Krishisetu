import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import { getDashboardRouteForRole } from '../../features/auth/utils/roleRoutes.js';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const dashboardRoute = user?.role ? getDashboardRouteForRole(user.role) : '/auth/login';

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4 font-sans antialiased text-stone-900">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/assets/logo.png"
            alt="KrishiSetu Logo"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Visual 404 Badge */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-inner">
          <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been removed, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate(dashboardRoute)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400">
          KrishiSetu • Connecting Farmers, FPOs & Logistics
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
