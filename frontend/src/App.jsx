import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/store/authStore.js';
import { authService } from './features/auth/services/authService.js';
import { RoleSelectionPage } from './features/auth/pages/RoleSelectionPage.jsx';
import { RegisterPage } from './features/auth/pages/RegisterPage.jsx';
import { LoginPage } from './features/auth/pages/LoginPage.jsx';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage.jsx';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage.jsx';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute.jsx';
import { PublicOnlyRoute } from './features/auth/components/PublicOnlyRoute.jsx';
import { getDashboardRouteForRole } from './features/auth/utils/roleRoutes.js';

// Role Operational Dashboards
import { FarmerDashboard } from './features/dashboards/FarmerDashboard.jsx';
import { FpoDashboard } from './features/dashboards/FpoDashboard.jsx';
import { LogisticsDashboard } from './features/dashboards/LogisticsDashboard.jsx';
import { BuyerDashboard } from './features/dashboards/BuyerDashboard.jsx';
import { ConsumerMarketplaceDashboard } from './features/dashboards/ConsumerMarketplaceDashboard.jsx';
import { AdminDashboard } from './features/dashboards/AdminDashboard.jsx';
import { ControlTowerDashboard } from './features/dashboards/ControlTowerDashboard.jsx';
import { UserProfilePage } from './features/profile/UserProfilePage.jsx';
import { NotFoundPage } from './components/common/NotFoundPage.jsx';

// Dedicated Farmer Feature Pages (Phase 2.3.1)
import { FarmsPage } from './features/farmer/pages/FarmsPage.jsx';
import { CropsPage } from './features/farmer/pages/CropsPage.jsx';
import { ProducePage } from './features/farmer/pages/ProducePage.jsx';
import { MarketPricesPage } from './features/farmer/pages/MarketPricesPage.jsx';
import { BuyerDemandPage } from './features/farmer/pages/BuyerDemandPage.jsx';
import { OrdersPage } from './features/farmer/pages/OrdersPage.jsx';
import { PaymentsPage } from './features/farmer/pages/PaymentsPage.jsx';
import { AiInsightsPage } from './features/farmer/pages/AiInsightsPage.jsx';
import { WeatherPage } from './features/farmer/pages/WeatherPage.jsx';
import { MessagesPage } from './features/farmer/pages/MessagesPage.jsx';

// Dedicated FPO Subsystem Pages (Phase 2.4)
import { FpoFarmersPage } from './features/fpo/pages/FpoFarmersPage.jsx';
import { FpoCollectionCentersPage } from './features/fpo/pages/FpoCollectionCentersPage.jsx';
import { FpoProducePage } from './features/fpo/pages/FpoProducePage.jsx';
import { FpoInventoryPage } from './features/fpo/pages/FpoInventoryPage.jsx';
import { FpoDemandPage } from './features/fpo/pages/FpoDemandPage.jsx';
import { FpoOrdersPage } from './features/fpo/pages/FpoOrdersPage.jsx';
import { FpoLogisticsPage } from './features/fpo/pages/FpoLogisticsPage.jsx';
import { FpoMarketPricesPage } from './features/fpo/pages/FpoMarketPricesPage.jsx';
import { FpoAiInsightsPage } from './features/fpo/pages/FpoAiInsightsPage.jsx';
import { FpoPaymentsPage } from './features/fpo/pages/FpoPaymentsPage.jsx';
import { FpoReportsPage } from './features/fpo/pages/FpoReportsPage.jsx';
import { FpoMessagesPage } from './features/fpo/pages/FpoMessagesPage.jsx';
import { FpoStaffPage } from './features/fpo/pages/FpoStaffPage.jsx';
import { FpoProfilePage } from './features/fpo/pages/FpoProfilePage.jsx';
import { FpoSettingsPage } from './features/fpo/pages/FpoSettingsPage.jsx';

// Dedicated Logistics Feature Pages (Phase 2.5)
import { ShipmentsPage } from './features/logistics/pages/ShipmentsPage.jsx';
import { TripsPage } from './features/logistics/pages/TripsPage.jsx';
import { VehiclesPage } from './features/logistics/pages/VehiclesPage.jsx';
import { RoutesPage } from './features/logistics/pages/RoutesPage.jsx';
import { EarningsPage } from './features/logistics/pages/EarningsPage.jsx';
import { LoadHistoryPage } from './features/logistics/pages/LoadHistoryPage.jsx';
import { ExpensesPage } from './features/logistics/pages/ExpensesPage.jsx';
import { MaintenancePage } from './features/logistics/pages/MaintenancePage.jsx';
import { RatingsPage } from './features/logistics/pages/RatingsPage.jsx';
import { MessagesPage as LogisticsMessagesPage } from './features/logistics/pages/MessagesPage.jsx';
import { NotificationsPage as LogisticsNotificationsPage } from './features/logistics/pages/NotificationsPage.jsx';
import { SettingsPage as LogisticsSettingsPage } from './features/logistics/pages/SettingsPage.jsx';

/**
 * Root redirector:
 * - If user is logged in, redirect to their role-specific canonical dashboard
 * - Otherwise redirect to Role Selection onboarding
 */
function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.role) {
    return <Navigate to={getDashboardRouteForRole(user.role)} replace />;
  }

  return <Navigate to="/auth/role-selection" replace />;
}

export function App() {
  const { isInitializing, isInitialized, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession().catch(() => {});
  }, [restoreSession]);

  if (isInitializing || !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-white select-none">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-emerald-500/20">
              <span className="text-xl">🌾</span>
            </div>
            <span className="text-2xl font-black tracking-tight">
              Krishi<span className="text-emerald-400">Setu</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-stone-400 text-xs font-medium">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            <span>Restoring session...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Root */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Authentication Routes (Guarded: logged-in users are redirected to dashboard) */}
        <Route
          path="/auth/role-selection"
          element={
            <PublicOnlyRoute>
              <RoleSelectionPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/auth/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/auth/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <PublicOnlyRoute>
              <ResetPasswordPage />
            </PublicOnlyRoute>
          }
        />

        {/* ============================================================ */}
        {/* PUBLIC MANDI MARKET PRICES (SEO-Friendly Open Routes)        */}
        {/* ============================================================ */}
        <Route path="/market-prices" element={<MarketPricesPage />} />
        <Route path="/market-prices/:commodity" element={<MarketPricesPage />} />
        <Route path="/market-prices/:commodity/:state/:district" element={<MarketPricesPage />} />

        {/* ============================================================ */}
        {/* FARMER SUBSYSTEM (Canonical /dashboard/farmer & /farmer/*)    */}
        {/* ============================================================ */}
        {/* Canonical Farmer Dashboard */}
        <Route
          path="/dashboard/farmer"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        {/* Legacy redirect for /farmer/dashboard */}
        <Route path="/farmer/dashboard" element={<Navigate to="/dashboard/farmer" replace />} />

        {/* 1. My Farms */}
        <Route
          path="/farmer/farms"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/farms/:farmId"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <FarmsPage />
            </ProtectedRoute>
          }
        />

        {/* 2. My Crops */}
        <Route
          path="/farmer/crops"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <CropsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/crops/:cropId"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <CropsPage />
            </ProtectedRoute>
          }
        />

        {/* 3. My Produce */}
        <Route
          path="/farmer/produce"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <ProducePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/produce/:produceId"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <ProducePage />
            </ProtectedRoute>
          }
        />

        {/* 4. Market Prices */}
        <Route
          path="/farmer/market-prices"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <MarketPricesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/market-prices/:cropId"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <MarketPricesPage />
            </ProtectedRoute>
          }
        />

        {/* 5. Buyer Demand */}
        <Route
          path="/farmer/buyer-demand"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <BuyerDemandPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/buyer-demand/:demandId"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <BuyerDemandPage />
            </ProtectedRoute>
          }
        />

        {/* 6. My Orders */}
        <Route
          path="/farmer/orders"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/orders/:orderId"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* 7. Payments & Earnings */}
        <Route
          path="/farmer/payments"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/payments/:paymentId"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        {/* 8. AI Insights */}
        <Route
          path="/farmer/ai-insights"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <AiInsightsPage />
            </ProtectedRoute>
          }
        />

        {/* 9. Weather & Alerts */}
        <Route
          path="/farmer/weather"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <WeatherPage />
            </ProtectedRoute>
          }
        />

        {/* 10. Messages */}
        <Route
          path="/farmer/messages"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/messages/:conversationId"
          element={
            <ProtectedRoute allowedRoles={['FARMER']}>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* ============================================================ */}
        {/* OTHER ROLES OPERATIONAL DASHBOARDS                           */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* FPO SUBSYSTEM (Phase 2.4 — Complete Operational Workspace)  */}
        {/* ============================================================ */}
        <Route
          path="/dashboard/fpo"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/dashboard"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/farmers"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoFarmersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/collection-centers"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoCollectionCentersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/produce"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoProducePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/inventory"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoInventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/demand"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoDemandPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/orders"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/logistics"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoLogisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/market-prices"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoMarketPricesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/ai-insights"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoAiInsightsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/payments"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoPaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/reports"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/messages"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoMessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/staff"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoStaffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/profile"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fpo/settings"
          element={
            <ProtectedRoute allowedRoles={['FPO']}>
              <FpoSettingsPage />
            </ProtectedRoute>
          }
        />
        {/* ============================================================ */}
        {/* LOGISTICS SUBSYSTEM (Phase 2.5 — Complete Partner Workspace) */}
        {/* ============================================================ */}
        <Route path="/dashboard/logistics" element={<Navigate to="/logistics/dashboard" replace />} />
        <Route
          path="/logistics/dashboard"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <LogisticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/shipments"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <ShipmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/trips"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <TripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/vehicles"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <VehiclesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/routes"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <RoutesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/earnings"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <EarningsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/load-history"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <LoadHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/expenses"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/maintenance"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <MaintenancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/ratings"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <RatingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/messages"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <LogisticsMessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/notifications"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <LogisticsNotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/settings"
          element={
            <ProtectedRoute allowedRoles={['LOGISTICS']}>
              <LogisticsSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['BULK_BUYER']}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute allowedRoles={['CONSUMER']}>
              <ConsumerMarketplaceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/control-tower/dashboard"
          element={
            <ProtectedRoute allowedRoles={['CONTROL_ADMIN']}>
              <ControlTowerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Common User Profile & Settings */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['FARMER', 'FPO', 'LOGISTICS', 'BULK_BUYER', 'CONSUMER', 'ADMIN', 'CONTROL_ADMIN']}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Route Aliases & Redirects for UX consistency */}
        <Route path="/farmer/profile" element={<Navigate to="/profile" replace />} />
        <Route path="/farmer/settings" element={<Navigate to="/profile" replace />} />
        <Route path="/farmer/market" element={<Navigate to="/farmer/market-prices" replace />} />
        <Route path="/farmer/notifications" element={<Navigate to="/farmer/weather" replace />} />
        <Route path="/logistics/profile" element={<Navigate to="/logistics/settings" replace />} />

        {/* Dedicated 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
