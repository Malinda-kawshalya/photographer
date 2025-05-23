import React, { useState, useEffect } from 'react';
import Footer from '../../../Components/Footer/Footer';
import Bgvideo from '../../../Components/background/Bgvideo';
import PhotographerNavbar from '../../../Components/PhotographerNavbar/PhotographerNavbar';
import ShopNavbar from '../../../Components/ShopNavbar/ShopNavbar';

function ShopOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('http://localhost:5000/api/orders/shop-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch orders');
        }
        
        const data = await response.json();
        console.log('Fetched orders:', data);
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Find the order to get customer details for email notification
      const orderToUpdate = orders.find(order => order._id === id);
      if (!orderToUpdate) {
        throw new Error('Order not found');
      }

      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: status }),
      });

      if (!response.ok) {
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update order status');
          } else {
            const errorText = await response.text();
            console.error('Non-JSON error response:', errorText);
            throw new Error('Failed to update order status');
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error(`Status update failed: ${response.status} ${response.statusText}`);
        }
      }

      const updatedOrder = await response.json(); // Get the updated order from response
      setOrders(orders.map(order => 
        order._id === id ? updatedOrder : order // Use backend response
      ));

      // Notify customer about the status change
      const statusMessages = {
        accepted: 'Your order has been accepted and is now being processed.',
        delivered: 'Your order has been delivered. Thank you for your purchase!',
        cancelled: 'Your order has been cancelled.'
      };
      
      // Log status change for debugging
      console.log(`Order status changed to ${status} for order ${id}`);
      console.log(`Order details:`, orderToUpdate);
      
      // Access billing details to get customer email
      const billingDetails = orderToUpdate.billingDetails || {};
      const customerEmail = billingDetails.email;
      
      // Log customer email info for debugging
      console.log('Billing details:', billingDetails);
      console.log('Customer email found:', customerEmail);
      
      // Only attempt to send email if we have a customer email
      if (customerEmail) {
        try {
          console.log(`Attempting to send email notification to: ${customerEmail}`);
          
          const emailResponse = await fetch('http://localhost:5000/api/order-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: customerEmail,
              name: billingDetails.username || 'Valued Customer',
              productName: orderToUpdate.productName || 'Product',
              orderStatus: status,
              orderDate: orderToUpdate.orderDate,
              shopName: orderToUpdate.shopName || user?.companyName || 'Shop'
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
            console.log('Status update email sent successfully');
          } else {
            console.error(`Failed to send status update email. Status: ${emailResponse.status}`);
            console.error(`Response: ${responseText}`);
            
            // Show fallback notification for shop owner
            alert(`Email notification could not be sent. Please notify the customer directly.\n\nStatus: ${status}\nCustomer: ${customerEmail}`);
          }
        } catch (emailError) {
          console.error('Error sending status update email:', emailError);
          // Show more debugging info
          alert(`Email notification failed. Email configuration may be incorrect.\n\nError: ${emailError.message}`);
        }
      } else {
        console.log('No customer email available - skipping email notification');
        alert(`Order status changed to: ${status}\n\nNo customer email available to send notification.`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <ShopNavbar />
      <Bgvideo />
      <div className='flex-grow container mx-auto px-6 py-8 bg-white'>
        <div className='mb-8'>
          <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-3xl font-bold'>Your Orders</h1>
          <p className='text-gray-400 mt-2'>Manage and track all your orders</p>
        </div>

        {error && (
          <div className="p-4 mb-4 text-center text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div className='glass rounded-lg border border-gray-300 shadow-sm hover:shadow-lg overflow-hidden'>
          {loading ? (
            <div className="p-8 text-center">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">No orders found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {orders.map((order) => (
                <div key={order._id} className="rounded-lg border border-gray-300 shadow-sm hover:shadow-lg p-6 text-white">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-black">{order.productName}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-black">Shop: </span>
                      <span className="capitalize text-gray-400">{order.shopName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Price: </span>
                      <span className='text-gray-400'>${order.discountedPrice || order.productPrice}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Date: </span>
                      <span className='text-gray-400'>{formatDate(order.orderDate)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Payment: </span>
                      <span className='text-gray-400 capitalize'>{order.paymentMethod.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Payment Status: </span>
                      <span className='text-gray-400 capitalize'>{order.paymentStatus.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="font-medium text-black">Status: </span>
                      <span className={`font-semibold ${
                        order.orderStatus === 'delivered' ? 'text-green-600' : 
                        order.orderStatus === 'cancelled' ? 'text-red-600' : 
                        order.orderStatus === 'accepted' ? 'text-blue-600' : 'text-yellow-400'
                      }`}>
                        {order.orderStatus || 'pending'}
                      </span>
                    </div>
                  </div>

                  {/* Show appropriate buttons based on current status */}
                  {(!order.orderStatus || order.orderStatus === 'pending') && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusChange(order._id, 'accepted')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(order._id, 'cancelled')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Show delivered button if status is accepted */}
                  {order.orderStatus === 'accepted' && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => handleStatusChange(order._id, 'delivered')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded transition-colors"
                      >
                        Delivered
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ShopOrder;