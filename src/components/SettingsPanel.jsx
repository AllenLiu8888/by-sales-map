import React from "react";
import { useSettings } from "../context/SettingsContext";
import { REGIONS } from "../utils/regionData";

const SettingsPanel = ({ isOpen, onClose }) => {
  const { fontSize, setFontSize, regionColors, updateRegionColor } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">设置</h2>

        {/* Font Size Setting */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            地图字体大小: {fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="40"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>小</span>
            <span>大</span>
          </div>
        </div>

        {/* Region Colors Setting */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">销区颜色配置</h3>
          <div className="space-y-4">
            {Object.values(REGIONS).map((region) => (
              <div key={region.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{region.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={regionColors[region.id]}
                    onChange={(e) => updateRegionColor(region.id, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs text-gray-400 font-mono">
                    {regionColors[region.id]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
