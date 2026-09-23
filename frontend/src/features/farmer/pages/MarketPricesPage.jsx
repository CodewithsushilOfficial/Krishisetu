import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { useUserLocation } from '../../../hooks/useUserLocation.js';
import { useLiveMarketPrices } from '../hooks/useMarketPrices.js';
import CommoditySelector from '../components/market-prices/CommoditySelector.jsx';
import LocationSelector from '../components/market-prices/LocationSelector.jsx';
import DateFilter from '../components/market-prices/DateFilter.jsx';
import VarietySelector from '../components/market-prices/VarietySelector.jsx';
import MarketPriceSummary from '../components/market-prices/MarketPriceSummary.jsx';
import MarketPriceTable from '../components/market-prices/MarketPriceTable.jsx';
import MarketPriceTrend from '../components/market-prices/MarketPriceTrend.jsx';
import MarketPriceEmpty from '../components/market-prices/MarketPriceEmpty.jsx';
import MarketPriceError from '../components/market-prices/MarketPriceError.jsx';
import AllCropsView from '../components/market-prices/AllCropsView.jsx';
import { TrendingUp, RefreshCw, RotateCcw, ExternalLink, ShieldCheck, Grid, BarChart2 } from 'lucide-react';

export function MarketPricesPage() {
  const { commodity: routeCommodity, state: routeState, district: routeDistrict } = useParams();
  const navigate = useNavigate();

  // Geolocation integration
  const {
    location: userLoc,
    mode: locMode,
    isLoading: isGeoLoading,
    requestLocation,
    setManualLocation,
  } = useUserLocation();

  // Filters State
  const [selectedCrop, setSelectedCrop] = useState(
    routeCommodity ? routeCommodity.charAt(0).toUpperCase() + routeCommodity.slice(1) : 'Tomato'
  );
  const [selectedState, setSelectedState] = useState(routeState ? decodeURIComponent(routeState) : userLoc.state || 'Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState(routeDistrict ? decodeURIComponent(routeDistrict) : userLoc.district || 'Varanasi');
  const [selectedMarket, setSelectedMarket] = useState('All Mandis');
  const [selectedVariety, setSelectedVariety] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('DETAIL'); // 'DETAIL' | 'ALL_CROPS'

  // Dynamic SEO Title & Meta Description
  useEffect(() => {
    const locStr = selectedDistrict ? `${selectedDistrict}, ${selectedState}` : selectedState;
    document.title = `${selectedCrop} Mandi Prices in ${locStr} | KrishiSetu`;
  }, [selectedCrop, selectedState, selectedDistrict]);

  // Query live variety-wise mandi prices
  const {
    data: queryRes,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useLiveMarketPrices({
    commodity: selectedCrop,
    state: selectedState,
    district: selectedDistrict,
    market: selectedMarket === 'All Mandis' ? '' : selectedMarket,
    variety: selectedVariety === 'All Varieties' ? '' : selectedVariety,
    arrivalDate: selectedDate,
    page,
    limit: 50,
  });

  const marketData = queryRes?.data || {};
  const records = marketData.records || [];
  const summary = marketData.summary || {};
  const pagination = marketData.pagination || {};
  const source = marketData.source || {};
  const availableVarieties = marketData.availableVarieties || [];
  const hasData = marketData.hasData;

  // Handle location change from LocationSelector
  const handleLocationChange = ({ state, district, market }) => {
    if (state !== selectedState) setSelectedState(state);
    setSelectedDistrict(district);
    setSelectedMarket(market || 'All Mandis');
    setPage(1);
    setManualLocation(state, district);
  };

  // Handle Clear Filters
  const handleClearFilters = () => {
    setSelectedCrop('Tomato');
    setSelectedState('Uttar Pradesh');
    setSelectedDistrict('Varanasi');
    setSelectedMarket('All Mandis');
    setSelectedVariety('');
    setSelectedDate('');
    setPage(1);
  };

  return (
    <DashboardLayout
      title="Live Mandi Market Intelligence"
      subtitle="Government of India (Data.gov.in) Official APMC Settlement Rates & Variety-wise Prices"
      fullWidth={true}
    >
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Control Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Crop & Location Selectors */}
            <div className="flex flex-wrap items-center gap-2.5">
              <CommoditySelector
                selectedCrop={selectedCrop}
                onSelectCrop={(crop) => {
                  setSelectedCrop(crop);
                  setPage(1);
                }}
              />

              <LocationSelector
                selectedState={selectedState}
                selectedDistrict={selectedDistrict}
                selectedMarket={selectedMarket}
                onSelectLocation={handleLocationChange}
                onUseCurrentLocation={requestLocation}
                isGeoLoading={isGeoLoading}
                isGpsActive={locMode === 'CURRENT'}
              />

              <DateFilter
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setPage(1);
                }}
              />

              {/* Clear Filters Button */}
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                title="Reset all filters to defaults"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>

            {/* Right: View Mode & Refresh */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('DETAIL')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    viewMode === 'DETAIL'
                      ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span>Crop Detail</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('ALL_CROPS')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    viewMode === 'ALL_CROPS'
                      ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span>All Crops Board</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50 hover:bg-white text-stone-600 transition-colors shadow-2xs disabled:opacity-50"
                title="Refresh live mandi data"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Variety Filter Pills (If multiple varieties exist) */}
          {availableVarieties.length > 1 && (
            <div className="pt-2 border-t border-stone-100">
              <VarietySelector
                varieties={availableVarieties}
                selectedVariety={selectedVariety}
                onSelectVariety={(v) => {
                  setSelectedVariety(v);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>

        {/* View Mode 1: All Crops Overview Board */}
        {viewMode === 'ALL_CROPS' ? (
          <AllCropsView
            state={selectedState}
            district={selectedDistrict}
            onSelectCrop={(crop) => {
              setSelectedCrop(crop);
              setViewMode('DETAIL');
              setPage(1);
            }}
          />
        ) : (
          /* View Mode 2: Detailed Crop Intelligence */
          <div className="space-y-6">
            {/* Loading State */}
            {isLoading ? (
              <div className="bg-white p-12 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
                <p className="text-xs font-bold text-stone-600">
                  Loading latest {selectedCrop} mandi prices from Data.gov.in...
                </p>
              </div>
            ) : error ? (
              /* Error State (Never falls back to Potato) */
              <MarketPriceError error={error} onRetry={() => refetch()} />
            ) : !hasData || records.length === 0 ? (
              /* Empty State (Never falls back to Potato) */
              <MarketPriceEmpty
                commodity={selectedCrop}
                district={selectedDistrict || selectedState}
                date={selectedDate}
                onTryAnotherDate={() => setSelectedDate('')}
                onChangeDistrict={() => setSelectedDistrict('')}
                onChangeCommodity={() => setSelectedCrop('Wheat')}
              />
            ) : (
              /* Success State */
              <>
                {/* 1. Summary Cards */}
                <MarketPriceSummary
                  summary={summary}
                  cropName={selectedCrop}
                  source={source}
                />

                {/* 2. Interactive Price Trend Chart */}
                <MarketPriceTrend
                  commodity={selectedCrop}
                  state={selectedState}
                  district={selectedDistrict}
                  market={selectedMarket === 'All Mandis' ? '' : selectedMarket}
                />

                {/* 3. Variety-wise Mandi Prices Table */}
                <MarketPriceTable
                  records={records}
                  pagination={pagination}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </>
            )}
          </div>
        )}

        {/* Data Source & Legal Attribution Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-stone-400 p-4 rounded-xl bg-stone-100/60 border border-stone-200/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Official Government Data Source: Ministry of Agriculture & Farmers Welfare (Agmarknet) via Data.gov.in
            </span>
          </div>
          <a
            href="https://data.gov.in/resource/variety-wise-daily-market-prices-data-commodity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-emerald-700 hover:underline shrink-0"
          >
            <span>Resource: 35985678-0d79-46b4-9ed6-6f13308a1d24</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MarketPricesPage;
