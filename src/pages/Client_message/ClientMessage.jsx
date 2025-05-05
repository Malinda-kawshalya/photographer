import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { IoIosSend } from "react-icons/io";
import Bgvideo from '../../Components/background/Bgvideo';
import { IoSearch } from "react-icons/io5";
import { FaFolderOpen } from "react-icons/fa6";

function ClientMessage() {
  return (
    <div>
      <Navbar/>
      <Bgvideo/>
      <div className='bg-white font-sans antialiased'>
        <div className='flex h-screen'>
          {/* Left sidebar (removed in this version) */}
          
          {/* Right side - main chat area */}
          <div className='flex-1 flex flex-col'>
            {/* Chat header */}
            <div className='p-4 border-b border-gray-200 flex items-center'>
              <div className='flex items-center'>
                <div className='w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold'>
                  S
                </div>
                <div className='ml-3'>
                  <h2 className='text-base font-semibold'>Sandeepa</h2>
                  <p className='text-xs text-gray-600'>@sandeepa</p>
                </div>
              </div>
            </div>

            {/* Chat message area */}
            <div className='flex-1 p-4 overflow-y-auto'>
              <div className='flex items-center justify-center h-full text-gray-400'>
                <p>No Messages yet</p>
              </div>
            </div>

            {/* Message input */}
            <div className='p-4 border-t border-gray-200 shadow-sm hover:shadow-lg'>
              <div className='flex items-center gap-3'>
                <button className='ml-2 bg-gray-100/10 hover:bg-gray-200 rounded-full p-2 text-gray-400 hover:text-gray-700'>
                  <FaFolderOpen className='h-5 w-6'/>
                </button>
                <input 
                  type="text" 
                  placeholder='Send message...' 
                  className='shadow-sm hover:shadow-lg flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                />
                <button className='bg-gray-100/10 hover:bg-gray-200 rounded-full p-2 text-gray-400 hover:text-gray-700'>
                  <IoIosSend className='h-7 w-7'/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientMessage;