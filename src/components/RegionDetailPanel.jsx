import React from "react";
import { clsx } from "clsx";

const RegionDetailPanel = ({ region, onClose }) => {
  if (!region) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{region.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="mb-2">
              <span className="text-sm text-gray-500 block">区域负责人</span>
              <span className="text-lg font-semibold text-gray-900">
                {region.manager}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">覆盖区域</span>
              <span className="text-gray-700">{region.area}</span>
            </div>
          </div>

          {/* Organization Structure */}
          {region.team && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                组织架构 & 人员
              </h3>

              {/* Management Team */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">业务经理</span>
                  <span className="font-semibold text-gray-900">{region.team.businessManager || "暂无"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">办公室</span>
                  <span className="font-semibold text-gray-900">{region.team.office || "暂无"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">内勤/售后</span>
                  <span className="font-semibold text-gray-900">{region.team.internal || "暂无"}</span>
                </div>
              </div>

              {/* Area Reps */}
              {region.team.areaReps && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">各区域业务员</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(region.team.areaReps).map(([area, reps]) => (
                      <div key={area} className="flex flex-col bg-gray-50 px-3 py-2 rounded border border-gray-100">
                        <span className="text-sm font-medium text-gray-700 mb-1">{area}</span>
                        <div className="flex flex-wrap gap-1">
                          {reps.map((rep, idx) => (
                            <span key={idx} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                              {rep}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Province List */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-green-500 pl-3">
              包含省份
            </h3>
            <div className="flex flex-wrap gap-2">
              {region.provinces.map((province, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {province}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionDetailPanel;
