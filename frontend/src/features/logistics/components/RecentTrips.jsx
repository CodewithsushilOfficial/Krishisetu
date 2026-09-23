import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck } from 'lucide-react';

const CROP_IMAGES = {
  tomato: '/assets/crops/tomato.svg',
  onion: '/assets/crops/onion.svg',
  potato: '/assets/crops/potato.svg',
};

export function RecentTrips({ trips = [] }) {
  const displayTrips = trips.length > 0 ? trips : [
    {
      id: 'TR001',
      tripCode: 'TR001',
      cropName: 'Tomato',
      origin: 'Varanasi',
      destination: 'Lucknow',
      dateDisplay: '5 Sept',
      status: 'DELIVERED',
      earnings: 14800,
    },
    {
      id: 'TR002',
      tripCode: 'TR002',
      cropName: 'Onion',
      origin: 'Kanpur',
      destination: 'Delhi',
      dateDisplay: '3 Sept',
      status: 'DELIVERED',
      earnings: 28000,
    },
    {
      id: 'TR003',
      tripCode: 'TR003',
      cropName: 'Potato',
      origin: 'Varanasi',
      destination: 'Kanpur',
      dateDisplay: '1 Sept',
      status: 'COMPLETED',
      earnings: 16200,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-50 text-[#0e5c36] flex items-center justify-center">
            <Truck className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Recent Trips</h3>
        </div>

        <NavLink
          to="/logistics/load-history"
          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </NavLink>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              <th className="py-2.5 px-2">Trip ID</th>
              <th className="py-2.5 px-2">Product</th>
              <th className="py-2.5 px-2">From</th>
              <th className="py-2.5 px-2">To</th>
              <th className="py-2.5 px-2">Date</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 px-2 text-right">Earnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {displayTrips.map((t) => {
              const cropKey = (t.cropName || 'tomato').toLowerCase();
              const cropImg = CROP_IMAGES[cropKey] || '/assets/crops/tomato.svg';
              const isDelivered = t.status === 'DELIVERED';

              return (
                <tr key={t.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-stone-700">
                    {t.tripCode || t.id}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={cropImg}
                        alt={t.cropName}
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span className="font-semibold text-stone-900">{t.cropName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-stone-600 font-medium">{t.origin}</td>
                  <td className="py-3 px-2 text-stone-600 font-medium">{t.destination}</td>
                  <td className="py-3 px-2 text-stone-500">{t.dateDisplay}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isDelivered
                          ? 'bg-emerald-50 text-[#0e5c36] border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isDelivered ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}
                      />
                      {isDelivered ? 'Delivered' : 'Completed'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-black text-stone-900">
                    ₹ {Number(t.earnings).toLocaleString()}
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

export default RecentTrips;
