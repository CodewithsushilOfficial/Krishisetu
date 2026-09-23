import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/apiClient.js';
import DashboardHeader from '../../components/DashboardHeader.jsx';
import { ShieldCheck, Users, ShoppingBag, Truck, AlertTriangle, TrendingUp, DollarSign, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [ovRes, usrRes] = await Promise.all([
          apiClient.get('/admin/overview'),
          apiClient.get('/admin/users'),
        ]);

        setOverview(ovRes.data);
        setUsers(usrRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch Admin platform overview');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-stone-600">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Querying Global System Architecture & Telemetry...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <h3 className="font-bold text-sm">Failed to Load Admin Hub</h3>
          <p className="text-xs mt-1 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const counts = overview?.counts || overview?.metrics || {};

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <DashboardHeader
        title="KrishiSetu Platform Governance"
        subtitle="Full Platform Supervision • Multi-Tenant RBAC Security • System Topology"
        badgeText="Super Administrator"
        badgeColor="bg-red-900 text-red-100"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Core Global KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Platform GMV</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-stone-900">
                ₹{(overview?.totalRevenue || 0).toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-2 font-medium">Settled & in-escrow transactions</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Registered Users</span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-700">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-stone-900">{counts.users || 0}</span>
              <span className="text-xs text-stone-500">accounts</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-2 font-medium">Across all 7 platform stakeholder roles</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Orders & Logistics</span>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-stone-900">{counts.orders || 0}</span>
              <span className="text-xs text-stone-500">/ {counts.shipments || 0} shipments</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-2 font-medium">Live contract fulfillments</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">System Alerts</span>
              <div className="p-2 bg-red-50 rounded-xl text-red-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-stone-900">{counts.alerts || 0}</span>
              <span className="text-xs text-stone-500">active events</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-2 font-medium">Monitored by operational control tower</p>
          </div>
        </div>

        {/* Stakeholder Cohort Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-700" /> Stakeholder Population Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 text-center">
              <span className="text-2xl font-black text-stone-900 block">{counts.farmers || 0}</span>
              <span className="text-xs font-bold text-stone-500">Farmers</span>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 text-center">
              <span className="text-2xl font-black text-stone-900 block">{counts.fpos || 0}</span>
              <span className="text-xs font-bold text-stone-500">FPOs</span>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 text-center">
              <span className="text-2xl font-black text-stone-900 block">{counts.logistics || 0}</span>
              <span className="text-xs font-bold text-stone-500">Logistics</span>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 text-center">
              <span className="text-2xl font-black text-stone-900 block">{counts.buyers || 0}</span>
              <span className="text-xs font-bold text-stone-500">Bulk Buyers</span>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 text-center">
              <span className="text-2xl font-black text-stone-900 block">{counts.consumers || 0}</span>
              <span className="text-xs font-bold text-stone-500">Consumers</span>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 text-center">
              <span className="text-2xl font-black text-stone-900 block">{counts.farms || 0}</span>
              <span className="text-xs font-bold text-stone-500">Mapped Farms</span>
            </div>
          </div>
        </div>

        {/* User Directory and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Directory */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-stone-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-700" /> Platform User Directory
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Verified stakeholder accounts loaded from database</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-stone-100 rounded-full text-stone-600">
                {users.length} Records
              </span>
            </div>
            <div className="divide-y divide-stone-100 max-h-[480px] overflow-y-auto">
              {users.slice(0, 50).map((u) => (
                <div key={u.id} className="p-4 hover:bg-stone-50/80 transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-stone-900">{u.fullName || 'User'}</h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{u.email || u.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {u.status}
                    </span>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Stream */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-stone-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-emerald-700" /> Recent Marketplace Transactions
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Latest purchase contracts and settlement activity</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-stone-100 rounded-full text-stone-600">
                {overview?.recentOrders?.length || 0} Orders
              </span>
            </div>
            <div className="divide-y divide-stone-100 max-h-[480px] overflow-y-auto">
              {overview?.recentOrders?.map((ord) => (
                <div key={ord.id} className="p-4 hover:bg-stone-50/80 transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900">{ord.orderNumber}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        {ord.crop?.name}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Buyer: <span className="font-medium text-stone-700">{ord.buyer?.companyName || 'Institutional'}</span> • {ord.totalQuantity?.toLocaleString()} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-stone-900">₹{ord.totalAmount?.toLocaleString()}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
