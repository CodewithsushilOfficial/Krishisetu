import React from 'react';

export function WelcomeHero({ farmer }) {
  const farmerName = farmer?.fullName || 'Ramesh Kumar';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e8f4fc] via-[#edf7f2] to-[#e4f6ec] border border-emerald-100/70 shadow-2xs">
      {/* Right Landscape Art Layer */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 lg:w-3/5 pointer-events-none overflow-hidden">
        <img
          src="/assets/dashboard/welcome_banner_landscape.png"
          alt="Better Farmers Brighter Futures"
          className="h-full w-full object-cover object-right opacity-95"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Soft linear fade on left edge so text is always 100% legible */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#e8f4fc] via-[#e8f4fc]/80 to-transparent" />
      </div>

      {/* Left Content */}
      <div className="relative z-10 px-5 py-5 sm:px-7 sm:py-6 max-w-xl">
        <div className="flex items-center gap-3">
          {/* Green Leaf Icon */}
          <div className="h-9 w-9 rounded-xl bg-emerald-100/80 flex items-center justify-center text-[#107c41] shrink-0 shadow-2xs">
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
            </svg>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-black tracking-tight text-slate-900">
            Namaste, {farmerName}!
          </h1>
        </div>

        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed sm:pl-12">
          Good to see you again. Let&apos;s grow a better tomorrow together.
        </p>
      </div>
    </div>
  );
}

export default WelcomeHero;
