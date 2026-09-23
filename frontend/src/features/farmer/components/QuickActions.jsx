import React from 'react';
import { useNavigate } from 'react-router-dom';

export function QuickActions({ onAddProduce, onViewDemand, onTrackShipment, onCheckPrices }) {
  const navigate = useNavigate();

  const handleAddProduce = () => {
    if (onAddProduce) onAddProduce();
    else navigate('/farmer/produce?action=create');
  };

  const handleViewDemand = () => {
    if (onViewDemand) onViewDemand();
    else navigate('/farmer/buyer-demand');
  };

  const handleTrackShipment = () => {
    if (onTrackShipment) onTrackShipment();
    else navigate('/farmer/orders');
  };

  const handleCheckPrices = () => {
    if (onCheckPrices) onCheckPrices();
    else navigate('/farmer/market-prices');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs flex flex-col">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 pb-3">
          <svg className="w-5 h-5 text-[#107c41] fill-current" viewBox="0 0 24 24">
            <path d="M7 2v11h3v9l7-12h-4l4-8z" />
          </svg>
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            Quick Actions
          </h2>
        </div>

        {/* 4 Action Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
          {/* Tile 1: Add Produce */}
          <button
            onClick={handleAddProduce}
            className="p-3 rounded-2xl bg-[#eef8f2] border border-[#d2edd9] hover:bg-[#e4f6ec] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer active:scale-95 shadow-2xs"
          >
            <div className="h-8 w-8 flex items-center justify-center text-[#138808] group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight">
              Add Produce
            </span>
          </button>

          {/* Tile 2: View Buyer Demand */}
          <button
            onClick={handleViewDemand}
            className="p-3 rounded-2xl bg-[#eff6ff] border border-[#dbeafe] hover:bg-[#e0f2fe] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer active:scale-95 shadow-2xs"
          >
            <div className="h-8 w-8 flex items-center justify-center text-[#1d4ed8] group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight">
              View Buyer Demand
            </span>
          </button>

          {/* Tile 3: Track Shipment */}
          <button
            onClick={handleTrackShipment}
            className="p-3 rounded-2xl bg-[#f5f3ff] border border-[#ede9fe] hover:bg-[#ede9fe] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer active:scale-95 shadow-2xs"
          >
            <div className="h-8 w-8 flex items-center justify-center text-[#7c3aed] group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight">
              Track Shipment
            </span>
          </button>

          {/* Tile 4: Check Market Prices */}
          <button
            onClick={handleCheckPrices}
            className="p-3 rounded-2xl bg-[#fffbeb] border border-[#fef3c7] hover:bg-[#fef3c7] transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer active:scale-95 shadow-2xs"
          >
            <div className="h-8 w-8 flex items-center justify-center text-[#b45309] group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zM16.2 13h2.8v6h-2.8z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight">
              Check Market Prices
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;
