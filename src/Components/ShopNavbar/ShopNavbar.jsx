import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RiUserSettingsFill } from "react-icons/ri";
import { FaMessage } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";

function ShopNavbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:5000/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSettingsDropdown = () => {
    setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
  };

  return (
    <div>
      <header className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] rounded py-4 px-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/icon.png" alt="Logo" className="w-6 h-7 flex mr-3" />
            <div className="text-xl font-bold text-white">PHOTOGRAPHER.LK [Shop]</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/shopdashboard" className="hover:text-purple-950 text-white transition">Dashboard</Link>
            <Link to="/shoporder" className="hover:text-purple-950 text-white transition">Orders</Link>
            <Link to="/shopcard" className="hover:text-purple-950 text-white transition">Shop Card</Link>
            <Link to="/shopearning" className="hover:text-purple-950 text-white transition">Earnings</Link>
            <Link to="/shopnotice" className="hover:text-purple-950 text-white transition">Notice</Link>
            <Link to="/shopabout" className="hover:text-purple-950 text-white transition">About Us</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white focus:outline-none" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            
            <div className="relative text-white transition hover:text-purple-950">
              <FaBell size={20} />
              <span className="absolute top-[-4px] right-[-4px] w-4 h-4 bg-red-500 text-xs rounded-full text-white flex items-center justify-center">3</span>
            </div>
            {user ? (
              <div className="relative">
                <button onClick={toggleSettingsDropdown} className="flex items-center transition hover:text-purple-950">
                  <RiUserSettingsFill className="w-5 h-5 text-white cursor-pointer" />
                </button>
                {isSettingsDropdownOpen && (
                  <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                    <Link to="/profile" className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200" onClick={() => setIsSettingsDropdownOpen(false)}>
                      <FaUser className="mr-2" /> Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200">
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin">
                  <button className="border text-white px-4 py-1 rounded-md">Register</button>
                </Link>
                <Link to="/login">
                  <button className="border text-white px-4 py-1 rounded-md">Log In</button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-4 px-6 shadow-md">
            <nav className="flex flex-col space-y-4">
              <Link to="/shopdashboard" className="hover:text-purple transition" onClick={toggleMobileMenu}>Dashboard</Link>
              <Link to="/shoporder" className="hover:text-purple transition" onClick={toggleMobileMenu}>Orders</Link>
              <Link to="/shopcard" className="hover:text-purple transition" onClick={toggleMobileMenu}>Shop Card</Link>
              <Link to="/shopearning" className="hover:text-purple transition" onClick={toggleMobileMenu}>Earnings</Link>
              <Link to="/shopnotice" className="hover:text-purple transition" onClick={toggleMobileMenu}>Notice</Link>
              <Link to="/shopabout" className="hover:text-purple transition" onClick={toggleMobileMenu}>About Us</Link>
            </nav>

            <div className="flex flex-col space-y-4 mt-4">
              {user ? (
                <>
                  <Link to="/profile" className="hover:text-purple transition" onClick={toggleMobileMenu}>
                    <button className="w-full border border-black py-2 px-4 rounded-md">Profile</button>
                  </Link>
                  <button onClick={handleLogout} className="w-full border border-black py-2 px-4 rounded-md">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={toggleMobileMenu}>
                    <button className="w-full border border-black py-2 px-4 rounded-md">Register</button>
                  </Link>
                  <Link to="/login" onClick={toggleMobileMenu}>
                    <button className="w-full border border-black py-2 px-4 rounded-md">Log In</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default ShopNavbar;
