import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';
import StartChat from '../../../Components/StartChat/StartChat';
import Bgvideo from '../../../Components/background/Bgvideo';
import Footer from '../../../Components/Footer/Footer';
import Navbar from "../../../Components/Navbar/Navbar";

function RentCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        setUser(loggedInUser);
        
        // Get providerId from URL parameters
        const params = new URLSearchParams(location.search);
        const providerId = params.get('providerId');
        
        if (!providerId && !loggedInUser?.role === 'rental') {
          setError('No provider specified');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/rental-products');
        const fetchedProducts = response.data.rentalProducts
          .filter(product => {
            if (loggedInUser?.role === 'rental') {
              return product.userId._id === loggedInUser._id;
            }
            return product.userId._id === providerId;
          })
          .map(product => ({
            id: product._id,
            userId: product.userId._id,
            image: `http://localhost:5000${product.image.url}`,
            name: product.name,
            tag: product.discount > 10 ? 'PREMIUM' : 
                 product.discount > 0 ? 'POPULAR' : 'NEW',
            description: product.description,
            price: product.pricePerDay,
            discount: product.discount,
            providerName: product.userId.companyName || 'Rental Service'
          }));
        
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rental products:', err);
        setError('Failed to load rental products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  // Format price with LKR and commas
  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString()}/day`;
  };

  const handleEdit = async (productId) => {
    try {
      navigate(`/edit-rental/${productId}`);
    } catch (error) {
      console.error('Error navigating to edit page:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this rental item?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/rental-products/${productId}`);
        if (response.data.success) {
          setProducts(products.filter(product => product.id !== productId));
        }
      } catch (error) {
        console.error('Error deleting rental product:', error);
      }
    }
  };

  const handleAddProduct = () => {
    navigate('/add-rental');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  console.log('Current user role:', user?.role); // Debug log
  console.log('Products:', products); // Debug log
  
  // Enhanced debug logging for the first product
  if (products.length > 0) {
    console.log('First product details:', {
      id: products[0].id,
      userId: products[0].userId,
      name: products[0].name,
      providerId: products[0].providerId
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar/>
      <Bgvideo />
      <div className="container mx-auto px-4 py-12 flex-grow">
        {/* Creative Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#850FFD] to-[#DF10FD]">
              Camera Rentals
            </span>
          </h2>
          {products.length > 0 && user?.role === 'client' && (
            <div className="flex justify-center mt-3 mb-4">
              {(() => {
                // Extract the raw product data to see the exact structure
                console.log('Raw product data:', products[0]);
                
                // Get providerId from URL parameters
                const params = new URLSearchParams(location.search);
                const providerId = params.get('providerId');
                
                console.log('Provider ID from URL:', providerId);
                console.log('Product userId:', products[0].userId);
                
                // For debugging, show the product.userId directly
                const productUserId = products[0].userId;
                console.log('Provider ID type:', typeof productUserId);
                
                // Use the providerId from URL if available, otherwise use the product's userId
                const rentalId = providerId || products[0].userId;
                
                // Ensure we have a valid userId before rendering the chat button
                if (!rentalId) {
                  return <p className="text-red-500">Unable to find rental provider ID</p>;
                }
                
                return (
                  <StartChat 
                    userId={rentalId}
                    type="rental" 
                  />
                );
              })()} 
            </div>
          )}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional photography gear for rent - capture your moments with premium equipment
          </p>
          <div className="mt-4">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              📷 Professional Grade
            </span>
          </div>
        </div>

        {/* Rental Products Grid */}
        <div className="container mx-auto px-4 py-12 flex-grow">
          {user?.role === 'rental' && (
            <div className="mb-8 flex justify-end">
              <button
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300"
              >
                + Add New Rental Item
              </button>
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-800">
                Products by {products[0].providerName}
              </h3>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            {products.map((rental) => (
              <div key={rental.id} className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                {/* Image section remains the same */}
                <div className="relative w-full md:w-64 h-64 flex-shrink-0">
                  <img 
                    src={rental.image} 
                    alt={rental.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-product-image.png';
                    }}
                  />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    rental.tag === 'POPULAR' ? 'bg-red-500' : 
                    rental.tag === 'NEW' ? 'bg-blue-500' : 
                    'bg-purple-500'
                  }`}>
                    {rental.tag}
                  </span>
                </div>

                {/* Product Details */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{rental.name}</h3>
                    {user?.role === 'rental' && user?._id === rental.userId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(rental.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-300"
                          title="Edit Item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(rental.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-300"
                          title="Delete Item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 flex-grow">{rental.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-extrabold text-gray-900">
                        {formatPrice(
                          rental.discount > 0 
                            ? rental.price * (1 - rental.discount / 100) 
                            : rental.price
                        )}
                      </span>
                      {rental.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(rental.price)}
                        </span>
                      )}
                    </div>
                    {user?.role !== 'rental' && (
                      <Link 
                        to={`/rentdetailsform?providerId=${rental.userId}`}
                        className="w-full md:w-auto"
                      >
                        <button className="w-full md:w-auto bg-gradient-to-r from-[#850FFD] to-[#DF10FD] hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md">
                          Rent Now →
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No products available message */}
          {!loading && products.length === 0 && (
            <div className="text-center text-gray-600">
              <p>No rental products available from this provider.</p>
            </div>
          )}
        </div>

        {/* Creative Footer Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Need Photography Gear?</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Our camera specialists can help you choose the perfect equipment for your shoot.
          </p>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300">
            Book Now
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RentCard;

// When linking to the RentCard page from other components:
// <Link to={`/rentcard?providerId=${providerId}`}>View Products</Link>