import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Bgvideo from '../background/Bgvideo';
import Footer from '../Footer/Footer';
import axios from 'axios';

function Portfolio() {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false); // New state to check if the viewer is the owner

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Check if this is the logged-in photographer viewing their own portfolio
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser?.role === 'photographer' && loggedInUser?.companyName === companyName) {
          // Add edit buttons or special photographer features here
          setIsOwner(true);
        }

        const response = await axios.get(`http://localhost:5000/api/company-profile/${companyName}`);
        setPortfolio(response.data.profile);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Portfolio not found. Please set up your portfolio first.');
          // Redirect to portfolio form if photographer
          const loggedInUser = JSON.parse(localStorage.getItem('user'));
          if (loggedInUser?.role === 'photographer') {
            navigate('/Portfoliodetailsform');
          }
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [companyName, navigate]);

  const handleChatClick = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        // If no token exists, redirect to login
        navigate('/login', { state: { from: `/portfolio/${companyName}`, message: 'Please login to chat with photographers' } });
        return;
      }

      // Include the token in the request headers
      const response = await axios.post(
        'http://localhost:5000/api/chats', 
        { companyName },
        { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
        }
      );

      if (response.data.success) {
        navigate(`/chat/${response.data.chatId}`);
      } else {
        setError(response.data.error || 'Failed to start chat');
      }
    } catch (err) {
      console.error('Error starting chat:', err);
      
      // Handle 401 errors by redirecting to login
      if (err.response && err.response.status === 401) {
        navigate('/login', { state: { from: `/portfolio/${companyName}`, message: 'Your session has expired. Please login again.' } });
        return;
      }
      
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

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

  if (!portfolio) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-xl">Portfolio not found</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Bgvideo />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* header section */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="flex items-center mb-4 md:mb-0">
                <h1 className="text-xl font-bold mr-3">{portfolio.companyName}</h1>
                <span className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white text-xs px-2 py-1 rounded-full">
                  Level - 2
                </span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold">{portfolio.mainCaption}</h2>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {/* main content */}
              <section className="container mx-auto p-4">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img
                    src={`http://localhost:5000${portfolio.mainPicture.url}`}
                    alt="Main"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {portfolio.subPictures.map((img, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={`http://localhost:5000${img.url}`}
                        alt={`preview ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="rounded-lg p-4 shadow-md">
                  <p className="text-gray-600">{portfolio.description}</p>
                </div>
              </section>

              {/* About section */}
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">Get to know {portfolio.companyName}</h3>
                <div className="rounded-lg p-6 shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold mr-3">{portfolio.companyName}</h4>
                    <span className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white text-xs px-2 py-1 rounded-full">
                      Level - 2
                    </span>
                  </div>

                  <div className="text-purple-900 grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <div className="flex items-center">
                      <span className="text-sm">{portfolio.companyDetails.address}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">Member since: {portfolio.companyDetails.memberSince}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">Response time: {portfolio.companyDetails.responseTime}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">Last event: {portfolio.companyDetails.lastEvent}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm">Languages: {portfolio.companyDetails.languages}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* packages */}
            <div className="w-full lg:w-1/3">
              <div className="rounded-lg p-6 shadow-md border bg-gray-100 border-gray-100 sticky top-4">
                <h3 className="text-xl font-bold mb-4">Pricing and packages</h3>

                {/* Photography Packages */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-3 text-purple-700">Photography</h4>
                  {Object.entries(portfolio.photographyPackages).map(([key, pkg]) => (
                    <div key={key} className="space-y-4 cursor-pointer">
                      <div className="p-4 border border-gray-100 bg-white shadow-md rounded-lg mb-2">
                        <h5 className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</h5>
                        <p className="text-lg font-bold my-1">{pkg.price} LKR</p>
                        <p className="text-sm text-gray-500">{pkg.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Videography Packages */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-3 text-purple-700">Videography</h4>
                  {Object.entries(portfolio.videographyPackages).map(([key, pkg]) => (
                    <div key={key} className="space-y-4 cursor-pointer">
                      <div className="p-4 border border-gray-100 bg-white shadow-md rounded-lg mb-2">
                        <h5 className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</h5>
                        <p className="text-lg font-bold my-1">{pkg.price} LKR</p>
                        <p className="text-sm text-gray-500">{pkg.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Book Your Package Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigate('/bookingform')}
                    className="w-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white font-bold py-3 px-6 rounded-lg transition duration-200 hover:from-[#EF10FD] hover:to-[#950FFD] cursor-pointer"
                  >
                    Book Your Package Now
                  </button>
                </div>

                {/* Chat with Photographer Button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={handleChatClick}
                    className="w-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white font-bold py-3 px-6 rounded-lg transition duration-200 hover:from-[#EF10FD] hover:to-[#950FFD] cursor-pointer"
                  >
                    Chat with Photographer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Portfolio;