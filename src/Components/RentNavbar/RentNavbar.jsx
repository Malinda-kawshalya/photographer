import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaEdit, FaSignOutAlt, FaBell, FaFileAlt } from 'react-icons/fa';
import { FaMessage } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri";

function RentNavbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNoticeDropdownOpen, setIsNoticeDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Retrieve user data from localStorage if available
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

  // Handle logout (clear localStorage)
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileDropdownOpen(false);
    setIsNoticeDropdownOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsNoticeDropdownOpen(false);
  };

  // Toggle notice dropdown
  const toggleNoticeDropdown = () => {
    setIsNoticeDropdownOpen(!isNoticeDropdownOpen);
    setIsProfileDropdownOpen(false);
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Update user data in localStorage
    const updatedUser = { ...user, ...profileForm };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditProfileOpen(false);
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <header className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD]  rounded py-4 px-6 shadow-sm ">
        <div className="container flex items-center justify-between mx-auto">
          <Link to='/' className='flex'><img src="icon.png" alt="" className='flex w-6 mr-3 h-7' /><div className="text-xl font-bold text-white ">PHOTOGRAPHER.LK [Rent]</div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-6 md:flex ">
            <Link to='/rentdashboard' className="text-white transition hover:text-purple-950 ">Dashboard</Link>
            <Link to='/rentorder' className="text-white transition hover:text-purple-950 ">Orders</Link>
            <Link to='/rentcard' className="text-white transition hover:text-purple-950 ">Rent Card</Link>
            <Link to='/rentearning' className="text-white transition hover:text-purple-950 ">Earnings</Link>
            <Link to='/rentnotice' className="text-white transition hover:text-purple-950 ">Notice</Link>
            <Link to='/rentabout' className="text-white transition hover:text-purple-950 ">About Us</Link>
            
            
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="text-white md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          
          {/* Desktop Icons */}
          <div className="items-center hidden space-x-6 md:flex ">
            <Link to="/message" className="text-white transition hover:text-purple-950">
              <FaMessage size={20} />
            </Link>
            
            <button className="relative text-white transition hover:text-purple-950">
              <FaBell size={20} />
              <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">3</span>
            </button>

            {/* Notice Link with Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleNoticeDropdown}
                className="flex items-center transition hover:text-purple-950"
              >
                <RiUserSettingsFill className="w-5 h-5 ml-1 text-white transition cursor-pointer hover:text-purple-950" />
              </button>
              
              {isNoticeDropdownOpen && (
                <div className="absolute left-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                  <Link
                    to="/rentcarddetailsform"
                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-200"
                    onClick={() => setIsNoticeDropdownOpen(false)}
                  >
                    <FaFileAlt className="mr-2" /> Form
                  </Link>
                  <button
                    onClick={() => {
                      setIsEditProfileOpen(true);
                      setIsNoticeDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-200"
                  >
                    <FaUser className="mr-2" /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-200"
                  >
                    <FaSignOutAlt className="mr-2 " /> Logout
                  </button>
                </div>
              )}
            </div>
            
            {/* {user ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-1 text-white hover:text-purple-dark"
                ><FaUser size={20} />
                  <IoIosArrowDropdownCircle />
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user.name || 'User'}
                    </div>
                    <button
                      onClick={() => {
                        setIsEditProfileOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-purple-100"
                    >
                      <FaEdit className="mr-2" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-purple-100"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-purple hover:text-purple-dark">
                <FaUser size={20} />
              </Link>
            )} */}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="px-6 py-4 bg-white shadow-md md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link to='/rentdashboard' className="transition hover:text-purple" onClick={toggleMobileMenu}>Dashboard</Link>
              <Link to='/rentorder' className="transition hover:text-purple" onClick={toggleMobileMenu}>Order</Link>
              <Link to='/rentcard' className="transition hover:text-purple" onClick={toggleMobileMenu}>Rent Card</Link>
              <Link to='/rentearning' className="transition hover:text-purple" onClick={toggleMobileMenu}>Earnings</Link>
              <Link to='/rentnotice' className="transition hover:text-purple" onClick={toggleMobileMenu}>Notice</Link>
              <Link to='/rentabout' className="transition hover:text-purple" onClick={toggleMobileMenu}>About Us</Link>
              
              {/* Notice Dropdown in Mobile */}
              <div className="flex flex-col space-y-2 ">
                <button 
                  onClick={() => setIsNoticeDropdownOpen(!isNoticeDropdownOpen)}
                  className="flex items-center text-left transition hover:text-purple"
                >
              
                  <RiUserSettingsFill className="ml-1" /> Settings
                </button>
                
                {isNoticeDropdownOpen && (
                  <div className="flex flex-col pl-4 space-y-2">
                    <Link
                      to="/rentcarddetailsform"
                      className="flex items-center transition hover:text-purple"
                      onClick={toggleMobileMenu}
                    >
                      <FaFileAlt className="mr-2" /> Form
                    </Link>
                    <button
                      onClick={() => {
                        setIsEditProfileOpen(true);
                        toggleMobileMenu();
                      }}
                      className="flex items-center text-left transition hover:text-purple"
                    >
                      <FaUser className="mr-2" /> Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="flex items-center text-left transition hover:text-purple"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
            
            <div className="flex flex-col mt-4 space-y-4">
              <Link to="/message" className="flex items-center transition hover:text-purple" onClick={toggleMobileMenu}>
                <FaMessage className="mr-2" /> Messages
              </Link>
              <Link to="/notifications" className="flex items-center transition hover:text-purple" onClick={toggleMobileMenu}>
                <FaBell className="mr-2 " /> Notifications
              </Link>
              {/* {user ? (
                <button 
                  onClick={() => {
                    setIsEditProfileOpen(true);
                    toggleMobileMenu();
                  }}
                  className="flex items-center justify-center w-full px-4 py-2 transition border rounded-md cursor-pointer border-purple hover:bg-purple hover:text-white"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </button>
              ) : (
                <Link to="/login" className="flex items-center transition hover:text-purple" onClick={toggleMobileMenu}>
                  <FaUser className="mr-2" /> Login
                </Link>
              )} */}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}


export default RentNavbar