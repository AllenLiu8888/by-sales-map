import React from "react";
import SalesMap from "./components/SalesMap";
import RegionList from "./components/RegionList";

function App() {
  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* Sidebar */}
      <RegionList />

      {/* Main Map Area */}
      <main className="flex-1 h-full p-4 relative">
        <SalesMap />
      </main>
    </div>
  );
}

export default App;
