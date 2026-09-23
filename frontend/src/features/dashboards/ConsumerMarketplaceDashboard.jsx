import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/apiClient.js';
import DashboardHeader from '../../components/DashboardHeader.jsx';
import { ShoppingCart, Sprout, MapPin, CheckCircle2, AlertCircle, Sparkles, Filter } from 'lucide-react';

export function ConsumerMarketplaceDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crops, setCrops] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cropsRes, invRes] = await Promise.all([
          apiClient.get('/marketplace/crops'),
          apiClient.get('/marketplace/inventory'),
        ]);

        setCrops(cropsRes.data || []);
        setInventory(invRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch marketplace data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-stone-600">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Connecting to Fresh Farm Direct Marketplace...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <h3 className="font-bold text-sm">Failed to Load Marketplace</h3>
          <p className="text-xs mt-1 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const filteredLots = selectedCrop === 'ALL'
    ? inventory
    : inventory.filter((item) => {
        const cName = item.crop?.cropName || item.crop?.name || '';
        return cName.toUpperCase() === selectedCrop.toUpperCase();
      });

  const totalKgAvailable = inventory.reduce((acc, curr) => {
    const qty = Number(curr.availableQtyKg ?? curr.availableQuantity ?? 0);
    return acc + qty;
  }, 0);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <DashboardHeader
        title="KrishiSetu Fresh Direct Marketplace"
        subtitle="100% Farm-Traceable Harvests • Direct Farmer-to-Consumer Procurement"
        badgeText="Consumer Marketplace"
        badgeColor="bg-emerald-700 text-emerald-100"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Marketplace Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-stone-900 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" /> Fair Price Guarantee
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-3">
              Direct from Kisan to Your Doorstep
            </h2>
            <p className="text-sm text-stone-300 mt-2">
              Every lot is verified on-chain and in-person by certified FPO agricultural supervisors. Zero middlemen commissions.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-xs text-stone-200">
              <div>
                <span className="text-xl font-bold text-white block">{inventory.length}</span>
                <span>Active Farm Lots</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white block">{(totalKgAvailable / 1000).toFixed(1)} MT</span>
                <span>Available Harvest</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white block">{crops.length || 3} Core</span>
                <span>Essential Commodities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Crops Filter Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-700" /> Filter by Harvest Commodity
            </h3>
            <span className="text-xs text-stone-500">Showing {filteredLots.length} available lots</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedCrop('ALL')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedCrop === 'ALL'
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-500'
              }`}
            >
              <span className="text-2xl block mb-1">🧺</span>
              <p className="font-bold text-sm">All Produce</p>
              <p className={`text-xs mt-0.5 ${selectedCrop === 'ALL' ? 'text-emerald-200' : 'text-stone-500'}`}>
                {inventory.length} lots
              </p>
            </button>

            {crops.map((crop) => {
              const cName = crop.cropName || crop.name || 'Crop';
              const isSelected = selectedCrop.toUpperCase() === cName.toUpperCase();
              const cropImg = crop.imageUrl || `/assets/crops/${cName.toLowerCase()}.svg`;

              return (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(cName)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-500'
                  }`}
                >
                  <div className="h-12 w-12 rounded-xl bg-stone-100 p-2 shrink-0 flex items-center justify-center">
                    <img
                      src={cropImg}
                      alt={cName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{cName}</p>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>
                      {crop.category || 'Produce'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Available Lots Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-700" /> Available Verified Harvest Batches
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLots.map((lot) => {
              const cName = lot.crop?.cropName || lot.crop?.name || 'Crop';
              const cropImg = lot.crop?.imageUrl || `/assets/crops/${cName.toLowerCase()}.svg`;
              const qty = Number(lot.availableQtyKg ?? lot.availableQuantity ?? 0);
              const price = Number(lot.askingPricePerKg ?? lot.basePricePerUnit ?? 25);
              const grade = lot.produce?.grade || lot.grade || 'A';
              const farmerName = lot.farmer?.user?.fullName || 'Verified Farmer';

              return (
                <div
                  key={lot.id}
                  className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-stone-50 p-2.5 border border-stone-100 shrink-0 flex items-center justify-center">
                        <img src={cropImg} alt={cName} className="h-full w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-base text-stone-900 truncate">{cName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Grade {grade}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-stone-400" />
                          {lot.farmer?.village ? `${lot.farmer.village}, ` : ''}{lot.farmer?.district || lot.warehouseLocation || 'India'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-stone-400 block font-medium">Direct Farm Price</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-stone-900">₹{price}</span>
                          <span className="text-xs text-stone-500 font-medium">/ kg</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-stone-400 block font-medium">Available</span>
                        <span className="text-sm font-bold text-emerald-700">
                          {qty.toLocaleString()} kg
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 rounded-xl bg-stone-50 text-[11px] text-stone-600 flex items-center justify-between">
                      <span>Batch: <span className="font-mono font-semibold text-stone-800">{lot.lotNumber || lot.id}</span></span>
                      <span>Kisan: <span className="font-semibold text-stone-800">{farmerName}</span></span>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50/60 border-t border-stone-100">
                    <button className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors">
                      <ShoppingCart className="h-3.5 w-3.5" /> Direct Procure Batch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
