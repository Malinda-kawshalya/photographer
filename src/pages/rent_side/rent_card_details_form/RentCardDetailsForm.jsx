import React, { useState } from 'react';
import axios from 'axios';
import RentNavbar from '../../../Components/RentNavbar/RentNavbar';
import Bgvideo from '../../../Components/background/Bgvideo';
import Footer from '../../../Components/Footer/Footer';

const RentalProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    image: null,
    name: '',
    description: '',
    pricePerDay: '',
    discount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      image: e.target.files[0] 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('pricePerDay', formData.pricePerDay);
      formDataToSend.append('discount', formData.discount);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.post('http://localhost:5000/api/rental-products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSuccess('Rental product saved successfully!');
        setFormData({
          image: null,
          name: '',
          description: '',
          pricePerDay: '',
          discount: ''
        });
        document.getElementById('image-upload').value = '';
      } else {
        setError(response.data.message || 'Failed to save rental product');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred while saving the rental product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <RentNavbar />
      <Bgvideo />
      <div className='min-h-screen bg-white mx-auto px-6 py-8'>
        <div className='container mx-auto px-4 py-8'>
          <header className='mb-8'>
            <h1 className='text-3xl font-bold mb-2'>
              Add Rental Product
            </h1>
            <p className='text-gray-600'>Fill out all details to add a new rental product</p>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
          </header>

          <form onSubmit={handleSubmit} className='rounded-lg p-6 shadow-md border border-gray-300'>
            {/* Product Image Section */}
            <section className='mb-8'>
              <h2 className='text-xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2'>
                Product Image
              </h2>
              
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-2'>Product Image</label>
                <input
                  id="image-upload"
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                  required
                />
              </div>
            </section>

            {/* Product Details Section */}
            <section className='mb-8'>
              <h2 className='text-xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2'>
                Product Details
              </h2>
              
              <div className='grid grid-cols-1 gap-4'>
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-2'>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-2'>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                    required
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Price Per Day (LKR)</label>
                    <input
                      type="number"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>

                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Form Submission */}
            <div className='flex justify-end mt-8'>
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white font-medium py-3 px-6 rounded-lg transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Product'
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

export default RentalProductForm;