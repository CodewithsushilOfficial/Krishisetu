import React, { useState } from 'react';
import { X, Fuel, AlertCircle, Check } from 'lucide-react';
import logisticsService from '../services/logisticsService.js';

export function AddExpenseModal({ isOpen, onClose, vehicles = [], onExpenseAdded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    expenseType: 'FUEL',
    amount: '',
    quantity: '',
    unitPrice: '90',
    station: '',
    odometer: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('Please enter a valid expense amount');
      return;
    }
    if (!form.vehicleId && vehicles.length > 0) {
      form.vehicleId = vehicles[0].id;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await logisticsService.createExpense({
        ...form,
        amount: parseFloat(form.amount),
        quantity: form.quantity ? parseFloat(form.quantity) : null,
        unitPrice: form.unitPrice ? parseFloat(form.unitPrice) : null,
        odometer: form.odometer ? parseInt(form.odometer, 10) : null,
      });

      if (onExpenseAdded) onExpenseAdded(res);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to record expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <Fuel className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Log Fleet Expense</h3>
              <p className="text-[11px] text-stone-500">Record fuel, toll, or maintenance cost</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">Select Vehicle *</label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicleNumber} - {v.vehicleType}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Expense Type</label>
              <select
                value={form.expenseType}
                onChange={(e) => setForm({ ...form, expenseType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
              >
                <option value="FUEL">Fuel (Diesel / CNG)</option>
                <option value="TOLL">FASTag Toll</option>
                <option value="PARKING">Parking</option>
                <option value="REPAIR">Minor Repair</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Total Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 5400"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
              />
            </div>
          </div>

          {form.expenseType === 'FUEL' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Liters / KG</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 60"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Price per Litre (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 90"
                  value={form.unitPrice}
                  onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">Station / Vendor</label>
            <input
              type="text"
              placeholder="e.g. Indian Oil NH 731 Fuel Plaza"
              value={form.station}
              onChange={(e) => setForm({ ...form, station: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
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
              {loading ? 'Saving...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpenseModal;
