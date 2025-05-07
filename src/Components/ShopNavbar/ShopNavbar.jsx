import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaEdit, FaSignOutAlt, FaBell, FaFileAlt } from 'react-icons/fa';
import { FaMessage } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri";

function ShopNavbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNoticeDropdownOpen, setIsNoticeDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
      setProfileForm({
        name: loggedInUser.name || '',
        email: loggedInUser.email || '',
        phone: loggedInUser.phone || ''
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsNoticeDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleNoticeDropdown = () => {
    setIsNoticeDropdownOpen(!isNoticeDropdownOpen);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...profileForm };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditProfileOpen(false);
    alert('Profile updated successfully!');
  };

  return (
    <div>
      {/* Navbar Header */}
      <header className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] rounded py-4 px-6 shadow-sm">
        <div className="container flex items-center justify-between mx-auto">
          <Link to='/' className='flex'>
            <img src="icon.png" alt="" className='flex w-6 mr-3 h-7' />
            <div className="text-xl font-bold text-white">PHOTOGRAPHER.LK [Shop]</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-6 md:flex">
            <Link to='/shopdashboard' className="text-white transition hover:text-purple-950">Dashboard</Link>
            <Link to='/shoporder' className="text-white transition hover:text-purple-950">Orders</Link>
            <Link to='/shopcard' className="text-white transition hover:text-purple-950">Shop Card</Link>
            <Link to='/shopearning' className="text-white transition hover:text-purple-950">Earnings</Link>
            <Link to='/shopnotice' className="text-white transition hover:text-purple-950">Notice</Link>
            <Link to='/shopabout' className="text-white transition hover:text-purple-950">About Us</Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="text-white md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Icons */}
          <div className="items-center hidden space-x-6 md:flex">
            <Link to="/message" className="text-white transition hover:text-purple-950">
              <FaMessage size={20} />
            </Link>

            <button className="relative text-white transition hover:text-purple-950">
              <FaBell size={20} />
              <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">3</span>
            </button>

            {/* Settings Dropdown */}
            <div className="relative">
              <button onClick={toggleNoticeDropdown} className="text-white hover:text-purple-950">
                <RiUserSettingsFill className="w-5 h-5" />
              </button>

              {isNoticeDropdownOpen && (
                <div className="absolute left-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                  <Link
                    to="/shopcarddetailsform"
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200"
                    onClick={() => setIsNoticeDropdownOpen(false)}
                  >
                    <FaFileAlt className="mr-2" /> Form
                  </Link>
                  <Link to="/profile" className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200" onClick={() => setIsSettingsDropdownOpen(false)}>
                                        <FaUser className="mr-2" /> Profile
                                      </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="px-6 py-4 bg-white shadow-md md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link to='/shopdashboard' onClick={toggleMobileMenu}>Dashboard</Link>
              <Link to='/shoporder' onClick={toggleMobileMenu}>Orders</Link>
              <Link to='/shopcard' onClick={toggleMobileMenu}>Shop Card</Link>
              <Link to='/shopearning' onClick={toggleMobileMenu}>Earnings</Link>
              <Link to='/shopnotice' onClick={toggleMobileMenu}>Notice</Link>
              <Link to='/shopabout' onClick={toggleMobileMenu}>About Us</Link>

              <div className="flex flex-col space-y-2">
                <button onClick={() => setIsNoticeDropdownOpen(!isNoticeDropdownOpen)} className="flex items-center text-left">
                  <RiUserSettingsFill className="mr-2" /> Settings
                </button>

                {isNoticeDropdownOpen && (
                  <div className="flex flex-col pl-4 space-y-2">
                    <Link to="/shopcarddetailsform" onClick={toggleMobileMenu} className="flex items-center">
                      <FaFileAlt className="mr-2" /> Form
                    </Link>
                    <button
                      onClick={() => {
                        setIsEditProfileOpen(true);
                        toggleMobileMenu();
                      }}
                      className="flex items-center text-left"
                    >
                      <FaUser className="mr-2" /> Profile
                    </button>
                    <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="flex items-center text-left">
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-center">Edit Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Name"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopNavbar;
