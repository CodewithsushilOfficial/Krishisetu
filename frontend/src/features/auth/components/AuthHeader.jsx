import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export function AuthHeader({ actionText = 'Already have an account?', actionLabel = 'Sign In', actionHref = '/auth/login' }) {
  return (
    <header className="w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-md shadow-emerald-900/15 group-hover:scale-105 transition-transform">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-stone-900 flex items-center gap-1.5">
              Krishi<span className="text-emerald-700">Setu</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                AgriTech
              </span>
            </div>
            <p className="text-[11px] font-medium text-stone-500">Bridging Farmers to Bharat</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-stone-600 hidden sm:inline">{actionText}</span>
          <Link
            to={actionHref}
            className="rounded-lg border border-emerald-600/30 px-3.5 py-1.5 font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AuthHeader;
