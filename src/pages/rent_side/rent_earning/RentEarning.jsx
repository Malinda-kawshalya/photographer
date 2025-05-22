import React, { useState, useEffect } from 'react'
import Footer from '../../../Components/Footer/Footer'
import Bgvideo from '../../../Components/background/Bgvideo'
import RentNavbar from '../../../Components/RentNavbar/RentNavbar'
import axios from 'axios'

function RentEarning() {
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

        // Fetch all rental transactions
        const response = await axios.get('http://localhost:5000/api/rental-transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Rental transactions response:', response.data);

        // Calculate total earnings from completed rentals
        const rentals = response.data.rentals || [];
        console.log('Filtered rentals:', rentals);
        
        // Get the current user ID to filter rentals
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;
        
        // Filter rentals that belong to the current user and have 'accepted' status
        const userRentals = rentals.filter(rental => 
          rental.rentalProviderId?._id === userId || 
          rental.rentalProviderId === userId
        );
        
        console.log('User ID:', userId);
        console.log('User rentals:', userRentals);
        
        // Calculate total from accepted rentals
        const acceptedRentals = userRentals.filter(rental => rental.status === 'accepted');
        const totalAmount = acceptedRentals.reduce((sum, rental) => {
          // Check if price is in productDetails (as per your updated schema)
          const price = rental.productDetails?.price || rental.price || 0;
          return sum + price;
        }, 0);

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
        <RentNavbar/>
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
        <Footer/>
    </div>
  ) 
}
export default RentEarning