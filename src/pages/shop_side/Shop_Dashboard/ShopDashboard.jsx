import React, { useEffect, useState } from 'react'
import logo from '../../../assets/clogo.png'
import Footer from '../../../Components/Footer/Footer'
import { Link, useNavigate } from 'react-router-dom'
import Bgvideo from '../../../Components/background/Bgvideo'
import ShopNavbar from '../../../Components/ShopNavbar/ShopNavbar'


function ShopDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser || loggedInUser.role !== 'shop') {
      navigate('/login');
      return;
    }
    setUser(loggedInUser);
  }, [navigate]);

  return (
    <div>
        <ShopNavbar/>
        <Bgvideo/>

        {/* main section */}
        <section className='flex-grow container mx-auto px-6 py-8 bg-white'>
            <div className='flex flex-col md:flex-row gap-8'>
                {/* left side */}
                <div className='w-full md:w-2/3 space-y-8 '>
                    <div className='mb-8'>
                        <h1 className='text-transparent bg-clip-text  bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-3xl font-bold'>Welcome, Chopsy events</h1>
                    </div>

                    <div className='flex flex-col space-y-6 '>
                        <Link to="/shoporder"><div className='glass border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow '>
                            <h2 className='text-xl  font-bold mb-2'>Check your orders</h2>
                            <p className='text-gray-600'>View manage all your current photography oders.</p>
                        </div></Link>

                        <Link to="/shopnotice"><div className='glass border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow '>
                            <h2 className='text-xl  font-bold mb-2'>Notice</h2>
                            <p className='text-gray-600'>Important updates and notifications for your account.</p>
                        </div></Link>

                        <Link to="/shopearning"><div className='glass border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow '>
                            <h2 className='text-xl  font-bold mb-2'>Earning</h2>
                            <p className='text-gray-600'>Track your revenue and payment history.</p>
                        </div></Link>

                        <Link to="/shopcarddetailsform"><div className='glass border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow '>
                            <h2 className='text-xl  font-bold mb-2'>Form</h2>
                            <p className='text-gray-600'>Add your details</p>
                        </div></Link>
                    </div>
                </div>

                {/* right side */}

                <div className='w-full md:w-1/3'>
                    <div className='border glass border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow '>
                        <div className='flex flex-col items-center mb-6'>
                            <div className='w-40 h-30 rounded-full flex items-center justify-center mb-4'>
                                <img src={logo} alt="" />
                            </div>

                            <h2 className='text-xl  font-bold'>Chopsy events</h2>
                            <Link to='/profile'><button className='mt-4 cursor-pointer text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#850FFD] to-[#DF10FD]'>View Profile</button></Link>
                        </div>

                        <div className='border-t border-purple-400 pt-4 mb-6' >
                            <h3 className='font-bold text-gray-800 mb-2'>My level - level 2</h3>
                            <p className='mb-1 text-gray-600'>Completed project - 82</p>
                        </div>

                        <div className='border-t border-gpurpleay-400 pt-4'>
                            <h3 className='font-bold text-gray-800 mb-2'>
                               Upcoming Event</h3>
                                <p className='text-gray-600'>Event in November </p>
                                <p className='text-2xl font-bold text-purple-800'>15</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer/>
    </div>
  )
}

export default ShopDashboard

