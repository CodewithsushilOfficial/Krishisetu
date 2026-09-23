import React from 'react';
import {
  X,
  Package,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Scale,
} from 'lucide-react';

export function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const steps = [
    { title: 'Order Confirmed', completed: true },
    {
      title: 'Logistics Assigned',
      completed: ['CONFIRMED', 'PICKUP_REQUESTED', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(
        order.status
      ),
    },
    {
      title: 'Driver Arrived & OTP Verified',
      completed: ['IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(order.status),
    },
    {
      title: 'Digital Weighing Verified',
      completed: ['IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(order.status),
    },
    {
      title: 'In Transit',
      completed: ['IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(order.status),
    },
    {
      title: 'Delivered & Payment Settled',
      completed: ['DELIVERED', 'COMPLETED'].includes(order.status),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-stone-900">Order #{order.id}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800">
                  {order.status}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Buyer: {order.buyer}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Crop & Volume</span>
            <span className="text-sm font-black text-stone-900 mt-0.5 block">
              {order.crop} • {order.quantityDisplay || `${order.quantityKg} kg`}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Agreed Value</span>
            <span className="text-sm font-black text-emerald-700 mt-0.5 block">
              ₹{Number(order.totalAmount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Logistics Details */}
        <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-950 flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-sky-700" />
              <span>Logistics & Fleet Partner</span>
            </span>
            <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
              Verified Partner
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-sky-900">
            <div>
              <span className="text-sky-600 block text-[10px]">Partner Name</span>
              <span className="font-bold">{order.shipment?.logisticsPartner || 'Kashi Agri-Logistics'}</span>
            </div>
            <div>
              <span className="text-sky-600 block text-[10px]">Vehicle Assigned</span>
              <span className="font-mono font-bold">{order.shipment?.vehicleNumber || 'UP-65-BT-1024'}</span>
            </div>
            <div>
              <span className="text-sky-600 block text-[10px]">Assigned Driver</span>
              <span className="font-bold">{order.shipment?.driverName || 'Suresh Yadav'}</span>
            </div>
            <div>
              <span className="text-sky-600 block text-[10px]">Estimated Delivery</span>
              <span className="font-bold text-emerald-700">{order.shipment?.etaHours ? `${order.shipment.etaHours} hrs` : 'Delivered'}</span>
            </div>
          </div>

          {/* Secure Pickup OTP Display */}
          <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-bold text-stone-800">Driver Pickup OTP:</span>
            </div>
            <span className="font-mono text-sm font-black px-3 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 shadow-2xs">
              {order.shipment?.pickupOtp || '4829'}
            </span>
          </div>
        </div>

        {/* Interactive Logistics Timeline */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <h4 className="text-xs font-black text-stone-900 mb-3">Shipment Progress Timeline</h4>
          <div className="space-y-2.5">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                    step.completed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span
                  className={`text-xs ${
                    step.completed ? 'font-bold text-stone-900' : 'text-stone-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
