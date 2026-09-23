import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { authService } from '../services/authService.js';
import { Sprout, LogOut, CheckCircle2, Shield, User, Building, Truck, ShoppingBag } from 'lucide-react';

const ROLE_META = {
  FARMER: {
    title: 'Farmer Operations Hub',
    tag: 'Producer Account',
    icon: Sprout,
    gradient: 'from-emerald-700 to-green-900',
    color: 'bg-emerald-100 text-emerald-800',
  },
  FPO: {
    title: 'FPO Collective Command',
    tag: 'Producer Organization',
    icon: Building,
    gradient: 'from-teal-700 to-emerald-900',
    color: 'bg-teal-100 text-teal-800',
  },
  LOGISTICS: {
    title: 'Logistics & Fleet Command',
    tag: 'Transit Partner',
    icon: Truck,
    gradient: 'from-amber-700 to-stone-900',
    color: 'bg-amber-100 text-amber-900',
  },
  BULK_BUYER: {
    title: 'Bulk Buyer Sourcing Portal',
    tag: 'Institutional Procurement',
    icon: ShoppingBag,
    gradient: 'from-blue-700 to-indigo-950',
    color: 'bg-blue-100 text-blue-900',
  },
  CONSUMER: {
    title: 'KrishiSetu Fresh Marketplace',
    tag: 'Direct Household Consumer',
    icon: Sprout,
    gradient: 'from-emerald-600 to-teal-800',
    color: 'bg-emerald-100 text-emerald-800',
  },
};

export function DashboardPlaceholderPage({ role }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const currentRole = role || user?.role || 'FARMER';
  const meta = ROLE_META[currentRole] || ROLE_META.FARMER;
  const RoleIcon = meta.icon;

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
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="font-black text-lg text-stone-900">
                Krishi<span className="text-emerald-700">Setu</span>
              </span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                Phase 1 Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-stone-900">{user?.fullName || 'Authenticated User'}</span>
              <span className="text-[11px] text-stone-500">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-6">
        {/* Role Banner */}
        <div className={`rounded-3xl bg-gradient-to-r ${meta.gradient} p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden`}>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white mb-2">
                <RoleIcon className="h-3.5 w-3.5" />
                {meta.tag}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">{meta.title}</h1>
              <p className="mt-1 text-xs sm:text-sm text-white/80 max-w-xl">
                Authentication & Identity session verified. Your account is active on PostgreSQL.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-white/70">Account Status</div>
                <div className="text-xs font-black tracking-wide text-white">ACTIVE & VERIFIED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Identity & Session Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-600" />
              <span>User Identity Information</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500 font-medium">User ID</span>
                <span className="font-mono text-xs text-stone-700">{user?.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500 font-medium">Full Name</span>
                <span className="font-bold text-stone-900">{user?.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500 font-medium">Email</span>
                <span className="font-semibold text-stone-900">{user?.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500 font-medium">Mobile</span>
                <span className="font-semibold text-stone-900">+91 {user?.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500 font-medium">Assigned Role</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${meta.color}`}>
                  {user?.role}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500 font-medium">Mobile OTP Verified</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Yes (123456 Verified)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Security & Architecture Protocol</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Short-lived JWT Access Token in memory</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Hashed Refresh Token stored in PostgreSQL</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>HTTP-Only secure cookie enabled for session refresh</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Role-specific profile linked to centralized User identity</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950">
              <span className="font-bold block text-emerald-900 mb-1">Phase 1 Complete:</span>
              Authentication and role identity foundation is fully operational. Full business features (crops, matchmaking, logistics fleet, and orders) will be unlocked in upcoming phases.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPlaceholderPage;
