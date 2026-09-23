import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import { Users, Plus, Search, Filter, Phone, MapPin, X, CheckCircle2, AlertCircle } from 'lucide-react';

export function FpoFarmersPage() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    village: '',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    primaryCrop: 'Potato',
    landArea: 3.5,
  });

  const loadFarmers = async () => {
    try {
      setLoading(true);
      const res = await fpoService.getFarmers({ search, village: villageFilter });
      setFarmers(res?.farmers || res?.data?.farmers || (Array.isArray(res) ? res : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, [villageFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFarmers();
  };

  const handleAddFarmer = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage('');
      await fpoService.createFarmer({
        ...formData,
        primaryCrops: [formData.primaryCrop],
        landArea: Number(formData.landArea),
      });
      setMessage('Farmer added successfully!');
      setShowModal(false);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        village: '',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        primaryCrop: 'Potato',
        landArea: 3.5,
      });
      loadFarmers();
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Failed to add farmer');
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
              <Users className="h-5 w-5 text-emerald-700" /> Farmer Management
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage registered member farmers, landholdings, and collective produce
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Farmer
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by farmer name, phone, or village..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
            />
          </form>

          <div className="flex items-center gap-2">
            <select
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
            >
              <option value="">All Villages</option>
              <option value="Sarnath">Sarnath</option>
              <option value="Arajiline">Arajiline</option>
              <option value="Cholapur">Cholapur</option>
              <option value="Pindra">Pindra</option>
              <option value="Harahua">Harahua</option>
            </select>
          </div>
        </div>

        {/* Farmers Table */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-stone-400">Loading farmer records...</div>
          ) : farmers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-10 w-10 mx-auto text-stone-300 mb-2" />
              <h3 className="text-sm font-bold text-stone-800">No farmers found</h3>
              <p className="text-xs text-stone-500 mt-1">Try changing search criteria or onboard a new farmer.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                + Add Farmer
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-400 border-b border-stone-200 text-[11px]">
                    <th className="py-3 px-4 font-semibold">Farmer Name</th>
                    <th className="py-3 px-4 font-semibold">Contact</th>
                    <th className="py-3 px-4 font-semibold">Location</th>
                    <th className="py-3 px-4 font-semibold">Primary Crops</th>
                    <th className="py-3 px-4 font-semibold text-right">Land Area</th>
                    <th className="py-3 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {farmers.map((f) => (
                    <tr key={f.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {f.fullName ? f.fullName[0] : 'F'}
                        </div>
                        <div>
                          <p className="leading-tight">{f.fullName}</p>
                          <p className="text-[10px] text-stone-400 font-normal">Member #{f.id.slice(-6)}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-stone-400" />
                          <span>{f.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-stone-400" />
                          <span>{f.village}, {f.district}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {f.primaryCrops?.map((crop) => (
                            <span key={crop} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-stone-900">
                        {f.totalLandAcres} Acres
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Farmer Modal */}
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
                <Users className="h-5 w-5 text-emerald-700" /> Onboard Member Farmer
              </h2>
              <p className="text-xs text-stone-500 mt-1">Add a new farmer to Suryoday FPO collective database</p>

              <form onSubmit={handleAddFarmer} className="mt-4 space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit phone"
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Land Area (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.landArea}
                      onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Village *</label>
                    <input
                      type="text"
                      required
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      placeholder="e.g. Sarnath"
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700">Primary Crop</label>
                    <select
                      value={formData.primaryCrop}
                      onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                    >
                      <option value="Potato">Potato</option>
                      <option value="Onion">Onion</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Chilli">Chilli</option>
                    </select>
                  </div>
                </div>

                {message && (
                  <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2 rounded-lg">{message}</p>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-stone-200 text-stone-600 text-xs font-bold rounded-xl hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Register Farmer'}
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

export default FpoFarmersPage;
