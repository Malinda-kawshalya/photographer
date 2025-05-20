import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ShopNavbar from '../../../Components/ShopNavbar/ShopNavbar';
import Bgvideo from '../../../Components/background/Bgvideo';

function ShopCardDetailsForm() {
  const { id } = useParams(); // Get product ID if editing
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceLKR: '',
    discount: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch existing product data if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const product = response.data.product;
          setFormData({
            name: product.name,
            description: product.description,
            priceLKR: product.priceLKR.toString(),
            discount: product.discount.toString(),
            image: null
          });
          setPreview(`http://localhost:5000${product.image.url}`);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details');
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priceLKR', formData.priceLKR);
      formDataToSend.append('discount', formData.discount || '0');
      formDataToSend.append('userId', user._id);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      let response;
      if (id) {
        // Update existing product
        response = await axios.put(`http://localhost:5000/api/products/${id}`, formDataToSend, config);
      } else {
        // Create new product
        response = await axios.post('http://localhost:5000/api/products', formDataToSend, config);
      }

      if (response.data.success) {
        setSuccess(id ? 'Product updated successfully!' : 'Product created successfully!');
        setTimeout(() => navigate('/shopcard'), 2000);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar />
      <Bgvideo />
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">
            {id ? 'Edit Product' : 'Add New Product'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <div className="mt-2 flex items-center gap-4">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (LKR)
                </label>
                <input
                  type="number"
                  name="priceLKR"
                  value={formData.priceLKR}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/shopcard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShopCardDetailsForm;