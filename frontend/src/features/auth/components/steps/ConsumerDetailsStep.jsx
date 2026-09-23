import React, { useState } from 'react';
import { ArrowLeft, Home, MapPin } from 'lucide-react';

export function ConsumerDetailsStep({ data = {}, onUpdate, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.streetArea || data.streetArea.trim().length < 2) errs.streetArea = 'Street or locality is required';
    if (!data.city || data.city.trim().length < 2) errs.city = 'City is required';
    if (!data.district || data.district.trim().length < 2) errs.district = 'District is required';
    if (!data.state || data.state.trim().length < 2) errs.state = 'State is required';
    if (!data.pincode || !/^[1-9][0-9]{5}$/.test(data.pincode.trim())) errs.pincode = 'Valid 6-digit pincode is required';
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
    <div className="mx-auto max-w-xl">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
          Step 3 of 5 • Delivery Address
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          Consumer Delivery Address
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          Provide your household address for direct farm delivery.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            House / Flat / Building No. (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Flat 402, Green Valley Apartments"
            value={data.houseFlat || ''}
            onChange={(e) => onUpdate({ houseFlat: e.target.value })}
            className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Street / Area / Landmark <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Gomti Nagar Extension, Near City Park"
            value={data.streetArea || ''}
            onChange={(e) => onUpdate({ streetArea: e.target.value })}
            className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
          {errors.streetArea && <p className="mt-1 text-xs text-red-600">{errors.streetArea}</p>}
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
              placeholder="e.g. 226010"
              value={data.pincode || ''}
              onChange={(e) => onUpdate({ pincode: e.target.value.replace(/\D/g, '') })}
              className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
            {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Delivery Instructions (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Ring bell or leave at security gate"
            value={data.deliveryInstructions || ''}
            onChange={(e) => onUpdate({ deliveryInstructions: e.target.value })}
            className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
          />
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

export default ConsumerDetailsStep;
