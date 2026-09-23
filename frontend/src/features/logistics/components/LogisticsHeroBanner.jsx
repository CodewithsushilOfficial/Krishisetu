import React from 'react';
import { Sprout, ShieldCheck, Users } from 'lucide-react';

export function LogisticsHeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/90 shadow-2xs min-h-[170px] flex items-center">
      {/* Background Hero Image */}
      <img
        src="/assets/dashboard/logistics_hero_banner.jpg"
        alt="KrishiSetu Logistics Corridor"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Subtle overlay gradient to ensure high readability on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:w-2/3 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Titles */}
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f2e1f] leading-none">
            Delivering Fresh Produce
          </h1>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f2e1f] leading-tight mt-1">
            A Stronger Tomorrow
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-stone-600 mt-2">
            Connecting Farms, Markets and People.
          </p>
        </div>

        {/* Right: 3 Value Pills (Exactly matching the reference image) */}
        <div className="flex items-center gap-4 sm:gap-6 bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-white/60 shadow-2xs">
          {/* Badge 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-[#0e5c36] text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-stone-900 mt-1.5 whitespace-nowrap">
              Fresh Produce
            </span>
          </div>

          {/* Badge 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-[#0e5c36] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-stone-900 mt-1.5 whitespace-nowrap">
              Reliable Logistics
            </span>
          </div>

          {/* Badge 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-[#0e5c36] text-white flex items-center justify-center shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-stone-900 mt-1.5 whitespace-nowrap">
              Growing Together
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogisticsHeroBanner;
