import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ShopNavbar from '../../../Components/ShopNavbar/ShopNavbar';
import ClientNavbar from '../../../Components/client_navbar/ClientNavbar'; // Add this import

import Bgvideo from '../../../Components/background/Bgvideo';
import Footer from '../../../Components/Footer/Footer';

function ShopCard() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Add location to existing hooks

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token'); // Get auth token
        setUser(loggedInUser);
        
        // Get sellerId from URL parameters
        const params = new URLSearchParams(location.search);
        const sellerId = params.get('sellerId');
        
        // If user is shop owner, show their products, else show specific seller's products
        const userId = loggedInUser?.role === 'shop' ? loggedInUser._id : sellerId;
        
        if (!userId) {
          setError('No seller specified');
          setIsLoading(false);
          return;
        }

        // Add auth token to request headers
        const response = await axios.get(`http://localhost:5000/api/products?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const fetchedProducts = response.data.products.map(product => ({
            id: product._id,
            userId: product.userId._id,
            image: `http://localhost:5000${product.image.url}`,
            name: product.name,
            description: product.description,
            price: product.priceLKR,
            discount: product.discount || 0,
            shopName: product.userId.companyName || 'Shop',
            tag: getProductTag(product)
          }));
          setProducts(fetchedProducts);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        if (err.response?.status === 401) {
          setError('Please log in to view products');
          // Optionally redirect to login
          // navigate('/login');
        } else {
          setError('An error occurred while loading products');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]); // Add location.search as dependency

  // Dynamically assign product tags
  const getProductTag = (product) => {
    if (product.discount >= 20) return 'BESTSELLER';
    return 'LIMITED EDITION';
  };

  // Format price with LKR and commas
  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString()}`;
  };

  // Handle Buy Now button click
  const handleBuyNow = (productName) => {
    navigate('/payments');
  };

  // Handle Edit Product
  const handleEdit = async (productId) => {
    try {
      navigate(`/edit-product/${productId}`);
    } catch (error) {
      console.error('Error navigating to edit page:', error);
    }
  };

  // Handle Delete Product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://localhost:5000/api/products/${productId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (response.data.success) {
          setProducts(products.filter(product => product.id !== productId));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        if (error.response?.status === 401) {
          setError('Please log in to delete products');
        } else {
          setError('Failed to delete product');
        }
      }
    }
  };

  // Handle Add Product
  const handleAddProduct = () => {
    navigate('/shopcarddetailsform');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
          {user?.role === 'shop' ? <ShopNavbar /> : <ClientNavbar />}

      <Bgvideo />
      <div className="container mx-auto px-4 py-12 flex-grow">
        {/* Header Section */}
        <div className="text-center mb-12">
          {products.length > 0 && (
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#850FFD] to-[#DF10FD]">
                {products[0].shopName}
              </span>
            </h2>
          )}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover innovation at your fingertips - where cutting-edge technology meets unbeatable value
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <>
            {user?.role === 'shop' && (
              <div className="mb-8 flex justify-end">
                <button
                  onClick={handleAddProduct}
                  className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300"
                >
                  + Add New Product
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                >
                  {/* Product Image with Tag */}
                  <div className="relative w-full h-64">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = '/fallback-image.jpg')}
                    />
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                      product.tag === 'BESTSELLER' ? 'bg-red-500' : 
                      'bg-purple-500'
                    }`}>
                      {product.tag}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                      {user?.role === 'shop' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-xl font-extrabold text-gray-900">
                          {formatPrice(product.price * (1 - product.discount / 100))}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      {user?.role !== 'shop' && (
                        <button 
                          className="w-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
                          onClick={() => handleBuyNow(product.name)}
                        >
                          Buy Now →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Creative Footer Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Need Help Choosing?</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Our tech experts are ready to guide you to the perfect gadget for your needs.
          </p>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300">
            Chat with an Expert
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ShopCard;