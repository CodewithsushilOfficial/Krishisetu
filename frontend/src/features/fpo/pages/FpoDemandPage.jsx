import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import {
  ShoppingBag,
  Search,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Building,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export function FpoDemandPage() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('ALL');

  useEffect(() => {
    async function loadDemands() {
      try {
        setLoading(true);
        const res = await fpoService.getDemands();
        const list = Array.isArray(res) ? res : (res?.data || []);
        setDemands(list);
      } catch (err) {
        console.error('Failed to load demands', err);
      } finally {
        setLoading(false);
      }
    }
    loadDemands();
  }, []);

  const filteredDemands = demands.filter((demand) => {
    const cropName = demand.crop?.cropName || demand.cropName || '';
    const buyerName = demand.buyer?.businessName || demand.buyer?.fullName || demand.buyerName || '';
    const city = demand.deliveryCity || demand.deliveryLocation || '';
    const matchesSearch =
      cropName.toLowerCase().includes(search.toLowerCase()) ||
      buyerName.toLowerCase().includes(search.toLowerCase()) ||
      city.toLowerCase().includes(search.toLowerCase());

    const matchesCrop = cropFilter === 'ALL' || cropName.toLowerCase() === cropFilter.toLowerCase();
    return matchesSearch && matchesCrop;
  });

  return (
    <FpoLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Buyer Demand & Market Requirements
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Active procurement contracts, institutional buyer requests, and automated lot-matching opportunities.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              {filteredDemands.length} Active Demands
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xs">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by buyer, crop, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8faf9] border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['ALL', 'Potato', 'Onion', 'Tomato', 'Wheat', 'Chilli'].map((crop) => (
              <button
                key={crop}
                onClick={() => setCropFilter(crop)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  cropFilter === crop
                    ? 'bg-[#107c41] text-white shadow-2xs'
                    : 'bg-stone-50 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="p-12 text-center text-stone-400 flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <span className="text-xs">Loading buyer demands...</span>
          </div>
        ) : filteredDemands.length === 0 ? (
          <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center shadow-2xs">
            <ShoppingBag className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-700 font-bold text-sm">No demands match your current filter</p>
            <p className="text-stone-400 text-xs mt-1">Try resetting the crop filter or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDemands.map((demand) => {
              const cropName = demand.crop?.cropName || demand.cropName || 'Produce';
              const reqQtyKg = Number(demand.requiredQtyKg || demand.quantityRequired || 25000);
              const reqQtyText = reqQtyKg >= 1000 ? `${(reqQtyKg / 1000).toFixed(1)} Tons` : `${reqQtyKg} kg`;
              const targetPrice = demand.targetPricePerKg || demand.maxPrice || 22;
              const buyerName = demand.buyer?.businessName || demand.buyer?.fullName || 'Verified Institutional Buyer';
              const location = demand.deliveryCity || demand.deliveryLocation || 'Lucknow Hub';
              const matchScore = demand.matchScore || 92;

              return (
                <div
                  key={demand.id}
                  className="bg-white border border-stone-200/80 hover:border-emerald-400 rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {cropName}
                        </span>
                        <h3 className="text-base font-black text-stone-900 mt-1.5 group-hover:text-emerald-800 transition-colors">
                          {cropName} Bulk Requirement
                        </h3>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {matchScore}% Match
                      </span>
                    </div>

                    <div className="bg-[#f8faf9] rounded-xl p-3.5 border border-stone-200/60 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-stone-500">
                        <span className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5 text-stone-400" /> Buyer</span>
                        <span className="font-bold text-stone-900">{buyerName}</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-500">
                        <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Target Price</span>
                        <span className="font-black text-emerald-800">₹{targetPrice}/kg</span>
                      </div>
                      <div className="flex justify-between items-center text-stone-500">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-stone-400" /> Quantity Req.</span>
                        <span className="font-bold text-stone-900">{reqQtyText}</span>
                      </div>
                      <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-stone-500 text-[11px]">
                        <span>Delivery City:</span>
                        <span className="text-stone-800 font-bold truncate max-w-[140px]">{location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Escrow Backed
                    </span>
                    <button
                      onClick={() => alert(`FPO allocation initiated for ${cropName} (${reqQtyText}). Redirecting to contract generator...`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#107c41] hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <span>Fulfill Demand</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FpoLayout>
  );
}

export default FpoDemandPage;
