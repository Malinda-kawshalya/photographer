import React, { useState } from 'react';
import axios from 'axios';
import Bgvideo from '../background/Bgvideo';
import Footer from '../Footer/Footer';
import PhotographerNavbar from '../PhotographerNavbar/PhotographerNavbar';

function PortfolioDetailsForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    mainCaption: '',
    mainPicture: null,
    subPictures: [],
    description: '',
    companyDetails: {
      address: '',
      responseTime: '',
      languages: '',
      memberSince: '',
      lastEvent: ''
    },
    photographyPackages: {
      wedding: { price: '', description: '' },
      photoshoots: { price: '', description: '' },
      musicEvents: { price: '', description: '' },
      graduation: { price: '', description: '' },
      productShoots: { price: '', description: '' },
      otherEvents: { price: '', description: '' }
    },
    videographyPackages: {
      wedding: { price: '', description: '' },
      documentary: { price: '', description: '' },
      musicEvents: { price: '', description: '' },
      otherEvents: { price: '', description: '' }
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please log in to create a profile');
      setIsSubmitting(false);
      return;
    }

    const submitData = new FormData();
    if (formData.mainPicture) {
      submitData.append('mainPicture', formData.mainPicture);
    } else {
      setErrorMessage('Main picture is required.');
      setIsSubmitting(false);
      return;
    }
    if (formData.subPictures.length > 0) {
      formData.subPictures.forEach((picture, index) => {
        submitData.append('subPictures', picture);
      });
    } else {
      setErrorMessage('At least one additional picture is required.');
      setIsSubmitting(false);
      return;
    }

    const dataToSend = {
      ...formData,
      mainPicture: null,
      subPictures: [],
    };

    console.log('Submitting formData:', dataToSend);
    submitData.append('formData', JSON.stringify(dataToSend));

    try {
      const response = await axios.post(
        'http://localhost:5000/api/company-profile',
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('API response:', response.data);

      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Company profile created successfully!');
        setFormData({
          companyName: '',
          mainCaption: '',
          mainPicture: null,
          subPictures: [],
          description: '',
          companyDetails: {
            address: '',
            responseTime: '',
            languages: '',
            memberSince: '',
            lastEvent: ''
          },
          photographyPackages: {
            wedding: { price: '', description: '' },
            photoshoots: { price: '', description: '' },
            musicEvents: { price: '', description: '' },
            graduation: { price: '', description: '' },
            productShoots: { price: '', description: '' },
            otherEvents: { price: '', description: '' }
          },
          videographyPackages: {
            wedding: { price: '', description: '' },
            documentary: { price: '', description: '' },
            musicEvents: { price: '', description: '' },
            otherEvents: { price: '', description: '' }
          }
        });
      } else {
        setErrorMessage(response.data.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(
        error.response?.data?.error || 
        error.response?.data?.details || 
        'Error submitting form: ' + error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PhotographerNavbar />
      <Bgvideo />
      <div className='min-h-screen mx-auto px-6 py-8 bg-white'>
        <div className='container mx-auto px-4 py-8'>
          <header className='mb-8'>
            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#850FFD] to-[#DF10FD] font-bold mb-2'>Setup Your Company Profile</h1>
            <p className='text-gray-600'>Fill out all details to create your portfolio page</p>
          </header>
          {successMessage && (
            <div className='mb-4 p-4 bg-green-500/20 border border-green-600 text-green-600 rounded-lg'>
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className='mb-4 p-4 bg-red-500/20 border border-red-500 text-red-500 rounded-lg'>
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className='rounded-lg p-6 shadow-md border border-gray-300'>
            <section className='mb-8'>
              <h2 className='text-xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2'>Basic Information</h2>
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-2'>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-2'>Main Caption</label>
                <input
                  type="text"
                  name="mainCaption"
                  value={formData.mainCaption}
                  onChange={handleChange}
                  placeholder="e.g., 'I will do portrait photography in Sri Lanka'"
                  className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-2'>Main Picture</label>
                <input
                  type="file"
                  name="mainPicture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-2'>Additional Pictures (Select up to 3)</label>
                <input
                  type="file"
                  name="subPictures"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-2'>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                  required
                ></textarea>
              </div>
            </section>
            <section className='mb-8'>
              <h2 className='text-xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2'>Company Details</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-2'>Address</label>
                  <input
                    type="text"
                    name="companyDetails.address"
                    value={formData.companyDetails.address}
                    onChange={handleChange}
                    className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-2'>Response Time</label>
                  <input
                    type="text"
                    name="companyDetails.responseTime"
                    value={formData.companyDetails.responseTime}
                    onChange={handleChange}
                    placeholder="e.g., '2 hours'"
                    className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-2'>Languages</label>
                  <input
                    type="text"
                    name="companyDetails.languages"
                    value={formData.companyDetails.languages}
                    onChange={handleChange}
                    placeholder="e.g., 'Sinhala, English, Tamil'"
                    className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                    required
                  />
                </div>
              </div>
            </section>
            <section className='mb-8'>
              <h2 className='text-xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2'>Photography Packages</h2>
              <div className='space-y-6'>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Wedding Photography</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="photography_wedding_price"
                        value={formData.photographyPackages.wedding.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="photography_wedding_description"
                        value={formData.photographyPackages.wedding.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Portrait Photo Shoots</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="photography_photoshoots_price"
                        value={formData.photographyPackages.photoshoots.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="photography_photoshoots_description"
                        value={formData.photographyPackages.photoshoots.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Music Events Photography</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="photography_musicEvents_price"
                        value={formData.photographyPackages.musicEvents.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="photography_musicEvents_description"
                        value={formData.photographyPackages.musicEvents.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Graduation Photography</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="photography_graduation_price"
                        value={formData.photographyPackages.graduation.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="photography_graduation_description"
                        value={formData.photographyPackages.graduation.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Product & Commercial Shoots</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="photography_productShoots_price"
                        value={formData.photographyPackages.productShoots.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="photography_productShoots_description"
                        value={formData.photographyPackages.productShoots.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Other Events Photography</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="photography_otherEvents_price"
                        value={formData.photographyPackages.otherEvents.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="photography_otherEvents_description"
                        value={formData.photographyPackages.otherEvents.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className='mb-8'>
              <h2 className='text-xl font-bold mb-4 text-purple-500 border-b border-purple-500 pb-2'>Videography Packages</h2>
              <div className='space-y-6'>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Wedding Videography</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="videography_wedding_price"
                        value={formData.videographyPackages.wedding.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="videography_wedding_description"
                        value={formData.videographyPackages.wedding.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Documentary Videography</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="videography_documentary_price"
                        value={formData.videographyPackages.documentary.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="videography_documentary_description"
                        value={formData.videographyPackages.documentary.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Music Events Videography</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="videography_musicEvents_price"
                        value={formData.videographyPackages.musicEvents.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="videography_musicEvents_description"
                        value={formData.videographyPackages.musicEvents.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg'>
                  <h3 className='font-bold text-lg mb-3'>Other Events Videography</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Price (LKR)</label>
                      <input
                        type="text"
                        name="videography_otherEvents_price"
                        value={formData.videographyPackages.otherEvents.price}
                        onChange={handleChange}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>Description</label>
                      <textarea
                        name="videography_otherEvents_description"
                        value={formData.videographyPackages.otherEvents.description}
                        onChange={handleChange}
                        rows={3}
                        className='w-full p-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-transparent'
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className='flex justify-end'>
              <button
                type="submit"
                className='bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white font-medium py-3 px-6 rounded-lg transition duration-200'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PortfolioDetailsForm;