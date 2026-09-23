import React, { useEffect, useState, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import { useSidebarStore } from '../../stores/sidebarStore.js';
import { getDashboardRouteForRole } from '../../features/auth/utils/roleRoutes.js';
import {
  Sprout,
  LayoutDashboard,
  User,
  Trees,
  Wheat,
  Warehouse,
  TrendingUp,
  Brain,
  Users,
  Truck,
  MapPin,
  ShoppingBag,
  CreditCard,
  Building,
  Building2,
  Shield,
  Radio,
  BarChart3,
  LogOut,
  X,
  Sparkles,
  Package,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  Compass,
  Route,
  Fuel,
  Wrench,
  Star,
  History,
  UserCheck,
} from 'lucide-react';

import FarmerSidebarIllustration from '../../features/farmer/components/FarmerSidebarIllustration.jsx';
import { farmerService } from '../../features/farmer/services/farmerService.js';
import fpoService from '../../features/fpo/services/fpoService.js';
import logisticsService from '../../features/logistics/services/logisticsService.js';

export const FARMER_NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard/farmer', icon: LayoutDashboard },
  { label: 'My Farms', path: '/farmer/farms', icon: Trees },
  { label: 'My Crops', path: '/farmer/crops', icon: Sprout },
  { label: 'My Produce', path: '/farmer/produce', icon: Package },
  { label: 'Market Prices', path: '/farmer/market-prices', icon: TrendingUp },
  { label: 'Buyer Demand', path: '/farmer/buyer-demand', icon: Users },
  { label: 'My Orders', path: '/farmer/orders', icon: FileText },
  { label: 'Payments & Earnings', path: '/farmer/payments', icon: CreditCard },
  { label: 'AI Insights', path: '/farmer/ai-insights', icon: Sparkles },
  { label: 'Weather & Alerts', path: '/farmer/weather', icon: Bell, badgeKey: 'farmerAlerts', defaultBadge: '3', badgeColor: 'bg-red-500 text-white' },
  { label: 'Messages', path: '/farmer/messages', icon: MessageSquare },
  { label: 'Profile & Settings', path: '/profile', icon: Settings },
];

export const FPO_NAV_ITEMS = [
  { label: 'Dashboard', path: '/fpo/dashboard', icon: LayoutDashboard },
  { label: 'Member Farmers', path: '/fpo/farmers', icon: Users },
  { label: 'Collection Centers', path: '/fpo/collection-centers', icon: Building2 },
  { label: 'Produce Aggregation', path: '/fpo/produce', icon: Package },
  { label: 'Inventory & Lots', path: '/fpo/inventory', icon: Warehouse },
  { label: 'Buyer Demands', path: '/fpo/demand', icon: ShoppingBag },
  { label: 'Orders & Contracts', path: '/fpo/orders', icon: FileText },
  { label: 'Logistics & Tracking', path: '/fpo/logistics', icon: Truck },
  { label: 'Market Prices', path: '/fpo/market-prices', icon: TrendingUp },
  { label: 'AI Insights', path: '/fpo/ai-insights', icon: Sparkles },
  { label: 'Payments & Settlements', path: '/fpo/payments', icon: CreditCard },
  { label: 'Reports & Analytics', path: '/fpo/reports', icon: BarChart3 },
  { label: 'Messages', path: '/fpo/messages', icon: MessageSquare, badgeKey: 'fpoMessages' },
  { label: 'Staff Management', path: '/fpo/staff', icon: UserCheck },
  { label: 'FPO Profile', path: '/fpo/profile', icon: Building },
  { label: 'Settings', path: '/fpo/settings', icon: Settings },
];

export const LOGISTICS_NAV_ITEMS = [
  { label: 'Dashboard', path: '/logistics/dashboard', icon: LayoutDashboard },
  { label: 'Available Shipments', path: '/logistics/shipments', icon: Package },
  { label: 'My Trips', path: '/logistics/trips', icon: Route },
  { label: 'My Vehicles', path: '/logistics/vehicles', icon: Truck },
  { label: 'Route Optimization', path: '/logistics/routes', icon: Compass },
  { label: 'Earnings & Payments', path: '/logistics/earnings', icon: CreditCard },
  { label: 'Load History', path: '/logistics/load-history', icon: History },
  { label: 'Fuel & Expenses', path: '/logistics/expenses', icon: Fuel },
  { label: 'Maintenance', path: '/logistics/maintenance', icon: Wrench },
  { label: 'Ratings & Reviews', path: '/logistics/ratings', icon: Star },
  { label: 'Messages', path: '/logistics/messages', icon: MessageSquare, badgeKey: 'logisticsMessages', defaultBadge: '3', badgeColor: 'bg-rose-500 text-white' },
  { label: 'Notifications', path: '/logistics/notifications', icon: Bell, badgeKey: 'logisticsAlerts', defaultBadge: '5', badgeColor: 'bg-rose-500 text-white' },
  { label: 'Profile & Settings', path: '/logistics/settings', icon: Settings },
];

export const ROLE_NAV_ITEMS = {
  FARMER: FARMER_NAV_ITEMS,
  FPO: FPO_NAV_ITEMS,
  LOGISTICS: LOGISTICS_NAV_ITEMS,
  BULK_BUYER: [
    { label: 'Dashboard', path: '/buyer/dashboard', icon: LayoutDashboard },
    { label: 'Business Profile', path: '/profile', icon: Building },
    { label: 'Open Demands', path: '/buyer/dashboard#demands', icon: ShoppingBag },
    { label: 'Supply Matching', path: '/buyer/dashboard#matching', icon: Wheat },
    { label: 'Orders & Payments', path: '/buyer/dashboard#orders', icon: CreditCard },
  ],
  CONSUMER: [
    { label: 'Marketplace Home', path: '/marketplace', icon: ShoppingBag },
    { label: 'Consumer Profile', path: '/profile', icon: User },
    { label: 'Available Crops', path: '/marketplace#crops', icon: Wheat },
    { label: 'My Orders', path: '/marketplace#orders', icon: CreditCard },
  ],
  ADMIN: [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Admin Profile', path: '/profile', icon: Shield },
    { label: 'Platform Users', path: '/admin/dashboard#users', icon: Users },
    { label: 'Platform Metrics', path: '/admin/dashboard#metrics', icon: BarChart3 },
  ],
  CONTROL_ADMIN: [
    { label: 'Mission Control', path: '/control-tower/dashboard', icon: Radio },
    { label: 'Admin Profile', path: '/profile', icon: Shield },
    { label: 'Control Alerts', path: '/control-tower/dashboard#alerts', icon: Radio, badge: 'Live' },
    { label: 'Regional Deficits', path: '/control-tower/dashboard#gaps', icon: BarChart3 },
    { label: 'AI Price Signals', path: '/control-tower/dashboard#forecasts', icon: Brain, badge: 'AI' },
  ],
};

const ROLE_COLORS = {
  FARMER: { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  FPO: { bg: 'bg-emerald-700', text: 'text-emerald-800', badge: 'bg-emerald-100 text-emerald-900 border border-emerald-200' },
  LOGISTICS: { bg: 'bg-indigo-600', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-800 border border-indigo-200' },
  BULK_BUYER: { bg: 'bg-cyan-600', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-800 border border-cyan-200' },
  CONSUMER: { bg: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800 border border-rose-200' },
  ADMIN: { bg: 'bg-purple-600', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800 border border-purple-200' },
  CONTROL_ADMIN: { bg: 'bg-emerald-400', text: 'text-emerald-400', badge: 'bg-slate-900 text-emerald-400 border border-emerald-600' },
};

export function DashboardSidebar({
  role: propRole,
  items: propItems,
  onClose,
}) {
  const { user } = useAuthStore();
  const location = useLocation();
  const { isCollapsed, mobileOpen, closeMobile } = useSidebarStore();

  const effectiveRole = propRole || user?.role || 'FARMER';
  const navItems = propItems || ROLE_NAV_ITEMS[effectiveRole] || ROLE_NAV_ITEMS.FARMER;
  const colors = ROLE_COLORS[effectiveRole] || ROLE_COLORS.FARMER;

  const [dynamicBadges, setDynamicBadges] = useState({
    farmerAlerts: 3,
    fpoMessages: 0,
    logisticsMessages: 3,
    logisticsAlerts: 5,
  });

  const handleClose = useCallback(() => {
    if (onClose) onClose();
    else closeMobile();
  }, [onClose, closeMobile]);

  // Close mobile drawer on route change
  useEffect(() => {
    handleClose();
  }, [location.pathname, handleClose]);

  // Close mobile drawer on Escape key & manage body scroll
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen, handleClose]);

  // Fetch dynamic badge counts based on role
  useEffect(() => {
    let isMounted = true;

    if (effectiveRole === 'FARMER') {
      farmerService.getUnreadNotificationCount?.()
        .then((res) => {
          if (isMounted && res?.data?.unreadCount !== undefined) {
            setDynamicBadges((prev) => ({ ...prev, farmerAlerts: res.data.unreadCount }));
          }
        })
        .catch(() => {});
    } else if (effectiveRole === 'FPO') {
      fpoService.getUnreadMessageCount?.()
        .then((res) => {
          if (isMounted && res?.unreadCount !== undefined) {
            setDynamicBadges((prev) => ({ ...prev, fpoMessages: res.unreadCount }));
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [effectiveRole]);

  const isItemActive = (itemPath) => {
    if (location.pathname === itemPath) return true;

    // Handle dashboard aliases
    if (itemPath === '/dashboard/farmer' && (location.pathname === '/farmer/dashboard' || location.pathname === '/dashboard/farmer')) return true;
    if (itemPath === '/fpo/dashboard' && (location.pathname === '/dashboard/fpo' || location.pathname === '/fpo/dashboard')) return true;
    if (itemPath === '/logistics/dashboard' && (location.pathname === '/dashboard/logistics' || location.pathname === '/logistics/dashboard')) return true;

    // Subpath matching for non-root routes
    if (
      itemPath !== '/dashboard/farmer' &&
      itemPath !== '/fpo/dashboard' &&
      itemPath !== '/logistics/dashboard' &&
      itemPath !== '/profile' &&
      itemPath !== '/marketplace' &&
      location.pathname.startsWith(`${itemPath}/`)
    ) {
      return true;
    }

    return false;
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="dashboard-sidebar"
        className={`
          fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-stone-200/90 flex flex-col h-screen shrink-0 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${mobileOpen ? 'w-72 sm:w-80 translate-x-0 shadow-2xl z-50' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ height: '100vh', minHeight: '100vh' }}
        aria-label="Sidebar navigation"
      >
        {/* Top: Brand Header */}
        <div className="h-16 sm:h-[68px] px-4 border-b border-stone-100/90 flex items-center justify-between shrink-0 bg-white">
          {/* Logo representation based on collapsed state */}
          <div className="flex items-center gap-2 overflow-hidden py-1 w-full justify-between">
            <NavLink
              to={getDashboardRouteForRole(effectiveRole)}
              className="flex items-center gap-2.5 overflow-hidden"
              title="KrishiSetu"
            >
              {isCollapsed ? (
                <div className="hidden lg:flex h-10 w-10 mx-auto rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 items-center justify-center text-white shadow-md hover:scale-105 transition-transform">
                  <span className="text-xl">🌾</span>
                </div>
              ) : null}

              <div className={`${isCollapsed ? 'lg:hidden' : 'flex'} items-center gap-2`}>
                <img
                  src="/assets/logo.png"
                  alt="KrishiSetu - Bridging Farmers to a Better Tomorrow"
                  className="h-10 sm:h-11 w-auto object-contain max-w-[200px]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black">
                    🌾
                  </div>
                  <span className="font-black text-lg text-stone-900 tracking-tight">
                    Krishi<span className="text-emerald-700">Setu</span>
                  </span>
                </div>
              </div>
            </NavLink>

            {/* Mobile Close Button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer active:scale-95 transition-all shrink-0"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* User Identity Banner (Shown in expanded mode) */}
        {!isCollapsed && (
          <div className="p-3 mx-3 my-2 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center gap-3 shrink-0">
            <div className="h-8 w-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
              {user?.fullName ? user.fullName[0].toUpperCase() : effectiveRole[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-stone-900 truncate">
                {user?.fullName || user?.email || `${effectiveRole} Portal`}
              </div>
              <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-0.5 ${colors.badge}`}>
                {effectiveRole.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav
          className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-3 space-y-1 overflow-y-auto custom-scrollbar`}
          aria-label="Dashboard links"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path);
            const badgeValue = item.badgeKey ? dynamicBadges[item.badgeKey] ?? item.defaultBadge : item.badge;

            // In desktop collapsed mode: render icon-only with hover tooltip
            if (isCollapsed) {
              return (
                <div key={item.label} className="relative group">
                  <NavLink
                    to={item.path}
                    onClick={handleClose}
                    className={`relative flex items-center justify-center h-11 w-11 mx-auto rounded-xl transition-all duration-150 ${
                      active
                        ? 'bg-[#107c41] text-white shadow-xs font-semibold'
                        : 'text-slate-700 hover:bg-[#f0f7f3] hover:text-[#107c41]'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : 'text-slate-600 group-hover:text-[#107c41]'}`} />
                    {badgeValue ? (
                      <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                    ) : null}
                  </NavLink>

                  {/* Desktop Hover Tooltip */}
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3.5 px-3 py-1.5 bg-stone-900 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {badgeValue && (
                        <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                          {badgeValue}
                        </span>
                      )}
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                  </div>
                </div>
              );
            }

            // Expanded / Mobile Drawer mode: full text + badge
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={handleClose}
                className={`flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium transition-colors duration-150 group ${
                  active
                    ? 'bg-[#107c41] text-white shadow-xs font-semibold'
                    : 'text-slate-700 hover:bg-[#f0f7f3] hover:text-[#107c41]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      active ? 'text-white' : 'text-slate-500 group-hover:text-[#107c41]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {badgeValue ? (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold leading-none shrink-0 ${
                      item.badgeColor || 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {badgeValue}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Promotional / Brand Tagline (only shown in expanded desktop & mobile) */}
        {!isCollapsed && (
          <div className="shrink-0 p-3 pt-2 border-t border-stone-100/90 bg-white">
            {effectiveRole === 'FARMER' && <FarmerSidebarIllustration />}

            {effectiveRole === 'LOGISTICS' && (
              <div className="w-full">
                <div className="rounded-xl overflow-hidden border border-emerald-100/90 shadow-2xs bg-white relative group">
                  <img
                    src="/assets/dashboard/sidebar_promo_truck.jpg"
                    alt="Move Freshness Move India"
                    className="w-full h-auto max-h-[110px] object-cover object-center block transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent flex items-end p-2.5 pointer-events-none">
                    <span className="text-[11px] font-black text-white drop-shadow-xs">Move Freshness, Move India</span>
                  </div>
                </div>

                <div className="text-center mt-2 space-y-0.5">
                  <div className="text-[11px] font-medium text-slate-500 tracking-wide">
                    Every Mile • Supports Farmers
                  </div>
                  <div className="text-xs font-black text-emerald-800 tracking-tight">
                    with <span className="text-emerald-600">KrishiSetu</span>
                  </div>
                </div>
              </div>
            )}

            {effectiveRole === 'FPO' && (
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-center space-y-1">
                <p className="text-[11px] font-bold text-emerald-950">KrishiSetu FPO Operations</p>
                <p className="text-[10px] text-emerald-800 font-medium">Collective Bargaining & Cold Storage</p>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

export default DashboardSidebar;
