import React, { useState, useEffect } from 'react';
import { Settings, Save, User, Truck, ShieldCheck, MapPin, Phone, Building2, CheckCircle2 } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import logisticsService from '../services/logisticsService.js';

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [form, setForm] = useState({
    businessName: 'Yadav Agro Logistics Services',
    contactName: 'Suresh Yadav',
    phone: '+91 98765 43210',
    email: 'logistics001@krishisetu.demo',
    operatingRadiusKm: 350,
    serviceArea: 'Varanasi - Lucknow - Gorakhpur Corridor (Eastern UP)',
    gstinNumber: '09AAECY1234F1Z8',
    panNumber: 'AAECY1234F',
    defaultFuelType: 'DIESEL',
  });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await logisticsService.getProfile();
        if (res) {
          setForm((prev) => ({
            ...prev,
            businessName: res.businessName || res.companyName || prev.businessName,
            contactName: res.contactName || prev.contactName,
            phone: res.phone || prev.phone,
            operatingRadiusKm: res.operatingRadiusKm || prev.operatingRadiusKm,
            serviceArea: res.serviceArea || res.coverageArea || prev.serviceArea,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await logisticsService.updateProfile(form);
      setToastMessage('Logistics partner profile updated successfully!');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Partner Profile & Dispatch Configuration</h1>
              <p className="text-xs text-stone-500">Commercial enterprise details, operating radius, and compliance documents</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Info (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" /> Enterprise Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Business / Firm Name</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Primary Contact Name</label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Mobile Contact (WhatsApp Enabled)</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Official Email Address</label>
                <input
                  type="email"
                  disabled
                  value={form.email}
                  className="w-full px-3.5 py-2 bg-stone-100 border border-stone-200 rounded-xl text-stone-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-blue-600" /> Operational Corridor Coverage
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Operating Radius (km)</label>
                  <input
                    type="number"
                    value={form.operatingRadiusKm}
                    onChange={(e) => setForm({ ...form, operatingRadiusKm: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">Maximum dispatch radius from primary base</span>
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Designated Highway Corridors</label>
                  <input
                    type="text"
                    value={form.serviceArea}
                    onChange={(e) => setForm({ ...form, serviceArea: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">Routes prioritized by AI load matching</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Verification (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Compliance Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-xl">
                <div className="flex items-center justify-between font-bold text-emerald-800">
                  <span>GSTIN Registered</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-mono text-[11px] text-emerald-700 mt-1">{form.gstinNumber}</div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-xl">
                <div className="flex items-center justify-between font-bold text-emerald-800">
                  <span>PAN Verified</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-mono text-[11px] text-emerald-700 mt-1">{form.panNumber}</div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <div className="font-semibold text-stone-700">Commercial Transport License</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Valid until 12 Nov 2028</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100 text-[11px] text-stone-500">
              Your profile is verified with Level-3 Gold Tier status. You receive immediate access to high-value cold storage transit loads.
            </div>
          </div>
        </form>
      </div>
    </LogisticsLayout>
  );
}

export default SettingsPage;
