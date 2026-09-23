import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Edit3, ChevronDown, Check, Loader2 } from 'lucide-react';
import {
  useIndianStates,
  useStateDistricts,
  useDistrictMandis,
} from '../../hooks/useMarketPrices.js';

export function LocationSelector({
  selectedState,
  selectedDistrict,
  selectedMarket,
  onSelectLocation,
  onUseCurrentLocation,
  isGeoLoading = false,
  isGpsActive = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: states = [] } = useIndianStates();
  const { data: districts = [] } = useStateDistricts(selectedState);
  const { data: mandis = ['All Mandis'] } = useDistrictMandis(selectedState, selectedDistrict);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayLocation = selectedDistrict
    ? `${selectedDistrict}, ${selectedState}`
    : selectedState;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all text-xs font-bold shadow-2xs ${
          isGpsActive
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
            : 'bg-stone-50 border-stone-200/80 hover:bg-white hover:border-emerald-600 text-slate-800'
        }`}
      >
        <MapPin className={`h-4 w-4 shrink-0 ${isGpsActive ? 'text-emerald-600' : 'text-stone-400'}`} />
        <span className="font-extrabold truncate max-w-[150px] sm:max-w-[200px]">
          {displayLocation}
        </span>
        {isGpsActive && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-black tracking-wide uppercase">
            GPS
          </span>
        )}
        <ChevronDown className={`h-3.5 w-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-2 w-72 sm:w-84 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Mode Toggle */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">Mandi Location</h4>
            <button
              type="button"
              onClick={() => {
                if (onUseCurrentLocation) onUseCurrentLocation();
              }}
              disabled={isGeoLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors disabled:opacity-50"
            >
              {isGeoLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Navigation className="h-3.5 w-3.5 text-emerald-600" />
              )}
              <span>Use Current Location</span>
            </button>
          </div>

          {/* 1. Select State */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                const newState = e.target.value;
                onSelectLocation({ state: newState, district: '', market: 'All Mandis' });
              }}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Select District */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                const newDistrict = e.target.value;
                onSelectLocation({ state: selectedState, district: newDistrict, market: 'All Mandis' });
              }}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="">All Districts ({selectedState})</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Select Mandi */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Mandi / APMC Market
            </label>
            <select
              value={selectedMarket || 'All Mandis'}
              onChange={(e) => {
                onSelectLocation({
                  state: selectedState,
                  district: selectedDistrict,
                  market: e.target.value,
                });
              }}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 cursor-pointer"
            >
              {mandis.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Footer Action */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-2 bg-[#107c41] hover:bg-[#0b5c30] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Apply Location
          </button>
        </div>
      )}
    </div>
  );
}

export default LocationSelector;
