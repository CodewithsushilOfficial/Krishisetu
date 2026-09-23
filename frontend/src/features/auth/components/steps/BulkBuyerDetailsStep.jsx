import React, { useState } from 'react';
import { ArrowLeft, Building2, MapPin, ShoppingBag } from 'lucide-react';

export function BulkBuyerDetailsStep({ data = {}, onUpdate, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.businessName || data.businessName.trim().length < 2) errs.businessName = 'Business or Company name is required';
    if (!data.contactPerson || data.contactPerson.trim().length < 2) errs.contactPerson = 'Contact person name is required';
    if (!data.city || data.city.trim().length < 2) errs.city = 'City is required';
    if (!data.district || data.district.trim().length < 2) errs.district = 'District is required';
    if (!data.state || data.state.trim().length < 2) errs.state = 'State is required';
    if (!data.pincode || !/^[1-9][0-9]{5}$/.test(data.pincode.trim())) errs.pincode = 'Valid 6-digit pincode is required';
    if (!data.primaryCrops || (Array.isArray(data.primaryCrops) && data.primaryCrops.length === 0) || (typeof data.primaryCrops === 'string' && !data.primaryCrops.trim())) {
      errs.primaryCrops = 'Please specify primary procurement crops';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
          Step 3 of 5 • Commercial & Procurement Profile
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          Bulk Buyer Profile
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          Direct institutional and wholesale sourcing from verified farm clusters.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
        {/* Business Identity */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span>Commercial Enterprise Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Company / Trade Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Agro Processors Ltd"
                value={data.businessName || ''}
                onChange={(e) => onUpdate({ businessName: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.businessName && <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Buyer Category
              </label>
              <select
                value={data.businessType || 'Wholesaler'}
                onChange={(e) => onUpdate({ businessType: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Wholesaler">Wholesaler / Mandi Trader</option>
                <option value="Processor">Food Processing & Milling</option>
                <option value="Retailer">Supermarket / Retail Chain</option>
                <option value="Exporter">Agri Commodity Exporter</option>
                <option value="Hospitality">Hotel / Restaurant / Cloud Kitchen</option>
                <option value="Institution">Institutional Buyer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                GSTIN Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 09AAACA1234A1Z5"
                value={data.gstNumber || ''}
                onChange={(e) => onUpdate({ gstNumber: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Amitabh Agarwal"
                value={data.contactPerson || ''}
                onChange={(e) => onUpdate({ contactPerson: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.contactPerson && <p className="mt-1 text-xs text-red-600">{errors.contactPerson}</p>}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Facility / Warehouse Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kanpur"
                value={data.city || ''}
                onChange={(e) => onUpdate({ city: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kanpur"
                value={data.district || ''}
                onChange={(e) => onUpdate({ district: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Uttar Pradesh"
                value={data.state || ''}
                onChange={(e) => onUpdate({ state: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 208001"
                value={data.pincode || ''}
                onChange={(e) => onUpdate({ pincode: e.target.value.replace(/\D/g, '') })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* Procurement Requirements */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
            <span>Procurement Volume & Crops</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Primary Commodities Sourced (Comma-separated) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Basmati Rice, Organic Wheat, Soybean, Pulses"
                value={Array.isArray(data.primaryCrops) ? data.primaryCrops.join(', ') : (data.primaryCrops || '')}
                onChange={(e) => onUpdate({ primaryCrops: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.primaryCrops && <p className="mt-1 text-xs text-red-600">{errors.primaryCrops}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Expected Volume (Monthly)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="50"
                  value={data.expectedVolume || ''}
                  onChange={(e) => onUpdate({ expectedVolume: Number(e.target.value) })}
                  className="flex-1 rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
                />
                <span className="inline-flex items-center px-3 rounded-xl border border-stone-300 bg-stone-100 text-xs font-semibold text-stone-600">
                  Tons
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Procurement Frequency
              </label>
              <select
                value={data.procurementFrequency || 'Monthly'}
                onChange={(e) => onUpdate({ procurementFrequency: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Biweekly">Biweekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Seasonal">Seasonal / Harvest-time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-stone-300 font-semibold text-xs sm:text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            className="px-7 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/10 active:scale-[0.98]"
          >
            Review Information →
          </button>
        </div>
      </form>
    </div>
  );
}

export default BulkBuyerDetailsStep;
