import React, { useState, useEffect } from 'react';
import Footer from '../../../Components/Footer/Footer';
import Bgvideo from '../../../Components/background/Bgvideo';
import PhotographerNavbar from '../../../Components/PhotographerNavbar/PhotographerNavbar'


function Order() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/bookings?userId=${user._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data.bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      setBookings(bookings.map(booking => 
        booking._id === id ? { ...booking, status } : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
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

  return (
    <div>
      <PhotographerNavbar/>
      <Bgvideo/>
      <div className='flex-grow container mx-auto px-6 py-8 bg-white'>
        <div className='mb-8'>
          <h1 className='text-transparent bg-clip-text  bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-3xl font-bold'>Your Orders</h1>
          <p className='text-gray-400 mt-2'>Manage and track all your orders</p>
        </div>

        <div className='glass rounded-lg border border-gray-300 shadow-sm hover:shadow-lg overflow-hidden'>
          {loading ? (
            <div className="p-8 text-center ">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center ">No bookings found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {bookings.map((booking) => (
                <div key={booking._id} className=" rounded-lg border border-gray-300 shadow-sm hover:shadow-lg p-6 text-white">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-black">{booking.fullName}</h3>
                    <p className="text-sm text-gray-600">{booking.email}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-black">Event: </span>
                      <span className="capitalize text-gray-400">{booking.eventType}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Date: </span>
                      <span className='text-gray-400'>{formatDate(booking.eventDate)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Venue: </span>
                      <span className='text-gray-400'>{booking.venueName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Status: </span>
                      <span className={`font-semibold ${
                        booking.status === 'completed' ? 'text-green-600' : 
                        booking.status === 'cancelled' ? 'text-red-600' : 'text-yellow-400'
                      }`}>
                        {booking.status || 'pending'}
                      </span>
                    </div>
                  </div>

                  {/* Only show buttons if status is pending */}
                  {(!booking.status || booking.status === 'pending') && (
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => handleStatusChange(booking._id, 'completed')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, 'cancelled')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
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

export default Order;