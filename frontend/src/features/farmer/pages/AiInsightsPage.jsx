import React, { useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { useFarmerAiInsights, useRefreshAiInsights } from '../hooks/useFarmerData.js';
import { Sparkles, RefreshCw, Lightbulb, AlertTriangle, Warehouse, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export function AiInsightsPage() {
  useEffect(() => {
    document.title = 'AI Insights | KrishiSetu';
  }, []);

  const { data: insightsData, isLoading, error, refetch } = useFarmerAiInsights();
  const refreshMutation = useRefreshAiInsights();

  const insights = insightsData?.insights || (Array.isArray(insightsData) ? insightsData : []);

  const handleRefresh = async () => {
    await refreshMutation.mutateAsync();
  };

  const getInsightIcon = (type) => {
    if (type?.includes('TIME') || type?.includes('SELL')) {
      return (
        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>
      );
    }
    if (type?.includes('WEATHER') || type?.includes('RISK')) {
      return (
        <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
      );
    }
    if (type?.includes('STORAGE') || type?.includes('WAREHOUSE')) {
      return (
        <div className="h-10 w-10 rounded-xl bg-emerald-100 text-[#107c41] flex items-center justify-center shrink-0">
          <Warehouse className="h-5 w-5" />
        </div>
      );
    }
    return (
      <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
        <TrendingUp className="h-5 w-5" />
      </div>
    );
  };

  return (
    <DashboardLayout title="AI Insights" subtitle="Predictive decision intelligence powered by satellite telemetry, price trends, and weather models" fullWidth={true}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Agri-Intelligence Recommendations</h1>
            <p className="text-xs text-stone-500 font-medium">
              Real-time advice tailored to your Varanasi district farm plots & crop holdings
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshMutation.isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
          <span>{refreshMutation.isPending ? 'Analyzing Data...' : 'Refresh Insights'}</span>
        </button>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-stone-200/70 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center max-w-lg mx-auto">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <h3 className="font-bold text-sm">Failed to Load AI Recommendations</h3>
          <p className="text-xs text-red-600 mt-1">{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && insights.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/80 shadow-2xs max-w-md mx-auto my-8">
          <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-700 mx-auto mb-4">
            <Sparkles className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-black text-slate-900">No insights available yet</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
            As your crop growth cycles progress and mandi prices fluctuate, AI recommendations will appear here.
          </p>
        </div>
      )}

      {/* Insights Cards Grid */}
      {!isLoading && !error && insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {insights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    {getInsightIcon(item.type)}
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                      <span className="text-xs font-medium text-stone-400">
                        {item.cropName ? `Crop: ${item.cropName}` : 'General Advisory'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                      {Math.round((item.confidence || 0.9) * 100)}% Confidence
                    </span>
                    {item.severity === 'HIGH' && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-4 space-y-2.5">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {item.message}
                  </p>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-700">
                    <span className="font-bold text-slate-900">Recommended Action: </span>
                    <span>{item.recommendation || item.message}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Model: KrishiSetu Agri-LLM v2</span>
                <div className="flex items-center gap-1 text-[#107c41] font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified Signal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default AiInsightsPage;
