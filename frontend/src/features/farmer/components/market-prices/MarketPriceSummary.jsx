import React from 'react';
import { TrendingUp, ArrowDownRight, ArrowUpRight, Scale, Store, Layers, Clock } from 'lucide-react';

export function MarketPriceSummary({ summary = {}, cropName = 'Crop', source = {} }) {
  const modalPrice = summary.modalPrice;
  const pricePerKg = summary.pricePerKg;
  const minPrice = summary.minPrice;
  const maxPrice = summary.maxPrice;
  const marketsCount = summary.marketsCount || 0;
  const varietiesCount = summary.varietiesCount || 0;
  const arrivalDate = summary.latestDate || source?.arrivalDate || 'Latest Arrival';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* 1. Modal Price (Hero Card) */}
      <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-gradient-to-br from-emerald-700 to-[#0b5c30] text-white p-4 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-emerald-100">
            <span className="text-[10px] font-black uppercase tracking-wider">Modal Price</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black tracking-tight">
              {modalPrice ? `₹${modalPrice.toLocaleString()}` : '—'}
            </span>
            <span className="text-[11px] font-semibold text-emerald-200">/ Qtl</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-emerald-600/60 flex items-center justify-between text-[11px]">
          <span className="text-emerald-200">Per Kilogram:</span>
          <span className="font-extrabold text-white">
            {pricePerKg ? `₹${pricePerKg}/kg` : '—'}
          </span>
        </div>
      </div>

      {/* 2. Min Price */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-400">
          <span className="text-[10px] font-black uppercase tracking-wider">Minimum Rate</span>
          <ArrowDownRight className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-stone-800">
              {minPrice ? `₹${minPrice.toLocaleString()}` : '—'}
            </span>
            <span className="text-[10px] font-medium text-stone-400">/ Qtl</span>
          </div>
          <p className="text-[10px] text-stone-400 mt-1">
            {minPrice ? `₹${(minPrice / 100).toFixed(2)}/kg` : 'Mandi Floor'}
          </p>
        </div>
      </div>

      {/* 3. Max Price */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-400">
          <span className="text-[10px] font-black uppercase tracking-wider">Maximum Rate</span>
          <ArrowUpRight className="h-4 w-4 text-amber-600" />
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-stone-800">
              {maxPrice ? `₹${maxPrice.toLocaleString()}` : '—'}
            </span>
            <span className="text-[10px] font-medium text-stone-400">/ Qtl</span>
          </div>
          <p className="text-[10px] text-stone-400 mt-1">
            {maxPrice ? `₹${(maxPrice / 100).toFixed(2)}/kg` : 'Mandi Ceiling'}
          </p>
        </div>
      </div>

      {/* 4. Active Mandis */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-400">
          <span className="text-[10px] font-black uppercase tracking-wider">Active Mandis</span>
          <Store className="h-4 w-4 text-blue-600" />
        </div>
        <div className="mt-2">
          <span className="text-xl sm:text-2xl font-black text-stone-800">{marketsCount}</span>
          <p className="text-[10px] text-stone-400 mt-1">Reporting APMCs</p>
        </div>
      </div>

      {/* 5. Varieties & Arrival */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-stone-400">
          <span className="text-[10px] font-black uppercase tracking-wider">Arrival Date</span>
          <Clock className="h-4 w-4 text-purple-600" />
        </div>
        <div className="mt-2">
          <span className="text-sm sm:text-base font-black text-stone-800 truncate block">
            {arrivalDate}
          </span>
          <p className="text-[10px] text-stone-400 mt-1">{varietiesCount} registered varieties</p>
        </div>
      </div>
    </div>
  );
}

export default MarketPriceSummary;
