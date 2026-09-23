import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar.jsx';
import { DashboardHeader } from './DashboardHeader.jsx';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import { authService } from '../../features/auth/services/authService.js';
import { useSidebarStore } from '../../stores/sidebarStore.js';
import { useWeatherStore } from '../../stores/weatherStore.js';
import { LocationPermissionModal } from '../weather/LocationPermissionModal.jsx';
import { LocationSearchModal } from '../weather/LocationSearchModal.jsx';
import { ArrowRight } from 'lucide-react';

export function DashboardLayout({
  title,
  subtitle,
  role: propRole,
  hideProfileCompletion = false,
  fullWidth = true,
  headerExtra,
  children,
}) {
  const { isCollapsed, mobileOpen, toggleSidebar, closeMobile } = useSidebarStore();
  const promptForLocation = useWeatherStore((state) => state.promptForLocation);
  const [profileMeta, setProfileMeta] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const role = propRole || user?.role || 'FARMER';

  useEffect(() => {
    // Only prompt for weather location if farmer
    if (role === 'FARMER') {
      promptForLocation();
    }
  }, [promptForLocation, role]);

  // Handle mobile drawer body scroll lock & Escape key
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        closeMobile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    let isMounted = true;
    if (role === 'FARMER' && !hideProfileCompletion) {
      const loadProfileMeta = async () => {
        try {
          const res = await authService.getProfile();
          if (isMounted && res?.data) {
            setProfileMeta(res.data);
          }
        } catch {
          // fail gracefully
        }
      };
      loadProfileMeta();
    }
    return () => {
      isMounted = false;
    };
  }, [role, hideProfileCompletion]);

  const completionPct = profileMeta?.completion?.percentage ?? 85;
  const missingCount = profileMeta?.completion?.missingFields?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-stone-900 antialiased font-sans relative">
      {/* Role-Aware Responsive Fixed 100vh Sidebar */}
      <DashboardSidebar role={role} onClose={closeMobile} />

      {/* Main Content Area: transitions margin based on desktop collapse (lg:pl-20 vs lg:pl-64) */}
      <div
        className={`min-h-screen flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Header */}
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          role={role}
          headerExtra={headerExtra}
          onMenuToggle={toggleSidebar}
        />

        {/* Content Body */}
        <main className={`flex-1 p-4 sm:p-5 lg:p-6 space-y-5 w-full ${fullWidth ? '' : 'max-w-7xl mx-auto'}`}>
          {/* Profile Completion & Verification Ribbon (if farmer, enabled, and not 100%) */}
          {role === 'FARMER' && !hideProfileCompletion && completionPct < 100 && (
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-emerald-700/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Profile Completion: {completionPct}%
                  </span>
                  <span className="text-xs font-semibold text-emerald-200">
                    {missingCount > 0 ? `${missingCount} recommended detail(s) pending` : 'Ready'}
                  </span>
                </div>
                <p className="text-xs text-emerald-100 font-medium">
                  Keep your personal, farm, or enterprise coordinates updated for direct matching and high trust ratings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-24 sm:w-32 bg-emerald-950/60 rounded-full h-2 overflow-hidden border border-emerald-600/40">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  <span>Complete</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Children Page Content */}
          {children}
        </main>
      </div>

      {/* Global Weather Location Modals */}
      {role === 'FARMER' && (
        <>
          <LocationPermissionModal />
          <LocationSearchModal />
        </>
      )}
    </div>
  );
}

export default DashboardLayout;
