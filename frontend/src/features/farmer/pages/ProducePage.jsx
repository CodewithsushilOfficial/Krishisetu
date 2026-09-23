import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { useFarmerProduce, useDeleteProduce } from '../hooks/useFarmerData.js';
import AddProduceModal from '../components/AddProduceModal.jsx';
import { Package, Plus, Search, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ProducePage() {
  useEffect(() => {
    document.title = 'My Produce | KrishiSetu';
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Auto-open add modal if query param ?action=create is present
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setIsAddModalOpen(true);
      // clean up URL
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const {
    data: produceData,
    isLoading,
    error,
    refetch,
  } = useFarmerProduce({ status: activeTab !== 'ALL' ? activeTab : undefined, search: searchQuery || undefined });

  const deleteProduceMutation = useDeleteProduce();
  const produceList = produceData?.items || (Array.isArray(produceData) ? produceData : []);

  const handleDelete = async (id, cropName) => {
    if (window.confirm(`Are you sure you want to remove listing for ${cropName}?`)) {
      await deleteProduceMutation.mutateAsync(id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f8ed] text-[#138808]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#138808]" />
            <span>Available</span>
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff3e6] text-[#d97706]">
            <span className="h-1.5 w-1.5 rotate-45 bg-[#d97706]" />
            <span>Reserved</span>
          </span>
        );
      case 'SOLD':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f0f2f5] text-[#5e6977]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5e6977]" />
            <span>Sold</span>
          </span>
        );
    }
  };

  return (
    <DashboardLayout title="My Produce" subtitle="Manage your harvested crop inventory, lots, and market listings" fullWidth={true}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-[#107c41] flex items-center justify-center shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Produce Inventory Listings</h1>
            <p className="text-xs text-stone-500 font-medium">
              {produceList.length} Active Listing(s) on KrishiSetu Direct Marketplace
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#107c41] hover:bg-[#0c6233] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add New Produce</span>
        </button>
      </div>

      {/* Filter Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold scrollbar-none">
          {['ALL', 'AVAILABLE', 'RESERVED', 'SOLD'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#107c41] text-white font-bold shadow-2xs'
                  : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search crop or grade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200/80 rounded-full pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600"
          />
        </div>
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
          <h3 className="font-bold text-sm">Failed to Load Produce Listings</h3>
          <p className="text-xs text-red-600 mt-1">{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && produceList.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/80 shadow-2xs max-w-md mx-auto my-8">
          <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#107c41] mx-auto mb-4">
            <Package className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-black text-slate-900">No produce listings found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {searchQuery || activeTab !== 'ALL'
              ? 'No produce matched your current filter criteria.'
              : 'Add your harvested produce to list it for verified institutional and retail buyers.'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[#107c41] hover:bg-[#0c6233] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>List Produce</span>
          </button>
        </div>
      )}

      {/* Produce Table */}
      {!isLoading && !error && produceList.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-semibold text-stone-500">
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Grade / Farm</th>
                  <th className="py-3 px-4">Available Quantity</th>
                  <th className="py-3 px-4">Target Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {produceList.map((p) => {
                  const qtyDisplay =
                    Number(p.quantityKg) >= 1000
                      ? `${(Number(p.quantityKg) / 1000).toFixed(1)} Ton`
                      : `${Number(p.quantityKg).toLocaleString('en-IN')} kg`;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-stone-50 border border-stone-200/60 p-1 flex items-center justify-center shrink-0">
                            <img src={p.cropImage} alt={p.cropName} className="h-full w-full object-contain" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{p.cropName}</div>
                            <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">Grade {p.grade}</span>
                        <div className="text-[11px] text-stone-400">{p.farmName}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {qtyDisplay}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-[#107c41]">₹ {p.expectedPricePerKg}</span>
                        <span className="text-[10px] text-stone-400 font-medium"> /kg</span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(p.id, p.cropName)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Produce Modal */}
      {isAddModalOpen && (
        <AddProduceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}

export default ProducePage;
