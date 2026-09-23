import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FpoLayout from '../fpo/components/FpoLayout.jsx';
import fpoService from '../fpo/services/fpoService.js';
import LogisticsMap from '../fpo/components/LogisticsMap.jsx';
import {
  Leaf,
  Users,
  Package,
  TrendingUp,
  Truck,
  CheckCircle2,
  Warehouse,
  FileText,
  Lightbulb,
  AlertTriangle,
  Star,
  Plus,
  ArrowUpRight,
  Sparkles,
  Layers,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Building2,
  ChevronDown,
  Navigation,
  ShieldCheck,
} from 'lucide-react';

const CROP_ASSETS = {
  potato: { img: '/assets/dashboard/crops/potato.png', emoji: '🥔', color: 'bg-amber-50 text-amber-700' },
  onion: { img: '/assets/dashboard/crops/onion.png', emoji: '🧅', color: 'bg-rose-50 text-rose-700' },
  tomato: { img: '/assets/dashboard/crops/tomato.png', emoji: '🍅', color: 'bg-red-50 text-red-700' },
  wheat: { img: '/assets/dashboard/crops/wheat.png', emoji: '🌾', color: 'bg-yellow-50 text-yellow-700' },
  chilli: { img: '/assets/dashboard/crops/chilli.png', emoji: '🌶️', color: 'bg-emerald-50 text-emerald-700' },
};

function getCropAsset(name) {
  if (!name) return { img: null, emoji: '🌱', color: 'bg-emerald-50 text-emerald-700' };
  const key = name.toLowerCase().trim();
  return CROP_ASSETS[key] || { img: null, emoji: '🌱', color: 'bg-emerald-50 text-emerald-700' };
}

export function FpoDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Time filters
  const [demandFilter, setDemandFilter] = useState('Last 6 Months');
  const [revenueFilter, setRevenueFilter] = useState('Last 6 Months');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await fpoService.getOverview();
        const overviewData = res?.hero || res?.kpis ? res : (res?.data || res);
        setData(overviewData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <FpoLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-36 bg-stone-200/80 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-stone-200/80 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-stone-200/80 rounded-2xl" />
            <div className="h-96 bg-stone-200/80 rounded-2xl" />
            <div className="h-96 bg-stone-200/80 rounded-2xl" />
          </div>
        </div>
      </FpoLayout>
    );
  }

  if (error || !data) {
    return (
      <FpoLayout>
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center max-w-lg mx-auto mt-12">
          <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
          <h3 className="text-sm font-bold text-red-900">Failed to Load FPO Dashboard</h3>
          <p className="text-xs text-red-600 mt-1">{error || 'Server error'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      </FpoLayout>
    );
  }

  const { hero, kpis, inventorySummary, demandSupply, farmerContributions, recentOrders, logistics, revenue, aiInsights, profile } = data;

  return (
    <FpoLayout>
      <div className="space-y-5">
        {/* ============================================================ */}
        {/* HERO SECTION (Attractive Profile + Landscape Backdrop)        */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 overflow-hidden relative">
          {/* Subtle Agricultural Landscape Banner Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 pointer-events-none overflow-hidden select-none">
            <img
              src="/assets/dashboard/welcome_banner_landscape.png"
              alt="KrishiSetu Agriculture Landscape"
              className="w-full h-full object-cover object-right opacity-15 sm:opacity-20 mix-blend-multiply"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
          </div>

          {/* Left: Profile Photo & Welcome Details */}
          <div className="flex items-center sm:items-start gap-3.5 sm:gap-4 z-10 min-w-0">
            {/* Real FPO Profile Photo */}
            <div className="relative shrink-0">
              <img
                src="/assets/fpo-profile.png"
                alt={hero?.staffName || 'Anil Singh'}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-md ring-4 ring-emerald-50"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/dashboard/farmer_avatar.png';
                }}
              />
              <span
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white shadow-2xs"
                title="Verified FPO Officer Active"
              >
                <CheckCircle2 className="h-3 w-3" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-stone-900 truncate">
                  Welcome, {hero?.staffName || 'Anil Singh'}!
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-700" />
                  FPO Manager
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-semibold text-stone-500 mt-1">
                <span className="text-stone-800 font-bold">{hero?.fpoName || 'Suryoday FPO'}</span>
                <span>•</span>
                <span className="bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-bold">
                  {hero?.farmerCount || 248} Farmers
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-emerald-700 font-medium hidden sm:inline">
                  | {hero?.tagline || 'Stronger Farmers, Brighter Futures'}
                </span>
              </div>
            </div>
          </div>

          {/* Middle/Center Banner Artwork Quote (Tablets & Up) */}
          <div className="hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 z-10">
            <Leaf className="h-4 w-4 text-emerald-700 shrink-0" />
            <p className="text-xs font-serif italic text-emerald-950 font-medium">
              "{hero?.quote || 'Collective Strength for a Better Tomorrow'}"
            </p>
          </div>

          {/* Right: Summary Metric Widget (Clean 3-col on Mobile) */}
          <div className="grid grid-cols-3 divide-x divide-stone-200/80 bg-[#F8FAF9]/95 backdrop-blur-xs p-3 sm:px-5 sm:py-3 rounded-2xl border border-stone-200/80 z-10 w-full lg:w-auto shadow-2xs">
            <div className="px-2 sm:px-3 text-center sm:text-left">
              <p className="text-lg sm:text-2xl font-black text-stone-900 leading-tight">
                {hero?.bannerMetrics?.farmers || 248}
              </p>
              <p className="text-[10px] sm:text-[11px] font-medium text-stone-500 truncate">Farmers</p>
            </div>
            <div className="px-2 sm:px-3 text-center sm:text-left">
              <p className="text-lg sm:text-2xl font-black text-stone-900 leading-tight">
                {hero?.bannerMetrics?.totalProduceHandled || '1,250+ Ton'}
              </p>
              <p className="text-[10px] sm:text-[11px] font-medium text-stone-500 truncate">Total Produce</p>
            </div>
            <div className="px-2 sm:px-3 text-center sm:text-left">
              <p className="text-lg sm:text-2xl font-black text-stone-900 leading-tight">
                {hero?.bannerMetrics?.activeBuyers || 12}
              </p>
              <p className="text-[10px] sm:text-[11px] font-medium text-stone-500 truncate">Active Buyers</p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ROW OF 6 KPI CARDS (Matching Screenshot)                    */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Total Produce */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-stone-500">Total Produce</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-stone-900 mt-2.5 tracking-tight">
              {kpis?.totalProduce?.value || '142.5 Ton'}
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              <span>{kpis?.totalProduce?.trend || '↑ 18% from last month'}</span>
            </p>
          </div>

          {/* 2. Active Farmers */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-stone-500">Active Farmers</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-stone-900 mt-2.5 tracking-tight">
              {kpis?.activeFarmers?.value || '186 / 248'}
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              <span>{kpis?.activeFarmers?.trend || '↑ 12 new this month'}</span>
            </p>
          </div>

          {/* 3. Active Orders */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-stone-500">Active Orders</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-stone-900 mt-2.5 tracking-tight">
              {kpis?.activeOrders?.value || '24'}
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              <span>{kpis?.activeOrders?.trend || '↑ 6 new this week'}</span>
            </p>
          </div>

          {/* 4. Total Revenue */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <span className="font-bold text-sm">₹</span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500">Total Revenue</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-stone-900 mt-2.5 tracking-tight">
              {kpis?.totalRevenue?.value || '₹ 18,42,000'}
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              <span>{kpis?.totalRevenue?.trend || '↑ 26% from last month'}</span>
            </p>
          </div>

          {/* 5. Dispatches */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Truck className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-stone-500">Dispatches</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-stone-900 mt-2.5 tracking-tight">
              {kpis?.dispatches?.value || '16'}
            </p>
            <p className="text-[11px] font-medium text-stone-500 mt-1">
              {kpis?.dispatches?.subtitle || 'In Transit: 6'}
            </p>
          </div>

          {/* 6. Pending Payments */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-semibold text-stone-500">Pending Payments</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-stone-900 mt-2.5 tracking-tight">
              {kpis?.pendingPayments?.value || '₹ 2,18,000'}
            </p>
            <p className="text-[11px] font-medium text-stone-500 mt-1">
              {kpis?.pendingPayments?.subtitle || '4 buyers'}
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3-COLUMN CONTENT COMPOSITION                                 */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ────────────────────────────────────────────────────────── */}
          {/* COLUMN 1: Produce Inventory, Farmer Contributions, Revenue */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Produce Inventory (Aggregated) */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4.5 w-4.5 text-emerald-700" />
                  <h2 className="text-sm font-bold text-stone-900">Produce Inventory (Aggregated)</h2>
                </div>
                <button
                  onClick={() => navigate('/fpo/inventory')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="mt-3 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs min-w-[460px]">
                  <thead>
                    <tr className="text-stone-400 border-b border-stone-100 text-[11px]">
                      <th className="pb-2 font-medium">Crop</th>
                      <th className="pb-2 font-medium text-right">Available</th>
                      <th className="pb-2 font-medium text-right">Reserved</th>
                      <th className="pb-2 font-medium text-right">In Transit</th>
                      <th className="pb-2 font-medium text-right">Sold</th>
                      <th className="pb-2 font-medium text-right font-bold text-stone-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {inventorySummary?.map((crop) => {
                      const asset = getCropAsset(crop.name);
                      return (
                        <tr
                          key={crop.name}
                          onClick={() => navigate('/fpo/inventory')}
                          className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 flex items-center gap-2 font-semibold text-stone-900">
                            <div className="h-8 w-8 rounded-xl bg-stone-50 border border-stone-200/80 p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                              {asset.img ? (
                                <img
                                  src={asset.img}
                                  alt={crop.name}
                                  className="h-full w-full object-contain"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline';
                                  }}
                                />
                              ) : null}
                              <span className="text-base" style={{ display: asset.img ? 'none' : 'inline' }}>
                                {asset.emoji}
                              </span>
                            </div>
                            <span className="font-bold text-stone-900">{crop.name}</span>
                          </td>
                          <td className="py-2.5 text-right font-semibold text-stone-900">{crop.available} Ton</td>
                          <td className="py-2.5 text-right text-stone-600">{crop.reserved} Ton</td>
                          <td className="py-2.5 text-right text-stone-600">{crop.inTransit} Ton</td>
                          <td className="py-2.5 text-right text-stone-600">{crop.sold} Ton</td>
                          <td className="py-2.5 text-right font-bold text-stone-900">{crop.total} Ton</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Farmer Contributions */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-emerald-700" />
                  <h2 className="text-sm font-bold text-stone-900">Farmer Contributions</h2>
                </div>
                <button
                  onClick={() => navigate('/fpo/farmers')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="mt-3 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs min-w-[460px]">
                  <thead>
                    <tr className="text-stone-400 border-b border-stone-100 text-[11px]">
                      <th className="pb-2 font-medium">Farmer Name</th>
                      <th className="pb-2 font-medium">Village</th>
                      <th className="pb-2 font-medium">Crop</th>
                      <th className="pb-2 font-medium">Quantity (This Month)</th>
                      <th className="pb-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {farmerContributions?.map((f) => {
                      const cropAsset = getCropAsset(f.crop);
                      return (
                        <tr
                          key={f.id}
                          onClick={() => navigate('/fpo/farmers')}
                          className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <img
                                src="/assets/dashboard/farmer_avatar.png"
                                alt={f.name}
                                className="h-7 w-7 rounded-full object-cover border border-emerald-600/30 shrink-0 shadow-2xs"
                              />
                              <span className="font-bold text-stone-900">{f.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-stone-600">{f.village}</td>
                          <td className="py-2.5">
                            <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                              <span className="text-sm">{cropAsset.emoji}</span>
                              <span>{f.crop}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-stone-900 font-semibold">{f.quantity}</td>
                          <td className="py-2.5 text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> {f.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue & Earnings */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="h-4.5 w-4.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                    ₹
                  </span>
                  <h2 className="text-sm font-bold text-stone-900">Revenue & Earnings</h2>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-stone-600 bg-stone-50 px-2 py-1 rounded-lg border border-stone-200/80">
                  <span>{revenueFilter}</span>
                  <ChevronDown className="h-3 w-3" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Visual Bar Chart */}
                <div className="h-40 flex items-end justify-between gap-2 px-2 pt-6 pb-2 bg-stone-50/50 rounded-xl border border-stone-100">
                  {revenue?.monthlyTrend?.map((item) => {
                    const max = 400000;
                    const heightPct = Math.round((item.revenue / max) * 100);
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className="w-full max-w-[28px] bg-emerald-600 hover:bg-emerald-500 rounded-t-sm transition-all relative group"
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            ₹{(item.revenue / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-500 font-medium">{item.month}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Financial Summary Breakdown */}
                <div className="space-y-3 bg-[#F8FAF9] p-3.5 rounded-xl border border-stone-200/80">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-stone-500">Total Revenue</p>
                      <p className="text-lg font-black text-stone-900 mt-0.5">{revenue?.totalRevenue}</p>
                    </div>
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                      +
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-emerald-600">{revenue?.trend}</p>

                  <div className="pt-2 border-t border-stone-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-stone-500">
                      <span>Platform Fee</span>
                      <span className="font-semibold text-stone-700">{revenue?.platformFee}</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-900 font-bold">
                      <span>Net to FPO</span>
                      <span className="text-emerald-700 font-black">{revenue?.netToFpo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* COLUMN 2: Demand vs Supply, Recent Orders, Quick Actions   */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Demand vs Supply Interactive Chart */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4.5 w-4.5 text-emerald-700" />
                  <h2 className="text-sm font-bold text-stone-900">Demand vs Supply</h2>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-stone-600 bg-stone-50 px-2 py-1 rounded-lg border border-stone-200/80">
                  <span>{demandFilter}</span>
                  <ChevronDown className="h-3 w-3" />
                </div>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-end gap-4 mt-3 text-xs font-medium text-stone-600">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-blue-500" />
                  <span>Demand</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600" />
                  <span>Available Supply</span>
                </div>
              </div>

              {/* Grouped Bar Chart */}
              <div className="h-44 mt-3 flex items-end justify-between gap-3 px-2 pt-6 pb-2 bg-stone-50/50 rounded-xl border border-stone-100">
                {demandSupply?.map((item) => {
                  const max = 100;
                  const demandH = Math.round((item.demand / max) * 100);
                  const supplyH = Math.round((item.supply / max) * 100);
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div
                          style={{ height: `${demandH}%` }}
                          className="w-1/2 max-w-[14px] bg-blue-500 rounded-t-xs hover:bg-blue-600 transition-colors"
                          title={`Demand: ${item.demand} Ton`}
                        />
                        <div
                          style={{ height: `${supplyH}%` }}
                          className="w-1/2 max-w-[14px] bg-emerald-600 rounded-t-xs hover:bg-emerald-500 transition-colors"
                          title={`Supply: ${item.supply} Ton`}
                        />
                      </div>
                      <span className="text-[10px] text-stone-500 font-medium">{item.month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Opportunity Tip */}
              <div className="mt-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5">
                <Lightbulb className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 font-medium">
                  {data?.demandSupplyTip || 'Demand for Potato and Onion is higher than current supply. Opportunity to onboard more farmers.'}
                </p>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-700" />
                  <h2 className="text-sm font-bold text-stone-900">Recent Orders</h2>
                </div>
                <button
                  onClick={() => navigate('/fpo/orders')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="mt-3 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs min-w-[460px]">
                  <thead>
                    <tr className="text-stone-400 border-b border-stone-100 text-[11px]">
                      <th className="pb-2 font-medium">Order ID</th>
                      <th className="pb-2 font-medium">Buyer</th>
                      <th className="pb-2 font-medium">Crop</th>
                      <th className="pb-2 font-medium">Quantity</th>
                      <th className="pb-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {recentOrders?.map((o) => {
                      const cropAsset = getCropAsset(o.crop);
                      return (
                        <tr
                          key={o.id}
                          onClick={() => navigate('/fpo/orders')}
                          className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 font-mono font-bold text-stone-900">{o.id}</td>
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center justify-center text-[10px] font-black shrink-0">
                                {o.buyer ? o.buyer.charAt(0) : 'B'}
                              </div>
                              <span className="font-semibold text-stone-800">{o.buyer}</span>
                            </div>
                          </td>
                          <td className="py-2.5">
                            <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                              <span className="text-sm">{cropAsset.emoji}</span>
                              <span>{o.crop}</span>
                            </div>
                          </td>
                          <td className="py-2.5 font-bold text-stone-900">{o.quantity}</td>
                          <td className="py-2.5 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                o.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : o.status === 'In Transit'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : o.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  o.status === 'Confirmed' || o.status === 'Delivered'
                                    ? 'bg-emerald-600'
                                    : o.status === 'In Transit'
                                    ? 'bg-blue-600'
                                    : 'bg-amber-600'
                                }`}
                              />
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions (2x4 Grid with Pastel Cards) */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <Sparkles className="h-4.5 w-4.5 text-emerald-700" />
                <h2 className="text-sm font-bold text-stone-900">Quick Actions</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {/* 1. Add Farmer */}
                <button
                  onClick={() => navigate('/fpo/farmers')}
                  className="p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60 flex flex-col items-center justify-center gap-2 text-center transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-emerald-950">Add Farmer</span>
                </button>

                {/* 2. Record Produce */}
                <button
                  onClick={() => navigate('/fpo/produce')}
                  className="p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60 flex flex-col items-center justify-center gap-2 text-center transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Leaf className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-emerald-950">Record Produce</span>
                </button>

                {/* 3. Create Order */}
                <button
                  onClick={() => navigate('/fpo/orders')}
                  className="p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60 flex flex-col items-center justify-center gap-2 text-center transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-blue-950">Create Order</span>
                </button>

                {/* 4. Manage Inventory */}
                <button
                  onClick={() => navigate('/fpo/inventory')}
                  className="p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/60 flex flex-col items-center justify-center gap-2 text-center transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                    <Warehouse className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-amber-950">Manage Inventory</span>
                </button>

                {/* 5. Find Buyers */}
                <button
                  onClick={() => navigate('/fpo/demand')}
                  className="p-3 rounded-xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200/60 flex flex-col items-center justify-center gap-2 text-center transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-purple-950">Find Buyers</span>
                </button>

                {/* 6. Track Shipment */}
                <button
                  onClick={() => navigate('/fpo/logistics')}
                  className="p-3 rounded-xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/60 flex flex-col items-center justify-center gap-2 text-center transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                    <Truck className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-rose-950">Track Shipment</span>
                </button>

                {/* 7. View Reports */}
                <button
                  onClick={() => navigate('/fpo/reports')}
                  className="p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60 flex flex-col items-center justify-center gap-2 text-center transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-blue-950">View Reports</span>
                </button>

                {/* 8. Make Payment */}
                <button
                  onClick={() => navigate('/fpo/payments')}
                  className="p-3 rounded-xl bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200/60 flex flex-col items-center justify-center gap-2 text-center transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-teal-950">Make Payment</span>
                </button>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* COLUMN 3: AI Insights, Logistics Tracking, FPO Profile     */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* AI Insights & Recommendations */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-purple-600" />
                  <h2 className="text-sm font-bold text-stone-900">AI Insights & Recommendations</h2>
                </div>
                <button
                  onClick={() => navigate('/fpo/ai-insights')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="mt-3.5 space-y-2.5">
                {aiInsights?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate('/fpo/ai-insights')}
                    className="p-3 rounded-xl border border-stone-100 hover:border-stone-200 hover:bg-stone-50/50 cursor-pointer transition-all flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-lg shrink-0 mt-0.5 bg-stone-100">
                      {item.icon === 'TrendingUp' && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                      {item.icon === 'Lightbulb' && <Lightbulb className="h-4 w-4 text-amber-600" />}
                      {item.icon === 'AlertTriangle' && <AlertTriangle className="h-4 w-4 text-rose-600" />}
                      {item.icon === 'Leaf' && <Leaf className="h-4 w-4 text-emerald-600" />}
                      {item.icon === 'Star' && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-stone-900 leading-tight">{item.title}</h3>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics Tracking (Interactive Route Map) */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Truck className="h-4.5 w-4.5 text-emerald-700" />
                  <h2 className="text-sm font-bold text-stone-900">Logistics Tracking</h2>
                </div>
                <button
                  onClick={() => navigate('/fpo/logistics')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View All
                </button>
              </div>

              {/* Visual Map Representation using Real Leaflet + OpenStreetMap */}
              <div className="mt-3 space-y-2">
                <LogisticsMap
                  compact={true}
                  height="220px"
                  shipment={{
                    vehicleNumber: logistics?.vehicleNumber || 'UP65XX1234',
                    status: logistics?.status || 'In Transit',
                    origin: logistics?.origin || 'Varanasi',
                    destination: logistics?.destination || 'Lucknow',
                    currentPosition: [25.7464, 82.6837],
                    polyline: [
                      [25.3176, 82.9739],
                      [25.7464, 82.6837],
                      [26.2648, 82.0727],
                      [26.8467, 80.9462],
                    ],
                    etaHours: 2.0,
                  }}
                />

                {/* Truck Live Card floating under map with Driver Profile Photo */}
                <div className="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src="/assets/dashboard/farmer_avatar.png"
                        alt="Ramesh Kumar (Driver)"
                        className="h-8 w-8 rounded-lg object-cover border border-emerald-600/30 shadow-2xs"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        Ramesh Kumar • {logistics?.vehicleNumber || 'UP65XX1234'}
                      </p>
                      <p className="text-[10px] text-stone-500 font-semibold truncate">
                        {logistics?.routeText || 'Enroute to Lucknow'} • ETA: {logistics?.eta || '2 hrs'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                    {logistics?.status || 'In Transit'}
                  </span>
                </div>
              </div>
            </div>

            {/* FPO Profile Card */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4.5 w-4.5 text-emerald-700" />
                  <h2 className="text-sm font-bold text-stone-900">FPO Profile</h2>
                </div>
                <button
                  onClick={() => navigate('/fpo/profile')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="mt-3.5 flex items-start gap-3.5">
                <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-emerald-600/40 shadow-xs shrink-0">
                  <img
                    src="/assets/fpo-profile.png"
                    alt="FPO Official Representative"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/dashboard/farmer_avatar.png';
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-900/80 text-white text-[8px] font-bold text-center py-0.2">
                    OFFICIAL
                  </div>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs font-bold text-stone-900 truncate">
                    {profile?.fpoName || 'Suryoday Farmer Producer Company'}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-mono">
                    FPO ID: {profile?.registrationNumber || 'FPO-UP-0456'}
                  </p>
                  <p className="text-[11px] text-stone-600">Location: {profile?.locationDisplay || 'Varanasi, Uttar Pradesh'}</p>
                  <p className="text-[11px] text-stone-600">
                    Members: {profile?.memberCount || 248} Farmers • Reg: {profile?.establishedYear || 2021}
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified FPO
                    </span>
                  </div>
                </div>
              </div>

              {/* Motto / Quote Banner */}
              <div className="mt-4 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center gap-2 text-emerald-950 text-xs italic font-serif">
                <Leaf className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>"{profile?.description || 'Empowering small farmers through collective action and technology.'}"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FpoLayout>
  );
}

export default FpoDashboard;
