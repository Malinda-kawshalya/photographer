import React, { useState, useEffect } from 'react'
import Footer from '../../../Components/Footer/Footer'
import Bgvideo from '../../../Components/background/Bgvideo'
import ShopNavbar from '../../../Components/ShopNavbar/ShopNavbar'
import axios from 'axios'

function ShopEarning() {
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

        // Fetch all orders for the current shop
        const response = await axios.get('http://localhost:5000/api/orders/shop-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Shop orders response:', response.data); // For debugging

        // Calculate total earnings from completed orders (delivered or accepted)
        const orders = response.data.orders || [];
        const totalAmount = orders
          .filter(order => order.orderStatus === 'delivered' || order.orderStatus === 'accepted')
          .reduce((sum, order) => sum + (order.discountedPrice || 0), 0);

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
        <ShopNavbar/>
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


export default ShopEarning