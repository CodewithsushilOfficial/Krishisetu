import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wrench, AlertTriangle } from 'lucide-react';

export function MaintenanceAlerts({ alerts = [], onSchedule = null }) {
  const displayAlerts = [
    {
      id: 1,
      title: 'UP78YY5678 - Service Due',
      desc: 'Engine oil change and brake check required.',
      color: 'text-red-600',
      boxBg: 'bg-red-50 text-red-600',
    },
    {
      id: 2,
      title: 'Tyre Pressure Low - UP65XX1234',
      desc: 'Front left tyre pressure is below recommended level.',
      color: 'text-amber-600',
      boxBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-50 text-[#0e5c36] flex items-center justify-center">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">Maintenance & Alerts</h3>
        </div>

        <NavLink
          to="/logistics/maintenance"
          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </NavLink>
      </div>

      {/* 2 Alerts matching screenshot */}
      <div className="my-2 space-y-3 flex-1">
        {displayAlerts.map((alt) => (
          <div
            key={alt.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg ${alt.boxBg} flex items-center justify-center shrink-0`}>
              <AlertTriangle className="w-4 h-4" />
            </div>

            <div className="text-xs leading-tight">
              <h4 className={`font-bold ${alt.color}`}>{alt.title}</h4>
              <p className="text-[11px] text-stone-500 mt-1">{alt.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaintenanceAlerts;
