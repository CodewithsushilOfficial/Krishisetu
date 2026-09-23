import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { useFarmerCrops, useAddCrop, useFarmerHarvests } from '../hooks/useFarmerData.js';
import { Sprout, Plus, Calendar, Sparkles, CheckCircle2, X, AlertCircle } from 'lucide-react';

export function CropsPage() {
  useEffect(() => {
    document.title = 'My Crops | KrishiSetu';
  }, []);

  const { data: crops = [], isLoading, error, refetch } = useFarmerCrops();
  const { data: harvests = [] } = useFarmerHarvests();
  const addCropMutation = useAddCrop();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCropName, setSelectedCropName] = useState('');

  const cultivatedCrops = crops.filter((c) => c.isCultivated);
  const availableCrops = crops.filter((c) => !c.isCultivated);

  const handleAddCrop = async (e) => {
    e.preventDefault();
    if (!selectedCropName) return;
    await addCropMutation.mutateAsync({ cropName: selectedCropName });
    setIsAddModalOpen(false);
    setSelectedCropName('');
  };

  return (
    <DashboardLayout title="My Crops" subtitle="Cultivated agricultural varieties, active crop seasons, and harvest calendar" fullWidth={true}>
      {/* Header Metric Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-[#107c41] flex items-center justify-center shrink-0">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Crop Cultivation Portfolio</h1>
            <p className="text-xs text-stone-500 font-medium">
              {cultivatedCrops.length} Active Varieties • {crops.length} Platform Catalog Crops Available
            </p>
          </div>
        </div>

        {availableCrops.length > 0 && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#107c41] hover:bg-[#0c6233] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Cultivated Crop</span>
          </button>
        )}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-44 bg-stone-200/70 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center max-w-lg mx-auto">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <h3 className="font-bold text-sm">Failed to Load Crop Data</h3>
          <p className="text-xs text-red-600 mt-1">{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Cultivated Crops Grid */}
      {!isLoading && !error && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-stone-400 mb-3">
              Currently Cultivated On Your Land
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cultivatedCrops.map((crop) => (
                <div
                  key={crop.id}
                  className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-stone-50 border border-stone-200/80 p-2 flex items-center justify-center shrink-0">
                      <img src={crop.imageUrl} alt={crop.cropName} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{crop.cropName}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#107c41]">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {crop.category} • Season: {crop.season}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-stone-600">
                        <span>Acreage: <strong>{crop.activeAcreage} Acres</strong></span>
                        <span>Total Yield: <strong>{crop.totalHarvestedKg > 0 ? `${(crop.totalHarvestedKg / 1000).toFixed(1)} MT` : 'Seeded'}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Harvest Projections */}
          {harvests.length > 0 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-stone-400 mb-3">
                Upcoming Harvest Timetable
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {harvests.map((h) => (
                  <div key={h.id} className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-stone-50 border border-stone-200/60 p-1.5 flex items-center justify-center">
                        <img src={h.cropImage} alt={h.cropName} className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{h.cropName} ({h.farmPlot})</h4>
                        <div className="flex items-center gap-1 text-[11px] text-stone-500">
                          <Calendar className="h-3 w-3 text-stone-400" />
                          <span>Expected: {h.expectedDate}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#107c41] bg-emerald-50 px-2.5 py-1 rounded-full">
                      {h.estimatedYield}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Crop Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-black text-slate-900">Add Crop to Cultivation</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddCrop} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Crop</label>
                <select
                  value={selectedCropName}
                  onChange={(e) => setSelectedCropName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                  required
                >
                  <option value="">Choose a crop to add...</option>
                  {availableCrops.map((c) => (
                    <option key={c.id} value={c.cropName}>{c.cropName} ({c.category} - {c.season})</option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedCropName || addCropMutation.isPending}
                  className="px-4 py-1.5 rounded-xl bg-[#107c41] text-white font-bold hover:bg-[#0c6233] disabled:opacity-50"
                >
                  {addCropMutation.isPending ? 'Adding...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CropsPage;
