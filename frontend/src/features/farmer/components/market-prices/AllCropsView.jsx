import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Search, ArrowUpRight, Sparkles } from 'lucide-react';
import { useMarketOverview } from '../../hooks/useMarketPrices.js';

const FAVORITES_KEY = 'krishisetu_favorite_crops';

export function AllCropsView({ state = 'Uttar Pradesh', district = '', onSelectCrop }) {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'MY_CROPS'
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['Tomato', 'Wheat', 'Onion'];
  });

  const { data: crops = [], isLoading } = useMarketOverview({ state, district });

  const toggleFavorite = (cropName, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(cropName);
      const updated = exists ? prev.filter((c) => c !== cropName) : [...prev, cropName];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const filteredCrops = crops.filter((c) => {
    if (activeTab === 'MY_CROPS' && !favorites.includes(c.crop)) return false;
    if (search.trim()) {
      return c.crop.toLowerCase().includes(search.toLowerCase().trim());
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5 space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#107c41]" /> Live Market Price Board
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Real settlement rates across all commodities in {district || state}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              All Crops ({crops.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('MY_CROPS')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'MY_CROPS'
                  ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
              <span>My Crops ({favorites.length})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search crop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 outline-none focus:bg-white focus:border-emerald-600 w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 py-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="p-8 text-center text-xs text-stone-400">
          {activeTab === 'MY_CROPS'
            ? 'No crops favorited yet. Click the star icon on any crop card to add it to My Crops.'
            : `No commodities matching "${search}".`}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredCrops.map((c) => {
            const isFav = favorites.includes(c.crop);
            return (
              <div
                key={c.crop}
                onClick={() => onSelectCrop && onSelectCrop(c.crop)}
                className="group relative bg-stone-50/60 hover:bg-white p-3.5 rounded-2xl border border-stone-200/80 hover:border-emerald-500 transition-all hover:shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{c.emoji || '🌾'}</span>
                    <div>
                      <h4 className="font-extrabold text-xs text-stone-900 group-hover:text-[#107c41] transition-colors leading-tight">
                        {c.crop}
                      </h4>
                      <p className="text-[10px] text-stone-400 truncate max-w-[100px] sm:max-w-[130px]">
                        {c.market}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(c.crop, e)}
                    className="p-1 text-stone-300 hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`}
                    />
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-black text-stone-900">
                      ₹{c.modalPrice?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium"> / Qtl</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    ₹{c.pricePerKg}/kg
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AllCropsView;
