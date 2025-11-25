import React from "react";
import { REGIONS } from "../utils/regionData";
import clsx from "clsx";

const RegionList = () => {
  return (
    <div className="h-full overflow-y-auto p-6 bg-white shadow-xl z-10 w-full md:w-96 flex-shrink-0 border-r border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
        销售分区列表
      </h2>
      <div className="space-y-6">
        {Object.values(REGIONS).map((region) => (
          <div
            key={region.id}
            className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Color Indicator Strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2"
              style={{ backgroundColor: region.borderColor }}
            />

            <div className="p-5 pl-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {region.name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {region.manager}
                </span>
              </div>

              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">主要区域</div>
                <div className="text-sm text-gray-700 font-medium">{region.area}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">覆盖范围</div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {region.provinces.join("、")}
                </p>
                {region.special && (
                  <div className="mt-2 pt-2 border-t border-gray-50">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      特殊说明
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{region.special}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-bold text-blue-900 mb-2">⚠️ 特别备注：内蒙古划分</h4>
        <div className="text-xs text-blue-800 space-y-2">
          <p>
            <span className="font-semibold">销区三（东部）：</span>
            乌兰察布市、锡林郭勒盟、赤峰市、通辽市、兴安盟、呼伦贝尔市
          </p>
          <p>
            <span className="font-semibold">销区五（西部）：</span>
            呼和浩特市、包头市、鄂尔多斯市、巴彦淖尔市、乌海市、阿拉善盟
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegionList;
