import React from 'react';
import { Truck, Package, IndianRupee, Fuel, BarChart2 } from 'lucide-react';

function extractDisplayValue(objOrPrimitive, fallback) {
  if (objOrPrimitive == null) return fallback;
  if (typeof objOrPrimitive === 'object') {
    if (objOrPrimitive.value != null) return String(objOrPrimitive.value);
    if (objOrPrimitive.numericValue != null) return String(objOrPrimitive.numericValue);
    return fallback;
  }
  if (typeof objOrPrimitive === 'number') {
    return String(objOrPrimitive);
  }
  return String(objOrPrimitive);
}

function extractTrend(objOrPrimitive, fallback) {
  if (objOrPrimitive == null) return fallback;
  if (typeof objOrPrimitive === 'object') {
    if (objOrPrimitive.trend != null) return String(objOrPrimitive.trend);
    if (objOrPrimitive.subtext != null) return String(objOrPrimitive.subtext);
    return fallback;
  }
  return fallback;
}

export function LogisticsKpiCards({ kpis = {} }) {
  // Extract values safely handling both objects and primitives
  const activeShipmentsVal = extractDisplayValue(kpis?.activeShipments ?? kpis?.activeLoads, '4');
  const activeShipmentsTrend = extractTrend(kpis?.activeShipments, '↑ 2 from last week');

  const totalDistVal = extractDisplayValue(kpis?.totalDistance, '1,250 km');
  const totalDistTrend = extractTrend(kpis?.totalDistance, '↑ 18% from last month');

  const totalEarningsVal = extractDisplayValue(kpis?.totalEarnings, '₹ 42,800');
  const totalEarningsTrend = extractTrend(kpis?.totalEarnings, '↑ 12% from last month');

  const fuelCostVal = extractDisplayValue(kpis?.fuelCost, '₹ 12,400');
  const fuelCostTrend = extractTrend(kpis?.fuelCost, '29% of total cost');

  const vehicleUtilVal = extractDisplayValue(kpis?.vehicleUtilization, '78%');
  const vehicleUtilTrend = extractTrend(kpis?.vehicleUtilization, '↑ 14% from last month');

  const cards = [
    {
      id: 'active_shipments',
      label: 'Active Shipments',
      value: activeShipmentsVal,
      subtext: activeShipmentsTrend,
      icon: Truck,
      cardBg: 'bg-[#edf8f2]',
      circleBg: 'bg-[#cde9da]',
      iconColor: 'text-[#0e5c36]',
      subtextColor: 'text-[#0e5c36]',
    },
    {
      id: 'total_distance',
      label: 'Total Distance',
      value: totalDistVal.includes('km') ? totalDistVal : `${totalDistVal} km`,
      subtext: totalDistTrend,
      icon: Package,
      cardBg: 'bg-[#eef5fc]',
      circleBg: 'bg-[#c8e2fb]',
      iconColor: 'text-blue-700',
      subtextColor: 'text-emerald-700',
    },
    {
      id: 'total_earnings',
      label: 'Total Earnings',
      value: totalEarningsVal.startsWith('₹') ? totalEarningsVal : `₹ ${totalEarningsVal}`,
      subtext: totalEarningsTrend,
      icon: IndianRupee,
      cardBg: 'bg-[#fff8ec]',
      circleBg: 'bg-[#fde2bf]',
      iconColor: 'text-amber-600',
      subtextColor: 'text-emerald-700',
    },
    {
      id: 'fuel_cost',
      label: 'Fuel Cost',
      value: fuelCostVal.startsWith('₹') ? fuelCostVal : `₹ ${fuelCostVal}`,
      subtext: fuelCostTrend,
      icon: Fuel,
      cardBg: 'bg-[#f5effe]',
      circleBg: 'bg-[#e2d0fa]',
      iconColor: 'text-purple-700',
      subtextColor: 'text-stone-500',
    },
    {
      id: 'vehicle_utilization',
      label: 'Vehicle Utilization',
      value: vehicleUtilVal.endsWith('%') ? vehicleUtilVal : `${vehicleUtilVal}%`,
      subtext: vehicleUtilTrend,
      icon: BarChart2,
      cardBg: 'bg-[#edf8f2]',
      circleBg: 'bg-[#cde9da]',
      iconColor: 'text-[#0e5c36]',
      subtextColor: 'text-[#0e5c36]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className={`${c.cardBg} p-4 rounded-2xl border border-stone-200/70 shadow-2xs flex flex-col justify-between transition-all`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className={`w-10 h-10 rounded-xl ${c.circleBg} ${c.iconColor} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left pl-1">
                <span className="text-xs font-semibold text-stone-600 block">
                  {c.label}
                </span>
                <span className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight block mt-0.5">
                  {c.value}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-200/50 text-[11px] font-bold">
              <span className={c.subtextColor}>{c.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LogisticsKpiCards;
