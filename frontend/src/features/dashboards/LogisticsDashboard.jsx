import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LogisticsLayout } from '../logistics/components/LogisticsLayout.jsx';
import { LogisticsHeroBanner } from '../logistics/components/LogisticsHeroBanner.jsx';
import { LogisticsKpiCards } from '../logistics/components/LogisticsKpiCards.jsx';
import { CurrentTripCard } from '../logistics/components/CurrentTripCard.jsx';
import { LogisticsMap } from '../logistics/components/LogisticsMap.jsx';
import { VehicleList } from '../logistics/components/VehicleList.jsx';
import { AvailableShipmentTable } from '../logistics/components/AvailableShipmentTable.jsx';
import { RouteOptimizationCard } from '../logistics/components/RouteOptimizationCard.jsx';
import { EarningsSummary } from '../logistics/components/EarningsSummary.jsx';
import { RecentTrips } from '../logistics/components/RecentTrips.jsx';
import { MaintenanceAlerts } from '../logistics/components/MaintenanceAlerts.jsx';
import { QuickActions } from '../logistics/components/QuickActions.jsx';
import { AddVehicleModal } from '../logistics/components/AddVehicleModal.jsx';
import { ShipmentAcceptModal } from '../logistics/components/ShipmentAcceptModal.jsx';
import { TripLifecycleModal } from '../logistics/components/TripLifecycleModal.jsx';
import { AddExpenseModal } from '../logistics/components/AddExpenseModal.jsx';
import logisticsService from '../logistics/services/logisticsService.js';

export function LogisticsDashboard() {
  const navigate = useNavigate();

  // Primary Data State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Modal States
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [selectedShipmentForAccept, setSelectedShipmentForAccept] = useState(null);
  const [selectedTripForLifecycle, setSelectedTripForLifecycle] = useState(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const data = await logisticsService.getDashboardOverview();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load logistics dashboard overview:', err);
      setError(err.message || 'Unable to retrieve live telemetry and operational data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Quick Action Dispatcher
  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'accept_loads':
        navigate('/logistics/shipments');
        break;
      case 'view_routes':
        navigate('/logistics/routes');
        break;
      case 'add_trip':
        navigate('/logistics/trips');
        break;
      case 'report_issue':
        showToast('Ticket #TKT-8910 logged with KrishiSetu Control Tower.');
        break;
      case 'contact_support':
        navigate('/logistics/messages');
        break;
      case 'add_vehicle':
        setIsAddVehicleOpen(true);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <LogisticsLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-[#0e5c36] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#0e5c36]">
              KS
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-stone-800">Connecting to KrishiSetu Fleet Telemetry Network</p>
            <p className="text-xs text-stone-500 mt-1">Retrieving real-time NH 731 corridor tracking & mandi consignments...</p>
          </div>
        </div>
      </LogisticsLayout>
    );
  }

  if (error && !dashboardData) {
    return (
      <LogisticsLayout>
        <div className="p-8 max-w-lg mx-auto text-center my-12 bg-white rounded-2xl border border-red-200 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-stone-900 mb-1">Failed to Connect to Logistics Hub</h2>
          <p className="text-xs text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => loadData()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e5c36] hover:bg-[#0a4628] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </button>
        </div>
      </LogisticsLayout>
    );
  }

  const kpis = dashboardData?.kpis || {};
  const currentTrip = dashboardData?.currentTrip;
  const vehicles = dashboardData?.vehicles || [];
  const availableShipments = dashboardData?.availableShipments || [];
  const routeOptimization = dashboardData?.routeOptimization || {};
  const earnings = dashboardData?.earningsSummary || dashboardData?.earnings || {};
  const recentTrips = dashboardData?.recentTrips || [];
  const maintenanceAlerts = dashboardData?.maintenanceAlerts || [];

  return (
    <LogisticsLayout>
      {/* Toast alert message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white text-xs font-medium rounded-xl shadow-xl border border-stone-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Dashboard Canvas matching Reference Image Exactly */}
      <div className="space-y-5">
        {/* ============================================================ */}
        {/* ROW 1: Wide Landscape Hero Banner                             */}
        {/* ============================================================ */}
        <LogisticsHeroBanner />

        {/* ============================================================ */}
        {/* ROW 2: 5 Top Metric Cards in 1 Row                           */}
        {/* ============================================================ */}
        <LogisticsKpiCards kpis={kpis} />

        {/* ============================================================ */}
        {/* ROW 3: Current Trip (4 cols) | Live Tracking (5 cols) | My Vehicles (3 cols) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-4">
            <CurrentTripCard
              trip={currentTrip}
              onAdvanceTrip={(trip) => setSelectedTripForLifecycle(trip)}
              onViewDetails={() => navigate('/logistics/trips')}
            />
          </div>

          <div className="lg:col-span-5">
            <LogisticsMap
              liveTracking={dashboardData?.liveTracking}
              activeTrip={currentTrip}
              stops={routeOptimization.stops || []}
              vehicles={vehicles}
            />
          </div>

          <div className="lg:col-span-3">
            <VehicleList
              vehicles={vehicles}
              onAddVehicle={() => setIsAddVehicleOpen(true)}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* ROW 4: Available Shipments (6 cols) | Route Optimization (3 cols) | Earnings Summary (3 cols) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-6">
            <AvailableShipmentTable
              shipments={availableShipments}
              onAccept={(shipment) => setSelectedShipmentForAccept(shipment)}
              onRefresh={() => loadData(true)}
            />
          </div>

          <div className="lg:col-span-3">
            <RouteOptimizationCard
              data={routeOptimization}
              onOptimize={() => {
                showToast('AI multi-stop route re-calculated. Optimized for NH 731 corridor.');
                loadData(true);
              }}
            />
          </div>

          <div className="lg:col-span-3">
            <EarningsSummary
              earnings={earnings}
              onViewAll={() => navigate('/logistics/earnings')}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* ROW 5: Recent Trips (5 cols) | Maintenance & Alerts (4 cols) | Quick Actions (3 cols) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5">
            <RecentTrips trips={recentTrips} />
          </div>

          <div className="lg:col-span-4">
            <MaintenanceAlerts
              alerts={maintenanceAlerts}
              onSchedule={() => navigate('/logistics/maintenance')}
            />
          </div>

          <div className="lg:col-span-3">
            <QuickActions onAction={handleQuickAction} />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* REAL-TIME INTERACTIVE MODALS                                  */}
      {/* ============================================================ */}
      {/* 1. Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onVehicleAdded={(newVeh) => {
          showToast(`Vehicle ${newVeh.plateNumber || newVeh.vehicleNumber} successfully added to fleet!`);
          loadData(true);
        }}
      />

      {/* 2. Concurrency-Safe Shipment Accept Modal */}
      <ShipmentAcceptModal
        isOpen={Boolean(selectedShipmentForAccept)}
        shipment={selectedShipmentForAccept}
        vehicles={vehicles}
        onClose={() => setSelectedShipmentForAccept(null)}
        onAccepted={(assignedTrip) => {
          setSelectedShipmentForAccept(null);
          showToast(`Load accepted! Trip ${assignedTrip.tripCode || assignedTrip.id} initiated.`);
          loadData(true);
        }}
      />

      {/* 3. Trip Lifecycle Modal */}
      <TripLifecycleModal
        isOpen={Boolean(selectedTripForLifecycle)}
        trip={selectedTripForLifecycle}
        onClose={() => setSelectedTripForLifecycle(null)}
        onTripUpdated={(updatedTrip) => {
          setSelectedTripForLifecycle(null);
          showToast(`Trip status successfully updated to ${updatedTrip.status}!`);
          loadData(true);
        }}
      />

      {/* 4. Add Fuel / Toll Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        vehicles={vehicles}
        trips={dashboardData?.trips || (currentTrip ? [currentTrip] : [])}
        onClose={() => setIsAddExpenseOpen(false)}
        onExpenseAdded={(newExpense) => {
          showToast(`Expense of ₹${Number(newExpense.amount).toLocaleString()} logged successfully.`);
          loadData(true);
        }}
      />
    </LogisticsLayout>
  );
}

export default LogisticsDashboard;
