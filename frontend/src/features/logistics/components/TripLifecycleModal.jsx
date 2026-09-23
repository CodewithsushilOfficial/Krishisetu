import React, { useState } from 'react';
import { X, CheckCircle2, Truck, Navigation, AlertCircle, Upload } from 'lucide-react';
import logisticsService from '../services/logisticsService.js';

export function TripLifecycleModal({ isOpen, onClose, trip, onTripUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proofNote, setProofNote] = useState('');

  if (!isOpen || !trip) return null;

  const currentStatus = trip.status;

  const handleAction = async (actionType) => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (actionType === 'pickup') {
        res = await logisticsService.completePickup(trip.id);
      } else if (actionType === 'transit') {
        res = await logisticsService.startDelivery(trip.id);
      } else if (actionType === 'delivered') {
        res = await logisticsService.completeTrip(trip.id, proofNote || 'Delivered to buyer hub');
      }

      if (onTripUpdated) onTripUpdated(res);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update trip status');
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
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Trip Stage Actions</h3>
              <p className="text-[11px] text-stone-500 font-mono">{trip.tripCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <p><strong>Cargo:</strong> {trip.cropName} ({trip.quantity})</p>
            <p><strong>Current Status:</strong> <span className="font-bold text-emerald-700">{currentStatus}</span></p>
            <p><strong>Route:</strong> {trip.fromLocation} ⟶ {trip.toLocation}</p>
          </div>

          <div className="space-y-2 pt-1">
            {/* Step 1: Pickup Complete */}
            <button
              onClick={() => handleAction('pickup')}
              disabled={loading || currentStatus === 'PICKUP_COMPLETED' || currentStatus === 'IN_TRANSIT' || currentStatus === 'DELIVERED'}
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-between disabled:opacity-40 transition-colors"
            >
              <span>1. Mark Pickup Completed</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            </button>

            {/* Step 2: En Route / In Transit */}
            <button
              onClick={() => handleAction('transit')}
              disabled={loading || currentStatus === 'IN_TRANSIT' || currentStatus === 'DELIVERED'}
              className="w-full py-2.5 px-4 rounded-xl border border-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold flex items-center justify-between disabled:opacity-40 transition-colors"
            >
              <span>2. Start Transit (En Route to Delivery)</span>
              <Navigation className="h-4 w-4 text-blue-700" />
            </button>

            {/* Step 3: Complete Trip */}
            <div className="pt-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Proof of Delivery (Optional Note/URL)
              </label>
              <input
                type="text"
                placeholder="e.g. Received by Ramesh, Gate 3"
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs mb-2"
              />
              <button
                onClick={() => handleAction('delivered')}
                disabled={loading || currentStatus === 'DELIVERED'}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-40 transition-colors shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>3. Complete Trip & Generate Payout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripLifecycleModal;
