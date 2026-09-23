import React, { useState } from 'react';
import { ArrowLeft, Truck, MapPin, Gauge } from 'lucide-react';

export function LogisticsDetailsStep({ data = {}, onUpdate, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.businessName || data.businessName.trim().length < 2) errs.businessName = 'Business or fleet name is required';
    if (!data.contactPerson || data.contactPerson.trim().length < 2) errs.contactPerson = 'Contact person name is required';
    if (!data.city || data.city.trim().length < 2) errs.city = 'City is required';
    if (!data.district || data.district.trim().length < 2) errs.district = 'District is required';
    if (!data.state || data.state.trim().length < 2) errs.state = 'State is required';
    if (!data.pincode || !/^[1-9][0-9]{5}$/.test(data.pincode.trim())) errs.pincode = 'Valid 6-digit pincode is required';
    if (!data.vehicleTypes || (Array.isArray(data.vehicleTypes) && data.vehicleTypes.length === 0) || (typeof data.vehicleTypes === 'string' && !data.vehicleTypes.trim())) {
      errs.vehicleTypes = 'Please specify vehicle types (e.g. Pickup, Mini Truck, Truck)';
    }
    if (!data.numberOfVehicles || Number(data.numberOfVehicles) < 1) errs.numberOfVehicles = 'At least 1 vehicle is required';
    if (!data.maxLoadCapacity || Number(data.maxLoadCapacity) <= 0) errs.maxLoadCapacity = 'Specify maximum load capacity';
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
          Step 3 of 5 • Fleet & Transport Details
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          Logistics Partner Details
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          Connect your transport vehicles and drivers with farm routes and aggregators.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
        {/* Business & Operator */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <Truck className="h-4 w-4 text-emerald-600" />
            <span>Transport Agency / Fleet Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Agency / Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kisan Fast Express Logistics"
                value={data.businessName || ''}
                onChange={(e) => onUpdate({ businessName: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.businessName && <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Business Type
              </label>
              <select
                value={data.businessType || 'Transport Company'}
                onChange={(e) => onUpdate({ businessType: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Individual">Individual Driver / Vehicle Owner</option>
                <option value="Transport Company">Transport Company</option>
                <option value="Fleet Operator">Fleet Operator (Multi-vehicle)</option>
                <option value="Logistics Provider">Third-Party Logistics (3PL)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Vikram Singh"
                value={data.contactPerson || ''}
                onChange={(e) => onUpdate({ contactPerson: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.contactPerson && <p className="mt-1 text-xs text-red-600">{errors.contactPerson}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Number of Operational Vehicles <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={data.numberOfVehicles || 1}
                onChange={(e) => onUpdate({ numberOfVehicles: Number(e.target.value) })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.numberOfVehicles && <p className="mt-1 text-xs text-red-600">{errors.numberOfVehicles}</p>}
            </div>
          </div>
        </div>

        {/* Operating Address */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Base Hub Address</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Lucknow"
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
                placeholder="e.g. Lucknow"
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
                placeholder="e.g. 226001"
                value={data.pincode || ''}
                onChange={(e) => onUpdate({ pincode: e.target.value.replace(/\D/g, '') })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* Capacity & Vehicles */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 border-b border-stone-100 pb-2 mb-3">
            <Gauge className="h-4 w-4 text-emerald-600" />
            <span>Vehicles & Payload Range</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Vehicle Types (Comma-separated) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Pickup, Mini Truck, 10-Tyre Truck, Refrigerated Van"
                value={Array.isArray(data.vehicleTypes) ? data.vehicleTypes.join(', ') : (data.vehicleTypes || '')}
                onChange={(e) => onUpdate({ vehicleTypes: e.target.value })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.vehicleTypes && <p className="mt-1 text-xs text-red-600">{errors.vehicleTypes}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Min Load Capacity (Tons)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="0.5"
                value={data.minLoadCapacity || 0}
                onChange={(e) => onUpdate({ minLoadCapacity: Number(e.target.value) })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Max Load Capacity (Tons) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                placeholder="e.g. 25"
                value={data.maxLoadCapacity || ''}
                onChange={(e) => onUpdate({ maxLoadCapacity: Number(e.target.value) })}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              {errors.maxLoadCapacity && <p className="mt-1 text-xs text-red-600">{errors.maxLoadCapacity}</p>}
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

export default LogisticsDetailsStep;
