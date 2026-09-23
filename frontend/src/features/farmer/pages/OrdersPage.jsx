import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { useFarmerOrders } from '../hooks/useFarmerData.js';
import OrderDetailsModal from '../components/OrderDetailsModal.jsx';
import { FileText, Search, Truck, CheckCircle2, Clock, AlertCircle, Eye } from 'lucide-react';

export function OrdersPage() {
  const { orderId } = useParams();

  useEffect(() => {
    document.title = 'My Orders | KrishiSetu';
  }, []);

  const [activeStatus, setActiveStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useFarmerOrders({
    status: activeStatus !== 'ALL' ? activeStatus : undefined,
    search: searchQuery || undefined,
  });

  const orders = ordersData?.items || (Array.isArray(ordersData) ? ordersData : []);

  // Auto open order if route has :orderId
  useEffect(() => {
    if (orderId && orders.length > 0) {
      const match = orders.find((o) => o.id === orderId);
      if (match) setSelectedOrder(match);
    }
  }, [orderId, orders]);

  const getStatusPill = (status) => {
    switch (status) {
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e8f3ff] text-[#1971c2]">
            <span className="h-1.5 w-1.5 rotate-45 bg-[#1971c2]" />
            <span>In Transit</span>
          </span>
        );
      case 'DELIVERED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f8ed] text-[#138808]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#138808]" />
            <span>Delivered</span>
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff8e6] text-[#b07800]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b07800]" />
            <span>Confirmed</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ffebee] text-[#d32f2f]">
            <span className="h-1.5 w-1.5 rotate-45 bg-[#d32f2f]" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <DashboardLayout title="My Orders" subtitle="Track buyer purchases, freight logistics telemetry, and pickup verification" fullWidth={true}>
      {/* Metric & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Commercial Orders & Shipments</h1>
            <p className="text-xs text-stone-500 font-medium">
              {orders.length} Order(s) logged across wholesale and institutional supply
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search Order ID, crop, or buyer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200/80 rounded-full pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold scrollbar-none">
        {['ALL', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'PENDING'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveStatus(tab)}
            className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
              activeStatus === tab
                ? 'bg-[#107c41] text-white font-bold shadow-2xs'
                : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.replace('_', ' ').charAt(0) + tab.replace('_', ' ').slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-stone-100 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center max-w-lg mx-auto">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <h3 className="font-bold text-sm">Failed to Load Orders</h3>
          <p className="text-xs text-red-600 mt-1">{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/80 shadow-2xs max-w-md mx-auto my-8">
          <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-700 mx-auto mb-4">
            <FileText className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-black text-slate-900">No orders yet</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {searchQuery || activeStatus !== 'ALL'
              ? 'No orders match your current filters.'
              : 'When buyers purchase your listed produce or accept quotation offers, they appear here.'}
          </p>
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-500">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Buyer / Destination</th>
                  <th className="py-3 px-4">Produce & Qty</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">Logistics / Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900">{o.id}</span>
                      <div className="text-[10px] text-stone-400">
                        {new Date(o.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{o.buyer}</div>
                      <div className="text-[11px] text-stone-400">{o.buyerDistrict || 'Hub'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img src={o.cropImage} alt={o.crop} className="h-5 w-5 object-contain" />
                        <span className="font-semibold text-slate-900">{o.crop}</span>
                        <span className="text-stone-400">({o.quantityDisplay})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-black text-[#107c41]">₹ {o.totalAmount?.toLocaleString('en-IN')}</span>
                      <div className="text-[10px] text-stone-400">₹{o.unitPrice}/kg</div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusPill(o.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </DashboardLayout>
  );
}

export default OrdersPage;
