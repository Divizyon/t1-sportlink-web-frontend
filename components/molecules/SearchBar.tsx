import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>
  );
};

export default SearchBar;
