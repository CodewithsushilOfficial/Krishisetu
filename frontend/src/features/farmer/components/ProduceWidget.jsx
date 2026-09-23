import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export function ProduceWidget({ produce = [], onOpenAddModal, onViewProduce }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');

  const currentList = Array.isArray(produce) ? produce : [];

  const allCount = currentList.length;
  const availableCount = currentList.filter(
    (p) => (p.status || 'AVAILABLE').toUpperCase() === 'AVAILABLE'
  ).length;
  const reservedCount = currentList.filter(
    (p) => (p.status || '').toUpperCase() === 'RESERVED'
  ).length;
  const soldCount = currentList.filter(
    (p) => (p.status || '').toUpperCase() === 'SOLD'
  ).length;

  const filteredProduce = currentList.filter((item) => {
    if (activeTab === 'ALL') return true;
    return (item.status || 'AVAILABLE').toUpperCase() === activeTab;
  });

  const renderStatus = (status) => {
    const s = (status || 'AVAILABLE').toUpperCase();
    if (s === 'AVAILABLE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f8ed] text-[#138808]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#138808]" />
          Available
        </span>
      );
    }
    if (s === 'RESERVED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff3e6] text-[#d97706]">
          <span className="h-1.5 w-1.5 rotate-45 bg-[#d97706]" />
          Reserved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f0f2f5] text-[#5e6977]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#5e6977]" />
        Sold
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs flex flex-col">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#107c41] fill-current" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
            </svg>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              My Produce
            </h2>
          </div>

          <button
            onClick={onOpenAddModal || (() => navigate('/farmer/produce?action=create'))}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#107c41] hover:bg-[#0c6233] text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Add New Produce</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-2 mb-3 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-[#107c41] text-white font-bold'
                : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({allCount})
          </button>
          <button
            onClick={() => setActiveTab('AVAILABLE')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeTab === 'AVAILABLE'
                ? 'bg-[#107c41] text-white font-bold'
                : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            onClick={() => setActiveTab('RESERVED')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeTab === 'RESERVED'
                ? 'bg-[#107c41] text-white font-bold'
                : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Reserved ({reservedCount})
          </button>
          <button
            onClick={() => setActiveTab('SOLD')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeTab === 'SOLD'
                ? 'bg-[#107c41] text-white font-bold'
                : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Sold ({soldCount})
          </button>
        </div>

        {/* Produce Table */}
        <div className="overflow-x-auto custom-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-xs min-w-[540px]">
            <thead>
              <tr className="border-b border-stone-100 text-[11px] font-semibold text-stone-400">
                <th className="pb-2.5 font-normal">Crop</th>
                <th className="pb-2.5 font-normal">Quantity</th>
                <th className="pb-2.5 font-normal">Grade</th>
                <th className="pb-2.5 font-normal">Expected Price</th>
                <th className="pb-2.5 font-normal">Status</th>
                <th className="pb-2.5 font-normal text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100/80">
              {filteredProduce.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400 italic">
                    No produce available in this category.
                  </td>
                </tr>
              ) : (
                filteredProduce.map((p) => {
                  const fallbackImg = `/assets/crops/${(p.cropName || 'potato').toLowerCase()}.svg`;
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Crop */}
                      <td className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.cropImage || fallbackImg}
                            alt={p.cropName}
                            className="h-6 w-6 object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/crops/potato.svg';
                            }}
                          />
                          <span className="font-semibold text-slate-800">
                            {p.cropName}
                          </span>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="py-2.5 font-medium text-slate-700">
                        {Number(p.quantityKg || 0).toLocaleString('en-IN')} kg
                      </td>

                      {/* Grade */}
                      <td className="py-2.5 font-medium text-slate-700">
                        {p.grade || 'A'}
                      </td>

                      {/* Expected Price */}
                      <td className="py-2.5 font-semibold text-slate-900">
                        ₹ {p.expectedPricePerKg || 24}/kg
                      </td>

                      {/* Status */}
                      <td className="py-2.5">
                        {renderStatus(p.status)}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 text-right pr-1">
                        <button
                          onClick={() => (onViewProduce ? onViewProduce(p) : navigate('/farmer/produce'))}
                          className="text-xs font-semibold text-[#1d70b8] hover:text-[#0b4b80] hover:underline cursor-pointer"
                        >
                          View
                        </button>
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
  );
}

export default ProduceWidget;
