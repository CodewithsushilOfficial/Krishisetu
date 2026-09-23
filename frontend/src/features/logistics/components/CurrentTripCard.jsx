import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, MapPin, Eye } from 'lucide-react';

export function CurrentTripCard({ trip = null, onAdvanceTrip = null, onViewDetails = null }) {
  const tripData = trip || {
    tripCode: 'TR-KSF001',
    orderCode: '#KSF001',
    cropName: 'Potato',
    quantityTon: 8,
    fromLocation: 'Suryoday FPO (Varanasi)',
    toLocation: 'AgroMart (Lucknow)',
    vehicleNumber: 'UP65XX1234',
    driverName: 'Suresh Yadav',
    status: 'IN_TRANSIT',
  };

  const timeline = [
    {
      id: 1,
      title: 'Pickup Completed',
      location: 'Suryoday FPO, Varanasi',
      time: '08:30 AM, 6 Sept',
      status: 'COMPLETED',
    },
    {
      id: 2,
      title: 'En Route to Delivery',
      location: 'AgroMart, Lucknow',
      time: 'ETA: 02:30 PM',
      status: 'CURRENT',
    },
    {
      id: 3,
      title: 'Out for Delivery',
      location: 'AgroMart, Lucknow',
      time: '--',
      status: 'PENDING',
    },
    {
      id: 4,
      title: 'Delivered',
      location: '--',
      time: '--',
      status: 'PENDING',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-50 text-[#0e5c36] flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Current Trip</h3>
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0e5c36] border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            In Transit
          </span>
        </div>

        <button
          onClick={onViewDetails}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Details
        </button>
      </div>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4 flex-1">
        {/* Left Column: 4-Step Timeline (6 cols) */}
        <div className="sm:col-span-6 space-y-3.5 relative">
          {timeline.map((step, idx) => {
            const isLast = idx === timeline.length - 1;
            return (
              <div key={step.id} className="relative flex items-start gap-2.5">
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute left-[11px] top-5 bottom-0 w-0.5 -mb-3.5 ${
                      step.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-stone-200'
                    }`}
                  />
                )}

                {/* Status Dot / Icon */}
                <div className="relative z-10 shrink-0">
                  {step.status === 'COMPLETED' ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : step.status === 'CURRENT' ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-blue-100 shadow-2xs">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-stone-100 border-2 border-stone-300 text-stone-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                    </div>
                  )}
                </div>

                {/* Text Details */}
                <div className="text-xs leading-tight">
                  <p className={`font-bold ${step.status === 'COMPLETED' ? 'text-stone-900' : step.status === 'CURRENT' ? 'text-blue-900' : 'text-stone-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{step.location}</p>
                  {step.time && step.time !== '--' && (
                    <p className={`text-[10px] mt-0.5 font-bold ${step.status === 'CURRENT' ? 'text-blue-700' : 'text-stone-400'}`}>
                      {step.time}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Cargo Specs & Photo (6 cols) */}
        <div className="sm:col-span-6 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/80 flex flex-col justify-between">
          <div>
            {/* Cargo Image Photo */}
            <div className="w-full h-24 rounded-xl overflow-hidden bg-amber-50 border border-stone-200 mb-2">
              <img
                src="/assets/dashboard/potato_harvest.jpg"
                alt="Potato Consignment"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
              />
            </div>

            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Order {tripData.orderCode || '#KSF001'}
            </span>
            <h4 className="text-sm font-black text-stone-900 leading-tight mt-0.5">
              {tripData.cropName || 'Potato'} - {tripData.quantityTon || 8} Ton
            </h4>

            <div className="mt-2.5 space-y-1 text-[11px] text-stone-600">
              <div className="truncate"><strong className="text-stone-500">From:</strong> {tripData.fromLocation}</div>
              <div className="truncate"><strong className="text-stone-500">To:</strong> {tripData.toLocation}</div>
              <div className="truncate font-mono"><strong className="text-stone-500 font-sans">Vehicle:</strong> {tripData.vehicleNumber}</div>
              <div className="truncate"><strong className="text-stone-500">Driver:</strong> {tripData.driverName}</div>
            </div>
          </div>

          <button
            onClick={() => onAdvanceTrip && onAdvanceTrip(tripData)}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-[#0e5c36] hover:bg-[#0a4628] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View on Map</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CurrentTripCard;
