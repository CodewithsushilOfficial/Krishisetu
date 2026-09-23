import React, { useState } from 'react';
import { X, Truck, Check, AlertCircle } from 'lucide-react';
import logisticsService from '../services/logisticsService.js';

export function AddVehicleModal({ isOpen, onClose, onVehicleAdded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    vehicleNumber: '',
    brand: 'Tata Motors',
    model: 'LPT 1109 Hexa',
    vehicleType: 'Tata 10 Ton',
    capacityTon: '10',
    fuelType: 'Diesel',
    gpsEnabled: true,
    refrigerated: false,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.vehicleNumber.trim()) {
      setError('Vehicle registration number is required');
      return;
    }

    try {
      setLoading(true);
      const res = await logisticsService.createVehicle({
        ...form,
        vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
        capacityTon: parseFloat(form.capacityTon),
        capacityKg: parseFloat(form.capacityTon) * 1000,
      });

      if (onVehicleAdded) onVehicleAdded(res);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Register Fleet Vehicle</h3>
              <p className="text-[11px] text-stone-500">Add commercial truck to active fleet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Vehicle Registration Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. UP65XX9999"
              value={form.vehicleNumber}
              onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold focus:outline-hidden focus:border-emerald-600 uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Manufacturer Brand</label>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
              >
                <option value="Tata Motors">Tata Motors</option>
                <option value="Eicher">Eicher</option>
                <option value="Mahindra">Mahindra</option>
                <option value="Ashok Leyland">Ashok Leyland</option>
                <option value="BharatBenz">BharatBenz</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Model Name</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="e.g. LPT 1109 Hexa"
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Capacity (Tons)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="50"
                value={form.capacityTon}
                onChange={(e) => setForm({ ...form, capacityTon: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Fuel Type</label>
              <select
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
              >
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Petrol">Petrol</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.gpsEnabled}
                onChange={(e) => setForm({ ...form, gpsEnabled: e.target.checked })}
                className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
              />
              <span className="font-semibold text-stone-700">GPS Telemetry Installed</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.refrigerated}
                onChange={(e) => setForm({ ...form, refrigerated: e.target.checked })}
                className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
              />
              <span className="font-semibold text-stone-700">Refrigerated Reefer</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVehicleModal;
