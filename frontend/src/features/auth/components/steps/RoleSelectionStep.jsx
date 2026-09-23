import React from 'react';
import { Sprout, Users, ShoppingCart, Truck, Package, Check } from 'lucide-react';

/* ─────────────────────────── role definitions ─────────────────────────── */

/*
 * ROLE_DEFINITIONS is exported so ReviewStep can resolve a role key → display name.
 * Public roles only — ADMIN and CONTROL_ADMIN are NOT in this list.
 */
export const ROLE_DEFINITIONS = [
  {
    key: 'FARMER',
    title: 'Farmer',
    icon: Sprout,
    desc: 'Sell your produce, get better prices',
    imageSrc: '/assets/roles/farmer.png',
  },
  {
    key: 'FPO',
    title: 'FPO',
    icon: Users,
    desc: 'Manage your organization and members',
    imageSrc: '/assets/roles/fpo.png',
  },
  {
    key: 'BULK_BUYER',
    title: 'Buyer',
    icon: ShoppingCart,
    desc: 'Source quality agricultural produce directly',
    imageSrc: '/assets/roles/bulk_buyer.png',
  },
  {
    key: 'LOGISTICS',
    title: 'Logistics',
    icon: Truck,
    desc: 'Provide transportation and delivery services',
    imageSrc: '/assets/roles/logistics.png',
  },
  {
    key: 'CONSUMER',
    title: 'Consumer',
    icon: Package,
    desc: 'Shop fresh produce from local farmers',
    imageSrc: '/assets/roles/consumer.png',
  },
];

/* ─────────────────────────── component ─────────────────────────── */

export function RoleSelectionStep({ selectedRole, onSelectRole }) {
  return (
    <div>
      {/* Step header — compact to fit inside the right panel */}
      <div className="mb-5">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">
          Let's Get Started
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">
          Select your role to create a tailored KrishiSetu account.
        </p>
      </div>

      {/* Role card grid — two columns on ≥sm */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        role="listbox"
        aria-label="Select your role"
      >
        {ROLE_DEFINITIONS.map(({ key, title, icon: Icon, desc }) => {
          const isSelected = selectedRole === key;
          return (
            <button
              key={key}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelectRole(key)}
              className={`group relative flex items-center gap-3 w-full rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green-500/40 ${
                isSelected
                  ? 'border-green-500 bg-green-50 shadow-sm ring-1 ring-green-400/30'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/40 hover:shadow-sm'
              }`}
            >
              {/* Role icon */}
              <div
                className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-green-100'
                    : 'bg-gray-100 group-hover:bg-green-100'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isSelected ? 'text-green-700' : 'text-gray-500 group-hover:text-green-700'
                  }`}
                  aria-hidden="true"
                />
              </div>

              {/* Role text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-bold leading-none mb-1 ${
                    isSelected ? 'text-green-900' : 'text-gray-800'
                  }`}
                >
                  {title}
                </p>
                <p
                  className={`text-xs leading-snug ${
                    isSelected ? 'text-green-700' : 'text-gray-500'
                  }`}
                >
                  {desc}
                </p>
              </div>

              {/* Selection indicator circle */}
              <div
                className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-200 group-hover:border-green-300'
                }`}
                aria-hidden="true"
              >
                {isSelected && (
                  <Check className="h-3 w-3 text-white stroke-[3]" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper nudge */}
      <p className="mt-4 text-center text-[11px] text-gray-400">
        Tap any role to automatically continue to the next step
      </p>
    </div>
  );
}

export default RoleSelectionStep;
