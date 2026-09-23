import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/apiClient.js';
import DashboardHeader from '../../components/DashboardHeader.jsx';
import { ShoppingBag, TrendingUp, CreditCard, Sparkles, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';

export function BuyerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [demands, setDemands] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [profRes, demRes, ordRes] = await Promise.all([
          apiClient.get('/buyers/me'),
          apiClient.get('/buyers/me/demands'),
          apiClient.get('/buyers/me/orders'),
        ]);

        setProfile(profRes.data);
        setDemands(demRes.data || []);
        setOrders(ordRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch Bulk Buyer procurement data');
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
            Loading Enterprise Procurement Operations from Database...
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
          <h3 className="font-bold text-sm">Failed to Load Buyer Hub</h3>
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

  const totalSpent = orders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);
  const totalVolumeKg = orders.reduce((acc, o) => acc + Number(o.totalQuantity || o.quantityKg || 0), 0);
  const openDemands = demands.filter((d) => d.status === 'OPEN');

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <DashboardHeader
        title={profile?.companyName || 'Institutional Buyer'}
        subtitle={`Sector: ${profile?.businessType || 'Wholesale'} • GST: ${profile?.gstNumber || 'Verified'} • Credit: ${profile?.creditRating || 'AAA'}`}
        badgeText="Bulk Buyer Console"
        badgeColor="bg-amber-800 text-amber-100"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Procurement</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-stone-900">
                ₹{totalSpent.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-2 font-medium">Escrow settled contract payments</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Volume Procured</span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-700">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-stone-900">
                {(totalVolumeKg / 1000).toFixed(1)}
              </span>
              <span className="text-xs text-stone-500">MT ({totalVolumeKg.toLocaleString()} kg)</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-2 font-medium">Fulfilled from farmer producer lots</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Open Demands</span>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-stone-900">{openDemands.length}</span>
              <span className="text-xs text-stone-500">active RFQs</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-2 font-medium">Broadcasted across FPO collective pools</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Contracts</span>
              <div className="p-2 bg-purple-50 rounded-xl text-purple-700">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-stone-900">{orders.length}</span>
              <span className="text-xs text-stone-500">orders</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-2 font-medium">100% direct traceability to farmers</p>
          </div>
        </div>

        {/* Demands & Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sourcing Demands & Smart Matchings */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-stone-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" /> Sourcing Demands & Matchings
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Procurement requirements and AI matching status</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-stone-100 rounded-full text-stone-600">
                {demands.length} Demands
              </span>
            </div>
            <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
              {demands.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">No active demands posted.</div>
              ) : (
                demands.map((d) => {
                  const cropName = d.crop?.cropName || d.crop?.name || 'Crop Demand';
                  const reqQty = Number(d.requiredQuantity || d.requiredQtyKg || 0);
                  const tgtPrice = Number(d.targetPrice || d.targetPricePerKg || 0);
                  const topMatch = d.matchings?.[0];

                  return (
                    <div key={d.id} className="p-5 hover:bg-stone-50/80 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-stone-900">{cropName}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              {d.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">
                            Required: <span className="font-bold text-stone-800">{reqQty.toLocaleString()} kg</span> @ target ₹{tgtPrice}/kg
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                            {d.deliveryCity || d.frequency || 'ONE_TIME'}
                          </span>
                        </div>
                      </div>

                      {/* AI Matching Status */}
                      {topMatch && (
                        <div className="mt-3 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/60 text-xs">
                          <div className="flex items-center justify-between text-emerald-900 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                              AI Matched Lot: <span className="font-mono font-bold">{topMatch.lot?.lotNumber || topMatch.lot?.id}</span>
                            </span>
                            <span className="font-extrabold text-emerald-700">
                              Score {Math.round((topMatch.matchScore || 0) * 100)}%
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-800 mt-1">
                            Status: {topMatch.matchStatus || topMatch.status} • Matched {Number(topMatch.matchedQuantity || topMatch.lot?.availableQtyKg || 0).toLocaleString()} kg
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Orders & Escrow Settlements */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-stone-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-700" /> Purchase Orders & Settlements
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Executed orders, payments and logistics dispatch</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-stone-100 rounded-full text-stone-600">
                {orders.length} Orders
              </span>
            </div>
            <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">No purchase orders found.</div>
              ) : (
                orders.map((o) => {
                  const cropName = o.crop?.cropName || o.crop?.name || 'Produce';
                  const orderId = o.orderNumber || o.id;
                  const qty = Number(o.totalQuantity || o.quantityKg || 0);
                  const payment = o.payment || o.payments?.[0];
                  const shipment = o.shipment || o.shipments?.[0];

                  return (
                    <div key={o.id} className="p-5 hover:bg-stone-50/80 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-stone-900">{orderId}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {o.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1">
                            {cropName} • {qty.toLocaleString()} kg @ ₹{Number(o.unitPrice || 0)}/kg
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-stone-900">₹{Number(o.totalAmount || 0).toLocaleString()}</p>
                          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                            {payment ? `Escrow ${payment.status}` : 'Pending Escrow'}
                          </p>
                        </div>
                      </div>

                      {/* Shipment dispatch tag */}
                      {shipment && (
                        <div className="mt-3 flex items-center justify-between text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg">
                          <span>Shipment: <span className="font-mono font-medium text-stone-800">{shipment.trackingNumber || shipment.id}</span></span>
                          <span className="text-blue-700 font-medium">{shipment.status}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
