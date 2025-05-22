import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Bgvideo from '../../Components/background/Bgvideo';
import ClientNavbar from '../../Components/client_navbar/ClientNavbar';
import { FaLock, FaTimes, FaCheckCircle } from 'react-icons/fa';

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    username: '',
    email: '',
    company: '',
    location: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setBillingDetails(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, []);

  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString()}`;
  };

  const discountedPrice = product.price
    ? product.price * (1 - (product.discount || 0) / 100)
    : 80000;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBilling = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to proceed with payment');
      }

      if (!product?.id) {
        throw new Error('Product information is missing');
      }

      // Create the order in the database
      const orderData = {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        discountedPrice: product.price * (1 - (product.discount || 0) / 100),
        shopId: product.shopId,
        shopName: product.shopName,
        productType: product.productType || 'shop',
        billingDetails: billingDetails,
        paymentMethod: 'credit_card',
        paymentStatus: 'completed'
      };

      // Make API call to save the order
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setIsPaymentSuccess(true);
      } else {
        throw new Error(response.data.error || 'Failed to create order');
      }
      
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err.message || 'An error occurred during payment.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ClientNavbar />
      <Bgvideo />
      <div className="bg-white font-sans antialiased rounded">
        <div className="min-h-screen flex items-center justify-center p-4">
          {isPaymentSuccess ? (
            <div className="rounded-xl shadow-lg w-full max-w-md overflow-hidden bg-white p-8 text-center">
              <div className="flex justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-6xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Your payment for {product.name || 'your order'} has been processed successfully.</p>
              <div className="flex flex-col space-y-3">
                <Link to="/" className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white font-medium py-3 px-6 rounded-lg transition duration-200">
                  Return to Home
                </Link>
                <button
                  onClick={() => navigate(-1)}
                  className="border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-200"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl shadow-lg w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-300">
                <h1 className="text-xl font-semibold">
                  Checkout{product.name ? ` - ${product.name}` : ''}
                </h1>
              </div>

              {/* Payment Option */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-600 mb-4">Payment Options</h2>
                <div className="space-y-3 mb-6">
                  <div className="border border-blue-200 rounded-lg p-4 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-purple-800 rounded-full flex items-center justify-center mr-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="font-medium text-gray-600">Credit & Debit Cards</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-8 h-5 bg-blue-600 rounded"></div>
                        <div className="w-8 h-5 bg-red-500 rounded"></div>
                        <div className="w-8 h-5 bg-green-500 rounded"></div>
                        <div className="w-8 h-5 bg-orange-500 rounded"></div>
                        <div className="w-8 h-5 bg-yellow-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Detail Form */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-500 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="card-number"
                        value="**** **** **** ****"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        readOnly
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expire" className="block text-sm font-medium text-gray-600 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        id="expire"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-600 mb-1">
                        Security Code
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        placeholder="CVV"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                      Cardholder's Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="As written on card"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="save-card"
                      className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
                    />
                    <label htmlFor="save-card" className="ml-2 block text-sm text-gray-500">
                      Save this card for future payments
                    </label>
                  </div>
                </div>

                {/* Billing Information */}
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-600 mb-4">Billing Information</h2>
                  <div className="rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium text-gray-600">Username: </span>
                          <span className="text-sm font-medium text-gray-900 ml-2">
                            {billingDetails.username}
                          </span>
                        </div>
                        {billingDetails.email && (
                          <div className="flex items-center mb-1">
                            <span className="text-sm font-medium text-gray-600">Email: </span>
                            <span className="text-sm font-medium text-gray-900 ml-2">
                              {billingDetails.email}
                            </span>
                          </div>
                        )}
                        {billingDetails.company && (
                          <div className="flex items-center mb-1">
                            <span className="text-sm font-medium text-gray-600">Company: </span>
                            <span className="text-sm font-medium text-gray-900 ml-2">
                              {billingDetails.company}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium text-gray-600">Location: </span>
                          <span className="text-sm font-medium text-gray-900 ml-2">
                            {billingDetails.location}
                          </span>
                        </div>
                        {billingDetails.address && (
                          <div className="flex items-center mb-1">
                            <span className="text-sm font-medium text-gray-600">Address: </span>
                            <span className="text-sm font-medium text-gray-900 ml-2">
                              {billingDetails.address}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white px-3 py-1 rounded-full cursor-pointer text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        {billingDetails.address ? 'Edit' : 'Add details'}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                    {error}
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-2">
                  <button
                    onClick={handlePay}
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white font-medium py-3 px-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting
                      ? 'Processing...'
                      : `Pay ${formatPrice(discountedPrice)}`}
                  </button>
                  <Link to="/shopcard">
                    <button className="w-full text-purple-600 font-medium py-3 px-4 rounded-lg cursor-pointer border">
                      Go Back
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Billing Details Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Billing Details</h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitBilling}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={billingDetails.username}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={billingDetails.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Company Name (Optional)
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={billingDetails.company}
                          onChange={handleInputChange}
                          placeholder="Your company name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={billingDetails.address}
                          onChange={handleInputChange}
                          placeholder="Street address"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={billingDetails.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={billingDetails.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Country/Region
                        </label>
                        <select
                          name="country"
                          value={billingDetails.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        Save Details
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payment;