import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import RentNavbar from '../../../Components/RentNavbar/RentNavbar';
import Bgvideo from '../../../Components/background/Bgvideo';
import Footer from '../../../Components/Footer/Footer';

function RentCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rental-products');
        const fetchedProducts = response.data.rentalProducts.map(product => ({
          id: product._id,
          image: `http://localhost:5000${product.image.url}`,
          name: product.name,
          tag: product.discount > 10 ? 'PREMIUM' : product.discount > 0 ? 'POPULAR' : 'NEW', // Synthetic tag
          description: `${product.description} (Provided by ${product.userId.companyName || 'Rental Service'})`,
          price: product.pricePerDay,
          discount: product.discount
        }));
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rental products:', err);
        setError('Failed to load rental products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Format price with LKR and commas
  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString()}/day`;
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Bgvideo />
      <div className="container mx-auto px-4 py-12 flex-grow">
        {/* Creative Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#850FFD] to-[#DF10FD]">
              Camera Rentals
            </span>
          </h2>
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
        {products.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            No rental products available. Check back later or contact a rental service.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {products.map((rental) => (
              <div 
                key={rental.id} 
                className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              >
                {/* Product Image with Tag */}
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
                    <div className="flex items-center">
                      {rental.discount > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                          SAVE {rental.discount}%
                        </span>
                      )}
                    </div>
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
                    <Link to='/rentdetailsform'>

                    <button className="w-full md:w-auto bg-gradient-to-r from-[#850FFD] to-[#DF10FD] hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md">
                      Rent Now →
                    </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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