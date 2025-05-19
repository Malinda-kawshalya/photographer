import React, { useState, useEffect } from 'react';
import Footer from '../../../Components/Footer/Footer';
import Bgvideo from '../../../Components/background/Bgvideo';
import RentNavbar from '../../../Components/RentNavbar/RentNavbar';

function RentOrder() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
  }, []);

  useEffect(() => {
    const fetchRentals = async () => {
      if (!user?._id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/rental-transactions?userId=${user._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch rentals');
        }
        const data = await response.json();
        if (data.success) {
          setRentals(data.rentals);
        } else {
          throw new Error(data.message || 'Failed to fetch rentals');
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRentals();
    }
  }, [user]);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rentals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update rental status');
      }

      setRentals(rentals.map(rental => 
        rental._id === id ? { ...rental, status } : rental
      ));
    } catch (error) {
      console.error('Error updating rental status:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Add debug logging
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Current rentals:', rentals);
  }, [user, rentals]);

  return (
    <div>
      <RentNavbar/>
      <Bgvideo/>
      <div className='flex-grow container mx-auto px-6 py-8 bg-white'>
        <div className='mb-8'>
          <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-3xl font-bold'>Your Rentals</h1>
          <p className='text-gray-400 mt-2'>Manage and track all your rental orders</p>
        </div>

        <div className='glass rounded-lg border border-gray-300 shadow-sm hover:shadow-lg overflow-hidden'>
          {loading ? (
            <div className="p-8 text-center">Loading rentals...</div>
          ) : rentals.length === 0 ? (
            <div className="p-8 text-center">No rentals found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {rentals.map((rental) => (
                <div key={rental._id} className="rounded-lg border border-gray-300 shadow-sm hover:shadow-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-black">
                      {rental.customerDetails?.name || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {rental.customerDetails?.email || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      NIC: {rental.customerDetails?.nicNumber || 'N/A'}
                    </p>
                    {rental.customerDetails?.address && (
                      <p className="text-sm text-gray-600">
                        Address: {rental.customerDetails.address}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-black">Product: </span>
                      <span className="capitalize text-gray-600">
                        {rental.productDetails?.name || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Quantity: </span>
                      <span className='text-gray-600'>
                        {rental.productDetails?.quantity || '1'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Rent Date: </span>
                      <span className='text-gray-600'>
                        {rental.productDetails?.rentDate ? formatDate(rental.productDetails.rentDate) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Duration: </span>
                      <span className='text-gray-600'>
                        {rental.productDetails?.rentalDuration ? `${rental.productDetails.rentalDuration} days` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-black">End Date: </span>
                      <span className='text-gray-600'>
                        {rental.productDetails?.endDate ? formatDate(rental.productDetails.endDate) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Status: </span>
                      <span className={`font-semibold ${
                        rental.status === 'completed' ? 'text-green-600' : 
                        rental.status === 'cancelled' ? 'text-red-600' : 
                        rental.status === 'active' ? 'text-blue-600' : 'text-yellow-400'
                      }`}>
                        {rental.status || 'pending'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    {rental.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(rental._id, 'active')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                      >
                        Activate
                      </button>
                    )}
                    {rental.status !== 'completed' && rental.status !== 'cancelled' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(rental._id, 'completed')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(rental._id, 'cancelled')}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default RentOrder;