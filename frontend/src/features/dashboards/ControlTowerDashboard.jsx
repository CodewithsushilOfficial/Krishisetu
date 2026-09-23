import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/apiClient.js';
import DashboardHeader from '../../components/DashboardHeader.jsx';
import { ShieldAlert, AlertTriangle, TrendingDown, Route, Activity, Sparkles, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';

export function ControlTowerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [ovRes, alertsRes, gapsRes, fcRes] = await Promise.all([
          apiClient.get('/control-tower/overview'),
          apiClient.get('/control-tower/alerts'),
          apiClient.get('/control-tower/supply-gaps'),
          apiClient.get('/control-tower/forecasts'),
        ]);

        setData({
          ...ovRes.data,
          alerts: alertsRes.data || [],
          supplyGaps: gapsRes.data || [],
          forecasts: fcRes.data || [],
          totalShipmentsWithTracking: ovRes.data?.metrics?.activeShipmentsCount || 0,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch Control Tower telemetry');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-stone-400">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
            Initialising Strategic Mission Control Telemetry...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-900 p-8 flex items-center justify-center">
        <div className="bg-red-950/60 border border-red-800 text-red-300 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
          <h3 className="font-bold text-sm">Failed to Connect Mission Control</h3>
          <p className="text-xs mt-1 text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-700 text-white text-xs font-semibold rounded-lg hover:bg-red-600"
          >
            Re-engage Link
          </button>
        </div>
      </div>
    );
  }

  const alerts = data?.alerts || [];
  const supplyGaps = data?.supplyGaps || [];
  const forecasts = data?.forecasts || [];

  const filteredAlerts = filterSeverity === 'ALL'
    ? alerts
    : alerts.filter((a) => a.severity?.toUpperCase() === filterSeverity.toUpperCase());

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
      <DashboardHeader
        title="Mission Control Tower"
        roleName="Control Admin"
        roleBadgeColor="bg-amber-500/20 text-amber-300 border-amber-500/30"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Mission Control Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider">Active Alerts</span>
              <div className="p-2 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-black text-red-400">{alerts.length}</span>
              <span className="text-xs text-stone-500">unresolved</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-mono">Real-time threshold triggers</p>
          </div>

          <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider">Supply Deficits</span>
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-black text-amber-400">{supplyGaps.length}</span>
              <span className="text-xs text-stone-500">regional gaps</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-mono">Predicted shortfall corridors</p>
          </div>

          <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider">AI Forecast Models</span>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-black text-emerald-400">{forecasts.length}</span>
              <span className="text-xs text-stone-500">active horizons</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-mono">Demand & Supply AI engine</p>
          </div>

          <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider">Live Fleet Telemetry</span>
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-black text-blue-400">{data?.totalShipmentsWithTracking || 0}</span>
              <span className="text-xs text-stone-500">active in-transit</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-mono">GPS & Sensor telemetry live</p>
          </div>
        </div>

        {/* Live Alerts Stream and Supply Gaps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Operational Alerts Console */}
          <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-400" /> Operational Alert Feed
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Automated algorithmic exceptions across nodes</p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      filterSeverity === sev
                        ? 'bg-stone-700 text-white font-bold'
                        : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-stone-800/60 max-h-[480px] overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 font-mono">No alerts matching filter criteria.</div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-stone-800/40 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : alert.severity === 'HIGH'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-xs font-mono font-semibold text-stone-300">{alert.region}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-100 mt-2">{alert.type}</h4>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">{alert.message}</p>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 shrink-0">
                        {alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Regional Supply Deficit Gaps */}
          <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-amber-400" /> AI Supply Deficit & Gap Analysis
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Discrepancy between regional demand and available harvest</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-stone-800 text-stone-400">
                {supplyGaps.length} Gaps
              </span>
            </div>

            <div className="divide-y divide-stone-800/60 max-h-[480px] overflow-y-auto">
              {supplyGaps.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 font-mono">No regional supply deficits recorded.</div>
              ) : (
                supplyGaps.map((gap) => (
                  <div key={gap.id} className="p-4 hover:bg-stone-800/40 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-100">{gap.crop?.cropName || gap.crop?.name}</h4>
                          <span className="text-xs font-mono text-stone-400">({gap.region})</span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            gap.severity === 'CRITICAL'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {gap.severity}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-stone-400">
                          <div>
                            <span>Demand: </span>
                            <span className="font-mono text-stone-200">{Number(gap.forecastDemandKg)?.toLocaleString()} kg</span>
                          </div>
                          <div>
                            <span>Supply: </span>
                            <span className="font-mono text-stone-200">{Number(gap.forecastSupplyKg)?.toLocaleString()} kg</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono text-stone-400 block">Deficit Gap</span>
                        <span className="text-sm font-mono font-black text-red-400">
                          -{Number(gap.gapKg)?.toLocaleString()} kg
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI Predictive Horizons (Forecasts) */}
        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-stone-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" /> AI Demand & Supply Intelligence Horizons
            </h3>
            <span className="text-xs font-mono text-stone-400">30-Day Projections</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecasts.slice(0, 6).map((f) => (
              <div key={f.id} className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200">{f.crop?.cropName || f.crop?.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Conf {Math.round(Number(f.confidence || 0) * 100)}%
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 font-mono block">Forecast Demand</span>
                    <span className="text-sm font-mono font-bold text-stone-200">{Number(f.predictedDemandKg).toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-mono block">Forecast Supply</span>
                    <span className="text-sm font-mono font-bold text-stone-200">{Number(f.predictedSupplyKg).toLocaleString()} kg</span>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-[10px] text-stone-500 font-mono">Market: {f.market}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ControlTowerDashboard;
