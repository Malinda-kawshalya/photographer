import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <>
    <footer className='bg-gray-800 text-white py-8 sm:py-12'>
        <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>

                {/* categories */}
                <div>
                    <h3 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4'>Categories</h3>
                    <ul className='space-y-1 sm:space-y-2'>
                        <li><Link to='/photographer' className='text-gray-300 hover:text-white text-sm sm:text-base'>Photographers</Link></li>

                        <li><Link to='/shop' className='text-gray-300 hover:text-white text-sm sm:text-base'>Shop</Link></li>

                        <li><Link to='/Rent' className='text-gray-300 hover:text-white text-sm sm:text-base'>Rent</Link></li>

                        <li><Link to='/about' className='text-gray-300 hover:text-white text-sm sm:text-base'>About Us</Link></li>

                        
                    </ul>
                </div>

                {/* Social media */}
                <div>
                    <h3 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4'>Connect With Us</h3>
                        <div className='flex space-x-4 mb-4'>

                        </div>
                        <div className='space-y-1 sm:space-y-2'>
                            <Link>
                            <p className="flex items-center text-gray-300 text-sm sm:text-base">
                                +94 703 644 755
                            </p></Link>

                            <Link>
                            <p className="flex items-center text-gray-300 text-sm sm:text-base">
                                info@photographer.lk
                            </p></Link>
                        </div>
                    
                </div>

                {/* stay in touch */}

                <div className='sm:col-span-2 lg:col-span-1'>
                    <h3 className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4'>
                        STAY IN TOUCH
                    </h3>
                    <p className='text-gray-300 mb-4 text-sm sm:text-base'>Join our community of photography enthusiasts. Subscribe to our newsletter for the latest updates, tips, and special offers.</p>

                    <div className="flex flex-col sm:flex-row">
                        <input type="email" placeholder="Your email" className="px-4 py-2 w-full rounded-md sm:rounded-l-md sm:rounded-r-none bg-gray-100 focus:outline-none text-gray-800 mb-2 sm:mb-0"/>
                        <button class="bg-purple-dark px-4 py-2 rounded-md  border-1 sm:rounded-l-none sm:rounded-r-md hover:bg-gradient-to-r from-[#850FFD] to-[#DF10FD] transition">Subscribe</button>
                    </div>
                </div>

                
            </div>

            <div className='border-t border-gray-700 mt-8 sm:mt-10 pt-4 sm:pt-6 text-center text-gray-400 text-sm'>
                    <p>Copyright 2025. All rights reserved.</p>
                </div>
        </div>
    </footer>
    </>
  )
}

export default Footer