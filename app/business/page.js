'use client'
import { useState } from 'react';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import UploadJson from './components/UploadJson';
import SearchBar from './components/Search';
import Dropdown from './components/Dropdown';

export default function BusinessPage() {
  const [filters, setFilters] = useState({});
  const [superFilters, setSuperFilters] = useState({
    types: '',
    colors: '',
    materials: ''
  });

  const types = [
    "Activewear",
    "Blazers & Suiting",
    "Cardigans & Sweaters",
    "Denim",
    "Dresses",
    "Intimates & Shapewear",
    "Jackets & Coats",
    "Jumpsuits & Rompers",
    "Knitwear",
    "Leggings & Bike Shorts",
    "Pants",
    "Sale",
    "Shirts & Blouses",
    "Shorts",
    "Skirts",
    "Sweatpants",
    "Sweatshirts & Hoodies",
    "Sweats",
    "Tops & Bodysuits",
    "T-Shirts",
    "Vests"
  ];
  
  const colors = [
    "Beige",
    "Black",
    "Blue",
    "Brown",
    "Green",
    "Grey",
    "Orange",
    "Pink",
    "Purple",
    "Red",
    "Tan",
    "White",
    "Yellow"
  ];
  
  const materials = [
    "Butter",
    "Barely-there, buttery soft sweat-wicking fabric that shapes to your body",
    "Cashmere",
    "Chiffon",
    "Contour",
    "Luxe, ultra-flattering fabric coveted for its smoothing effect and second-skin feel.",
    "Cotton",
    "Crepe",
    "Denim",
    "Flannel",
    "HomeStretch",
    "Body-hugging, stretchy ribbed fabric with a cottony soft feel.",
    "Jersey",
    "Lace",
    "Linen",
    "Mesh",
    "Modal",
    "Non-Wool Yarn",
    "Polar Fleece",
    "Poplin",
    "Ribbed",
    "Ripstop",
    "Satin",
    "Smooth, glossy fabric for evening time.",
    "Sculpt Knit",
    "Our signature figure-enhancing yarn. Holds you in all the right places to shape and sculpt your form.",
    "Seamless",
    "Our smooth-look, smooth-feel fabrics crafted for unbeatable comfort. In ribbed, smooth or Scrunchee.",
    "Silk",
    "Suiting",
    "Sweatfleece",
    "Tailored Outerwear",
    "Technical Outerwear",
    "Twill",
    "UnReal Leather",
    "Waffle Knit",
    "Waterproof Fabrics",
    "Wool",
    "Recycled Materials",
    "Responsible Cashmere",
    "Responsible Forestry",
    "Responsible Wool"
  ];
  

  const handleSearch = async (searchTerm) => {
    const response = await fetch(`/api/business?search=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    console.log("DATA HERE", data);
    
    // Apply super filters
    const filteredData = Object.keys(data).reduce((acc, key) => {
      if (superFilters[key] && superFilters[key] !== '') {
        acc[key] = [superFilters[key]];
      } else {
        acc[key] = data[key];
      }
      return acc;
    }, {});
    
    setFilters(filteredData);
  };

  const handleSuperFilterChange = (filterType, value) => {
    setSuperFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <main>
      <Upload />
      <UploadJson />
      <div className="flex space-x-4 mb-4">
        <Dropdown
          options={types}
          value={superFilters.types}
          onChange={(value) => handleSuperFilterChange('types', value)}
          label="Type"
        />
        <Dropdown
          options={colors}
          value={superFilters.colors}
          onChange={(value) => handleSuperFilterChange('colors', value)}
          label="Color"
        />
        <Dropdown
          options={materials}
          value={superFilters.materials}
          onChange={(value) => handleSuperFilterChange('materials', value)}
          label="Material"
        />
      </div>
      <SearchBar onSearch={handleSearch} />
      <Gallery filters={filters} />   
    </main>
  );
}
