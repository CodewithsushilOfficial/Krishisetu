/**
 * KrishiSetu Role-to-Dashboard Canonical Mapping
 */
export const ROLE_DASHBOARD_ROUTES = {
  FARMER: '/dashboard/farmer',
  FPO: '/fpo/dashboard',
  LOGISTICS: '/logistics/dashboard',
  BULK_BUYER: '/buyer/dashboard',
  CONSUMER: '/marketplace',
  ADMIN: '/admin/dashboard',
  CONTROL_ADMIN: '/control-tower/dashboard',
};

/**
 * Resolve canonical dashboard route for a given user role
 */
export function getDashboardRouteForRole(role) {
  return ROLE_DASHBOARD_ROUTES[role] || '/dashboard/farmer';
}

export default ROLE_DASHBOARD_ROUTES;
