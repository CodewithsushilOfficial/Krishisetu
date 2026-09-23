import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ArrowUp, ChevronDown } from 'lucide-react';

export function EarningsOverview({ earnings }) {
  const [period, setPeriod] = useState('6m');

  const current = earnings || {
    period: 'Last 6 Months',
    totalEarnings: 0,
    trendPercentage: 0,
    comparisonText: 'vs prior cycle',
    monthlyData: [],
  };

  const chartData = Array.isArray(current.monthlyData) ? current.monthlyData : [];
  const totalVal = Number(current.totalEarnings || 0).toLocaleString('en-IN');

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs flex flex-col">
      <div>
        {/* Header with Period Dropdown */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#107c41]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zM16.2 13h2.8v6h-2.8z" />
            </svg>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Earnings Overview
            </h2>
          </div>

          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-stone-50 border border-stone-200/80 rounded-xl pl-3 pr-7 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="6m">Last 6 Months</option>
              <option value="3m">Last 3 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-stone-400 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Bar Chart + Total Summary Card Container */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-3 items-center">
          {/* Bar Chart (Col 1-7) */}
          <div className="sm:col-span-7 h-36 w-full -ml-4">
            {chartData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-stone-400 italic ml-4">
                No earnings recorded for this cycle.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 5, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 40000]}
                    ticks={[0, 10000, 20000, 30000, 40000]}
                    tick={{ fontSize: 9, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹ ${val === 0 ? '0' : `${val / 1000}K`}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                    formatter={(val) => [`₹ ${Number(val).toLocaleString('en-IN')}`, 'Earnings']}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Total Earnings Summary Card (Col 8-12) */}
          <div className="sm:col-span-5 p-3.5 rounded-2xl bg-[#eef8f2] border border-[#d2edd9] flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#c6f3d4] text-[#138808] flex items-center justify-center font-bold text-lg shrink-0">
              ₹
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-slate-600">Total Earnings</div>
              <div className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                ₹ {totalVal}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#138808] mt-0.5 whitespace-nowrap">
                <ArrowUp className="h-3 w-3 stroke-[2.5]" />
                <span>{current.trendPercentage || 22}%</span>
                <span className="text-slate-500 font-normal">{current.comparisonText || 'vs last 6 months'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EarningsOverview;
