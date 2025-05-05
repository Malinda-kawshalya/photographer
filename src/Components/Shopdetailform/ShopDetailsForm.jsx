import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Bgvideo from '../background/Bgvideo';
import Footer from '../Footer/Footer';
import ShopNavbar from '../ShopNavbar/ShopNavbar';



const ShopDetailsForm = ( ) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    const [formData, setFormData] = useState({
      
      // New fields
      customerDetails: {
        name: '',
        email: '',
        nicNumber: ''
      },
      productDetails: {
        name: '',
        brand: '',
        quantity: '',
        date: ''
      }
    });
  
    // Fetch existing profile if editing
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser && storedUser._id) {
            setUserId(storedUser._id);
            const response = await axios.get(`/api/company-profile/${storedUser._id}`);
            if (response.data.success) {
              setFormData(response.data.profile);
            }
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      };
  
      fetchProfile();
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
      } else if (name.includes('_')) {
        const [category, packageName, field] = name.split('_');
        setFormData(prev => ({
          ...prev,
          [`${category}Packages`]: {
            ...prev[`${category}Packages`],
            [packageName]: {
              ...prev[`${category}Packages`][packageName],
              [field]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    };
  
    const handleFileChange = (e) => {
      const { name, files } = e.target;
      if (name === 'mainPicture') {
        setFormData(prev => ({ ...prev, mainPicture: files[0] }));
      } else if (name === 'subPictures') {
        setFormData(prev => ({ ...prev, subPictures: Array.from(files).slice(0, 3) }));
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      setSuccess('');
  
      try {
        const formDataToSend = new FormData();
        
        // Append all form data
        formDataToSend.append('userId', userId);
        formDataToSend.append('companyName', formData.companyName);
        formDataToSend.append('mainCaption', formData.mainCaption);
        formDataToSend.append('description', formData.description);
        
        // Append nested objects
        formDataToSend.append('companyDetails', JSON.stringify(formData.companyDetails));
        formDataToSend.append('photographyPackages', JSON.stringify(formData.photographyPackages));
        formDataToSend.append('videographyPackages', JSON.stringify(formData.videographyPackages));
        formDataToSend.append('customerDetails', JSON.stringify(formData.customerDetails));
        formDataToSend.append('productDetails', JSON.stringify(formData.productDetails));
        
        // Append files
        if (formData.mainPicture) {
          formDataToSend.append('mainPicture', formData.mainPicture);
        }
        
        if (formData.subPictures && formData.subPictures.length > 0) {
          formData.subPictures.forEach((file) => {
            formDataToSend.append('subPictures', file);
          });
        }
  
        const response = await axios.post('/api/company-profile', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (response.data.success) {
          setSuccess('Portfolio saved successfully!');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          setError(response.data.message || 'Failed to save portfolio');
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        setError(err.response?.data?.message || 'An error occurred while saving the portfolio');
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleShopNow = () => {
      // Add your shop now logic here
      console.log('Shop Now clicked with data:', {
        customer: formData.customerDetails,
        product: formData.productDetails
      });
      alert('Proceeding to checkout!');
    };
  
    return (
      <div>
        <ShopNavbar/>
        <Bgvideo />
        <div className='min-h-screen bg-white mx-auto px-6 py-8 '>
          <div className='container mx-auto px-4 py-8'>
            <header className='mb-8'>
              <h1 className='text-3xl  font-bold mb-2'>
                {userId && formData.companyName ? 'Edit Crad' : 'Create Card'}
              </h1>
              <p className='text-gray-600'>Fill out all details to create your portfolio page</p>
              
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
  
            <form onSubmit={handleSubmit} className=' rounded-lg p-6 shadow-md border border-gray-300'>
              {/* Customer Details Section */}
              <section className='mb-8'>
                <h2 className='text-xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2'>
                  Customer Information
                </h2>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Customer Name</label>
                    <input
                      type="text"
                      name="customerDetails.name"
                      value={formData.customerDetails.name}
                      onChange={handleChange}
                      className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>
  
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Email Address</label>
                    <input
                      type="email"
                      name="customerDetails.email"
                      value={formData.customerDetails.email}
                      onChange={handleChange}
                      className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>
  
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>NIC Number</label>
                    <input
                      type="text"
                      name="customerDetails.nicNumber"
                      value={formData.customerDetails.nicNumber}
                      onChange={handleChange}
                      className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
              </section>
  
              {/* Product Details Section */}
              <section className='mb-8'>
                <h2 className='text-xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2'>
                  Product Information
                </h2>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Product Name</label>
                    <input
                      type="text"
                      name="productDetails.name"
                      value={formData.productDetails.name}
                      onChange={handleChange}
                      className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>
  
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Brand</label>
                    <input
                      type="text"
                      name="productDetails.brand"
                      value={formData.productDetails.brand}
                      onChange={handleChange}
                      className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>
  
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Quantity</label>
                    <input
                      type="number"
                      name="productDetails.quantity"
                      value={formData.productDetails.quantity}
                      onChange={handleChange}
                      min="1"
                      className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>
  
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Date</label>
                    <input
                      type="date"
                      name="productDetails.date"
                      value={formData.productDetails.date}
                      onChange={handleChange}
                      className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
  
                {/* Shop Now Button */}
                <div className='mt-6'>
                  <button
                    type="button"
                    onClick={handleShopNow}
                    className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition duration-2m00"
                  >
                    Shop Now
                  </button>
                </div>
              </section>
  
              {/* Rest of your existing form sections (Basic Information, Company Details, Packages) */}
              {/* ... Include all your existing sections here ... */}
  
              {/* Form Submission */}
              {/* <div className='flex justify-end mt-8'>
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
                    'Save Portfolio'
                  )}
                </button>
              </div> */}
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

export default ShopDetailsForm