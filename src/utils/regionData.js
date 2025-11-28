export const REGIONS = {
  1: {
    id: 1,
    name: "销区一",
    manager: "康 华",
    area: "华东地区",
    color: "#f97316", // Orange 500
    borderColor: "#c2410c", // Orange 700
    provinces: ["上海市", "江苏省", "安徽省", "山东省", "浙江省"],
  },
  2: {
    id: 2,
    name: "销区二",
    manager: "米宏伟",
    area: "华南及东南沿海",
    color: "#3b82f6", // Blue 500
    borderColor: "#1d4ed8", // Blue 700
    provinces: ["广东省", "福建省", "海南省"],
  },
  3: {
    id: 3,
    name: "销区三",
    manager: "中 昊",
    area: "华北及东北地区",
    color: "#22c55e", // Green 500
    borderColor: "#15803d", // Green 700
    provinces: ["北京市", "天津市", "河北省", "辽宁省", "黑龙江省", "吉林省"],
    special: "内蒙古东部",
  },
  4: {
    id: 4,
    name: "销区四",
    manager: "奥 斌",
    area: "华中地区",
    color: "#eab308", // Yellow 500
    borderColor: "#a16207", // Yellow 700
    provinces: ["河南省", "湖北省", "湖南省", "江西省"],
  },
  5: {
    id: 5,
    name: "销区五",
    manager: "刘 军",
    area: "西南、西北及华北西部",
    color: "#ef4444", // Red 500
    borderColor: "#b91c1c", // Red 700
    provinces: [
      "重庆市",
      "四川省",
      "贵州省",
      "云南省",
      "广西壮族自治区",
      "陕西省",
      "山西省",
      "甘肃省",
      "青海省",
      "宁夏回族自治区",
      "新疆维吾尔自治区",
      "西藏自治区",
    ],
    special: "内蒙古西部",
    team: {
      manager: "刘 军",
      businessManager: "杭 盖",
      office: "张春梅",
      internal: "孟慧平",
      structure: [], // Deprecated in favor of flat areaReps, but keeping for compatibility if needed or just remove
      areaReps: {
        "新疆维吾尔自治区": ["杭盖", "乔环宇", "郭有福"],
        "甘肃省": ["毛文虎", "郝国庆"],
        "青海省": ["毛文虎", "郝国庆"],
        "重庆市": ["高连柱", "高锦亮"],
        "四川省": ["高连柱", "毛文虎"],
        "广西壮族自治区": ["高连柱", "高锦亮", "丁帅雄"],
        "陕西省": ["王利军", "陈宇轩", "张磊", "李旭"],
        "山西省": ["王利军", "李旭", "多文贤", "吕小平"],
        "宁夏回族自治区": ["张宁", "史占亮", "梁敏慧", "吕小平", "陈宇"],
        "呼和浩特市": ["赵晶", "郭有福", "赵伟"],
        "包头市": ["张宁", "孙鹏飞"],
        "鄂尔多斯市": ["丁帅雄", "郭有福"],
        "巴彦淖尔市": ["张磊"],
        "乌海市": ["边志贵"],
        "阿拉善盟": ["胡强德"],
        "乌兰察布市": ["张磊", "郭有福"],
        "贵州省": ["待定"],
        "云南省": ["待定"],
      },
    },
  },
};

// Inner Mongolia Split Logic
const INNER_MONGOLIA_EAST = [
  "乌兰察布市",
  "锡林郭勒盟",
  "赤峰市",
  "通辽市",
  "兴安盟",
  "呼伦贝尔市",
];

const INNER_MONGOLIA_WEST = [
  "呼和浩特市",
  "包头市",
  "鄂尔多斯市",
  "巴彦淖尔市",
  "乌海市",
  "阿拉善盟",
];

export const getRegionByFeature = (feature) => {
  const { name, adcode } = feature.properties;
  const provinceName = feature.properties.province || name; // Fallback if province prop missing (usually top level)

  // Handle Inner Mongolia Special Case
  // Inner Mongolia adcode starts with 15
  if (String(adcode).startsWith("15") || feature.properties.province === "内蒙古自治区") {
    if (INNER_MONGOLIA_EAST.includes(name)) {
      return REGIONS[3];
    }
    if (INNER_MONGOLIA_WEST.includes(name)) {
      return REGIONS[5];
    }
    // Fallback for unknown cities in Inner Mongolia (shouldn't happen with full list)
    return REGIONS[5];
  }

  // General Province Matching
  // We need to check which region's province list contains this feature's province
  // Note: GeoJSON might have "广西壮族自治区" but user said "广西自治区", need to be careful with matching.
  // The REGIONS object above uses full names which should match GeoJSON.

  for (const regionId in REGIONS) {
    const region = REGIONS[regionId];
    // Check if the feature's name (if it's a province) or its parent province is in the list
    // Since we are using city-level map, we mostly look at 'province' property.
    // However, for direct-controlled municipalities (Beijing, Shanghai, etc.), 'province' might be same as name.

    // Normalize names for matching (remove '省', '市', '自治区' etc if needed, but exact match is safer first)
    // Let's try exact match against the list we defined.

    // The GeoJSON 'province' property usually contains the full name.
    // For direct municipalities, 'province' might be empty or same as name? 
    // In 100000_full.json, features are cities. 
    // 'province' property exists for all.

    // Special handling for Guangxi and Ningxia and Xinjiang short names vs long names
    // User input: "广西自治区", "宁夏自治区", "新疆自治区"
    // GeoJSON likely: "广西壮族自治区", "宁夏回族自治区", "新疆维吾尔自治区"
    // I updated REGIONS to use the likely GeoJSON names.

    if (region.provinces.includes(name) || region.provinces.includes(feature.properties.province)) {
      return region;
    }
  }

  return null; // No region found
};
