import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import { Warehouse, Plus, MapPin, Phone, User, CheckCircle2, X } from 'lucide-react';

export function FpoCollectionCentersPage() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    district: 'Varanasi',
    block: '',
    village: '',
    managerName: '',
    contactPhone: '',
    capacityKg: 400000,
    storageCapacityKg: 350000,
  });

  const loadCenters = async () => {
    try {
      setLoading(true);
      const res = await fpoService.getCollectionCenters();
      setCenters(Array.isArray(res) ? res : (res?.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCenters();
  }, []);

  const handleCreateCenter = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await fpoService.createCollectionCenter({
        ...formData,
        capacityKg: Number(formData.capacityKg),
        storageCapacityKg: Number(formData.storageCapacityKg),
      });
      setShowModal(false);
      setFormData({
        name: '',
        code: '',
        address: '',
        district: 'Varanasi',
        block: '',
        village: '',
        managerName: '',
        contactPhone: '',
        capacityKg: 400000,
        storageCapacityKg: 350000,
      });
      loadCenters();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FpoLayout>
      <div className="space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-emerald-700" /> Collection Centers
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Aggregation points for harvest intake, moisture inspection, weighing, and lot packaging
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Collection Center
          </button>
        </div>

        {/* Center Cards Grid */}
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading collection centers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {centers.map((cc) => {
              const capMT = Math.round(Number(cc.capacityKg || 0) / 1000);
              const storeMT = Math.round(Number(cc.storageCapacityKg || 0) / 1000);

              return (
                <div key={cc.id} className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5 space-y-4 hover:shadow-xs transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                        {cc.code}
                      </span>
                      <h2 className="text-base font-bold text-stone-900 mt-1">{cc.name}</h2>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{cc.address || `${cc.block}, ${cc.district}`}</span>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      {cc.status}
                    </span>
                  </div>

                  {/* Capacity Gauges */}
                  <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                    <div>
                      <div className="flex justify-between text-stone-600 text-[11px] mb-1">
                        <span>Daily Intake Capacity</span>
                        <span className="font-bold text-stone-900">{capMT} MT</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-stone-600 text-[11px] mb-1">
                        <span>Storage & Silo Capacity</span>
                        <span className="font-bold text-stone-900">{storeMT} MT</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '48%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Center Manager Details */}
                  <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-700">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{cc.managerName || 'Center Incharge'}</p>
                        <p className="text-[10px] text-stone-500">Center Manager</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${cc.contactPhone}`}
                      className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      <span>{cc.contactPhone || 'Contact'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Center Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-emerald-700" /> New Collection Center
              </h2>
              <p className="text-xs text-stone-500 mt-1">Add an aggregation facility for farm produce intake</p>

              <form onSubmit={handleCreateCenter} className="mt-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Center Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rohania Agri Hub"
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="CC-04"
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700">Address & Landmark *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Near G.T. Road, Rohania"
                    className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Manager Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-stone-200 text-stone-600 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Center'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FpoLayout>
  );
}

export default FpoCollectionCentersPage;
