import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, X } from 'lucide-react';

export function AiInsightsPanel({ insights = [] }) {
  const navigate = useNavigate();
  const [selectedInsight, setSelectedInsight] = useState(null);

  const currentList = Array.isArray(insights) ? insights : [];

  const renderIcon = (type) => {
    switch (type) {
      case 'BEST_TIME_TO_SELL':
        return (
          <div className="h-7 w-7 rounded-lg bg-[#fef9c3] text-[#ca8a04] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
            </svg>
          </div>
        );
      case 'HIGH_DEMAND':
        return (
          <div className="h-7 w-7 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z"/>
            </svg>
          </div>
        );
      case 'WEATHER_RISK':
        return (
          <div className="h-7 w-7 rounded-lg bg-[#fee2e2] text-[#dc2626] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          </div>
        );
      case 'STORAGE_INTELLIGENCE':
      default:
        return (
          <div className="h-7 w-7 rounded-lg bg-[#dcfce7] text-[#16a34a] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-5-9L2 6v2h19V6l-9-5z"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs flex flex-col">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 pb-2">
            <Sparkles className="w-5 h-5 text-[#7c3aed]" />
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              AI Insights & Recommendations
            </h2>
          </div>

          {/* Stacked Recommendation Cards */}
          <div className="space-y-2 mt-2">
            {currentList.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400 italic">
                No active advisory alerts. Farm operations are running within optimal parameters.
              </div>
            ) : (
              currentList.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedInsight(item)}
                className="p-2.5 rounded-xl border border-stone-100 hover:border-emerald-200 bg-white hover:bg-stone-50/60 transition-all cursor-pointer flex items-start gap-2.5 group"
              >
                {renderIcon(item.type)}

                <div className="min-w-0 flex-1">
                  {item.title && (
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                      {item.title}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {item.message || item.recommendation}
                  </p>
                </div>

                <ChevronRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-stone-700 transition-transform group-hover:translate-x-0.5 shrink-0 self-center" />
              </div>
            )))}
          </div>
        </div>

        {/* Bottom Link */}
        <div className="pt-2 text-center">
          <button
            onClick={() => navigate('/farmer/ai-insights')}
            className="text-xs font-semibold text-[#1d70b8] hover:text-[#0b4b80] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View More Insights</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>

      {/* Modal Detail for User Interaction */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-bold text-stone-900">
                  {selectedInsight.title || 'AI Decision Support'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInsight(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-950 font-medium leading-relaxed">
                {selectedInsight.message}
              </div>

              {selectedInsight.recommendation && (
                <div>
                  <span className="text-[11px] font-bold text-stone-700 block mb-1">
                    Suggested Farmer Action
                  </span>
                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    {selectedInsight.recommendation}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedInsight(null)}
                className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AiInsightsPanel;
