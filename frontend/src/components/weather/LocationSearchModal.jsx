import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Loader2 } from 'lucide-react';
import { useWeatherStore } from '../../stores/weatherStore.js';
import weatherService from '../../services/weatherService.js';

const POPULAR_AGRICULTURAL_HUBS = [
  { name: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739 },
  { name: 'Nashik', state: 'Maharashtra', latitude: 19.9975, longitude: 73.7898 },
  { name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567 },
  { name: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577 },
  { name: 'Guntur', state: 'Andhra Pradesh', latitude: 16.3067, longitude: 80.4365 },
  { name: 'Karnal', state: 'Haryana', latitude: 29.6857, longitude: 76.9905 },
  { name: 'Ludhiana', state: 'Punjab', latitude: 30.9010, longitude: 75.8573 },
  { name: 'Jaunpur', state: 'Uttar Pradesh', latitude: 25.7464, longitude: 82.6837 },
];

export function LocationSearchModal() {
  const isSearchModalOpen = useWeatherStore((state) => state.isSearchModalOpen);
  const closeSearchModal = useWeatherStore((state) => state.closeSearchModal);
  const setManualLocation = useWeatherStore((state) => state.setManualLocation);
  const requestBrowserLocation = useWeatherStore((state) => state.requestBrowserLocation);
  const isLoadingLocation = useWeatherStore((state) => state.isLoadingLocation);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (!isSearchModalOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await weatherService.searchLocation(query.trim());
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimerRef.current);
  }, [query]);

  if (!isSearchModalOpen) return null;

  const handleSelect = (loc) => {
    setManualLocation(loc);
  };

  const handleUseGps = () => {
    requestBrowserLocation();
    closeSearchModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Select Weather Location</h3>
              <p className="text-xs text-stone-500 font-medium">Search Indian cities, districts, or mandis</p>
            </div>
          </div>
          <button
            onClick={closeSearchModal}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-stone-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type city or district name (e.g., Varanasi, Pune, Karnal)..."
              autoFocus
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium"
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 absolute right-3.5 top-3.5 text-emerald-600 animate-spin" />
            )}
          </div>

          {/* Quick GPS Button */}
          <button
            onClick={handleUseGps}
            disabled={isLoadingLocation}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer border border-emerald-200/60"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Use Current Device GPS Location</span>
          </button>
        </div>

        {/* Content / Results */}
        <div className="overflow-y-auto p-4 flex-1 space-y-4">
          {/* Live Search Results */}
          {query.trim().length >= 2 ? (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                Search Results ({results.length})
              </div>
              {results.length === 0 && !isSearching && (
                <div className="py-8 text-center text-xs text-stone-500 font-medium">
                  No matching agricultural locations found. Try checking the spelling.
                </div>
              )}
              <div className="space-y-1.5">
                {results.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left p-3 rounded-2xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-stone-100 group-hover:bg-emerald-100 text-stone-600 group-hover:text-emerald-700 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-stone-500 font-medium">
                          {[item.district, item.state, item.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Select →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Popular Agricultural Hubs */
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                Agricultural Hubs & Mandis
              </div>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_AGRICULTURAL_HUBS.map((hub) => (
                  <button
                    key={hub.name}
                    onClick={() => handleSelect(hub)}
                    className="p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                      {hub.name}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {hub.state}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationSearchModal;
