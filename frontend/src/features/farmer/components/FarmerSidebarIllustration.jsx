import React from 'react';

export default function FarmerSidebarIllustration() {
  return (
    <div className="w-full">
      {/* Smart Farmers Stronger India Card */}
      <div className="rounded-xl overflow-hidden border border-emerald-100/90 shadow-2xs bg-white">
        <img
          src="/assets/dashboard/sidebar_smart_farmer.png"
          alt="Smart Farmers Stronger India"
          className="w-full h-auto max-h-[115px] object-cover object-top block"
          onError={(e) => {
            // Fallback if asset fails to load
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Footer Tagline */}
      <div className="text-center mt-2 space-y-0.5">
        <div className="text-[11px] font-medium text-slate-500 tracking-wide">
          Grow • Connect • Prosper
        </div>
        <div className="text-xs font-black text-emerald-800 tracking-tight">
          with <span className="text-emerald-600">KrishiSetu</span>
        </div>
      </div>
    </div>
  );
}

