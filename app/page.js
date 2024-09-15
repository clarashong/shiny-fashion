'use client'
import Image from "next/image";
import { useState } from 'react';

let recentSearch = '';
const links = [
  {
    "category": "Tops & Bodysuits",
    "link": "https://www.aritzia.com/en/clothing/tops/black+seamless"
  },
  {
    "category": "Shirts & Blouses",
    "link": "https://www.aritzia.com/en/clothing/blouses/pink+poplin"
  },
  {
    "category": "Dresses",
    "link": "https://www.aritzia.com/en/clothing/dresses/black+chiffon"
  },
  {
    "category": "Skirts",
    "link": "https://www.aritzia.com/en/clothing/skirts/white+suiting"
  },
  {
    "category": "Pants",
    "link": "https://www.aritzia.com/en/clothing/pants/white+suiting"
  }
]


const SearchBar = () => { 
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
     // fill in later
     console.log(searchTerm);
     recentSearch = searchTerm;
     e.target.querySelector('input').blur();
     e.preventDefault();
  };

  return <div className="w-full max-w-2xl px-4"> 
    <form onSubmit = {handleSubmit}>
      <input 
        className="w-full outline-none border-gray-300 border-2 h-14 px-4 rounded-xl" 
        placeholder="Search for something ex: 'Warm clothing'"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}>
      </input>
    </form>
  </div>
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

const Suggestion = ({Name}) => {
  return (
    <div className="w-1/2 bg-orange-50/50 hover:bg-orange-50 border-gray p-2 rounded-md"> {Name} </div>
  )
}

const Card = ({link, category}) => {
  return (
    <a className="flex flex-col w-60 h-80 bg-white/75 hover:bg-white rounded-md drop-shadow-lg" href={link}>
      <div className="w-60 h-60 bg-orange-300 rounded-t-md " href={link} target="_blank"></div>
      <div className="text-lg font-bold p-2" href={link} target="_blank">{category}</div>
    </a>
  )
}

const CardGrid = ({ links }) => {
  return (
    <div className="grid grid-cols-4 gap-4 py-6">
      {links.map((item, index) =>
      (<Card key={index} category={item.category} link={item.link} />))}
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ 
      backgroundImage: `url("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.etsy.com%2Fca%2Flisting%2F710979248%2F100-silk-ivory-white-silk-40mm-silk&psig=AOvVaw2M5Kgh2ApXAMLIN1S4bYga&ust=1726451523919000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOjb6Z_rw4gDFQAAAAAdAAAAABAE")`}} 
      className="flex flex-col items-center justify-center content-center min-h-screen w-full py-6 px-4" >
      <h1 className="p-3 text-6xl text-center font-bold text-stone-700">TEXTILE</h1>
      <h3 className="italic pb-3 text-2xl text-center text-stone-600">Making searches very mindful, very demure.</h3>
      <div className="w-full max-w-2xl">
      <SearchBar/>
      <DropDown/>
     <div className="flex flex-row p-3 space-x-3"> <Suggestion Name="Preppy"/> <Suggestion Name="Warm"/> <Suggestion Name="Formal"/><Suggestion Name="Goth"/></div> 
      </div>
      <CardGrid links={links}/>
    </div>
  );
};
