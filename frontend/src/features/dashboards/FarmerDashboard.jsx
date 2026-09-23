import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import {
  useFarmerSummary,
  useFarmerProduce,
  useFarmerOrders,
  useFarmerHarvests,
  useFarmerEarnings,
  useFarmerWeather,
  useFarmerInsights,
} from '../farmer/hooks/useFarmerDashboard.js';

import WelcomeHero from '../farmer/components/WelcomeHero.jsx';
import KpiStatCards from '../farmer/components/KpiStatCards.jsx';
import ProduceWidget from '../farmer/components/ProduceWidget.jsx';
import AddProduceModal from '../farmer/components/AddProduceModal.jsx';
import MarketPriceTrends from '../farmer/components/MarketPriceTrends.jsx';
import AiInsightsPanel from '../farmer/components/AiInsightsPanel.jsx';
import MyOrdersWidget from '../farmer/components/MyOrdersWidget.jsx';
import UpcomingHarvestWidget from '../farmer/components/UpcomingHarvestWidget.jsx';
import EarningsOverview from '../farmer/components/EarningsOverview.jsx';
import QuickActions from '../farmer/components/QuickActions.jsx';
import WeatherWidget from '../farmer/components/WeatherWidget.jsx';
import PromotionalBanner from '../farmer/components/PromotionalBanner.jsx';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function FarmerDashboard() {
  const navigate = useNavigate();
  const [isAddProduceOpen, setIsAddProduceOpen] = useState(false);

  // TanStack Query for dynamic server state
  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useFarmerSummary();

  const { data: produce = [], isLoading: isProduceLoading } = useFarmerProduce();
  const { data: orders = [] } = useFarmerOrders();
  const { data: harvests = [] } = useFarmerHarvests();
  const { data: earnings } = useFarmerEarnings();
  const { data: weather } = useFarmerWeather();
  const { data: insights = [] } = useFarmerInsights();

  const isLoading = isSummaryLoading && isProduceLoading && !summary;

  if (isLoading) {
    return (
      <DashboardLayout
        title="Farmer Dashboard"
        hideProfileCompletion={true}
        fullWidth={true}
      >
        <div className="space-y-4 animate-pulse">
          {/* Welcome Banner Skeleton */}
          <div className="h-28 bg-emerald-950/10 rounded-2xl" />

          {/* 4 KPI Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 sm:h-28 bg-stone-200/70 rounded-2xl" />
            ))}
          </div>

          {/* 3-Column Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr_1fr] gap-4">
            <div className="h-72 bg-stone-200/70 rounded-2xl" />
            <div className="h-72 bg-stone-200/70 rounded-2xl" />
            <div className="h-72 bg-stone-200/70 rounded-2xl" />
            <div className="h-56 bg-stone-200/70 rounded-2xl" />
            <div className="h-56 bg-stone-200/70 rounded-2xl" />
            <div className="h-56 bg-stone-200/70 rounded-2xl" />
            <div className="h-56 bg-stone-200/70 rounded-2xl" />
            <div className="h-56 bg-stone-200/70 rounded-2xl" />
            <div className="h-56 bg-stone-200/70 rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (summaryError && !summary) {
    return (
      <DashboardLayout
        title="Farmer Dashboard"
        hideProfileCompletion={true}
        fullWidth={true}
      >
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-lg mx-auto text-center my-12 shadow-sm">
          <AlertCircle className="h-10 w-10 mx-auto mb-3 text-red-600" />
          <h3 className="font-bold text-base">Failed to Sync Farmer Operations</h3>
          <p className="text-xs mt-1 text-red-600 leading-relaxed">
            {summaryError?.message || 'Database connection error. Please verify PostgreSQL session.'}
          </p>
          <button
            onClick={() => refetchSummary()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Database Connection
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Bind dynamic server state with fallback defaults
  const farmerProfile = summary?.farmer;
  const kpiStats = summary?.stats || summary?.kpis;
  const activeProduce = produce.length > 0 ? produce : (summary?.produce || []);
  const activeOrders = orders.length > 0 ? orders : (summary?.orders || []);
  const upcomingHarvests = harvests.length > 0 ? harvests : (summary?.upcomingHarvests || []);
  const activeEarnings = earnings || summary?.earningsOverview;
  const activeWeather = weather || summary?.weather;
  const activeInsights = insights.length > 0 ? insights : (summary?.aiInsights || []);

  return (
    <DashboardLayout
      title="Farmer Dashboard"
      role="FARMER"
      hideProfileCompletion={true}
      fullWidth={true}
    >
      <div className="space-y-4 pb-8">
        {/* 1. Welcome Banner */}
        <WelcomeHero farmer={farmerProfile} />

        {/* 2. Top 4 KPI Metrics */}
        <KpiStatCards stats={kpiStats} />

        {/* Mobile/Tablet Quick Actions immediately below KPI Cards */}
        <div className="block xl:hidden">
          <QuickActions
            onAddProduce={() => setIsAddProduceOpen(true)}
            onViewDemand={() => navigate('/farmer/buyer-demand')}
            onTrackShipment={() => navigate('/farmer/orders')}
            onCheckPrices={() => navigate('/farmer/market-prices')}
          />
        </div>

        {/* 3. Three Natural Columns matching Former Dashbord Ui.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* COLUMN 1: Left (~42% on xl = col-span-5) */}
          <div className="space-y-4 sm:space-y-5 md:col-span-2 xl:col-span-5">
            <ProduceWidget
              produce={activeProduce}
              onOpenAddModal={() => setIsAddProduceOpen(true)}
            />
            <MyOrdersWidget orders={activeOrders} />
            <EarningsOverview earnings={activeEarnings} />
          </div>

          {/* COLUMN 2: Middle (~33% on xl = col-span-4) */}
          <div className="space-y-4 sm:space-y-5 md:col-span-1 xl:col-span-4">
            <MarketPriceTrends
              initialData={summary?.marketTrend}
              farmer={farmerProfile}
            />
            <UpcomingHarvestWidget
              harvests={upcomingHarvests}
              onAddCrop={() => setIsAddProduceOpen(true)}
            />
            <div className="hidden xl:block">
              <QuickActions
                onAddProduce={() => setIsAddProduceOpen(true)}
                onViewDemand={() => navigate('/farmer/buyer-demand')}
                onTrackShipment={() => navigate('/farmer/orders')}
                onCheckPrices={() => navigate('/farmer/market-prices')}
              />
            </div>
          </div>

          {/* COLUMN 3: Right (~25% on xl = col-span-3) */}
          <div className="space-y-4 sm:space-y-5 md:col-span-1 xl:col-span-3">
            <AiInsightsPanel insights={activeInsights} />
            <WeatherWidget weather={activeWeather} />
            <PromotionalBanner />
          </div>
        </div>
      </div>

      {/* Add Produce Modal */}
      <AddProduceModal
        isOpen={isAddProduceOpen}
        onClose={() => setIsAddProduceOpen(false)}
      />
    </DashboardLayout>
  );
}

export default FarmerDashboard;
