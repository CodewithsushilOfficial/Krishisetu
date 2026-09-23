import React, { useState } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import { Settings, Sliders, BellRing, Lock, Shield, CheckCircle2, Save } from 'lucide-react';

export function FpoSettingsPage() {
  const [settings, setSettings] = useState({
    commissionRate: '4.5',
    storageAlertThreshold: '85',
    weatherAlertsEnabled: true,
    autoMatchDemand: true,
    smsDisbursements: true,
    dailyDigestEmail: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <FpoLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                FPO Operational Parameters & System Settings
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Configure commission deductions, warehouse storage warning thresholds, and automated notifications.
              </p>
            </div>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Operational settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Operational thresholds */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sliders className="h-4.5 w-4.5 text-emerald-700" />
              Operational Thresholds & Aggregation Rules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  Default FPO Service Commission (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Deducted on gross sale to cover transport and handling</span>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  Collection Center Warning Capacity (%)
                </label>
                <input
                  type="number"
                  value={settings.storageAlertThreshold}
                  onChange={(e) => setSettings({ ...settings, storageAlertThreshold: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Triggers high-priority logistics rerouting notifications</span>
              </div>
            </div>
          </div>

          {/* Automation & notifications */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <BellRing className="h-4.5 w-4.5 text-emerald-700" />
              Automated Alerts & Dispatch Notifications
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8faf9] border border-stone-200/60 cursor-pointer hover:bg-stone-50 transition-colors">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Automated Lot Matching with Buyer Demand</span>
                  <span className="text-[11px] text-stone-500">Instantly flag compatible institutional buyer demands against verified lots</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoMatchDemand}
                  onChange={(e) => setSettings({ ...settings, autoMatchDemand: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8faf9] border border-stone-200/60 cursor-pointer hover:bg-stone-50 transition-colors">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Real-time Weather & Perishable Risk Advisories</span>
                  <span className="text-[11px] text-stone-500">Receive proactive warnings for regional rainfall on collection centers</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weatherAlertsEnabled}
                  onChange={(e) => setSettings({ ...settings, weatherAlertsEnabled: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8faf9] border border-stone-200/60 cursor-pointer hover:bg-stone-50 transition-colors">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Instant SMS to Farmers on Escrow Settlement</span>
                  <span className="text-[11px] text-stone-500">Dispatch transaction credit notifications in Hindi directly to farmer mobiles</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.smsDisbursements}
                  onChange={(e) => setSettings({ ...settings, smsDisbursements: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#107c41] hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </FpoLayout>
  );
}

export default FpoSettingsPage;
