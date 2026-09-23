import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore.js';
import { authService } from '../features/auth/services/authService.js';
import { Sprout, LogOut, ShieldCheck, User } from 'lucide-react';

export function DashboardHeader({ title, subtitle, roleName, roleBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200' }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      logout();
      navigate('/auth/login', { replace: true });
    }
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-stone-900 tracking-tight">
                Krishi<span className="text-emerald-700">Setu</span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleBadgeColor}`}>
                {roleName || user?.role}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 font-medium">{title}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50/60 hover:bg-emerald-50/50 transition-all text-left group"
          >
            <div className="h-7 w-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:flex flex-col text-right pr-1">
              <div className="flex items-center justify-end gap-1 text-xs font-bold text-stone-900 group-hover:text-emerald-700">
                <span>{user?.fullName || user?.email}</span>
              </div>
              <div className="flex items-center justify-end gap-1 text-[10px] text-stone-500">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>Profile & Settings</span>
              </div>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:text-red-600 transition-colors shadow-2xs"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
