import React from 'react';
import { useNavigate } from 'react-router-dom';

export function PromotionalBanner() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/farmer/market-prices')}
      className="relative overflow-hidden rounded-2xl border border-emerald-200/80 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer w-full h-[155px] sm:h-[165px] group flex items-center bg-emerald-50"
    >
      {/* Background Graphic Asset */}
      <img
        src="/assets/dashboard/promo_banner_raw.png"
        alt="Small Steps Big Harvests With KrishiSetu"
        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        onError={(e) => {
          // Fallback if asset is unavailable
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
}

export default PromotionalBanner;
