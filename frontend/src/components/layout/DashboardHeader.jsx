import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import { authService } from '../../features/auth/services/authService.js';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  MapPin,
  CheckCircle2,
  Radio,
  ExternalLink,
} from 'lucide-react';

import { useSidebarStore } from '../../stores/sidebarStore.js';
import { useWeatherStore } from '../../stores/weatherStore.js';

export function DashboardHeader({ title, subtitle, role: propRole, onMenuToggle, headerExtra }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isCollapsed, mobileOpen, toggleSidebar } = useSidebarStore();
  const weatherLocation = useWeatherStore((state) => state.location);
  const openSearchModal = useWeatherStore((state) => state.openSearchModal);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  const isNavExpanded = typeof window !== 'undefined' && window.innerWidth >= 1024 ? !isCollapsed : mobileOpen;

  // Determine user role
  const role = propRole || user?.role || 'FARMER';

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setShowNotificationMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleMenuClick = () => {
    if (onMenuToggle) {
      onMenuToggle();
    } else {
      toggleSidebar();
    }
  };

  // User display metadata
  const userName = user?.fullName || user?.name || (user?.email ? user.email.split('@')[0] : 'KrishiSetu User');
  
  const roleLabels = {
    FARMER: 'Progressive Farmer',
    FPO: user?.fpoProfile?.fpoName || user?.fpo?.name || 'FPO Manager',
    LOGISTICS: user?.logisticsProfile?.companyName || user?.vehicleNumber || 'Logistics Partner',
    BUYER: 'Verified Buyer',
    ADMIN: 'System Admin',
  };
  const roleBadgeColors = {
    FARMER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    FPO: 'bg-teal-50 text-teal-800 border-teal-200',
    LOGISTICS: 'bg-amber-50 text-amber-800 border-amber-200',
    BUYER: 'bg-blue-50 text-blue-800 border-blue-200',
    ADMIN: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  const userSubtitle = subtitle || roleLabels[role] || 'KrishiSetu Member';
  const avatarSrc = user?.avatar || (
    role === 'LOGISTICS'
      ? '/assets/roles/logistics.png'
      : role === 'FPO'
      ? '/assets/roles/fpo.png'
      : '/assets/dashboard/farmer_avatar.png'
  );

  const searchPlaceholder = role === 'LOGISTICS'
    ? 'Search shipments, trips, routes, vehicles...'
    : role === 'FPO'
    ? 'Search member farmers, lots, buyer demand...'
    : 'Search crops, buyers, mandi prices...';

  // Role-based notifications
  const notificationsByRole = {
    FARMER: [
      { id: 1, title: 'Order KS001 Picked Up', text: 'Vehicle UP-65-BT-1024 is in transit to Lucknow.', time: '10m ago', type: 'emerald' },
      { id: 2, title: 'Market Surge Alert', text: 'Onion prices increased by ₹3.5/kg in local mandi.', time: '1h ago', type: 'stone' },
      { id: 3, title: 'Precipitation Warning', text: 'Moderate rainfall expected in your district tomorrow.', time: '3h ago', type: 'rose' },
    ],
    FPO: [
      { id: 1, title: 'New Farmer Registration', text: 'Ramesh Patel submitted member onboarding request.', time: '15m ago', type: 'emerald' },
      { id: 2, title: 'Bulk Demand Posted', text: 'Reliance Retail requested 25 Tons Premium Wheat.', time: '2h ago', type: 'stone' },
      { id: 3, title: 'Lot #402 Verified', text: 'Quality check completed at Varanasi Collection Center.', time: '5h ago', type: 'teal' },
    ],
    LOGISTICS: [
      { id: 1, title: 'New Load Assigned', text: '12 MT Wheat: Ghazipur FPO to Azamgarh Mandi.', time: '5m ago', type: 'emerald' },
      { id: 2, title: 'FastTag Toll Debited', text: 'NH-19 Toll Plaza Varanasi debited ₹185.', time: '1h ago', type: 'stone' },
      { id: 3, title: 'Trip Payment Credited', text: '₹14,500 settled directly to verified UPI account.', time: '4h ago', type: 'amber' },
    ],
  };

  const currentNotifications = notificationsByRole[role] || notificationsByRole.FARMER;
  const notifTargetRoute = role === 'LOGISTICS' ? '/logistics/notifications' : role === 'FPO' ? '/fpo/messages' : '/farmer/weather';

  return (
    <header className="h-16 sm:h-[68px] bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="h-full px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Hamburger Menu & Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMenuClick}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            aria-label="Toggle navigation sidebar"
            aria-expanded={isNavExpanded}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="h-5 w-5" />
          </button>

          {title && (
            <div className="hidden xl:block">
              <h1 className="text-sm font-bold text-stone-900 leading-tight">{title}</h1>
              {subtitle && <p className="text-[11px] text-stone-500 leading-none">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Center: Search Box */}
        <div className="flex-1 max-w-md lg:max-w-xl mx-1 sm:mx-3">
          <div className="relative w-full">
            <Search className="h-4 w-4 absolute left-3.5 top-2.5 sm:top-3 text-stone-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full bg-[#f8fafc] border border-stone-200/90 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Right Side: Role-Specific Action, Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Custom or Role-Specific Slot */}
          {headerExtra ? (
            headerExtra
          ) : role === 'FARMER' ? (
            /* Farmer Weather Location Pill */
            <button
              onClick={openSearchModal}
              title="Click to change weather location"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all shadow-2xs"
            >
              <span className="text-emerald-600">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span className="truncate max-w-[140px] lg:max-w-[180px]">
                {weatherLocation?.formatted || user?.location || 'Varanasi, UP'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
            </button>
          ) : role === 'LOGISTICS' ? (
            /* Logistics Online Status Pill */
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Loads</span>
            </div>
          ) : role === 'FPO' ? (
            /* FPO Center Pill */
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span className="truncate max-w-[160px]">
                {user?.fpoProfile?.district || 'Eastern UP Cluster'}
              </span>
            </div>
          ) : null}

          {/* Notifications Icon with Badge */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 relative transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold absolute -top-0.5 -right-0.5 flex items-center justify-center shadow-xs">
                {currentNotifications.length}
              </span>
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-black text-stone-900 uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {currentNotifications.length} New
                  </span>
                </div>
                <div className="py-2 space-y-2">
                  {currentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${
                        notif.type === 'emerald'
                          ? 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
                          : notif.type === 'rose'
                          ? 'bg-rose-50/70 border-rose-100 text-rose-950'
                          : notif.type === 'amber'
                          ? 'bg-amber-50/70 border-amber-100 text-amber-950'
                          : 'bg-stone-50 border-stone-100 text-stone-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{notif.title}</span>
                        <span className="text-[10px] text-stone-400">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-stone-600">{notif.text}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setShowNotificationMenu(false);
                      navigate(notifTargetRoute);
                    }}
                    className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline py-1"
                  >
                    View All Activity →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 sm:pr-2 rounded-full hover:bg-stone-50 transition-all text-left group cursor-pointer"
              aria-label="User profile menu"
              aria-expanded={showProfileMenu}
            >
              <div className="h-9 w-9 rounded-full overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                <img
                  src={avatarSrc}
                  alt={userName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/roles/farmer.png';
                  }}
                />
              </div>
              <div className="hidden sm:block text-left max-w-[130px]">
                <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 leading-tight truncate">
                  {userName}
                </div>
                <div className="text-[10px] font-medium text-stone-500 leading-tight truncate">
                  {userSubtitle}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-stone-400 group-hover:text-stone-700" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                <div className="px-3 py-2 border-b border-stone-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-stone-900 block truncate">
                      {userName}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        roleBadgeColors[role] || 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {role}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block truncate">
                    {user?.email || 'authenticated'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate(role === 'LOGISTICS' ? '/logistics/settings' : role === 'FPO' ? '/fpo/profile' : '/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors text-left cursor-pointer"
                >
                  <User className="h-4 w-4 text-stone-500" />
                  <span>My Profile & Settings</span>
                </button>

                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-stone-400">
                  System Status
                </div>
                <div className="px-3 py-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>PostgreSQL Connected</span>
                </div>

                <div className="pt-1 border-t border-stone-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
