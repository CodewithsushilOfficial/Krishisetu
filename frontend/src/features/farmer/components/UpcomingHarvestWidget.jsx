import React from 'react';
import { useNavigate } from 'react-router-dom';

export function UpcomingHarvestWidget({ harvests = [], onAddCrop }) {
  const navigate = useNavigate();
  const currentHarvests = Array.isArray(harvests) ? harvests : [];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs flex flex-col">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#107c41]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
            </svg>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Upcoming Harvest
            </h2>
          </div>

          <button
            onClick={() => {
              if (onAddCrop) onAddCrop();
              else navigate('/farmer/crops');
            }}
            className="text-xs font-semibold text-[#1d70b8] hover:text-[#0b4b80] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-xs min-w-[420px]">
            <thead>
              <tr className="border-b border-stone-100 text-[11px] font-semibold text-stone-400">
                <th className="pb-2.5 font-normal">Crop</th>
                <th className="pb-2.5 font-normal">Farm/Plot</th>
                <th className="pb-2.5 font-normal">Expected Date</th>
                <th className="pb-2.5 font-normal text-right pr-1">Est. Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100/80">
              {currentHarvests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-stone-400 italic">
                    No upcoming harvests scheduled.
                  </td>
                </tr>
              ) : (
                currentHarvests.slice(0, 3).map((h) => {
                const fallbackImg = `/assets/crops/${(h.cropName || 'potato').toLowerCase()}.svg`;
                return (
                  <tr key={h.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={h.cropImage || fallbackImg}
                          alt={h.cropName}
                          className="h-5 w-5 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/crops/potato.svg';
                          }}
                        />
                        <span className="font-semibold text-slate-800">
                          {h.cropName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 text-slate-600 font-medium">
                      {h.farmPlot}
                    </td>

                    <td className="py-3 text-slate-700 font-medium">
                      {h.expectedDate}
                    </td>

                    <td className="py-3 text-right pr-1 font-semibold text-slate-900">
                      {h.estimatedYield}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UpcomingHarvestWidget;
