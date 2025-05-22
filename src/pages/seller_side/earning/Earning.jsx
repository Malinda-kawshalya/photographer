import React, { useState, useEffect } from 'react'
import PhotographerNavbar from '../../../Components/PhotographerNavbar/PhotographerNavbar'
import Footer from '../../../Components/Footer/Footer'
import Bgvideo from '../../../Components/background/Bgvideo'
import axios from 'axios'

function Earning() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        // Fetch all bookings
        const response = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Get the current user's ID
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;
        
        console.log('All bookings:', response.data); // For debugging
        
        // Filter bookings for the current photographer and with accepted status
        const photographerBookings = response.data.bookings 
          ? response.data.bookings.filter(booking => 
              booking.photographerId === userId && booking.status === 'accepted')
          : [];
          
        console.log('Photographer bookings:', photographerBookings); // For debugging

        // Calculate total earnings from accepted bookings
        const totalAmount = photographerBookings
          .reduce((sum, booking) => sum + (booking.packagePrice || 0), 0);

        setTotalEarnings(totalAmount);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching earnings:', err);
        setError('Failed to load earnings data');
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div>
        <PhotographerNavbar/>
        <Bgvideo/>
        <div className='flex-grow container mx-auto px-6 py-8 bg-white'>
            <div className='mb-8'>
                <h1 className='text-transparent bg-clip-text  bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-3xl font-bold'>Your Earning</h1>
                <p className='text-gray-600 mt-2 '>Track your revenue and payment history</p>
            </div>

            {/* earning overview */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 '>
                <div className='glass rounded-lg border border-gray-300 shadow-sm hover:shadow-lg p-6'>
                    <h2 className='text-sm font-medium text-gray-600 mb-1'>Total Earnings</h2>
                    {loading ? (
                      <p className='text-3xl font-bold'>Loading...</p>
                    ) : error ? (
                      <p className='text-red-500'>{error}</p>
                    ) : (
                      <p className='text-3xl font-bold'>{totalEarnings.toLocaleString()} LKR</p>
                    )}
                </div>

                {/* <div className='glass rounded-lg border border-purple-300/30 shadow-sm p-6'>
                    <h2 className='text-sm font-medium text-gray-300 mb-1'>Pending Payments</h2>
                    <p className='text-3xl text-white font-bold'>40 000 LKR</p>
                </div>

                <div className='glass rounded-lg border border-purple-300/30 shadow-sm p-6'>
                    <h2 className='text-sm font-medium text-gray-300 mb-1'>This Month</h2>
                    <p className='text-3xl text-white font-bold'>120 000 LKR</p>
                </div> */}

            </div>

            {/* earning chart */}

            {/* <div className='glass rounded-lg border border-purple-300/30 shadow-sm p-6 mb-8'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl text-white font-bold'>Earning Overview</h2>
                    <select className='px-3 py-1 border text-white border-purple-300/30 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple'>
                        <option className='text-black'>Last 6 Months</option>
                        <option className='text-black'>Last Year</option>
                        <option className='text-black'>All Time</option>
                    </select>
                </div>

                <div className='h-64 bg-gray-50/30 rounded-md flex items-center justify-center'>
                    <p className='text-gray-400'>Chart placeholder</p>
                </div>
            </div> */}

        </div>
        <Footer/>;
    </div>
  ) 
}

export default Earning