import React, { useState, useEffect } from 'react';
import { FiEdit2, FiShare2, FiMapPin, FiMessageSquare, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';
import PhotographerNavbar from '../../../Components/PhotographerNavbar/PhotographerNavbar';
import Bgvideo from '../../../Components/background/Bgvideo';

function Profile() {
  const [activeModal, setActiveModal] = useState(null);
  const [profileData, setProfileData] = useState({
    tagline: '',
    description: '',
    displayName: '',
    username: '',
    location: '',
    languages: [],
    hideLocation: false,
    companyLogo: { url: '', filename: '' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your profile');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const response = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileData({
          tagline: response.data.user.description || '',
          description: response.data.user.description || '',
          displayName: response.data.user.companyName || '',
          username: response.data.user.username || '',
          location: response.data.user.location || '',
          languages: response.data.user.languages || [],
          hideLocation: response.data.user.hideLocation || false,
          companyLogo: response.data.user.companyLogo || { url: '', filename: '' },
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLanguageToggle = (language) => {
    setProfileData((prev) => {
      if (prev.languages.includes(language)) {
        return {
          ...prev,
          languages: prev.languages.filter((l) => l !== language),
        };
      } else {
        return {
          ...prev,
          languages: [...prev.languages, language],
        };
      }
    });
  };

  // Save profile changes to backend
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to save changes');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      await axios.put(
        'http://localhost:5000/profile',
        {
          companyName: profileData.displayName,
          description: profileData.description,
          location: profileData.location,
          languages: profileData.languages,
          hideLocation: profileData.hideLocation,
          username: profileData.username,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      closeModal();
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.response?.data?.message || 'Failed to save profile');
    }
  };

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('companyLogo', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/profile/picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileData((prev) => ({
        ...prev,
        companyLogo: response.data.user.companyLogo,
      }));
      closeModal();
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    }
  };

  // Reusable Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-xl mx-4 overflow-hidden bg-white rounded-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  // Reusable Modal Footer Component
  const ModalFooter = ({ onSave }) => {
    return (
      <div className="flex justify-end p-4 border-t">
        <button
          onClick={onSave}
          className="px-6 py-2 text-gray-800 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Save
        </button>
      </div>
    );
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

  return (
    <>
      <PhotographerNavbar />
      <Bgvideo />
      <div className="min-h-screen pt-4 pb-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="p-6 mb-6 bg-white rounded-xl">
              <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 group">
                    <div className="w-24 h-24 overflow-hidden bg-gray-200 rounded-full">
                      <img
                        src={profileData.companyLogo.url || '/placeholder.svg'}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <button
                      onClick={() => openModal('profilePic')}
                      className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100"
                    >
                      <FiEdit2 className="text-white" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{profileData.displayName}</h1>
                      <button onClick={() => openModal('name')} className="text-gray-500">
                        <FiEdit2 />
                      </button>
                    </div>
                    <p className="text-gray-500">@{profileData.username}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {!profileData.hideLocation && (
                        <div className="flex items-center">
                          <FiMapPin className="mr-1" />
                          <span>{profileData.location}</span>
                          <button onClick={() => openModal('location')} className="ml-2 text-gray-500">
                            <FiEdit2 />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center">
                        <FiMessageSquare className="mr-1" />
                        <span>Speaks {profileData.languages.join(', ')}</span>
                        <button onClick={() => openModal('languages')} className="ml-2 text-gray-500">
                          <FiEdit2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <FiShare2 />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              <div className="p-6 mb-6 bg-white border border-gray-200 rounded-xl">
                <h2 className="mb-4 text-2xl font-bold">About</h2>
                <p className="mb-2 text-lg font-semibold">{profileData.tagline}</p>
                <p className="mb-4 text-gray-700 whitespace-pre-line">{profileData.description}</p>
                <button
                  onClick={() => openModal('about')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <FiEdit2 />
                  <span>Edit details</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* About Modal */}
        <Modal isOpen={activeModal === 'about'} onClose={closeModal} title="Edit About">
          <div className="mb-6">
            <label htmlFor="tagline" className="block mb-2 text-lg font-medium text-gray-700">
              Tagline
            </label>
            <div className="relative">
              <input
                type="text"
                id="tagline"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                value={profileData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
              />
              <div className="absolute text-xs text-gray-500 right-2 bottom-1">
                {profileData.tagline.length}/70 characters
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-lg font-medium text-gray-700">
              Description
            </label>
            <div className="relative">
              <textarea
                id="description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none min-h-[200px]"
                value={profileData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
              <div className="absolute text-xs text-gray-500 right-2 bottom-1">
                {profileData.description.length}/600 characters
              </div>
            </div>
          </div>
          <ModalFooter onSave={handleSave} />
        </Modal>

        {/* Profile Picture Modal */}
        <Modal isOpen={activeModal === 'profilePic'} onClose={closeModal} title="Edit Profile Picture">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-32 h-32 mb-4 overflow-hidden bg-gray-200 rounded-full">
              <img
                src={profileData.companyLogo.url || '/placeholder.svg'}
                alt="Current Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <label className="px-6 py-2 text-gray-800 transition-colors bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300">
              Upload New Picture
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicUpload}
              />
            </label>
          </div>

          <div className="text-sm text-gray-500">
            <p>Recommended: Square image, at least 400x400 pixels</p>
            <p>Maximum file size: 5MB</p>
            <p>Supported formats: JPG, PNG, GIF</p>
          </div>
          <ModalFooter onSave={closeModal} />
        </Modal>

        {/* Name Modal */}
        <Modal isOpen={activeModal === 'name'} onClose={closeModal} title="Edit Display Name">
          <div className="mb-6">
            <label htmlFor="displayName" className="block mb-2 text-lg font-medium text-gray-700">
              Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="displayName"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                value={profileData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
              />
              <div className="absolute text-xs text-gray-500 right-2 bottom-1">
                {profileData.displayName.length}/50 characters
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 text-lg font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                  @
                </span>
                <input
                  type="text"
                  id="username"
                  className="w-full p-3 border border-gray-300 rounded-r-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  value={profileData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </div>
              <div className="absolute text-xs text-gray-500 right-2 bottom-1">
                {profileData.username.length}/15 characters
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Username can only contain letters, numbers, and underscores.
            </p>
          </div>
          <ModalFooter onSave={handleSave} />
        </Modal>

        {/* Location Modal */}
        <Modal isOpen={activeModal === 'location'} onClose={closeModal} title="Edit Location">
          <div className="mb-6">
            <label htmlFor="location" className="block mb-2 text-lg font-medium text-gray-700">
              Your Location
            </label>
            <div className="relative">
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                  <FiMapPin />
                </span>
                <input
                  type="text"
                  id="location"
                  className="w-full p-3 border border-gray-300 rounded-r-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter your location"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">This will be displayed on your public profile</p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-700">Popular Locations</label>
            <div className="grid grid-cols-2 gap-2">
              {['Colombo, Sri Lanka', 'Kandy, Sri Lanka', 'Galle, Sri Lanka', 'Jaffna, Sri Lanka'].map(
                (loc) => (
                  <button
                    key={loc}
                    onClick={() => handleInputChange('location', loc)}
                    className="p-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    {loc}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hideLocation"
              className="w-4 h-4 mr-2"
              checked={profileData.hideLocation}
              onChange={(e) => handleInputChange('hideLocation', e.target.checked)}
            />
            <label htmlFor="hideLocation" className="text-sm text-gray-700">
              Hide my location from public profile
            </label>
          </div>
          <ModalFooter onSave={handleSave} />
        </Modal>

        {/* Languages Modal */}
        <Modal isOpen={activeModal === 'languages'} onClose={closeModal} title="Edit Languages">
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium text-gray-700">Select Languages</label>
            <div className="space-y-3">
              {['English', 'Sinhala', 'Tamil', 'Hindi', 'French'].map((lang) => (
                <div key={lang} className="flex items-center">
                  <input
                    type="checkbox"
                    id={lang.toLowerCase()}
                    className="w-4 h-4 mr-2"
                    checked={profileData.languages.includes(lang)}
                    onChange={() => handleLanguageToggle(lang)}
                  />
                  <label htmlFor={lang.toLowerCase()}>{lang}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <button className="flex items-center text-blue-600 hover:text-blue-800">
              <FiEdit2 className="mr-1" />
              <span>Add another language</span>
            </button>
          </div>
          <ModalFooter onSave={handleSave} />
        </Modal>
      </div>
      <Footer />
    </>
  );
}

export default Profile;