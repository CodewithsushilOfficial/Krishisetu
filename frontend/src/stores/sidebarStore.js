import { create } from 'zustand';

const SIDEBAR_COLLAPSED_KEY = 'krishisetu-sidebar-collapsed';

export const useSidebarStore = create((set, get) => ({
  isCollapsed: (() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
      }
    } catch {
      return false;
    }
    return false;
  })(),
  desktopOpen: true, // Legacy compatibility
  mobileOpen: false,

  toggleSidebar: () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const nextCollapsed = !get().isCollapsed;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(nextCollapsed));
      } catch {}
      set({ isCollapsed: nextCollapsed });
    } else {
      set((state) => ({ mobileOpen: !state.mobileOpen }));
    }
  },

  toggleCollapsed: () => {
    const nextCollapsed = !get().isCollapsed;
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(nextCollapsed));
    } catch {}
    set({ isCollapsed: nextCollapsed });
  },

  setIsCollapsed: (isCollapsed) => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
    } catch {}
    set({ isCollapsed });
  },

  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
  openMobile: () => set({ mobileOpen: true }),
  closeMobile: () => set({ mobileOpen: false }),
}));

export default useSidebarStore;
