import React from "react";
import { REGIONS } from "../utils/regionData";

const RegionList = ({ onSelect }) => {
  return (
    <aside className="w-64 bg-white h-full shadow-lg z-10 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">🗺️</span> 销售区域
        </h1>
        <p className="text-xs text-gray-400 mt-2">Sales Region Management</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {Object.values(REGIONS).map((region) => (
          <div
            key={region.id}
            onClick={() => onSelect && onSelect(region.id)}
            className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-gray-50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{region.name}</span>
              <span
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: region.color }}
              />
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {region.manager}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {region.area}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default RegionList;
