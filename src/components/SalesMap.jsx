import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import geoJson from "../assets/100000_full.json";
import innerMongoliaGeoJson from "../assets/150000_full.json";
import { getRegionByFeature, REGIONS } from "../utils/regionData";

// Merge Inner Mongolia cities into the main map
const mergedFeatures = geoJson.features.filter(
  (f) => f.properties.adcode !== 150000 && f.properties.name !== "内蒙古自治区"
).concat(innerMongoliaGeoJson.features);

const mergedGeoJson = {
  ...geoJson,
  features: mergedFeatures,
};

const SalesMap = () => {
  const [option, setOption] = useState({});
  const chartRef = useRef(null);

  useEffect(() => {
    echarts.registerMap("china", mergedGeoJson);

    const data = mergedGeoJson.features.map((feature) => {
      const region = getRegionByFeature(feature);
      return {
        name: feature.properties.name,
        value: region ? region.id : 0,
        region: region,
        itemStyle: {
          areaColor: region ? region.color : "#eee",
          borderColor: region ? region.borderColor : "#999",
          borderWidth: 0.5,
        },
        emphasis: {
          itemStyle: {
            areaColor: region ? region.color : "#eee", // Keep same color on hover, maybe darken slightly?
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
          label: {
            show: true,
            color: "#000",
          },
        },
      };
    });

    const chartOption = {
      title: {
        text: "中国销售区域分布图",
        subtext: "Sales Region Distribution",
        left: "center",
        top: 20,
        textStyle: {
          fontSize: 24,
          fontWeight: "bold",
          color: "#1f2937",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          const { name, data } = params;
          if (!data || !data.region) return `${name}: 未分配区域`;
          const { region } = data;
          return `
            <div class="p-2">
              <div class="font-bold text-lg mb-1">${name}</div>
              <div class="text-sm">所属: <span class="font-semibold" style="color: ${region.borderColor}">${region.name}</span></div>
              <div class="text-sm">负责人: ${region.manager}</div>
              <div class="text-xs text-gray-500 mt-1">${region.area}</div>
            </div>
          `;
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textStyle: {
          color: "#374151",
        },
        extraCssText: "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 0.5rem;",
      },
      // geo: { ... }, // Removed separate geo component to avoid style conflicts
      series: [
        {
          name: "Sales Regions",
          type: "map",
          map: "china", // Map registered name
          roam: true,
          zoom: 1.2,
          label: {
            show: true,
            color: "#333",
            fontSize: 10,
          },
          itemStyle: {
            areaColor: "#eee",
            borderColor: "#999",
          },
          data: data,
        },
      ],
    };

    setOption(chartOption);
  }, []);

  return (
    <div className="w-full h-full bg-slate-50 rounded-xl shadow-inner overflow-hidden relative">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
        * 滚轮缩放 / 拖拽移动
      </div>
    </div>
  );
};

export default SalesMap;
