import React, { useState } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import { Sparkles, TrendingUp, CloudRain, ShoppingBag, ShieldAlert, Cpu, ChevronRight, CheckCircle2 } from 'lucide-react';

export function FpoAiInsightsPage() {
  const [activeTab, setActiveTab] = useState('ALL');

  const insights = [
    {
      id: 1,
      type: 'PRICE_OPPORTUNITY',
      category: 'Market Arbitrage',
      title: 'Potato Spot Price Premium in Lucknow (+14%)',
      description: 'Regional demand spikes in Lucknow food processing cluster indicate Potato Grade-A can fetch ₹24.8/kg vs local Mandi modal ₹21.5/kg. Reallocating Lot #LOT-POT-2401 is recommended.',
      actionText: 'Allocate Lot to Lucknow Hub',
      badge: 'High Profit Impact',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: TrendingUp,
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 2,
      type: 'WEATHER_ALERT',
      category: 'Perishable Risk',
      title: 'Heavy Rainfall Advisory in Pindra (Next 48h)',
      description: 'IMD forecasts 42mm precipitation in Pindra cluster. 18 Tons of Tomato produce currently at Pindra Collection Center (CC-VAR-03) requires immediate cold dispatch or tarping.',
      actionText: 'Dispatch Fleet to Pindra Center',
      badge: 'Urgent Action Needed',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: CloudRain,
      iconColor: 'text-rose-700 bg-rose-50 border-rose-200',
    },
    {
      id: 3,
      type: 'DEMAND_MATCH',
      category: 'Direct Contract Match',
      title: 'BigBasket Institutional Procurement Match (98% Compatibility)',
      description: 'BigBasket submitted a 40-ton Grade-A Potato requirement. Suryoday FPO current inventory has 52T available with matching quality certificates.',
      actionText: 'Review Contract & Lock Escrow',
      badge: 'Immediate Liquidation',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      icon: ShoppingBag,
      iconColor: 'text-sky-700 bg-sky-50 border-sky-200',
    },
    {
      id: 4,
      type: 'INVENTORY_OPTIMIZATION',
      category: 'Storage Efficiency',
      title: 'Arajiline Hub Approaching 85% Capacity',
      description: 'Arajiline Hub cold storage is nearing threshold capacity. Transferring 12 tons of non-perishable wheat to Varanasi Central will prevent overflow bottlenecks.',
      actionText: 'Schedule Inter-Center Transfer',
      badge: 'Logistics Optimization',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: ShieldAlert,
      iconColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <FpoLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                AI Agronomic & Market Optimization Engine
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Predictive models evaluating mandi arbitrage, weather vulnerabilities, buyer match-making, and lot turnover.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <Cpu className="h-4 w-4" /> AI Models Synced
            </span>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white border border-stone-200/80 hover:border-emerald-500/40 rounded-2xl p-6 shadow-2xs hover:shadow-xs flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${item.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">{item.category}</span>
                        <h3 className="text-sm sm:text-base font-black text-stone-900 group-hover:text-emerald-800 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed bg-[#f8faf9] p-3.5 rounded-xl border border-stone-200/60 font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <button
                    onClick={() => alert(`Initiated automated recommendation: "${item.title}"`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#107c41] hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span>{item.actionText}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FpoLayout>
  );
}

export default FpoAiInsightsPage;
