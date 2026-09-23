import React from 'react';
import { ArrowUp } from 'lucide-react';

export function KpiStatCards({ stats, kpis }) {
  // Support both props for flexibility
  const data = stats || kpis || {};

  const totalProduceVal = data.totalProduce?.value || '22.2 Ton';
  const totalProduceTrend = data.totalProduce?.trend ?? 18;
  const totalProduceComp = data.totalProduce?.comparisonText || 'vs last month';

  const activeOrdersVal = data.activeOrders?.value ?? 3;
  const activeOrdersTrend = data.activeOrders?.trendText || '2 new this week';

  const totalEarningsVal = data.totalEarnings?.value || '₹ 1,24,800';
  const totalEarningsTrend = data.totalEarnings?.trend ?? 22;
  const totalEarningsComp = data.totalEarnings?.comparisonText || 'vs last month';

  const pendingPaymentsVal = data.pendingPayments?.value || '₹ 1,20,000';
  const pendingPaymentsSub = data.pendingPayments?.subtext || `${data.pendingPayments?.pendingOrdersCount || 3} order pending`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* CARD 1: Total Produce */}
      <div className="rounded-2xl p-3 sm:p-4 md:p-5 bg-[#eef8f2] border border-[#d2edd9] shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        {/* Leaf Icon */}
        <div className="h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-xl sm:rounded-2xl bg-[#c6f3d4] text-[#138808] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1 w-full">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Total Produce</div>
          <div className="text-lg sm:text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight mt-0.5 truncate">
            {totalProduceVal}
          </div>
          <div className="flex flex-wrap items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#138808] mt-1">
            <span className="inline-flex items-center gap-0.5 shrink-0">
              <ArrowUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.5]" />
              {totalProduceTrend}%
            </span>
            <span className="text-slate-500 font-normal truncate">{totalProduceComp}</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Active Orders */}
      <div className="rounded-2xl p-3 sm:p-4 md:p-5 bg-[#eff6ff] border border-[#dbeafe] shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        {/* Shopping Cart Icon */}
        <div className="h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-xl sm:rounded-2xl bg-[#dbeafe] text-[#1d4ed8] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1 w-full">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Active Orders</div>
          <div className="text-lg sm:text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight mt-0.5 truncate">
            {activeOrdersVal}
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#138808] mt-1">
            <ArrowUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.5]" />
            <span className="truncate">{activeOrdersTrend}</span>
          </div>
        </div>
      </div>

      {/* CARD 3: Total Earnings */}
      <div className="rounded-2xl p-3 sm:p-4 md:p-5 bg-[#fffbeb] border border-[#fef3c7] shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        {/* Rupee Icon */}
        <div className="h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-xl sm:rounded-2xl bg-[#fef3c7] text-[#b45309] flex items-center justify-center text-lg sm:text-xl font-black shrink-0">
          ₹
        </div>

        <div className="min-w-0 flex-1 w-full">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Total Earnings</div>
          <div className="text-lg sm:text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight mt-0.5 truncate">
            {totalEarningsVal}
          </div>
          <div className="flex flex-wrap items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#138808] mt-1">
            <span className="inline-flex items-center gap-0.5 shrink-0">
              <ArrowUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.5]" />
              {totalEarningsTrend}%
            </span>
            <span className="text-slate-500 font-normal truncate">{totalEarningsComp}</span>
          </div>
        </div>
      </div>

      {/* CARD 4: Pending Payments */}
      <div className="rounded-2xl p-3 sm:p-4 md:p-5 bg-[#fef2f2] border border-[#fee2e2] shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        {/* Payment Cube Icon */}
        <div className="h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-xl sm:rounded-2xl bg-[#fee2e2] text-[#dc2626] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1.5l8.5 4.9v9.8L12 21.1 3.5 16.2V6.4L12 1.5zm0 2.3L5.5 7.6 12 11.3l6.5-3.7L12 3.8zm-7 5.2v6.6l6 3.4v-6.6l-6-3.4zm14 0l-6 3.4v6.6l6-3.4V9z"/>
          </svg>
        </div>

        <div className="min-w-0 flex-1 w-full">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Pending Payments</div>
          <div className="text-lg sm:text-2xl lg:text-[26px] font-black text-[#dc2626] tracking-tight mt-0.5 truncate">
            {pendingPaymentsVal}
          </div>
          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-1 truncate">
            {pendingPaymentsSub}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KpiStatCards;
