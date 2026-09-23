import React, { useState } from 'react';
import { ArrowLeft, MapPin, Tractor, Sprout } from 'lucide-react';

export function FarmerDetailsStep({ data = {}, onUpdate, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.village || data.village.trim().length < 2) errs.village = 'Village name is required';
    if (!data.district || data.district.trim().length < 2) errs.district = 'District is required';
    if (!data.state || data.state.trim().length < 2) errs.state = 'State is required';
    if (!data.pincode || !/^[1-9][0-9]{5}$/.test(data.pincode.trim())) errs.pincode = 'Valid 6-digit pincode is required';
    if (!data.totalLandArea || Number(data.totalLandArea) <= 0) errs.totalLandArea = 'Enter valid land area';
    if (!data.primaryCrops || (Array.isArray(data.primaryCrops) && data.primaryCrops.length === 0) || (typeof data.primaryCrops === 'string' && !data.primaryCrops.trim())) {
      errs.primaryCrops = 'Please specify at least one crop';
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
          Step 3 of 5 • Farm & Land Profile
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          Farmer Profile Details
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          Help buyers and transport partners discover your harvest accurately.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
        {/* Section 1: Location / Address */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Farm Location & Address</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Village <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kalyanpur"
                value={data.village || ''}
                onChange={(e) => onUpdate({ village: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.village && <p className="mt-1 text-xs text-red-600">{errors.village}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Post Office (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Kalyanpur Branch"
                value={data.postOffice || ''}
                onChange={(e) => onUpdate({ postOffice: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Varanasi"
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

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 221001"
                value={data.pincode || ''}
                onChange={(e) => onUpdate({ pincode: e.target.value.replace(/\D/g, '') })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Farming Operations */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <Tractor className="h-4 w-4 text-emerald-600" />
            <span>Land & Crop Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Farmer Type
              </label>
              <select
                value={data.farmerType || 'Individual Farmer'}
                onChange={(e) => onUpdate({ farmerType: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Individual Farmer">Individual Farmer</option>
                <option value="Owner Farmer">Owner Farmer</option>
                <option value="Tenant Farmer">Tenant Farmer</option>
                <option value="Sharecropper">Sharecropper</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Farm Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Patel Organic Farm"
                value={data.farmName || ''}
                onChange={(e) => onUpdate({ farmName: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Total Land Area <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="5.0"
                  value={data.totalLandArea || ''}
                  onChange={(e) => onUpdate({ totalLandArea: e.target.value })}
                  className="flex-1 rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
                <select
                  value={data.landUnit || 'Acre'}
                  onChange={(e) => onUpdate({ landUnit: e.target.value })}
                  className="rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none"
                >
                  <option value="Acre">Acre</option>
                  <option value="Bigha">Bigha</option>
                  <option value="Hectare">Hectare</option>
                  <option value="Guntha">Guntha</option>
                </select>
              </div>
              {errors.totalLandArea && <p className="mt-1 text-xs text-red-600">{errors.totalLandArea}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Farming Type
              </label>
              <select
                value={data.farmingType || 'Conventional'}
                onChange={(e) => onUpdate({ farmingType: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Conventional">Conventional</option>
                <option value="Organic">Organic (Certified / In-conversion)</option>
                <option value="Natural">Natural (ZBNF)</option>
                <option value="Mixed">Mixed Farming</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Primary Harvest Crops (Comma-separated) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                  <Sprout className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Wheat, Basmati Rice, Mustard, Potato"
                  value={Array.isArray(data.primaryCrops) ? data.primaryCrops.join(', ') : (data.primaryCrops || '')}
                  onChange={(e) => onUpdate({ primaryCrops: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 pl-9 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              {errors.primaryCrops && <p className="mt-1 text-xs text-red-600">{errors.primaryCrops}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Secondary Crops (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Seasonal Vegetables, Pulses"
                value={Array.isArray(data.secondaryCrops) ? data.secondaryCrops.join(', ') : (data.secondaryCrops || '')}
                onChange={(e) => onUpdate({ secondaryCrops: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Irrigation Type
              </label>
              <select
                value={data.irrigationType || 'Rainfed'}
                onChange={(e) => onUpdate({ irrigationType: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Rainfed">Rainfed</option>
                <option value="Tube Well">Tube Well</option>
                <option value="Canal">Canal</option>
                <option value="Drip">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Other">Other</option>
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

export default FarmerDetailsStep;
