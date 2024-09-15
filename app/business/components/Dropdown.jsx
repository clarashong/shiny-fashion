import React from 'react';

function Dropdown({ options, value, onChange, label }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-red-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-black-700"
      >
        <option value="" className="text-red-700">All</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-black-700">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
