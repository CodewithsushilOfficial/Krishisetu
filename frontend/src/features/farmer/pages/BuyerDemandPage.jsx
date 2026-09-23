import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.jsx';
import { useFarmerBuyerDemand } from '../hooks/useFarmerData.js';
import { Users, Search, ShoppingBag, MapPin, Calendar, CheckCircle2, ArrowRight, X, AlertCircle } from 'lucide-react';

export function BuyerDemandPage() {
  useEffect(() => {
    document.title = 'Buyer Demand | KrishiSetu';
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [offerSuccess, setOfferSuccess] = useState(false);

  const {
    data: demandData,
    isLoading,
    error,
    refetch,
  } = useFarmerBuyerDemand({ search: searchQuery || undefined });

  const demands = demandData?.items || (Array.isArray(demandData) ? demandData : []);

  const handleSendOffer = (e) => {
    e.preventDefault();
    setOfferSuccess(true);
    setTimeout(() => {
      setOfferSuccess(false);
      setSelectedDemand(null);
    }, 2000);
  };

  return (
    <DashboardLayout title="Buyer Demand" subtitle="Direct procurement demand requests from verified bulk buyers, retailers and institutional procurers" fullWidth={true}>
      {/* Header Metric Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 text-[#1d4ed8] flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Active Procurement Demand</h1>
            <p className="text-xs text-stone-500 font-medium">
              Verified buyers seeking immediate and forward harvest supply contracts
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search crop, buyer, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200/80 rounded-full pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 bg-stone-200/70 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center max-w-lg mx-auto">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <h3 className="font-bold text-sm">Failed to Load Buyer Demands</h3>
          <p className="text-xs text-red-600 mt-1">{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && demands.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/80 shadow-2xs max-w-md mx-auto my-8">
          <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1d4ed8] mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-black text-slate-900">No relevant demand found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {searchQuery
              ? 'No buyers matching your query were found. Try another crop or city.'
              : 'New procurement demand pools are posted daily by wholesale buyers.'}
          </p>
        </div>
      )}

      {/* Demands Grid */}
      {!isLoading && !error && demands.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {demands.map((demand) => (
            <div
              key={demand.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-stone-50 border border-stone-200/60 p-1 flex items-center justify-center shrink-0">
                      <img src={demand.cropImage} alt={demand.cropName} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{demand.cropName}</h3>
                      <p className="text-xs text-stone-500 font-medium">{demand.buyerName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {demand.status}
                  </span>
                </div>

                <div className="py-3.5 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">Required Volume:</span>
                    <span className="font-bold text-slate-900">{demand.requiredQtyDisplay}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">Offered Price:</span>
                    <span className="font-black text-[#107c41]">₹ {demand.targetPricePerKg} /kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">Delivery Destination:</span>
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <MapPin className="h-3 w-3 text-stone-400" />
                      <span>{demand.deliveryCity}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 font-medium">Delivery Deadline:</span>
                    <div className="flex items-center gap-1 font-semibold text-amber-700">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(demand.requiredBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-mono">{demand.id}</span>
                <button
                  onClick={() => setSelectedDemand(demand)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#107c41] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Submit Offer</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offer Modal */}
      {selectedDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Supply Offer: {selectedDemand.cropName}</h3>
                <p className="text-xs text-stone-500 font-medium">{selectedDemand.buyerName} ({selectedDemand.deliveryCity})</p>
              </div>
              <button onClick={() => setSelectedDemand(null)} className="text-stone-400 hover:text-stone-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {offerSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-[#107c41] mx-auto animate-bounce" />
                <h4 className="text-base font-black text-slate-900">Offer Submitted Successfully!</h4>
                <p className="text-xs text-stone-500">The buyer will review your produce coordinates and confirm dispatch.</p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Your Available Quantity (kg)</label>
                  <input
                    type="number"
                    defaultValue="2000"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Your Asking Price (₹/kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    defaultValue={selectedDemand.targetPricePerKg}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dispatch Readiness Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none"
                    required
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDemand(null)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#107c41] text-white font-bold hover:bg-[#0c6233]"
                  >
                    Submit Quotation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default BuyerDemandPage;
