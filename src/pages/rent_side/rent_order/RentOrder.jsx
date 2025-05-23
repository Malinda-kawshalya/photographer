import React, { useState, useEffect } from 'react';
import Footer from '../../../Components/Footer/Footer';
import Bgvideo from '../../../Components/background/Bgvideo';
import RentNavbar from '../../../Components/RentNavbar/RentNavbar';

function RentOrder() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null); // Add this state

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
      setUpdatingStatus(id);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log(`Attempting to update rental ${id} to status: ${status}`);
      
      // Store the original status to revert if needed
      const originalRental = rentals.find(rental => rental._id === id);
      const originalStatus = originalRental?.status || 'pending';
      
      // Optimistically update the UI first
      setRentals(prevRentals => 
        prevRentals.map(rental => 
          rental._id === id ? { ...rental, status } : rental
        )
      );

      const response = await fetch(`http://localhost:5000/api/rental-transactions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      console.log('Response status:', response.status);

      // Handle response based on content type
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } else {
        const text = await response.text();
        console.log('Response text:', text);
        responseData = { message: text };
      }

      if (!response.ok) {
        // Revert the optimistic update if the server request failed
        setRentals(prevRentals => 
          prevRentals.map(rental => 
            rental._id === id ? { ...rental, status: originalStatus } : rental
          )
        );
        throw new Error(responseData.error || responseData.message || 'Failed to update rental status');
      }

      // No need to update state again since we already did it optimistically
      console.log('Rental status updated successfully');

      // Send notification if status is changed to 'accepted'
      if (status === 'accepted') {
        const rentalToUpdate = rentals.find(rental => rental._id === id);
        if (rentalToUpdate) {
          const customerDetails = rentalToUpdate.customerDetails || {};
          const productDetails = rentalToUpdate.productDetails || {};
          
          // Log status change for debugging
          console.log(`Rental status changed to 'accepted' for rental ${id}`);
          console.log(`Rental details:`, rentalToUpdate);
          
          const customerEmail = customerDetails.email;
          
          // Only attempt to send email if we have a customer email
          if (customerEmail) {
            try {
              console.log(`Attempting to send rental acceptance notification to: ${customerEmail}`);
              
              const emailResponse = await fetch('http://localhost:5000/api/rental-status', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  to: customerEmail,
                  name: customerDetails.name || 'Valued Customer',
                  productName: productDetails.name || 'Rental Product',
                  status: 'accepted',
                  rentDate: productDetails.rentDate,
                  rentalDuration: productDetails.rentalDuration || '1',
                  rentalProvider: user?.companyName || 'Rental Provider'
                })
              });
              
              // Get full response details for debugging
              let responseText;
              try {
                responseText = await emailResponse.text();
              } catch (e) {
                responseText = 'Could not read response text';
              }
              
              if (emailResponse.ok) {
                console.log('Rental acceptance email sent successfully');
              } else {
                console.error(`Failed to send rental acceptance email. Status: ${emailResponse.status}`);
                console.error(`Response: ${responseText}`);
                
                // Show fallback notification for rental provider
                alert(`Email notification could not be sent. Please notify the customer directly.\n\nStatus: Accepted\nCustomer: ${customerEmail}\nProduct: ${productDetails.name || 'Rental Product'}`);
              }
            } catch (emailError) {
              console.error('Error sending rental acceptance email:', emailError);
              // Show more debugging info
              alert(`Email notification failed. Email configuration may be incorrect.\n\nError: ${emailError.message}`);
            }
          } else {
            console.log('No customer email available - skipping email notification');
            alert(`Rental accepted\n\nNo customer email available to send notification.`);
          }
        }
      }
      
    } catch (error) {
      console.error('Error updating rental status:', error);
      // Show error message without blocking UI update
      setTimeout(() => {
        alert(error.message || 'Failed to update status. Please try again.');
      }, 100);
    } finally {
      setUpdatingStatus(null);
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

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
                      <StatusBadge status={rental.status || 'pending'} />
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    {rental.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(rental._id, 'accepted')}
                          disabled={updatingStatus === rental._id}
                          className={`flex-1 ${
                            updatingStatus === rental._id 
                              ? 'bg-green-400 cursor-not-allowed' 
                              : 'bg-green-600 hover:bg-green-700'
                          } text-white py-2 px-4 rounded transition-colors flex items-center justify-center`}
                        >
                          <span>{updatingStatus === rental._id ? 'Updating...' : 'Accept'}</span>
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(rental._id, 'cancelled')}
                          disabled={updatingStatus === rental._id}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors flex items-center justify-center"
                        >
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    
                    {rental.status === 'accepted' && (
                      <div className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded text-center">
                        Accepted
                      </div>
                    )}
                    
                    {rental.status === 'cancelled' && (
                      <div className="flex-1 bg-red-100 text-red-800 py-2 px-4 rounded text-center">
                        Cancelled
                      </div>
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