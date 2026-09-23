import React, { useState } from 'react';
import { ArrowLeft, Building, MapPin, Users } from 'lucide-react';

export function FpoDetailsStep({ data = {}, onUpdate, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.fpoName || data.fpoName.trim().length < 2) errs.fpoName = 'FPO / Company name is required';
    if (!data.registrationNumber || data.registrationNumber.trim().length < 3) errs.registrationNumber = 'Registration number is required';
    if (!data.cityTownVillage || data.cityTownVillage.trim().length < 2) errs.cityTownVillage = 'City/Town/Village is required';
    if (!data.district || data.district.trim().length < 2) errs.district = 'District is required';
    if (!data.state || data.state.trim().length < 2) errs.state = 'State is required';
    if (!data.pincode || !/^[1-9][0-9]{5}$/.test(data.pincode.trim())) errs.pincode = 'Valid 6-digit pincode is required';
    if (!data.representativeName || data.representativeName.trim().length < 2) errs.representativeName = 'Representative name is required';
    if (!data.designation || data.designation.trim().length < 2) errs.designation = 'Designation is required';
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
          Step 3 of 5 • Organization Details
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          FPO / Producer Company Details
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          Provide your collective entity details to aggregate farmer produce.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
        {/* Section 1: Entity Info */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <Building className="h-4 w-4 text-emerald-600" />
            <span>FPO Entity Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                FPO / Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kashi Kisan Samriddhi Producer Company"
                value={data.fpoName || ''}
                onChange={(e) => onUpdate({ fpoName: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.fpoName && <p className="mt-1 text-xs text-red-600">{errors.fpoName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Entity Type
              </label>
              <select
                value={data.fpoType || 'Farmer Producer Organization'}
                onChange={(e) => onUpdate({ fpoType: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Farmer Producer Organization">Farmer Producer Organization (FPO)</option>
                <option value="Farmer Producer Company">Farmer Producer Company (FPC)</option>
                <option value="Cooperative Society">Cooperative Society (PACS)</option>
                <option value="Producer Group">Self Help / Producer Group</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                CIN / Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. U01111UP2021PTC123456"
                value={data.registrationNumber || ''}
                onChange={(e) => onUpdate({ registrationNumber: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.registrationNumber && <p className="mt-1 text-xs text-red-600">{errors.registrationNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Established Year
              </label>
              <input
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                placeholder="2021"
                value={data.establishedYear || 2021}
                onChange={(e) => onUpdate({ establishedYear: Number(e.target.value) })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Total Member Farmers Count
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 350"
                value={data.numberOfFarmers || ''}
                onChange={(e) => onUpdate({ numberOfFarmers: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Authorized Representative */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <Users className="h-4 w-4 text-emerald-600" />
            <span>Authorized Representative</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Representative Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Suresh Kumar"
                value={data.representativeName || ''}
                onChange={(e) => onUpdate({ representativeName: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.representativeName && <p className="mt-1 text-xs text-red-600">{errors.representativeName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Managing Director / CEO"
                value={data.designation || ''}
                onChange={(e) => onUpdate({ designation: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.designation && <p className="mt-1 text-xs text-red-600">{errors.designation}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Registered Address */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Registered Address & Crops</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City / Town / Village <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Varanasi"
                value={data.cityTownVillage || ''}
                onChange={(e) => onUpdate({ cityTownVillage: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.cityTownVillage && <p className="mt-1 text-xs text-red-600">{errors.cityTownVillage}</p>}
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

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 221002"
                value={data.pincode || ''}
                onChange={(e) => onUpdate({ pincode: e.target.value.replace(/\D/g, '') })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Aggregated Primary Crops <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Paddy, Wheat, Mustard, Vegetables"
                value={Array.isArray(data.primaryCrops) ? data.primaryCrops.join(', ') : (data.primaryCrops || '')}
                onChange={(e) => onUpdate({ primaryCrops: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.primaryCrops && <p className="mt-1 text-xs text-red-600">{errors.primaryCrops}</p>}
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="storageAvailable"
                checked={Boolean(data.storageAvailable)}
                onChange={(e) => onUpdate({ storageAvailable: e.target.checked })}
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="storageAvailable" className="text-xs sm:text-sm text-stone-700 font-medium">
                Warehouse / Packhouse Aggregation Storage Available
              </label>
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

export default FpoDetailsStep;
