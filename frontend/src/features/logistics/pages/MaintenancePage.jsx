import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, CheckCircle2, ShieldAlert, Calendar, Plus, Clock, RefreshCw } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import logisticsService from '../services/logisticsService.js';

export function MaintenancePage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mRes, vRes] = await Promise.all([
        logisticsService.getMaintenanceRecords(),
        logisticsService.getVehicles(),
      ]);
      setRecords(mRes || []);
      setVehicles(vRes || []);
    } catch (err) {
      console.error('Failed to load maintenance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const alerts = [
    { id: 1, vehicle: 'UP65XX1234', title: 'Periodic 50,000 km Service Due', urgency: 'HIGH', desc: 'Engine oil flush, diesel filter change, brake pad inspection required.' },
    { id: 2, vehicle: 'UP78YY5678', title: 'Reefer Unit Calibration Recommended', urgency: 'MEDIUM', desc: 'Chiller compressor pressure baseline variance (+1.2°C).' },
  ];

  return (
    <LogisticsLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white text-xs font-medium rounded-xl shadow-xl border border-stone-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Fleet Maintenance & Preventive Care</h1>
              <p className="text-xs text-stone-500">Engine diagnostics, reefer calibration, and statutory vehicle fitness certifications</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setToastMessage('Service booking request sent to Authorized Tata / Ashok Leyland Workshop.');
                setTimeout(() => setToastMessage(null), 4000);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Book Authorized Service
            </button>
          </div>
        </div>

        {/* Urgent Alerts Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" /> Active Service Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs flex items-start gap-3.5"
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${alt.urgency === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-stone-900">{alt.vehicle}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alt.urgency === 'HIGH' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                      {alt.urgency}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-800 mt-1">{alt.title}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{alt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Log History */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900">Maintenance & Repair History</h3>
            <span className="text-xs font-semibold text-stone-500">{records.length} Service Logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Service Type</th>
                  <th className="py-3 px-4">Odometer Reading</th>
                  <th className="py-3 px-4">Workshop / Provider</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-stone-400">No previous maintenance records found.</td>
                  </tr>
                ) : (
                  records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-stone-600">{new Date(rec.serviceDate || rec.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-800">{rec.vehicle?.plateNumber || rec.vehicle?.vehicleNumber || 'UP65XX1234'}</td>
                      <td className="py-3.5 px-4 font-medium text-stone-800">{rec.serviceType}</td>
                      <td className="py-3.5 px-4 font-mono text-stone-600">{rec.odometerKm ? `${rec.odometerKm.toLocaleString()} km` : '-'}</td>
                      <td className="py-3.5 px-4 text-stone-600">{rec.serviceProvider || 'Authorized Center'}</td>
                      <td className="py-3.5 px-4 font-black text-stone-900">₹{Number(rec.cost || 0).toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          COMPLETED
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LogisticsLayout>
  );
}

export default MaintenancePage;
