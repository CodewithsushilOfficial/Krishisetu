import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { usePriceTrend } from '../../hooks/useMarketPrices.js';

export function MarketPriceTrend({
  commodity = 'Tomato',
  state = 'Uttar Pradesh',
  district = '',
  market = '',
}) {
  const [days, setDays] = useState(30);

  const { data: trendRes, isLoading } = usePriceTrend({
    commodity,
    state,
    district,
    market,
    days,
  });

  const series = trendRes?.data?.series || [];

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#107c41]" />
            <span>Price Trend — {commodity}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Historical settlement rates in {district || state} ({days} Days)
          </p>
        </div>

        {/* Days Toggle */}
        <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          {[
            { label: '7D', val: 7 },
            { label: '30D', val: 30 },
            { label: '90D', val: 90 },
          ].map(({ label, val }) => (
            <button
              key={val}
              type="button"
              onClick={() => setDays(val)}
              className={`px-3 py-1 rounded-lg transition-all ${
                days === val
                  ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          </div>
        ) : series.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
            <TrendingUp className="h-8 w-8 mb-2 opacity-30 text-stone-400" />
            <p className="text-xs font-bold text-stone-600">Not enough historical trend records</p>
            <p className="text-[11px] text-stone-400 mt-1 max-w-xs">
              Daily arrival history for {commodity} will build as APMCs submit daily settlement reports.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#107c41" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#107c41" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="text-[10px] text-stone-400 font-bold">{d.date}</p>
                        <p className="font-extrabold text-emerald-400 text-sm">
                          Modal: ₹{d.modalPrice?.toLocaleString()} / Qtl
                        </p>
                        <p className="text-[10px] text-stone-300">
                          (₹{(d.modalPrice / 100).toFixed(2)} / kg)
                        </p>
                        {d.minPrice && d.maxPrice && (
                          <div className="flex items-center gap-2 text-[10px] text-stone-300 pt-1 border-t border-slate-700">
                            <span>Min: ₹{d.minPrice}</span>
                            <span>•</span>
                            <span>Max: ₹{d.maxPrice}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="modalPrice"
                stroke="#107c41"
                strokeWidth={2.5}
                fill="url(#trendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default MarketPriceTrend;
