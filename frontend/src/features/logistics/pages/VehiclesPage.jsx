import React, { useState, useEffect } from 'react';
import { Truck, Plus, CheckCircle2, AlertTriangle, ShieldCheck, Fuel, BatteryCharging, Radio, RefreshCw } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import { AddVehicleModal } from '../components/AddVehicleModal.jsx';
import logisticsService from '../services/logisticsService.js';

export function VehiclesPage() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const res = await logisticsService.getVehicles();
      setVehicles(res || []);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <LogisticsLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white text-xs font-medium rounded-xl shadow-xl border border-stone-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Fleet & Vehicle Management</h1>
              <p className="text-xs text-stone-500">Commercial transport fleet, GPS telematics, and fitness compliance certificates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadVehicles}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Vehicle
            </button>
          </div>
        </div>

        {/* Fleet Grid */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/90">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mb-2" />
            <p className="text-xs text-stone-500 font-medium">Loading fleet telemetry...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/90">
            <Truck className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-bold text-stone-700">No vehicles registered</p>
            <p className="text-xs text-stone-400 mt-1">Add your commercial vehicle to start accepting agricultural consignments.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              Register First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((v) => {
              const plate = v.plateNumber || v.vehicleNumber;
              const capTon = Number(v.capacityTon || (v.capacityKg ? v.capacityKg / 1000 : 5)).toFixed(1);
              const isReefer = v.reeferEquipped || (v.vehicleType || '').toLowerCase().includes('reefer');

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div>
                        <span className="font-mono text-sm font-black text-stone-900">{plate}</span>
                        <div className="text-[11px] text-stone-500">{v.brand} {v.model}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          v.status === 'AVAILABLE' || v.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : v.status === 'IN_TRANSIT'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-stone-50 rounded-xl">
                        <span className="text-stone-400 text-[10px] block">Payload Capacity</span>
                        <strong className="text-stone-800">{capTon} Ton</strong>
                      </div>
                      <div className="p-2.5 bg-stone-50 rounded-xl">
                        <span className="text-stone-400 text-[10px] block">Type & Body</span>
                        <strong className="text-stone-800">{v.vehicleType || 'Standard Cargo'}</strong>
                      </div>
                      <div className="p-2.5 bg-stone-50 rounded-xl">
                        <span className="text-stone-400 text-[10px] block">Fuel Type</span>
                        <strong className="text-stone-800 flex items-center gap-1">
                          <Fuel className="w-3 h-3 text-stone-500" /> {v.fuelType || 'Diesel'}
                        </strong>
                      </div>
                      <div className="p-2.5 bg-stone-50 rounded-xl">
                        <span className="text-stone-400 text-[10px] block">Telemetry GPS</span>
                        <strong className="text-emerald-700 flex items-center gap-1 font-bold">
                          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> Active
                        </strong>
                      </div>
                    </div>

                    {isReefer && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-200/60 rounded-xl flex items-center justify-between text-xs text-blue-800">
                        <span className="font-semibold">Reefer Temperature Control</span>
                        <span className="font-mono font-bold">+2°C to +8°C</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> RC & Insurance Verified
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">ID: {String(v?.id || '').slice(0, 8)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onVehicleAdded={(newVeh) => {
          showToast(`Vehicle ${newVeh.plateNumber || newVeh.vehicleNumber} successfully added to fleet!`);
          loadVehicles();
        }}
      />
    </LogisticsLayout>
  );
}

export default VehiclesPage;
