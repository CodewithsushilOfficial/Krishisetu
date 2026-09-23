import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import { Building2, Save, MapPin, Mail, Phone, Hash, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function FpoProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: 'Suryoday Farmer Producer Company Ltd.',
    registrationNo: 'FPO-UP-0456',
    address: 'Agriculture Complex, Sarnath Road, Varanasi',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221007',
    bankName: 'State Bank of India',
    bankAccountNumber: '389201948201',
    ifscCode: 'SBIN0001234',
    panNo: 'AAACS1234K',
    gstNo: '09AAACS1234K1Z5',
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await fpoService.getProfile();
      const prof = res?.fpoName || res?.name ? res : (res?.data || null);
      if (prof) {
        setProfile(prof);
        setFormData((prev) => ({
          ...prev,
          name: prof.fpoName || prof.name || prev.name,
          registrationNo: prof.registrationNumber || prof.registrationNo || prev.registrationNo,
          district: prof.district || prev.district,
          state: prof.state || prev.state,
          address: prof.addressLine || prof.address || prev.address,
          panNo: prof.panNumber || prof.panNo || prev.panNo,
          gstNo: prof.gstNumber || prof.gstNo || prev.gstNo,
          bankName: prof.bankName || prev.bankName,
          bankAccountNumber: prof.bankAccountNumber || prev.bankAccountNumber,
          ifscCode: prof.bankIfscCode || prof.ifscCode || prev.ifscCode,
        }));
      }
    } catch (err) {
      console.error('Failed to load FPO profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');
      await fpoService.updateProfile(formData);
      setMessage('FPO organization profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <FpoLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header with Profile Photo Card */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="relative shrink-0">
              <img
                src="/assets/fpo-profile.png"
                alt="FPO Official Representative"
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-emerald-600 shadow-md ring-4 ring-emerald-50"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/dashboard/farmer_avatar.png';
                }}
              />
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {formData.name || 'Suryoday Farmer Producer Company Ltd.'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-700" />
                  Verified Corporate Entity
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Statutory registration details, banking beneficiaries for escrow disbursement, and administrative records.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Org info */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-700" />
              Company Legal Entity Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Company Registered Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">ROC / Ministry Registration #</label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">PAN Number</label>
                <input
                  type="text"
                  value={formData.panNo}
                  onChange={(e) => setFormData({ ...formData, panNo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">GSTIN</label>
                <input
                  type="text"
                  value={formData.gstNo}
                  onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-mono uppercase"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-stone-600 block mb-1">Registered Operational Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>
          </div>

          {/* Banking details */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Hash className="h-4.5 w-4.5 text-emerald-700" />
              Banking & Escrow Beneficiary Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Current Account Number</label>
                <input
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#107c41] hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </FpoLayout>
  );
}

export default FpoProfilePage;
