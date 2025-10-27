import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
          <option>Cơ sở 1</option>
          <option>Cơ sở 2</option>
        </select>
      </div>
      
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Tìm kiếm..."
          className="px-4 py-2 border border-gray-300 rounded-lg w-64"
        />
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            🔔
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">27/10/2025 - 10:12:46</span>
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;