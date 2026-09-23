import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Sprout } from 'lucide-react';
import { useAvailableCommodities } from '../../hooks/useMarketPrices.js';

const CATEGORIES = ['All', 'Vegetables', 'Cereals', 'Pulses', 'Spices', 'Fruits', 'Oilseeds'];

export function CommoditySelector({ selectedCrop, onSelectCrop }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const { data: commodities = [] } = useAvailableCommodities(search);

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

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    }
  }, [isOpen]);

  const filtered = commodities.filter((c) => {
    if (activeCategory === 'All') return true;
    return c.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const currentCommodity = commodities.find(
    (c) => c.name.toLowerCase() === (selectedCrop || '').toLowerCase()
  ) || { name: selectedCrop || 'Select Crop', emoji: '🌾' };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200/80 hover:bg-white hover:border-emerald-600 transition-all text-xs font-bold text-slate-800 shadow-2xs"
      >
        <span className="text-base">{currentCommodity.emoji || '🌾'}</span>
        <span className="font-extrabold text-stone-900">{currentCommodity.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-stone-100 bg-stone-50/70">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search any crop (e.g. Wheat, Tomato)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-slate-800 placeholder-stone-400 outline-none focus:border-emerald-600"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 mt-2 overflow-x-auto no-scrollbar py-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#107c41] text-white'
                      : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Commodity List */}
          <div className="max-h-64 overflow-y-auto p-1.5 divide-y divide-stone-50">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400">
                No matching crops found for "{search}".
              </div>
            ) : (
              filtered.map((c) => {
                const isSelected = c.name.toLowerCase() === (selectedCrop || '').toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      onSelectCrop(c.name);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-[#107c41] font-bold'
                        : 'hover:bg-stone-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{c.emoji || '🌾'}</span>
                      <div>
                        <p className="text-xs font-bold leading-tight">{c.name}</p>
                        {c.category && (
                          <span className="text-[10px] font-medium text-stone-400">{c.category}</span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-[#107c41]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CommoditySelector;
