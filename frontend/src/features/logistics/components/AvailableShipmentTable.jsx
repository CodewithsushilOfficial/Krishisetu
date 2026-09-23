import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, ArrowRight, Calendar, MapPin } from 'lucide-react';

const CROP_IMAGES = {
  tomato: '/assets/crops/tomato.svg',
  onion: '/assets/crops/onion.svg',
  potato: '/assets/crops/potato.svg',
  wheat: '/assets/crops/wheat.svg',
};

export function AvailableShipmentTable({ shipments = [], onAccept = null, onRefresh = null }) {
  // Demo fallback matching the screenshot
  const displayShipments = shipments.length > 0 ? shipments : [
    {
      id: 'LS001',
      loadId: 'LS001',
      cropName: 'Tomato',
      origin: 'Varanasi',
      destination: 'Lucknow',
      distanceKm: 320,
      quantityKg: 6000,
      pickupDate: '7 Sept',
      payoutAmount: 18000,
    },
    {
      id: 'LS002',
      loadId: 'LS002',
      cropName: 'Onion',
      origin: 'Prayagraj',
      destination: 'Kanpur',
      distanceKm: 210,
      quantityKg: 5000,
      pickupDate: '8 Sept',
      payoutAmount: 12500,
    },
    {
      id: 'LS003',
      loadId: 'LS003',
      cropName: 'Potato',
      origin: 'Jaunpur',
      destination: 'Lucknow',
      distanceKm: 280,
      quantityKg: 8000,
      pickupDate: '8 Sept',
      payoutAmount: 16800,
    },
    {
      id: 'LS004',
      loadId: 'LS004',
      cropName: 'Wheat',
      origin: 'Varanasi',
      destination: 'Indore',
      distanceKm: 820,
      quantityKg: 15000,
      pickupDate: '9 Sept',
      payoutAmount: 45000,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#0e5c36] flex items-center justify-center">
            <Truck className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Available Shipments</h3>
        </div>

        <NavLink
          to="/logistics/shipments"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          View All
        </NavLink>
      </div>

      {/* Mobile Card View (< md: 320px to 767px) */}
      <div className="block md:hidden divide-y divide-stone-100 mt-2">
        {displayShipments.map((s) => {
          const crop = s.cropName || s.product || 'Produce';
          const cropKey = crop.toLowerCase();
          const cropImg = CROP_IMAGES[cropKey] || '/assets/crops/tomato.svg';
          const fromLoc = s.originDistrict || s.origin || s.from || 'Origin';
          const toLoc = s.destinationCity || s.destination || s.to || 'Destination';
          const dist = s.distanceKm || 200;
          const qtyTon = s.quantityKg ? (s.quantityKg >= 1000 ? `${s.quantityKg / 1000} Ton` : `${s.quantityKg} kg`) : '5 Ton';
          const earnings = Number(s.payoutAmount || s.estimatedCost || 15000);
          const pickupDate = s.pickupDate || '7 Sept';

          return (
            <div key={s.id} className="py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={cropImg} alt={crop} className="w-5 h-5 object-contain" />
                  <span className="font-bold text-stone-900 text-xs">{crop}</span>
                  <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                    {s.loadId || s.id}
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-800">
                  ₹{earnings.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                <span className="truncate">{fromLoc}</span>
                <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="truncate">{toLoc}</span>
                <span className="text-[11px] text-stone-400">({dist} km)</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span>{qtyTon}</span>
                  <span>•</span>
                  <span>{pickupDate}</span>
                </div>
                <button
                  onClick={() => onAccept && onAccept(s)}
                  className="px-3 py-1 rounded-lg bg-[#0e5c36] hover:bg-[#0a4628] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop/Tablet Table view (md and up) */}
      <div className="hidden md:block overflow-x-auto mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              <th className="py-2.5 px-2">Load ID</th>
              <th className="py-2.5 px-2">Product</th>
              <th className="py-2.5 px-2">From</th>
              <th className="py-2.5 px-2">To</th>
              <th className="py-2.5 px-2">Distance</th>
              <th className="py-2.5 px-2">Quantity</th>
              <th className="py-2.5 px-2">Pickup Date</th>
              <th className="py-2.5 px-2">Earnings</th>
              <th className="py-2.5 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {displayShipments.map((s) => {
              const crop = s.cropName || s.product || 'Produce';
              const cropKey = crop.toLowerCase();
              const cropImg = CROP_IMAGES[cropKey] || '/assets/crops/tomato.svg';
              const fromLoc = s.originDistrict || s.origin || s.from || 'Origin';
              const toLoc = s.destinationCity || s.destination || s.to || 'Destination';
              const dist = s.distanceKm || 200;
              const qtyTon = s.quantityKg ? (s.quantityKg >= 1000 ? `${s.quantityKg / 1000} Ton` : `${s.quantityKg} kg`) : '5 Ton';
              const earnings = Number(s.payoutAmount || s.estimatedCost || 15000);
              const pickupDate = s.pickupDate || '7 Sept';

              return (
                <tr key={s.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-stone-700">
                    {s.loadId || s.id}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={cropImg}
                        alt={crop}
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span className="font-semibold text-stone-900">{crop}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-stone-600 font-medium">{fromLoc}</td>
                  <td className="py-3 px-2 text-stone-600 font-medium">{toLoc}</td>
                  <td className="py-3 px-2 text-stone-600">{dist} km</td>
                  <td className="py-3 px-2 text-stone-600 font-medium">{qtyTon}</td>
                  <td className="py-3 px-2 text-stone-500">{pickupDate}</td>
                  <td className="py-3 px-2 font-black text-stone-900">
                    ₹ {earnings.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => onAccept && onAccept(s)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0e5c36] hover:bg-[#0a4628] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AvailableShipmentTable;
