import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, MoreVertical, Plus, Fuel, Radio, Scale } from 'lucide-react';

const TRUCK_IMAGES = {
  UP65XX1234: '/assets/dashboard/trucks/tata_truck.svg',
  UP78YY5678: '/assets/dashboard/trucks/eicher_truck.svg',
  UP32ZZ9012: '/assets/dashboard/trucks/mahindra_truck.svg',
};

export function VehicleList({ vehicles = [], onAddVehicle = null }) {
  // Demo fallback matching the screenshot
  const displayVehicles = vehicles.length > 0 ? vehicles : [
    {
      id: 'v1',
      plateNumber: 'UP65XX1234',
      vehicleNumber: 'UP65XX1234',
      brand: 'Tata',
      model: '10 Ton',
      capacityTon: 10,
      fuelType: 'Diesel',
      gpsEnabled: true,
      status: 'ACTIVE',
    },
    {
      id: 'v2',
      plateNumber: 'UP78YY5678',
      vehicleNumber: 'UP78YY5678',
      brand: 'Eicher',
      model: '16 Ton',
      capacityTon: 16,
      fuelType: 'Diesel',
      gpsEnabled: false,
      status: 'IN_MAINTENANCE',
    },
    {
      id: 'v3',
      plateNumber: 'UP32ZZ9012',
      vehicleNumber: 'UP32ZZ9012',
      brand: 'Mahindra',
      model: '5 Ton',
      capacityTon: 5,
      fuelType: 'CNG',
      gpsEnabled: true,
      status: 'ACTIVE',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-50 text-[#0e5c36] flex items-center justify-center">
            <Truck className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">My Vehicles</h3>
        </div>

        <NavLink
          to="/logistics/vehicles"
          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All
        </NavLink>
      </div>

      {/* Vehicle Cards List */}
      <div className="space-y-3.5 my-3 flex-1">
        {displayVehicles.slice(0, 3).map((v) => {
          const plate = v.plateNumber || v.vehicleNumber;
          const imageSrc = TRUCK_IMAGES[plate] || '/assets/dashboard/trucks/tata_truck.svg';
          const isActive = v.status === 'ACTIVE' || v.status === 'AVAILABLE';
          const brandModel = `${v.brand || 'Commercial'} ${v.model || `${v.capacityTon || 10} Ton`}`;

          return (
            <div
              key={v.id}
              className="p-2.5 rounded-xl border border-stone-200/80 hover:border-emerald-400/60 bg-stone-50/40 hover:bg-stone-50 transition-all flex items-center gap-3"
            >
              {/* Truck image container */}
              <div className="w-16 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 p-1">
                <img
                  src={imageSrc}
                  alt={brandModel}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Middle specs */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-stone-900 block leading-tight">
                      {plate}
                    </span>
                    <span className="text-[11px] font-medium text-stone-500 block leading-tight">
                      {brandModel}
                    </span>
                  </div>

                  {/* Status badge + More */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                        isActive
                          ? 'bg-emerald-50 text-[#0e5c36] border-emerald-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-emerald-600' : 'bg-stone-400'
                        }`}
                      />
                      {isActive ? 'Active' : 'In Maintenance'}
                    </span>
                    <NavLink
                      to={`/logistics/vehicles`}
                      className="text-stone-400 hover:text-stone-700 p-0.5"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </NavLink>
                  </div>
                </div>

                {/* Bottom specs line: Weight • Fuel • GPS */}
                <div className="mt-1.5 flex items-center gap-2.5 text-[10px] text-stone-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3 h-3 text-stone-400" />
                    <span>{v.capacityTon || 10} Ton</span>
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-stone-400" />
                    <span>{v.fuelType || 'Diesel'}</span>
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="flex items-center gap-1">
                    <Radio className={`w-3 h-3 ${v.gpsEnabled ? 'text-[#0e5c36]' : 'text-stone-400'}`} />
                    <span className={v.gpsEnabled ? 'text-[#0e5c36] font-semibold' : 'text-stone-400'}>
                      {v.gpsEnabled ? 'GPS On' : 'GPS Off'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Vehicle Outline Button */}
      <div className="pt-2 border-t border-stone-100">
        <button
          onClick={onAddVehicle}
          className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:border-[#0e5c36] text-stone-700 hover:text-[#0e5c36] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#0e5c36]" />
          <span>Add New Vehicle</span>
        </button>
      </div>
    </div>
  );
}

export default VehicleList;
