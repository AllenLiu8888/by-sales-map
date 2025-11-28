import React, { createContext, useContext, useState } from "react";
import { REGIONS } from "../utils/regionData";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(14); // Default font size reduced
  const [regionColors, setRegionColors] = useState(
    Object.keys(REGIONS).reduce((acc, key) => {
      acc[key] = REGIONS[key].color;
      return acc;
    }, {})
  );

  const updateRegionColor = (regionId, color) => {
    setRegionColors((prev) => ({
      ...prev,
      [regionId]: color,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        setFontSize,
        regionColors,
        updateRegionColor,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
