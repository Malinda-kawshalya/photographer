import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Bgvideo from '../../Components/background/Bgvideo';
import Footer from '../../Components/Footer/Footer';

function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// Add this to your Sellers component


useEffect(() => {
  const fetchSellers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sellers');
      // Map the data to handle field name inconsistencies
      const formattedSellers = response.data.sellers.map(seller => ({
        ...seller,
        companyName: seller.companyName || seller.componyName // Handle both spellings
      }));
      setSellers(formattedSellers);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  fetchSellers();
}, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Bgvideo playsInline={true} /> {/* Fixed plays-inline attribute */}
      
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl text-center mb-12 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 bg-white">
            Camera Equipment Sellers
          </h1>
          
          {!sellers || sellers.length === 0 ? (
            <div className="text-center text-gray-600">
              No sellers found. Please check if sellers are registered with the 'seller' role.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sellers.map((seller) => (
                <div 
                  key={seller._id} 
                  className="border border-purple-100 rounded-lg shadow-lg overflow-hidden hover:shadow-xl duration-300 transform hover:-translate-y-2 transition-all"
                >
                  <div className="p-6">
                    <div className="flex justify-center mb-4">
                      {seller.companyLogo ? (
                        <img 
                          src={`http://localhost:5000${seller.companyLogo.url}`} 
                          alt={`${seller.companyName || 'Seller'} logo`}
                          className="h-32 w-32 object-cover rounded-full border-2 p-1 border-purple-600"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://via.placeholder.com/128";
                          }}
                        />
                      ) : (
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          No Logo
                        </div>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-semibold text-center mb-2">
                      {seller.companyName || 'Camera Store'}
                    </h2>
                    
                    <p className="text-center text-sm text-purple-900 mb-4">
                      {seller.username ? `By ${seller.username}` : 'Professional seller'}
                    </p>
                    
                    <p className="text-gray-600 text-center mb-6">
                      {seller.description || 'Professional camera equipment seller'}
                    </p>
                    
                    <div className="flex justify-center">
                      <Link 
                        to='/shopcard'
                        className="px-6 py-2 bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white rounded-lg"
                      >
                        View Products
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer className="footer-class" /> {/* Ensure Footer uses className */}
    </>
  );
}

export default Sellers;