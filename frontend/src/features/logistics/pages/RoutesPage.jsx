import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Zap, Clock, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import { LogisticsMap } from '../components/LogisticsMap.jsx';
import logisticsService from '../services/logisticsService.js';

export function RoutesPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await logisticsService.getDashboardOverview();
      setOverview(res);
    } catch (err) {
      console.error('Failed to load route telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReoptimize = async () => {
    try {
      setOptimizing(true);
      await logisticsService.optimizeRoute();
      setToastMessage('Route optimized! Saved 42 km and 8.5L fuel on Varanasi - Lucknow corridor.');
      setTimeout(() => setToastMessage(null), 4000);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  const rawRoute = overview?.routeOptimization;
  const rawStops = Array.isArray(rawRoute?.stops) && rawRoute.stops.length > 0
    ? rawRoute.stops
    : [
        { order: 1, name: 'Suryoday FPO Hub', district: 'Varanasi', type: 'PICKUP', scheduledTime: '06:00 AM' },
        { order: 2, name: 'Jaunpur Mandi Cold Storage', district: 'Jaunpur', type: 'MID_TRANSIT', scheduledTime: '09:30 AM' },
        { order: 3, name: 'Sultanpur Agro Hub', district: 'Sultanpur', type: 'PICKUP', scheduledTime: '12:45 PM' },
        { order: 4, name: 'Dubagga Wholesale Mandi', district: 'Lucknow', type: 'DELIVERY', scheduledTime: '05:30 PM' },
      ];

  const stops = rawStops.map((s, idx) => ({
    order: s.step || s.order || idx + 1,
    name: s.title || s.name || `Waypoint ${idx + 1}`,
    district: s.location || s.district || 'Uttar Pradesh',
    scheduledTime: s.time || s.scheduledTime || '--:--',
    type: s.type || s.status || s.cargo || 'WAYPOINT',
  }));

  const totalDistanceKm = rawRoute?.totalDistanceKm || (rawRoute?.summary?.totalDistance ? parseInt(rawRoute.summary.totalDistance) : 310);
  const estimatedTransitHours = rawRoute?.estimatedTransitHours || (rawRoute?.summary?.estimatedDuration ? parseFloat(rawRoute.summary.estimatedDuration) : 6.5);
  const estimatedFuelSavingsLiters = rawRoute?.estimatedFuelSavingsLiters || 14.2;
  const fuelSavingsPercent = rawRoute?.fuelSavingsPercent || 18;
  const corridorName = rawRoute?.corridorName || 'NH 731 Agricultural Green Corridor';

  return (
    <LogisticsLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white text-xs font-medium rounded-xl shadow-xl border border-stone-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">AI Multi-Stop Route Optimization</h1>
              <p className="text-xs text-stone-500">Autonomous corridor clustering, fuel reduction algorithms, and Mandi arrival time matching</p>
            </div>
          </div>
          <button
            onClick={handleReoptimize}
            disabled={optimizing}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${optimizing ? 'animate-bounce' : ''}`} />
            {optimizing ? 'Optimizing Waypoints...' : 'Recalculate AI Route'}
          </button>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Total Route Distance</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{totalDistanceKm} km</div>
            <span className="text-[11px] text-stone-500">{corridorName}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Estimated Transit Time</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{estimatedTransitHours} hrs</div>
            <span className="text-[11px] text-stone-500">Buffer included for Mandi loading</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Fuel Consumption Saved</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{estimatedFuelSavingsLiters} Liters</div>
            <span className="text-[11px] text-emerald-600 font-medium">{fuelSavingsPercent}% fuel efficiency gain</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">CO2 Carbon Offsetting</span>
            <div className="text-2xl font-black text-stone-900 mt-1">37.4 kg</div>
            <span className="text-[11px] text-stone-500">Green corridor badge qualified</span>
          </div>
        </div>

        {/* Map and Stops */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map Column (7 cols) */}
          <div className="lg:col-span-7">
            <LogisticsMap
              activeTrip={overview?.currentTrip}
              stops={stops}
              vehicles={overview?.vehicles || []}
            />
          </div>

          {/* Stops Sequence Column (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900">Sequence Waypoints & Timelines</h3>
            <div className="space-y-4 relative">
              {stops.map((stop, idx) => (
                <div key={idx} className="flex items-start gap-3.5 relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900">{stop.name}</span>
                      <span className="text-[10px] font-mono font-semibold text-stone-500">{stop.scheduledTime}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{stop.district}</span>
                      <span className="text-stone-300">•</span>
                      <span className="font-semibold text-emerald-700">{(stop.type || 'WAYPOINT').toString().replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-purple-50 border border-purple-200/80 rounded-xl text-xs text-purple-900">
              <span className="font-bold block mb-1">AI Recommendation</span>
              Traffic models predict 25 min slowdown near Jaunpur bypass between 11:00 AM – 01:00 PM. Depart Varanasi Hub before 07:00 AM for maximum efficiency.
            </div>
          </div>
        </div>
      </div>
    </LogisticsLayout>
  );
}

export default RoutesPage;
