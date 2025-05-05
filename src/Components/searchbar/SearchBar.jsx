import React from 'react';
import { IoSearch } from "react-icons/io5";

function SearchBar() {
  return (
    <div>
      <section className='container mx-auto px-4 py-6 sm:py-8'>
        <div className='max-w-2xl mx-auto relative'>
          <input 
            type="text" 
            placeholder='Search for photographers, cameras, or services...' 
            className='w-full py-2 sm:py-3 px-4 pr-12 border border-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-transparent shadow-sm'
          />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer group">
  <div className="relative w-10 h-10">
    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-100 border-r-gray-100 transform rotate-45 group-hover:rotate-135 transition-transform duration-500"></div>
    <div className="absolute inset-1 rounded-full bg-white/10 flex items-center justify-center">
      <IoSearch className="w-4 h-4 text-gray-100"/>
    </div>
  </div>
</button>
        </div>
      </section>
    </div>
  )
}

export default SearchBar;