import React, { useState, useEffect } from 'react';
import Footer from '../Footer/Footer';
import RentNavbar from '../RentNavbar/RentNavbar';
import Bgvideo from '../background/Bgvideo';
import Navbar from "../../Components/Navbar/Navbar";

const RentDetailsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    rentalProviderId: '', // Provider ID from URL
    customerDetails: {
      name: '',
      email: '',
      nicNumber: '',
      address: ''
    },
    productDetails: {
      name: '',
      quantity: 1,
      rentDate: '',
      rentalDuration: 1,
      price: 15000
    },
  });

  useEffect(() => {
    // Get parameters from URL
    const params = new URLSearchParams(window.location.search);
    const providerId = params.get('providerId');
    const price = params.get('price');
    
    const updates = {};
    
    if (providerId) {
      updates.rentalProviderId = providerId;
    }
    
    if (price) {
      updates.price = Number(price) || 15000; // Use price from URL or default
    }
    
    if (Object.keys(updates).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...updates
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      const requiredFields = {
        'customerDetails.name': 'Customer name is required',
        'customerDetails.email': 'Email is required',
        'customerDetails.nicNumber': 'NIC number is required',
        'productDetails.name': 'Product name is required',
        'productDetails.rentDate': 'Rent date is required'
      };

      for (const [field, message] of Object.entries(requiredFields)) {
        const [parent, child] = field.split('.');
        if (!formData[parent][child]?.trim()) {
          throw new Error(message);
        }
      }

      // Validate rental provider ID
      if (!formData.rentalProviderId) {
        throw new Error('Rental provider ID is missing');
      }

      if (!formData.productDetails.rentalDuration || formData.productDetails.rentalDuration < 1) {
        throw new Error('Rental duration must be at least 1 day');
      }

      // Validate price
      if (!formData.price || formData.price < 1000) {
        throw new Error('Price must be at least 1000 LKR');
      }

      // Calculate dates
      const startDate = new Date(formData.productDetails.rentDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(formData.productDetails.rentalDuration));

      // Prepare API payload
      const payload = {
        rentalProviderId: formData.rentalProviderId,
        customerDetails: formData.customerDetails,
        productDetails: {
          name: formData.productDetails.name,
          quantity: parseInt(formData.productDetails.quantity),
          rentDate: startDate.toISOString(),
          rentalDuration: parseInt(formData.productDetails.rentalDuration),
          endDate: endDate.toISOString()
        },
        price: parseFloat(formData.price) // Move price to root level
      };

      // API call
      const response = await fetch('http://localhost:5000/api/rental-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create rental');
      }

      // Success handling
      setSuccess('Rental created successfully!');
      setFormData({
        rentalProviderId: '', // Reset this field
        customerDetails: {
          name: '',
          email: '',
          nicNumber: '',
          address: ''
        },
        productDetails: {
          name: '',
          quantity: 1,
          rentDate: '',
          rentalDuration: 1,
          price: 15000
        },
      // Reset price
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <Bgvideo/>
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white shadow-sm rounded-lg hover:shadow-lg p-6">
          <h1 className="text-2xl font-bold text-purple-700 mb-6">Rental Details Form</h1>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
                <button 
                  onClick={() => setError('')}
                  className="text-red-700 hover:text-red-900"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">Success</p>
                  <p>{success}</p>
                </div>
                <button 
                  onClick={() => setSuccess('')}
                  className="text-green-700 hover:text-green-900"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Customer Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerDetails.name"
                    value={formData.customerDetails.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="customerDetails.email"
                    value={formData.customerDetails.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    NIC Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerDetails.nicNumber"
                    value={formData.customerDetails.nicNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="customerDetails.address"
                    value={formData.customerDetails.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Product Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Rental Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productDetails.name"
                    value={formData.productDetails.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="productDetails.quantity"
                    value={formData.productDetails.quantity}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="productDetails.rentDate"
                    value={formData.productDetails.rentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="productDetails.rentalDuration"
                    value={formData.productDetails.rentalDuration}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                {/* Total Price field (now at root level) */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Total Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit Rental'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RentDetailsForm;