import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import geoJson from "../assets/100000_full.json";
import innerMongoliaGeoJson from "../assets/150000_full.json";
import { getRegionByFeature, REGIONS } from "../utils/regionData";
import { useSettings } from "../context/SettingsContext";

// Merge Inner Mongolia cities into the main map
const mergedFeatures = geoJson.features.filter(
  (f) => f.properties.adcode !== 150000 && f.properties.name !== "内蒙古自治区"
).concat(innerMongoliaGeoJson.features.map(f => ({
  ...f,
  properties: {
    ...f.properties,
    cp: f.properties.center // ECharts uses 'cp' for label position
  }
})));

const mergedGeoJson = {
  ...geoJson,
  features: mergedFeatures,
};

const SalesMap = ({ onRegionSelect, selectedRegion }) => {
  const [option, setOption] = useState({});
  const chartRef = useRef(null);
  const { fontSize, regionColors } = useSettings();

  useEffect(() => {
    echarts.registerMap("china", mergedGeoJson);

    const data = mergedGeoJson.features.map((feature) => {
      const region = getRegionByFeature(feature);
      const isInnerMongoliaCity = feature.properties.adcode && String(feature.properties.adcode).startsWith("15");
      const isXilinGol = feature.properties.adcode === 152500; // Use Xilin Gol as the anchor for "Inner Mongolia" label

      let labelSettings = {
        show: true,
        color: "#000",
      };

      if (isInnerMongoliaCity) {
        if (isXilinGol) {
          labelSettings = {
            show: true,
            formatter: "内蒙古", // Custom label for the province
            fontSize: fontSize, // Strictly synchronize with global font size
            color: "#000",
          };
        } else {
          labelSettings = {
            show: false, // Hide other city labels
          };
        }
      }

      // Special handling for specific labels
      if (feature.properties.name.includes("香港") || feature.properties.name.includes("澳门")) {
        labelSettings.show = false;
      }

      if (feature.properties.name.includes("北京")) {
        labelSettings.offset = [0, -15];
      }
      if (feature.properties.name.includes("天津")) {
        labelSettings.offset = [30, 10];
      }
      if (feature.properties.name.includes("河北")) {
        labelSettings.offset = [-30, 30];
      }

      // Focus Mode Logic
      const isSelected = selectedRegion ? (region && region.id === selectedRegion.id) : true;
      const areaColor = isSelected
        ? (region ? regionColors[region.id] : "#eee")
        : "#f3f4f6"; // Gray out if not selected
      const borderColor = isSelected
        ? (region ? region.borderColor : "#999")
        : "#e5e7eb";

      return {
        name: feature.properties.name,
        value: region ? region.id : 0,
        region: region,
        itemStyle: {
          areaColor: areaColor,
          borderColor: borderColor,
          borderWidth: 0.5,
        },
        emphasis: {
          itemStyle: {
            areaColor: areaColor, // Keep color stable on hover
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
          label: labelSettings, // Apply custom label settings
        },
        label: labelSettings, // Apply custom label settings to normal state too
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

          // Find specific rep
          let rep = "待定";
          if (region.team) {
            if (region.team.areaReps && region.team.areaReps[name]) {
              // If it's an array, join them
              const reps = region.team.areaReps[name];
              rep = Array.isArray(reps) ? reps.join("、") : reps;
            } else if (region.team.cities && region.team.cities[name]) {
              rep = region.team.cities[name];
            } else if (region.team.areaReps) {
              // Try to find if the city belongs to a province in areaReps? 
              // For now, simple lookup. If not found, check if it's a province name match
            }
          }

          return `
            <div class="p-2">
              <div class="font-bold text-lg mb-1">${name}</div>
              <div class="text-sm mb-1">所属: <span class="font-semibold" style="color: ${region.borderColor}">${region.name}</span></div>
              <div class="text-sm">业务员: <span class="font-semibold text-blue-600">${rep}</span></div>
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
      series: [
        {
          name: "Sales Regions",
          type: "map",
          map: "china", // Map registered name
          roam: true,
          zoom: 1.2,
          selectedMode: false, // Disable selection to prevent "stuck yellow" color
          label: {
            show: true,
            color: "#333",
            fontSize: fontSize, // Use dynamic font size
            formatter: function (params) {
              const name = params.name;
              // Simplify names: remove suffixes like Province, City, Autonomous Region
              return name
                .replace(/(?:自治区|省|市|维吾尔|回族|壮族|特别行政区)/g, "")
                .replace("内蒙古", "内蒙古"); // Ensure Inner Mongolia is kept (though handled separately below)
            },
          },
          labelLayout: {
            hideOverlap: false,
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
  }, [fontSize, regionColors, selectedRegion]); // Re-render when settings or selection change

  const onChartClick = (params) => {
    if (params.data && params.data.region) {
      onRegionSelect(params.data.region);
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 rounded-xl shadow-inner overflow-hidden relative">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "canvas" }}
        onEvents={{
          click: onChartClick,
        }}
      />
    </div>
  );
};

export default SalesMap;
