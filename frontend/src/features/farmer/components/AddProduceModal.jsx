import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Sprout, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAddProduceMutation } from '../hooks/useFarmerDashboard.js';

export function AddProduceModal({ isOpen, onClose }) {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const addProduceMutation = useAddProduceMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      cropId: 'CROP-POTATO',
      quantityKg: '',
      grade: 'A',
      expectedPricePerKg: '',
      farmId: 'FARM-001',
      harvestDate: new Date().toISOString().split('T')[0],
      organic: false,
      qualityScore: 9.0,
      warehouseLocation: 'On-Farm Storage',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Input validation guard
      if (!data.cropId) throw new Error('Please select a crop');
      if (!data.quantityKg || Number(data.quantityKg) <= 0) {
        throw new Error('Quantity must be greater than 0 kg');
      }
      if (!data.expectedPricePerKg || Number(data.expectedPricePerKg) <= 0) {
        throw new Error('Expected price must be greater than ₹0/kg');
      }

      await addProduceMutation.mutateAsync({
        cropId: data.cropId,
        quantityKg: Number(data.quantityKg),
        expectedPricePerKg: Number(data.expectedPricePerKg),
        grade: data.grade,
        farmId: data.farmId,
        harvestDate: data.harvestDate,
        organic: Boolean(data.organic),
        qualityScore: Number(data.qualityScore || 9.0),
        warehouseLocation: data.warehouseLocation,
      });

      setSubmitSuccess(true);
      reset();
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setSubmitError(err.message || 'Failed to list produce. Please verify fields.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">List New Produce</h3>
              <p className="text-[11px] text-stone-400">Add harvested crop directly to marketplace</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-black text-stone-900">Produce Listed Successfully!</h4>
            <p className="text-xs text-stone-500 mt-1">
              Synchronized with PostgreSQL database and inventory lot activated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 text-xs">
            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Crop Selection */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Select Crop *</label>
              <select
                {...register('cropId', { required: true })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="CROP-POTATO">Potato (Alu)</option>
                <option value="CROP-ONION">Onion (Pyaz)</option>
                <option value="CROP-TOMATO">Tomato (Tamatar)</option>
                <option value="CROP-WHEAT">Wheat (Gehu)</option>
                <option value="CROP-CHILLI">Chilli (Mirch)</option>
              </select>
            </div>

            {/* Quantity & Expected Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Quantity (in kg) *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 5000"
                  {...register('quantityKg', { required: true, min: 1 })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
                {errors.quantityKg && (
                  <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">
                    Valid quantity required
                  </span>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Expected Price (₹/kg) *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 24"
                  {...register('expectedPricePerKg', { required: true, min: 1 })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
                {errors.expectedPricePerKg && (
                  <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">
                    Valid price required
                  </span>
                )}
              </div>
            </div>

            {/* Farm Plot & Grade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Farm Holding / Plot</label>
                <select
                  {...register('farmId')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="FARM-001">Plot A (Alluvial Loam)</option>
                  <option value="FARM-001-B">Plot B (Clay Loam)</option>
                  <option value="FARM-001-C">Plot C (Sandy Loam)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Quality Grade</label>
                <select
                  {...register('grade')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="A">Grade A (Export / Prime)</option>
                  <option value="B">Grade B (Standard Commercial)</option>
                  <option value="PREMIUM">Premium Special Sort</option>
                </select>
              </div>
            </div>

            {/* Harvest Date & Storage Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Harvest Date</label>
                <input
                  type="date"
                  {...register('harvestDate')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Storage Location</label>
                <input
                  type="text"
                  placeholder="e.g. Cold Storage Varanasi"
                  {...register('warehouseLocation')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Organic certification checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="organicCheck"
                {...register('organic')}
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="organicCheck" className="font-semibold text-stone-700 text-xs">
                Certified Natural / Organic Produce
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || addProduceMutation.isPending}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting || addProduceMutation.isPending ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <span>Publish Produce</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddProduceModal;
