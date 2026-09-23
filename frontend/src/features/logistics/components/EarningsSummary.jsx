import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, BarChart2, ChevronDown } from 'lucide-react';

export function EarningsSummary({ earnings = null, onViewAll = null }) {
  const [timeframe, setTimeframe] = useState('This Month');

  const totalDisplay = earnings?.totalDisplay
    ? String(earnings.totalDisplay)
    : `₹ ${(Number(earnings?.totalNumeric || earnings?.totalEarnings || 42800)).toLocaleString('en-IN')}`;

  const bars = [
    { label: 'W1', value: 45, amount: '₹ 28,000' },
    { label: 'W2', value: 65, amount: '₹ 38,500' },
    { label: 'W3', value: 92, amount: '₹ 56,000' },
    { label: 'W4', value: 78, amount: '₹ 48,200' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-50 text-[#0e5c36] flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Earnings Summary</h3>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-stone-600 bg-stone-50 hover:bg-stone-100 px-2 py-1 rounded-lg border border-stone-200 cursor-pointer">
          <span>{timeframe}</span>
          <ChevronDown className="w-3 h-3 text-stone-400" />
        </div>
      </div>

      {/* Big Metric Display */}
      <div className="my-3 flex items-baseline gap-3">
        <span className="text-2xl font-black text-stone-900 tracking-tight">
          {totalDisplay.startsWith('₹') ? totalDisplay : `₹ ${totalDisplay}`}
        </span>
        <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
          <span>↑</span> 12% from last month
        </span>
      </div>

      {/* Bar Chart matching screenshot */}
      <div className="pt-2 flex-1 flex flex-col justify-end">
        <div className="flex items-end justify-between gap-3 h-36 border-b border-stone-100 pb-2 relative">
          {/* Y-Axis Guidelines & Labels */}
          <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[9px] text-stone-300 font-mono">
            <div className="border-b border-stone-100/60 w-full flex justify-end pr-1">₹ 60K</div>
            <div className="border-b border-stone-100/60 w-full flex justify-end pr-1">₹ 40K</div>
            <div className="border-b border-stone-100/60 w-full flex justify-end pr-1">₹ 20K</div>
            <div className="w-full flex justify-end pr-1">₹ 0</div>
          </div>

          {/* 4 Green Vertical Bars */}
          {bars.map((bar) => (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 z-10 group">
              <div className="w-full max-w-[40px] h-28 bg-stone-100 rounded-t-md flex items-end overflow-hidden">
                <div
                  style={{ height: `${bar.value}%` }}
                  className="w-full bg-[#0e5c36] group-hover:bg-[#15803d] rounded-t-md transition-all duration-300"
                />
              </div>
              <span className="text-xs font-bold text-stone-600">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EarningsSummary;
