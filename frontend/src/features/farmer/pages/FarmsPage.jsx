import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { useFarmerFarms, useCreateFarm, useDeleteFarm } from '../hooks/useFarmerData.js';
import { Trees, Plus, MapPin, Droplets, Sparkles, Trash2, X, AlertCircle } from 'lucide-react';

export function FarmsPage() {
  useEffect(() => {
    document.title = 'My Farms | KrishiSetu';
  }, []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    areaAcres: '',
    soilType: 'Alluvial Soil',
    irrigationType: 'Drip Irrigation',
  });
  const [formError, setFormError] = useState('');

  const { data: farms = [], isLoading, error, refetch } = useFarmerFarms();
  const createFarmMutation = useCreateFarm();
  const deleteFarmMutation = useDeleteFarm();

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.farmName.trim() || !formData.areaAcres) {
      setFormError('Please provide farm name and area in acres.');
      return;
    }

    try {
      await createFarmMutation.mutateAsync({
        farmName: formData.farmName.trim(),
        areaAcres: parseFloat(formData.areaAcres),
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
      });
      setIsAddModalOpen(false);
      setFormData({
        farmName: '',
        areaAcres: '',
        soilType: 'Alluvial Soil',
        irrigationType: 'Drip Irrigation',
      });
    } catch (err) {
      setFormError(err.message || 'Failed to register farm');
    }
  };

  const handleDelete = async (farmId, farmName) => {
    if (window.confirm(`Are you sure you want to remove ${farmName}?`)) {
      await deleteFarmMutation.mutateAsync(farmId);
    }
  };

  const totalAcres = farms.reduce((acc, f) => acc + (Number(f.areaAcres) || 0), 0);

  return (
    <DashboardLayout title="My Farms" subtitle="Manage your registered agricultural land, soil records and irrigation plots" fullWidth={true}>
      {/* Header Actions & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-[#107c41] flex items-center justify-center shrink-0">
            <Trees className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Registered Farm Land</h1>
            <p className="text-xs text-stone-500 font-medium">
              {farms.length} Farm Plot(s) • {totalAcres.toFixed(1)} Total Acres under cultivation
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#107c41] hover:bg-[#0c6233] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add New Farm</span>
        </button>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-stone-200/70 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center max-w-lg mx-auto">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <h3 className="font-bold text-sm">Failed to Load Farm Records</h3>
          <p className="text-xs text-red-600 mt-1">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && farms.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/80 shadow-2xs max-w-md mx-auto my-8">
          <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#107c41] mx-auto mb-4">
            <Trees className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-black text-slate-900">No farms registered yet</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Add your first farm plot to begin listing seasonal produce and receiving microclimate advisories.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[#107c41] hover:bg-[#0c6233] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Farm Plot</span>
          </button>
        </div>
      )}

      {/* Farms Grid */}
      {!isLoading && !error && farms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-[#107c41]">
                      {farm.id}
                    </span>
                    <h2 className="text-base font-black text-slate-900 mt-1 truncate">{farm.farmName}</h2>
                  </div>
                  <button
                    onClick={() => handleDelete(farm.id, farm.farmName)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-50 transition-colors"
                    title="Remove farm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="py-4 space-y-2.5 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">Land Area:</span>
                    <span className="font-bold text-slate-900">{farm.areaAcres} Acres</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">Soil Profile:</span>
                    <span className="font-semibold text-slate-800">{farm.soilType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">Irrigation:</span>
                    <div className="flex items-center gap-1 text-sky-700 font-semibold">
                      <Droplets className="h-3.5 w-3.5 text-sky-500" />
                      <span>{farm.irrigationType}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">GPS Coordinates:</span>
                    <div className="flex items-center gap-1 text-stone-500 text-[11px]">
                      <MapPin className="h-3 w-3" />
                      <span>{farm.latitude?.toFixed(4)}, {farm.longitude?.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">Active Crops:</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
                  {farm.crops && farm.crops.length > 0 ? (
                    farm.crops.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-400 italic text-[11px]">No active lot</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Farm Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-100 text-[#107c41] flex items-center justify-center">
                  <Trees className="h-4 w-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">Register New Farm Plot</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="my-3 p-3 bg-red-50 text-red-700 border border-red-200 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateFarm} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Farm / Plot Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rohania North Field"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Land Area (in Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 3.5"
                  value={formData.areaAcres}
                  onChange={(e) => setFormData({ ...formData, areaAcres: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Soil Type</label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-none"
                >
                  <option value="Alluvial Soil">Alluvial Soil (Gangetic Plains)</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Red & Yellow Soil">Red & Yellow Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Clayey Loam">Clayey Loam</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Irrigation Setup</label>
                <select
                  value={formData.irrigationType}
                  onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-none"
                >
                  <option value="Drip Irrigation">Drip Irrigation</option>
                  <option value="Sprinkler System">Sprinkler System</option>
                  <option value="Canal / Flood">Canal / Surface Flood</option>
                  <option value="Tube Well / Borewell">Tube Well / Borewell</option>
                  <option value="Rainfed Only">Rainfed (Non-irrigated)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFarmMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#107c41] text-white font-bold hover:bg-[#0c6233] disabled:opacity-50"
                >
                  {createFarmMutation.isPending ? 'Saving...' : 'Register Farm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default FarmsPage;
