import React from 'react';
import { Route, Zap, Leaf } from 'lucide-react';

export function RouteOptimizationCard({ data = null, onOptimize = null }) {
  const stops = [
    {
      order: 1,
      name: 'Suryoday FPO',
      detail: 'Varanasi - 2 Ton (Potato)',
      time: '08:00 AM',
    },
    {
      order: 2,
      name: 'Kisan Pragati FPO',
      detail: 'Jaunpur - 3 Ton (Onion)',
      time: '10:30 AM',
    },
    {
      order: 3,
      name: 'AgroMart',
      detail: 'Lucknow - 5 Ton (Mixed)',
      time: '02:00 PM',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-50 text-[#0e5c36] flex items-center justify-center">
            <Route className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Route Optimization (AI)</h3>
        </div>

        <button
          onClick={onOptimize}
          className="px-3.5 py-1 rounded-lg bg-[#0e5c36] hover:bg-[#0a4628] text-white font-bold text-xs shadow-2xs transition-colors"
        >
          Optimize
        </button>
      </div>

      {/* Stops for Today (3) */}
      <div className="my-3 space-y-2 flex-1">
        <span className="text-xs font-bold text-stone-800 block mb-2">
          Stops for Today (3)
        </span>

        {stops.map((stop) => (
          <div
            key={stop.order}
            className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100 hover:bg-stone-100/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0">
                {stop.order}
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 leading-tight">
                  {stop.name}
                </h4>
                <p className="text-[11px] text-stone-500">{stop.detail}</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-stone-600">
              {stop.time}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Summary Strip */}
      <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Left: Route Metrics */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0e5c36] flex items-center justify-center shrink-0 mt-0.5">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="font-black text-stone-900 block">Optimized Route</span>
            <span className="text-stone-500 block">Total Distance: 320 km</span>
            <span className="text-stone-500 block">Estimated Time: 6 hr 20 min</span>
            <span className="text-stone-500 block">Estimated Cost: ₹ 8,400</span>
          </div>
        </div>

        {/* Right: Green Savings Badge */}
        <div className="p-2.5 rounded-xl bg-[#edf8f2] border border-[#cde9da] text-[#0e5c36] flex items-center gap-2">
          <Leaf className="w-4 h-4 shrink-0" />
          <span className="text-[11px] font-bold leading-tight">
            Save 18% fuel cost with optimized route
          </span>
        </div>
      </div>
    </div>
  );
}

export default RouteOptimizationCard;
