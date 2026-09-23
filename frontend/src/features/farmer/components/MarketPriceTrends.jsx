import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MapPin,
  RefreshCw,
  Info,
  ExternalLink,
  ChevronDown,
  Search,
  Check,
  Building2,
  Sparkles,
  BarChart3,
  LineChart,
  Table2,
  Layers,
  Award,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useLiveMarketPrices,
  usePriceTrend,
  useAvailableCommodities,
  useDistrictMandis,
  useMarketOverview,
  useMarketComparison,
} from '../hooks/useMarketPrices.js';

// Top Uttar Pradesh Districts
const UP_DISTRICTS = [
  'All Districts',
  'Varanasi', 'Lucknow', 'Kanpur Nagar', 'Ayodhya', 'Prayagraj', 'Agra', 'Meerut',
  'Gorakhpur', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Jhansi', 'Banda',
  'Mathura', 'Muzaffarnagar', 'Mirzapur', 'Ghazipur', 'Jaunpur', 'Barabanki', 'Sitapur',
];

// Sleek Custom Tooltip for Recharts
function CustomChartTooltip({ active, payload, selectedCrop }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const modal = Number(data.modalPrice) || 0;
    const kgRate = (modal / 100).toFixed(2);
    return (
      <div className="bg-slate-900/95 backdrop-blur-md rounded-xl p-2.5 shadow-2xl border border-slate-800 text-white min-w-[150px] space-y-1 animate-in fade-in-50 zoom-in-95 duration-100">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pb-1 border-b border-slate-800">
          <span className="flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5 text-emerald-400" />
            {data.date}
          </span>
          <span className="text-emerald-400 bg-emerald-950/80 px-1 py-0.2 rounded text-[9px] font-bold">
            APMC
          </span>
        </div>
        <div>
          <div className="text-base font-black text-white tracking-tight">
            ₹{modal.toLocaleString('en-IN')}
            <span className="text-[10px] font-normal text-slate-400 ml-1">/Q</span>
          </div>
          <div className="text-[11px] font-semibold text-emerald-400">
            ₹{kgRate} / kg
          </div>
        </div>
        {(data.minPrice || data.maxPrice) && (
          <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
            <span>Min: ₹{data.minPrice}</span>
            <span>Max: ₹{data.maxPrice}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export function MarketPriceTrends({ initialData, farmer }) {
  // Determine smart initial crop (never default to empty Arhar)
  const initialCropName = useMemo(() => {
    const raw =
      (Array.isArray(farmer?.primaryCrops) && farmer.primaryCrops[0]) ||
      farmer?.cropName ||
      initialData?.commodity ||
      initialData?.cropName;
    if (raw && !raw.toLowerCase().includes('arhar')) {
      return raw;
    }
    return 'Tomato';
  }, [farmer, initialData]);

  const [selectedCrop, setSelectedCrop] = useState(initialCropName);
  const [selectedDistrict, setSelectedDistrict] = useState(farmer?.district || 'Varanasi');
  const [selectedMarket, setSelectedMarket] = useState('All Mandis');
  const [selectedDays, setSelectedDays] = useState(30);
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'comparison' | 'table' | 'compare'
  const [tablePage, setTablePage] = useState(1);

  // Dropdown controls
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [cropSearch, setCropSearch] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Compare crops selection
  const [comparedCrops, setComparedCrops] = useState(['Tomato', 'Potato', 'Onion', 'Wheat']);

  const cropDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (cropDropdownRef.current && !cropDropdownRef.current.contains(e.target)) {
        setIsCropOpen(false);
      }
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(e.target)) {
        setIsDistrictOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Live Market Prices query
  const {
    data: livePricesData,
    isLoading: isLiveLoading,
    isFetching,
    refetch,
  } = useLiveMarketPrices({
    commodity: selectedCrop,
    state: 'Uttar Pradesh',
    district: selectedDistrict === 'All Districts' ? '' : selectedDistrict,
    market: selectedMarket === 'All Mandis' ? '' : selectedMarket,
    page: tablePage,
    limit: 6,
  });

  // 2. Historical Price Trend query (Timeseries for Recharts)
  const { data: trendData, isLoading: isTrendLoading } = usePriceTrend({
    commodity: selectedCrop,
    state: 'Uttar Pradesh',
    district: selectedDistrict === 'All Districts' ? '' : selectedDistrict,
    market: selectedMarket === 'All Mandis' ? '' : selectedMarket,
    days: selectedDays,
  });

  // 3. Multi-crop Live Overview Ticker (Top crops in UP)
  const { data: overviewData = [] } = useMarketOverview({
    state: 'Uttar Pradesh',
    district: selectedDistrict === 'All Districts' ? '' : selectedDistrict,
  });

  // 4. Market Comparison query across UP mandis
  const { data: comparisonData = [], isLoading: isComparisonLoading } = useMarketComparison({
    commodity: selectedCrop,
    state: 'Uttar Pradesh',
    district: selectedDistrict === 'All Districts' ? '' : selectedDistrict,
  });

  // 5. Available Commodities
  const { data: commodities = [] } = useAvailableCommodities(cropSearch);

  // Smart fallback: Never stall on empty crop
  useEffect(() => {
    if (overviewData && overviewData.length > 0) {
      const hasZeroRecords =
        livePricesData &&
        livePricesData.hasData === false &&
        (!livePricesData.records || livePricesData.records.length === 0);

      const isUnreported = selectedCrop.toLowerCase().includes('arhar') && hasZeroRecords;

      if (hasZeroRecords || isUnreported) {
        const firstActive = overviewData[0]?.crop || 'Tomato';
        if (firstActive.toLowerCase() !== selectedCrop.toLowerCase()) {
          setSelectedCrop(firstActive);
        }
      }
    }
  }, [overviewData, livePricesData, selectedCrop]);

  // Key stats
  const summary = livePricesData?.summary || {};
  const currentModalPrice =
    summary.modalPrice ||
    overviewData.find((o) => o.crop.toLowerCase() === selectedCrop.toLowerCase())?.modalPrice ||
    0;
  const currentPricePerKg =
    summary.pricePerKg || (currentModalPrice ? (currentModalPrice / 100).toFixed(2) : '0.00');
  const minPrice = summary.minPrice || (currentModalPrice ? Math.round(currentModalPrice * 0.92) : 0);
  const maxPrice = summary.maxPrice || (currentModalPrice ? Math.round(currentModalPrice * 1.08) : 0);
  const arrivalDate = summary.latestDate || livePricesData?.source?.arrivalDate || 'Recent';

  // Best mandi in UP
  const bestMandi = useMemo(() => {
    if (Array.isArray(comparisonData) && comparisonData.length > 0) {
      return comparisonData[0];
    }
    return null;
  }, [comparisonData]);

  // Market spread
  const marketSpread = useMemo(() => {
    if (Array.isArray(comparisonData) && comparisonData.length > 1) {
      const highest = comparisonData[0].modalPrice;
      const lowest = comparisonData[comparisonData.length - 1].modalPrice;
      return highest - lowest;
    }
    return maxPrice - minPrice;
  }, [comparisonData, maxPrice, minPrice]);

  // Trend Series for Recharts
  const seriesData = useMemo(() => {
    return Array.isArray(trendData?.series) ? trendData.series : [];
  }, [trendData]);

  // Percentage change calculation
  const trendMetrics = useMemo(() => {
    if (seriesData.length >= 2) {
      const first = seriesData[0].modalPrice;
      const last = seriesData[seriesData.length - 1].modalPrice;
      if (first > 0) {
        const diff = last - first;
        const pct = ((diff / first) * 100).toFixed(1);
        return {
          diff,
          pct: Math.abs(pct),
          isUp: diff > 0,
          isDown: diff < 0,
          text: `${diff >= 0 ? '+' : '-'}${Math.abs(pct)}%`,
        };
      }
    }
    return { diff: 0, pct: 0, isUp: false, isDown: false, text: 'Stable' };
  }, [seriesData]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs flex flex-col relative transition-all overflow-hidden">
      {/* ── 1. CLEAN TOP HEADER ── */}
      <div className="p-4 sm:p-4.5 border-b border-stone-100">
        <div className="flex items-center justify-between gap-2">
          {/* Title & Live Status */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  Market Price Trends
                </h2>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  UP Live
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Info, Refresh, Full view) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowInfoModal(!showInfoModal)}
              title="Official Government Mandi Details"
              className="p-1 rounded-lg text-stone-400 hover:text-emerald-800 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh latest APMC rates"
              className="p-1 rounded-lg text-stone-400 hover:text-emerald-800 hover:bg-stone-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin text-emerald-700' : ''}`} />
            </button>
            <Link
              to="/market-prices"
              title="Full Screen Mandi Intelligence"
              className="p-1 rounded-lg text-stone-400 hover:text-emerald-800 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Info Modal / Notice */}
        {showInfoModal && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-[11px] text-emerald-950 leading-relaxed animate-in fade-in duration-150">
            <div className="flex items-start justify-between gap-2">
              <p>
                <strong>Official Source:</strong> Ministry of Agriculture & Farmers Welfare, Govt of India (AGMARKNET Resource ID:{' '}
                <code className="bg-emerald-100 px-1 py-0.2 rounded text-[10px] text-emerald-900 font-mono">
                  35985678-0d79-46b4-9ed6-6f13308a1d24
                </code>
                ). Settlement rates reflect daily modal APMC transactions in <strong>₹ / Quintal</strong>.
              </p>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-emerald-700 hover:text-emerald-950 font-black cursor-pointer px-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ── 2. PRICE HERO & CONTROLS ── */}
        <div className="mt-3 flex items-baseline justify-between gap-2">
          {/* Large Price Display */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ₹{Number(currentModalPrice).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-stone-400">/Q</span>
              <span className="text-xs font-semibold text-emerald-700 ml-1">
                (₹{currentPricePerKg}/kg)
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-500 font-medium">
              <span>Modal Rate • {selectedDistrict}, UP</span>
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  trendMetrics.isUp
                    ? 'text-emerald-700'
                    : trendMetrics.isDown
                    ? 'text-rose-600'
                    : 'text-stone-500'
                }`}
              >
                {trendMetrics.isUp ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : trendMetrics.isDown ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {trendMetrics.text}
              </span>
            </div>
          </div>

          {/* Timeframe Toggle (7D / 30D / 90D) */}
          <div className="flex items-center gap-0.5 bg-stone-100 p-0.5 rounded-xl text-[11px] font-bold">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDays(d)}
                className={`px-2 py-0.8 rounded-lg transition-all cursor-pointer ${
                  selectedDays === d
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. CROP & DISTRICT SELECTOR PILLS ── */}
        <div className="mt-3 flex items-center gap-2">
          {/* Crop Selector */}
          <div className="relative" ref={cropDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCropOpen(!isCropOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-stone-50 hover:bg-stone-100/70 px-2.5 py-1.2 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            >
              <span className="text-stone-400 font-normal">Crop:</span>
              <span className="text-emerald-800 font-black">{selectedCrop}</span>
              <ChevronDown className="h-3 w-3 text-stone-400" />
            </button>

            {isCropOpen && (
              <div className="absolute left-0 mt-1 w-60 rounded-2xl border border-stone-200 bg-white shadow-xl p-2 z-40 animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="relative mb-1.5">
                  <Search className="h-3 w-3 text-stone-400 absolute left-2 top-2" />
                  <input
                    type="text"
                    placeholder="Search crops..."
                    value={cropSearch}
                    onChange={(e) => setCropSearch(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 pl-7 pr-2 py-1 text-xs outline-none focus:border-emerald-600 focus:bg-white"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {commodities
                    .filter((c) => c.name.toLowerCase().includes(cropSearch.toLowerCase()))
                    .slice(0, 25)
                    .map((item) => {
                      const isSelected = selectedCrop.toLowerCase() === item.name.toLowerCase();
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            setSelectedCrop(item.name);
                            setIsCropOpen(false);
                            setCropSearch('');
                            setTablePage(1);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-950 font-bold'
                              : 'text-slate-700 hover:bg-stone-100'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>{item.emoji || '🌾'}</span>
                            <span className="truncate">{item.name}</span>
                          </span>
                          {isSelected && <Check className="h-3 w-3 text-emerald-700" />}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* District Selector */}
          <div className="relative" ref={districtDropdownRef}>
            <button
              type="button"
              onClick={() => setIsDistrictOpen(!isDistrictOpen)}
              className="flex items-center gap-1 rounded-xl border border-stone-200/90 bg-stone-50 hover:bg-stone-100/70 px-2.5 py-1.2 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            >
              <MapPin className="h-3 w-3 text-emerald-700" />
              <span>{selectedDistrict}</span>
              <ChevronDown className="h-3 w-3 text-stone-400" />
            </button>

            {isDistrictOpen && (
              <div className="absolute left-0 mt-1 w-52 rounded-2xl border border-stone-200 bg-white shadow-xl p-2 z-40 animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="text-[9px] font-bold text-stone-400 uppercase px-2 py-0.5">
                  UP Districts
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {UP_DISTRICTS.map((d) => {
                    const isSelected = selectedDistrict === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setSelectedDistrict(d);
                          setSelectedMarket('All Mandis');
                          setIsDistrictOpen(false);
                          setTablePage(1);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-950 font-bold'
                            : 'text-slate-700 hover:bg-stone-100'
                        }`}
                      >
                        <span>{d}</span>
                        {isSelected && <Check className="h-3 w-3 text-emerald-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sub-Tab Navigation Switcher */}
          <div className="flex items-center gap-0.5 ml-auto bg-stone-100/90 p-0.5 rounded-xl text-[11px] font-semibold">
            {[
              { id: 'chart', label: 'Chart' },
              { id: 'comparison', label: 'Mandis' },
              { id: 'table', label: 'Table' },
              { id: 'compare', label: 'Compare' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-0.8 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-emerald-950 shadow-2xs font-black'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. THE MAIN VISUALIZATION AREA ── */}
      <div className="p-4 sm:p-4.5 pt-3">
        {/* TAB 1: SLEEK RECHARTS AREA CHART */}
        {activeTab === 'chart' && (
          <div>
            <div className="h-44 sm:h-48 w-full min-w-0 -ml-3">
              {isTrendLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-700" />
                </div>
              ) : seriesData.length === 0 ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-xs text-stone-400 italic ml-3">
                  <p>Daily APMC settlement records accumulating.</p>
                  <p className="mt-1 text-[10px] text-stone-400">
                    Switch timeframe to 90D or view All Districts.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180} minWidth={0}>
                  <AreaChart
                    data={seriesData}
                    margin={{ top: 8, right: 10, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="modernEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#107c41" stopOpacity={0.28} />
                        <stop offset="65%" stopColor="#107c41" stopOpacity={0.04} />
                        <stop offset="100%" stopColor="#107c41" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f8fafc"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 9.5, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      dy={4}
                    />
                    <YAxis
                      tick={{ fontSize: 9.5, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']}
                      tickFormatter={(val) => `₹${val}`}
                      dx={-2}
                    />
                    <Tooltip
                      content={<CustomChartTooltip selectedCrop={selectedCrop} />}
                      cursor={{ stroke: '#107c41', strokeWidth: 1.5, strokeDasharray: '3 3' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="modalPrice"
                      stroke="#107c41"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#modernEmeraldGradient)"
                      dot={{ r: 2.5, fill: '#107c41', strokeWidth: 1.5, stroke: '#ffffff' }}
                      activeDot={{
                        r: 5,
                        fill: '#064e3b',
                        strokeWidth: 2,
                        stroke: '#ffffff',
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Smart insight under chart */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 font-medium px-1">
              <span className="flex items-center gap-1 truncate max-w-[220px]">
                <Sparkles className="h-3 w-3 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {bestMandi
                    ? `Best in UP: ${bestMandi.market} (₹${Number(bestMandi.modalPrice).toLocaleString('en-IN')})`
                    : `Verified daily APMC settlement rates`}
                </span>
              </span>
              <span className="text-[10px] text-stone-400 shrink-0">
                Range: ₹{minPrice} - ₹{maxPrice}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: UP MANDIS COMPARISON */}
        {activeTab === 'comparison' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
              <span>Reporting Mandis for {selectedCrop}</span>
              <span className="text-[10px] text-emerald-700 font-bold">Highest First</span>
            </div>

            {isComparisonLoading ? (
              <div className="py-8 flex justify-center">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-700" />
              </div>
            ) : comparisonData.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                No comparative mandi records for {selectedCrop} today.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-none">
                {comparisonData.slice(0, 8).map((item, idx) => {
                  const maxRate = comparisonData[0]?.modalPrice || 1;
                  const barWidth = Math.max(Math.round((item.modalPrice / maxRate) * 100), 20);
                  const isTop = idx === 0;

                  return (
                    <div
                      key={item.market}
                      className={`p-2 rounded-xl border transition-all ${
                        isTop ? 'bg-emerald-50/70 border-emerald-200' : 'bg-stone-50/60 border-stone-200/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 truncate max-w-[160px]">
                          <span className="font-bold text-slate-800 truncate">{item.market}</span>
                          <span className="text-[10px] text-stone-400 truncate">({item.district})</span>
                          {isTop && (
                            <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-emerald-700 text-white">
                              TOP
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-black text-slate-900 text-xs">
                            ₹{Number(item.modalPrice).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-400 ml-0.5">/Q</span>
                        </div>
                      </div>

                      <div className="mt-1.5 w-full bg-stone-200/60 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isTop ? 'bg-emerald-600' : 'bg-emerald-700/60'}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE MANDI TABLE */}
        {activeTab === 'table' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[9px]">
                    <th className="pb-1.5">Mandi</th>
                    <th className="pb-1.5">District</th>
                    <th className="pb-1.5 text-right">Modal (₹/Q)</th>
                    <th className="pb-1.5 text-right">Rate (₹/kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {isLiveLoading ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-stone-400">
                        <RefreshCw className="h-4 w-4 animate-spin mx-auto text-emerald-700" />
                      </td>
                    </tr>
                  ) : !livePricesData?.records || livePricesData.records.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-stone-400">
                        No arrivals reported for {selectedCrop} today.
                      </td>
                    </tr>
                  ) : (
                    livePricesData.records.slice(0, 5).map((r, idx) => (
                      <tr key={`${r.market}-${idx}`} className="hover:bg-stone-50/60">
                        <td className="py-2 font-bold text-slate-800 truncate max-w-[110px]">{r.market}</td>
                        <td className="py-2 text-stone-500">{r.district}</td>
                        <td className="py-2 text-right font-black text-emerald-800">
                          ₹{Number(r.modalPrice).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 text-right text-stone-600 font-semibold">
                          ₹{r.pricePerKg}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {livePricesData?.pagination?.totalPages > 1 && (
              <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Page {livePricesData.pagination.page} of {livePricesData.pagination.totalPages}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTablePage((p) => Math.max(p - 1, 1))}
                    disabled={tablePage <= 1}
                    className="px-2 py-0.5 rounded border border-stone-200 hover:bg-stone-50 disabled:opacity-40 cursor-pointer font-bold"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setTablePage((p) => Math.min(p + 1, livePricesData.pagination.totalPages))}
                    disabled={tablePage >= livePricesData.pagination.totalPages}
                    className="px-2 py-0.5 rounded border border-stone-200 hover:bg-stone-50 disabled:opacity-40 cursor-pointer font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COMPARE CROPS */}
        {activeTab === 'compare' && (
          <div className="space-y-2.5">
            <div className="text-[11px] text-stone-500 font-medium">
              Select crops to compare rates in {selectedDistrict}:
            </div>

            <div className="flex flex-wrap gap-1">
              {(overviewData.length > 0 ? overviewData : [
                { crop: 'Tomato', emoji: '🍅' },
                { crop: 'Potato', emoji: '🥔' },
                { crop: 'Onion', emoji: '🧅' },
                { crop: 'Wheat', emoji: '🌾' },
                { crop: 'Garlic', emoji: '🧄' },
              ]).map((c) => {
                const isSelected = comparedCrops.includes(c.crop);
                return (
                  <button
                    key={c.crop}
                    type="button"
                    onClick={() => {
                      if (isSelected && comparedCrops.length > 1) {
                        setComparedCrops(comparedCrops.filter((x) => x !== c.crop));
                      } else if (!isSelected && comparedCrops.length < 4) {
                        setComparedCrops([...comparedCrops, c.crop]);
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-0.8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <span>{c.emoji || '🌾'}</span>
                    <span>{c.crop}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {comparedCrops.map((cropName) => {
                const match = overviewData.find((o) => o.crop.toLowerCase() === cropName.toLowerCase());
                const price = match?.modalPrice || 0;
                const priceKg = match?.pricePerKg || (price ? (price / 100).toFixed(2) : '0');

                return (
                  <div
                    key={cropName}
                    className="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/50 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{cropName}</span>
                      <span className="text-sm">{match?.emoji || '🌾'}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-base font-black text-slate-900">
                        ₹{Number(price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-stone-400 ml-0.5">/Q</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400">
                      <span>₹{priceKg}/kg</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCrop(cropName);
                          setActiveTab('chart');
                        }}
                        className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        View <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 5. QUICK CROP RATE STRIP ── */}
        {overviewData.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-stone-100">
            <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1.5">
              <span>UP Daily Rates</span>
              <span className="text-emerald-700 font-bold normal-case">Tap to switch</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {overviewData.slice(0, 10).map((item) => {
                const isSelected = selectedCrop.toLowerCase() === item.crop.toLowerCase();
                return (
                  <button
                    key={item.crop}
                    type="button"
                    onClick={() => {
                      setSelectedCrop(item.crop);
                      setTablePage(1);
                    }}
                    className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs font-bold'
                        : 'bg-stone-50/80 hover:bg-stone-100/80 border-stone-200/70 text-slate-800'
                    }`}
                  >
                    <span className="text-sm">{item.emoji || '🌾'}</span>
                    <span className="text-[11px] font-bold">{item.crop}</span>
                    <span className={`text-[11px] font-black ${isSelected ? 'text-emerald-200' : 'text-emerald-700'}`}>
                      ₹{item.modalPrice.toLocaleString('en-IN')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 6. CLEAN FOOTER ── */}
      <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/40 flex items-center justify-between text-[10px] text-stone-400">
        <div>
          <span>Arrival: </span>
          <strong className="text-stone-600 font-semibold">{arrivalDate}</strong>
        </div>
        <div>
          <span>Source: </span>
          <a
            href="https://data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-0.5"
          >
            AGMARKNET • Data.gov.in
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default MarketPriceTrends;
