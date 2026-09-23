import { create } from 'zustand';
import weatherService from '../services/weatherService.js';

const STORAGE_KEY_LOC = 'krishisetu_weather_location';
const STORAGE_KEY_PERM = 'krishisetu_location_permission';

// Default initial state (fallback to Varanasi only if no coordinates available yet)
const DEFAULT_LOCATION = {
  latitude: 25.3176,
  longitude: 82.9739,
  city: 'Varanasi',
  district: 'Varanasi',
  state: 'Uttar Pradesh',
  country: 'India',
  formatted: 'Varanasi, Uttar Pradesh',
  source: 'default',
};

const getStoredLocation = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOC);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return null;
};

const getStoredPermission = () => {
  try {
    return localStorage.getItem(STORAGE_KEY_PERM) || 'prompt';
  } catch {
    return 'prompt';
  }
};

export const useWeatherStore = create((set, get) => ({
  location: getStoredLocation() || DEFAULT_LOCATION,
  hasExplicitLocation: Boolean(getStoredLocation()),
  permissionState: getStoredPermission(), // 'prompt' | 'granted' | 'denied' | 'unavailable' | 'timeout'
  isLoadingLocation: false,
  locationError: null,
  isPermissionModalOpen: false,
  isSearchModalOpen: false,

  // UI Modal controllers
  openPermissionModal: () => set({ isPermissionModalOpen: true }),
  closePermissionModal: () => set({ isPermissionModalOpen: false }),
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),

  // Set explicit manual location (e.g. from search or saved profile)
  setManualLocation: (loc) => {
    const normalized = {
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      city: loc.name || loc.city || 'Selected Location',
      district: loc.district || '',
      state: loc.state || '',
      country: loc.country || 'India',
      formatted: loc.formatted || [loc.name || loc.city, loc.state].filter(Boolean).join(', '),
      source: 'manual',
    };

    try {
      localStorage.setItem(STORAGE_KEY_LOC, JSON.stringify(normalized));
    } catch {
      // ignore
    }

    set({
      location: normalized,
      hasExplicitLocation: true,
      isSearchModalOpen: false,
      locationError: null,
    });
  },

  // Request browser geolocation
  requestBrowserLocation: async () => {
    if (!navigator?.geolocation) {
      set({
        permissionState: 'unavailable',
        locationError: 'Location services are unavailable on this device or browser.',
        isPermissionModalOpen: false,
      });
      return;
    }

    set({ isLoadingLocation: true, locationError: null });

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try {
          localStorage.setItem(STORAGE_KEY_PERM, 'granted');
        } catch {
          // ignore
        }

        let geoInfo = null;
        try {
          geoInfo = await weatherService.reverseGeocode(latitude, longitude);
        } catch {
          // reverse geocoding fallback
        }

        const newLocation = {
          latitude,
          longitude,
          accuracy,
          city: geoInfo?.city || 'Current Location',
          district: geoInfo?.district || '',
          state: geoInfo?.state || '',
          country: geoInfo?.country || 'India',
          formatted: geoInfo?.formatted || `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
          source: 'gps',
        };

        try {
          localStorage.setItem(STORAGE_KEY_LOC, JSON.stringify(newLocation));
        } catch {
          // ignore
        }

        set({
          location: newLocation,
          hasExplicitLocation: true,
          permissionState: 'granted',
          isLoadingLocation: false,
          isPermissionModalOpen: false,
          locationError: null,
        });
      },
      (error) => {
        let permState = 'denied';
        let errorMsg = 'Location permission was denied.';

        if (error.code === error.PERMISSION_DENIED) {
          permState = 'denied';
          errorMsg = 'Location permission was denied. You can search your city manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          permState = 'unavailable';
          errorMsg = 'Location services are unavailable on this device.';
        } else if (error.code === error.TIMEOUT) {
          permState = 'timeout';
          errorMsg = 'Could not determine your location within timeout limit.';
        }

        try {
          localStorage.setItem(STORAGE_KEY_PERM, permState);
        } catch {
          // ignore
        }

        set({
          permissionState: permState,
          isLoadingLocation: false,
          isPermissionModalOpen: false,
          locationError: errorMsg,
        });
      },
      options
    );
  },

  // Reset or prompt user for location permission
  promptForLocation: () => {
    const currentPerm = getStoredPermission();
    if (currentPerm === 'granted') {
      get().requestBrowserLocation();
    } else if (currentPerm === 'prompt') {
      set({ isPermissionModalOpen: true });
    }
  },
}));

export default useWeatherStore;
