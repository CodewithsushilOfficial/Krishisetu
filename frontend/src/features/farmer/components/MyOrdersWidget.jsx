import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from './OrderDetailsModal.jsx';

export function MyOrdersWidget({ orders = [] }) {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const currentOrders = Array.isArray(orders) ? orders : [];

  const renderStatus = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'IN_TRANSIT') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e8f3ff] text-[#1971c2]">
          <span className="h-1.5 w-1.5 rotate-45 bg-[#1971c2]" />
          In Transit
        </span>
      );
    }
    if (s === 'DELIVERED' || s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f8ed] text-[#138808]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#138808]" />
          Delivered
        </span>
      );
    }
    if (s === 'CONFIRMED' || s === 'PICKUP_REQUESTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff8e6] text-[#b07800]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b07800]" />
          Confirmed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ffebee] text-[#d32f2f]">
        <span className="h-1.5 w-1.5 rotate-45 bg-[#d32f2f]" />
        Pending
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs flex flex-col">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#107c41]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                My Orders
              </h2>
            </div>

            <button
              onClick={() => navigate('/farmer/orders')}
              className="text-xs font-semibold text-[#1d70b8] hover:text-[#0b4b80] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Compact Table */}
          <div className="overflow-x-auto custom-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs min-w-[480px]">
              <thead>
                <tr className="border-b border-stone-100 text-[11px] font-semibold text-stone-400">
                  <th className="pb-2.5 font-normal">Order ID</th>
                  <th className="pb-2.5 font-normal">Buyer</th>
                  <th className="pb-2.5 font-normal">Crop</th>
                  <th className="pb-2.5 font-normal">Quantity</th>
                  <th className="pb-2.5 font-normal text-right pr-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100/80">
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400 italic">
                      No orders received yet.
                    </td>
                  </tr>
                ) : (
                  currentOrders.slice(0, 4).map((o) => {
                    const buyerName = o.buyer?.companyName || o.buyer?.businessName || (typeof o.buyer === 'string' ? o.buyer : 'Bulk Buyer');
                    const cropName = o.crop?.cropName || o.crop?.name || (typeof o.crop === 'string' ? o.crop : 'Produce');
                    const qtyDisplay = o.quantityDisplay || `${Number(o.quantityKg || 0).toLocaleString('en-IN')} kg`;

                    return (
                      <tr
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className="hover:bg-stone-50/70 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 font-semibold text-slate-900">
                          {o.id}
                        </td>
                        <td className="py-2.5 text-slate-700 font-medium">
                          {buyerName}
                        </td>
                        <td className="py-2.5 text-slate-800 font-medium">
                          {cropName}
                        </td>
                        <td className="py-2.5 text-slate-700 font-medium">
                          {qtyDisplay}
                        </td>
                        <td className="py-2.5 text-right pr-1">
                          {renderStatus(o.status)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}

export default MyOrdersWidget;
