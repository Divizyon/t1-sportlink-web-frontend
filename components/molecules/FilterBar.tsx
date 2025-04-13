import React from "react";

const FilterBar: React.FC = () => {
  return (
    <div className="mb-4 flex space-x-2">
      <select className="p-2 border border-gray-300 rounded">
        <option value="">Tümü</option>
        <option value="scraped">Scraped</option>
        <option value="manual">Manual</option>
      </select>
    </div>
  );
};

export default FilterBar;
