import React from 'react';
import { MapPin, ShieldCheck, X, Navigation } from 'lucide-react';
import { useWeatherStore } from '../../stores/weatherStore.js';

export function LocationPermissionModal() {
  const isPermissionModalOpen = useWeatherStore((state) => state.isPermissionModalOpen);
  const closePermissionModal = useWeatherStore((state) => state.closePermissionModal);
  const requestBrowserLocation = useWeatherStore((state) => state.requestBrowserLocation);
  const openSearchModal = useWeatherStore((state) => state.openSearchModal);
  const isLoadingLocation = useWeatherStore((state) => state.isLoadingLocation);

  if (!isPermissionModalOpen) return null;

  const handleAllow = () => {
    requestBrowserLocation();
  };

  const handleManualSearch = () => {
    closePermissionModal();
    openSearchModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden">
        {/* Top Decorative Green Accent */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

        <button
          onClick={closePermissionModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 text-center">
          {/* Animated Icon Glow */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5 shadow-xs">
            <MapPin className="w-8 h-8 animate-bounce" />
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Use Your Current Location
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
            Allow <strong className="font-semibold text-emerald-800">KrishiSetu</strong> to access your device location to provide hyperlocal live microclimate data, precipitation radars, and agriculture-specific crop advisories.
          </p>

          <div className="mt-5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center gap-2.5 text-left text-xs text-emerald-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your location is used only to retrieve local weather and is never stored permanently.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={handleAllow}
              disabled={isLoadingLocation}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Navigation className="w-4 h-4" />
              <span>{isLoadingLocation ? 'Detecting Location...' : 'Allow Location Access'}</span>
            </button>

            <button
              onClick={handleManualSearch}
              className="w-full py-2.5 px-4 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors cursor-pointer"
            >
              Search Location Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationPermissionModal;
