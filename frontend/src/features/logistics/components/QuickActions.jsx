import React from 'react';
import { Compass, Search, Share2, PlusCircle, AlertTriangle, Headphones } from 'lucide-react';

export function QuickActions({ onAction = null }) {
  const actions = [
    {
      id: 'accept_loads',
      label: 'Find Loads',
      icon: Search,
      bg: 'bg-[#edf8f2]',
      iconColor: 'text-[#0e5c36]',
    },
    {
      id: 'view_routes',
      label: 'Plan Route',
      icon: Share2,
      bg: 'bg-[#eef5fc]',
      iconColor: 'text-blue-700',
    },
    {
      id: 'add_trip',
      label: 'Add Trip',
      icon: PlusCircle,
      bg: 'bg-[#edf8f2]',
      iconColor: 'text-[#0e5c36]',
    },
    {
      id: 'report_issue',
      label: 'Report Issue',
      icon: AlertTriangle,
      bg: 'bg-[#fef2f2]',
      iconColor: 'text-red-600',
    },
    {
      id: 'contact_support',
      label: 'Contact Support',
      icon: Headphones,
      bg: 'bg-[#f5effe]',
      iconColor: 'text-purple-700',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
        <div className="w-5 h-5 rounded-md bg-emerald-50 text-[#0e5c36] flex items-center justify-center">
          <Compass className="w-3.5 h-3.5" />
        </div>
        <h3 className="font-bold text-stone-900 text-sm">Quick Actions</h3>
      </div>

      {/* 5 Actions Horizontal Grid */}
      <div className="grid grid-cols-5 gap-2 my-2 flex-1 items-center">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onAction && onAction(act.id)}
              className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-stone-50 transition-colors group"
            >
              <div
                className={`w-10 h-10 rounded-xl ${act.bg} ${act.iconColor} flex items-center justify-center shadow-2xs transition-transform group-hover:scale-110 mb-1.5`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-stone-700 text-center leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
