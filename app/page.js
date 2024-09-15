'use client';
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.querySelector('input').blur();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <form onSubmit={handleSubmit}>
        <input
          className="w-full outline-none border-gray-300 border-2 h-14 px-4 rounded-xl"
          placeholder="Search for something ex: 'Warm clothing'"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
};

const DropDown = () => {
  return (
    <div className="w-full items-center max-w-2xl px-4 pt-4">
      <select className="w-full h-10 border border-gray-300 rounded-md px-2 py-2">
        <option value="">Select a store</option>
        <option value="store1">Aritzia</option>
        <option value="store2">Abercrombie</option>
      </select>
    </div>
  );
};

const Suggestion = ({ Name }) => {
  return (
    <div className="w-1/2 bg-orange-50/50 hover:bg-orange-50 border-gray p-2 rounded-md">
      {Name}
    </div>
  );
};

const Card = ({ link, category, color, material }) => {
  return (
    <a
      className="flex flex-col w-60 bg-white/75 hover:bg-white rounded-md drop-shadow-lg"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* <div className="w-60 h-60 bg-orange-300 rounded-t-md overflow-hidden"></div> */}
      <div className="text-lg font-bold p-2">{category}</div>
      <div className="flex space-x-2 px-2">
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{color}</span>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{material}</span>
      </div>
    </a>
  );
};

const CardGrid = ({ links }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
      {links.map((item, index) => (
        <Card key={index} category={item.category} link={item.link} color={item.randomColor} material={item.randomMaterial} />
      ))}
    </div>
  );
};

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

  const handleSearch = async (searchTerm) => {
    setLoading(true); // Start loading when the search starts
    try {
      const response = await fetch(
        `/api/get-search?search=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false); // Stop loading when the search completes
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.etsy.com%2Fca%2Flisting%2F710979248%2F100-silk-ivory-white-silk-40mm-silk&psig=AOvVaw2M5Kgh2ApXAMLIN1S4bYga&ust=1726451523919000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOjb6Z_rw4gDFQAAAAAdAAAAABAE")`,
      }}
      className="flex flex-col items-center justify-center content-center min-h-screen w-full py-6 px-4"
    >
      <h1 className="p-3 text-6xl text-center font-bold text-stone-700">TEXTILE</h1>
      <h3 className="italic pb-3 text-2xl text-center text-stone-600">
        Making searches very mindful, very demure.
      </h3>
      <div className="w-full max-w-2xl">
        <SearchBar onSearch={handleSearch} />
        <DropDown />
        <div className="flex flex-row p-3 space-x-3">
          <Suggestion Name="Preppy" />
          <Suggestion Name="Warm" />
          <Suggestion Name="Formal" />
          <Suggestion Name="Goth" />
        </div>
      </div>
      {loading ? ( // Display loading state when fetching data
        <div className="text-2xl">Loading...</div>
      ) : searchResults.length > 0 ? (
        <CardGrid links={searchResults} />
      ) : null}
    </div>
  );
}
