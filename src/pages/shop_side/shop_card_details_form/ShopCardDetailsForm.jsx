import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Bgvideo from '../../../Components/background/Bgvideo';
import Footer from '../../../Components/Footer/Footer';
import ShopNavbar from '../../../Components/ShopNavbar/ShopNavbar';

const ShopCardDetailsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL for editing
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    description: '',
    priceLKR: '',
    discount: ''
  });

  // Fetch existing product if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setFormData({
            ...response.data.product,
            image: response.data.product.image.url // Display existing image URL
          });
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      }
    };

    fetchProduct();
  }, [id]);

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
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));

      formDataToSend.append('userId', storedUser?._id || '');
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priceLKR', formData.priceLKR);
      formDataToSend.append('discount', formData.discount || 0);
      if (formData.image && typeof formData.image !== 'string') {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.post('http://localhost:5000/api/product', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSuccess('Product saved successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(response.data.message || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'An error occurred while saving the product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <ShopNavbar />
      <Bgvideo />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#850FFD] to-[#DF10FD]">
              {id ? 'Edit Product' : 'Add New Product'}
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the details below to add or update a product in your shop.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-3xl mx-auto">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg max-w-3xl mx-auto">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-3xl mx-auto">
          {/* Product Image Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2">
              Product Image
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Product Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required={!id}
              />
              {formData.image && typeof formData.image === 'string' && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Current image:</p>
                  <img
                    src={`http://localhost:5000${formData.image}`}
                    alt="Product preview"
                    className="h-40 object-cover mt-2 rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Product Details Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Price (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="priceLKR"
                  value={formData.priceLKR}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Form Submission */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white font-bold py-3 px-8 rounded-lg transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
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
      <Footer />
    </div>
  );
};

export default ShopCardDetailsForm;