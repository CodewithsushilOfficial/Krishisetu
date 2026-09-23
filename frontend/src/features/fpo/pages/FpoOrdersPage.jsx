import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  DollarSign,
  Eye,
  X,
  ChevronRight,
  Filter,
} from 'lucide-react';

export function FpoOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fpoService.getOrders();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setOrders(list);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      await fpoService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const buyerName = o.buyer?.businessName || o.buyer?.fullName || o.buyerName || '';
    const cropName = o.crop?.cropName || o.cropName || '';
    const orderNum = o.id || o.orderNumber || '';
    const matchesSearch =
      buyerName.toLowerCase().includes(search.toLowerCase()) ||
      cropName.toLowerCase().includes(search.toLowerCase()) ||
      orderNum.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Confirmed
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="h-3 w-3" /> In Transit
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  return (
    <FpoLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Orders & Institutional Contracts
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Track bulk buyer contracts, escrow releases, fulfillment stages, and logistics dispatches.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              {filteredOrders.length} Total Contracts
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xs">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search contract number, buyer, crop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8faf9] border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['ALL', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#107c41] text-white shadow-2xs'
                    : 'bg-stone-50 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs">
          {loading ? (
            <div className="p-12 text-center text-stone-400 flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              <span className="text-xs">Loading contracts...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-xs">
              <p>No orders found matching criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#f8faf9] text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200/80">
                  <tr>
                    <th className="py-3 px-4">Contract #</th>
                    <th className="py-3 px-4">Buyer Organization</th>
                    <th className="py-3 px-4">Crop & Qty</th>
                    <th className="py-3 px-4">Total Value</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Order Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((order) => {
                    const buyerName = order.buyer?.businessName || order.buyer?.fullName || order.buyerName || 'Enterprise Partner';
                    const crop = order.crop?.cropName || order.cropName || 'Produce';
                    const qtyKg = Number(order.quantityKg || order.quantity || 20000);
                    const qtyText = qtyKg >= 1000 ? `${(qtyKg / 1000).toFixed(1)} Ton` : `${qtyKg} kg`;
                    const amount = order.totalAmount ? `₹${Number(order.totalAmount).toLocaleString('en-IN')}` : '₹4,50,000';
                    const dateStr = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : '22 Sep 2026';

                    return (
                      <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-stone-900">
                          {order.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{buyerName}</div>
                          <div className="text-[10px] text-stone-500">{order.buyer?.district || 'Wholesale Partner'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{crop}</div>
                          <div className="text-[10px] text-stone-500">{qtyText}</div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-800">
                          {amount}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500 font-medium">
                          {dateStr}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-stone-50 hover:bg-emerald-50 border border-stone-200 text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Order Details */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-700" />
                  Contract {selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-[#f8faf9] p-3.5 rounded-xl border border-stone-200/60">
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Buyer</span>
                    <span className="font-bold text-stone-900">
                      {selectedOrder.buyer?.businessName || selectedOrder.buyer?.fullName || 'Institutional Buyer'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Total Amount</span>
                    <span className="font-black text-emerald-800">
                      ₹{Number(selectedOrder.totalAmount || 450000).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Crop</span>
                    <span className="font-bold text-stone-900">
                      {selectedOrder.crop?.cropName || selectedOrder.cropName || 'A-Grade'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Current Status</span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-2">Update Fulfillment Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['CONFIRMED', 'IN_TRANSIT', 'DELIVERED'].map((st) => (
                      <button
                        key={st}
                        disabled={updating || selectedOrder.status === st}
                        onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedOrder.status === st
                            ? 'bg-[#107c41] border-[#107c41] text-white shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-500 hover:bg-emerald-50'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-stone-100">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FpoLayout>
  );
}

export default FpoOrdersPage;
