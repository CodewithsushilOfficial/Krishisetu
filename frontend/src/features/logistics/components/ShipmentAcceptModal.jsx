import React, { useState } from 'react';
import { X, Package, Truck, Check, AlertCircle, MapPin, IndianRupee } from 'lucide-react';
import logisticsService from '../services/logisticsService.js';

export function ShipmentAcceptModal({ isOpen, onClose, shipment, vehicles = [], onAccepted }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    vehicles.find((v) => v.status === 'ACTIVE')?.id || vehicles[0]?.id || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !shipment) return null;

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const shipmentQtyKg = Number(shipment.quantityKg || 6000);
  const vehicleCapacityKg = Number(selectedVehicle?.capacityKg || 10000);
  const hasSufficientCapacity = vehicleCapacityKg >= shipmentQtyKg;

  const handleConfirm = async () => {
    if (!selectedVehicleId) {
      setError('Please select an active fleet vehicle');
      return;
    }

    if (!hasSufficientCapacity) {
      setError(`Vehicle capacity (${Math.round(vehicleCapacityKg / 1000)} Ton) is less than shipment load (${Math.round(shipmentQtyKg / 1000)} Ton).`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await logisticsService.acceptShipment(shipment.id, selectedVehicleId);
      if (onAccepted) onAccepted(res);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to accept shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Accept Shipment Load</h3>
              <p className="text-[11px] text-stone-500">Confirm consignment assignment to your fleet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shipment Details Box */}
        <div className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-stone-900 text-sm">{shipment.loadId}</span>
              <span className="font-black text-sm text-emerald-800">{shipment.earningsDisplay}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-stone-600 pt-1 border-t border-stone-200/60">
              <div>Product: <strong className="text-stone-900">{shipment.product || shipment.cropName}</strong></div>
              <div>Quantity: <strong className="text-stone-900">{shipment.quantityDisplay}</strong></div>
              <div>Route: <strong className="text-stone-900">{shipment.from} ⟶ {shipment.to}</strong></div>
              <div>Distance: <strong className="text-stone-900">{shipment.distanceDisplay}</strong></div>
            </div>
          </div>

          {/* Vehicle Assignment Selection */}
          <div>
            <label className="block font-bold text-stone-800 mb-1.5">
              Assign Fleet Vehicle *
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900 focus:outline-hidden focus:border-emerald-600"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicleNumber} ({v.vehicleType} • {v.capacityDisplay || `${v.capacityTon} Ton`} • {v.status})
                </option>
              ))}
            </select>
          </div>

          {/* Capacity Validation Notice */}
          <div className={`p-3 rounded-xl border flex items-center gap-2 ${
            hasSufficientCapacity
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            {hasSufficientCapacity ? (
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <div className="text-[11px]">
              {hasSufficientCapacity ? (
                <span>Vehicle capacity verified for this consignment weight.</span>
              ) : (
                <span>Insufficient vehicle capacity. Please select a larger truck.</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || !hasSufficientCapacity}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Confirm & Create Trip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipmentAcceptModal;
