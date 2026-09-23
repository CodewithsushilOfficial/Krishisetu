import React, { useState, useEffect } from 'react';
import { Route, MapPin, Truck, Calendar, Clock, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import { TripLifecycleModal } from '../components/TripLifecycleModal.jsx';
import logisticsService from '../services/logisticsService.js';

export function TripsPage() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const res = await logisticsService.getTrips();
      setTrips(res || []);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredTrips = trips.filter((t) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return ['IN_TRANSIT', 'DISPATCHED', 'PICKUP_COMPLETED', 'OUT_FOR_DELIVERY'].includes(t.status);
    if (statusFilter === 'COMPLETED') return ['COMPLETED', 'DELIVERED'].includes(t.status);
    return t.status === statusFilter;
  });

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
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Active & Scheduled Trips</h1>
              <p className="text-xs text-stone-500">Live corridor progression, stop checkpoints, and dispatch logs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadTrips}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Trips' },
            { id: 'ACTIVE', label: 'In Transit / Active' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trips List */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/90">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mb-2" />
            <p className="text-xs text-stone-500 font-medium">Loading telemetry trips...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/90">
            <Route className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-bold text-stone-700">No trips in this category</p>
            <p className="text-xs text-stone-400 mt-1">Trips will appear here once loads are accepted.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => {
              const origin = trip.originDistrict || trip.pickupCity || 'Origin';
              const destination = trip.destinationCity || trip.deliveryCity || 'Destination';
              const vehicleNumber = trip.vehicle?.plateNumber || trip.vehicle?.vehicleNumber || 'Assigned Fleet';
              const crop = trip.shipment?.cropName || 'Produce Consignment';
              const payout = Number(trip.payoutAmount || trip.totalCost || 0);

              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-stone-200/90 p-5 hover:border-blue-400/80 shadow-2xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        {trip.tripCode || trip.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          trip.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : trip.status === 'IN_TRANSIT'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {(trip?.status || 'SCHEDULED').toString().replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        Vehicle: <strong className="text-stone-800 font-mono">{vehicleNumber}</strong>
                      </span>
                    </div>

                    {/* Route Corridor */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-700">
                      <span className="font-bold text-stone-900">{origin}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-bold text-stone-900">{destination}</span>
                      <span className="text-stone-300">•</span>
                      <span>{Number(trip.distanceKm || 0)} km</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-emerald-700 font-bold">{crop}</span>
                    </div>

                    {/* Driver & Timeline */}
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span>Driver: <strong className="text-stone-700">{trip.driverName || 'Self / Assigned'}</strong></span>
                      {trip.driverPhone && <span>Contact: {trip.driverPhone}</span>}
                      {trip.etaTimestamp && (
                        <span className="flex items-center gap-1 text-blue-700 font-semibold">
                          <Clock className="w-3 h-3" /> ETA: {new Date(trip.etaTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Cost */}
                  <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    <div className="text-left lg:text-right">
                      <div className="text-base font-black text-stone-900">₹{payout.toLocaleString()}</div>
                      <span className="text-[10px] text-stone-400 block">Guaranteed Payout</span>
                    </div>

                    {trip.status !== 'COMPLETED' && (
                      <button
                        onClick={() => setSelectedTrip(trip)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        Update Progress
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lifecycle Modal */}
      <TripLifecycleModal
        isOpen={Boolean(selectedTrip)}
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
        onTripUpdated={(updated) => {
          setSelectedTrip(null);
          showToast(`Trip ${updated.tripCode || updated.id} advanced to ${updated.status}!`);
          loadTrips();
        }}
      />
    </LogisticsLayout>
  );
}

export default TripsPage;
