import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RiUserSettingsFill } from 'react-icons/ri';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from localStorage if available
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Handle logout
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle settings dropdown
  const toggleSettingsDropdown = () => {
    setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
  };

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'photographer':
        return { path: '/dashboard', label: 'Dashboard' };
      case 'shop':
        return { path: '/shopdashboard', label: 'Shop Dashboard' };
      case 'rental':
        return { path: '/rentdashboard', label: 'Rent Dashboard' };
      case 'client':
        return { path: '/bookingform', label: 'Booking' };
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <div>
      <header className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] rounded py-4 px-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/icon.png" alt="Logo" className="w-6 h-7 flex mr-3" />
            <div className="text-xl font-bold text-white">PHOTOGRAPHER.LK</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-purple-950 text-white transition">
              Home
            </Link>
            <Link to="/photographer" className="hover:text-purple-950 text-white transition">
              Photographer
            </Link>
            <Link to="/shop" className="hover:text-purple-950 text-white transition">
              Shop
            </Link>
            <Link to="/rent" className="hover:text-purple-950 text-white transition">
              Rent
            </Link>
            <Link to="/Aboutus" className="hover:text-purple-950 text-white transition">
              About Us
            </Link>
            {user && dashboardLink && (
              <Link to={dashboardLink.path} className="hover:text-purple-950 text-white transition">
                {dashboardLink.label}
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Auth/Settings */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleSettingsDropdown}
                  className="flex items-center transition hover:text-purple-950"
                >
                  <RiUserSettingsFill className="w-5 h-5 text-white transition cursor-pointer hover:text-purple-950" />
                </button>
                {isSettingsDropdownOpen && (
                  <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-200"
                      onClick={() => setIsSettingsDropdownOpen(false)}
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-200"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin">
                  <button className="border text-white px-4 py-1 rounded-md cursor-pointer">
                    Register
                  </button>
                </Link>
                <Link to="/login">
                  <button className="border text-white px-4 py-1 rounded-md cursor-pointer">
                    Log In
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-4 px-6 shadow-md">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="hover:text-purple transition"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/photographer"
                className="hover:text-purple transition"
                onClick={toggleMobileMenu}
              >
                Photographer
              </Link>
              <Link
                to="/shop"
                className="hover:text-purple transition"
                onClick={toggleMobileMenu}
              >
                Shop
              </Link>
              <Link
                to="/rent"
                className="hover:text-purple transition"
                onClick={toggleMobileMenu}
              >
                Rent
              </Link>
              <Link
                to="/Aboutus"
                className="hover:text-purple transition"
                onClick={toggleMobileMenu}
              >
                About Us
              </Link>
              {user && dashboardLink && (
                <Link
                  to={dashboardLink.path}
                  className="hover:text-purple transition"
                  onClick={toggleMobileMenu}
                >
                  {dashboardLink.label}
                </Link>
              )}
            </nav>

            <div className="flex flex-col space-y-4 mt-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="hover:text-purple transition"
                    onClick={toggleMobileMenu}
                  >
                    <button className="w-full border border-black py-2 px-4 rounded-md cursor-pointer">
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full border border-black py-2 px-4 rounded-md cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="hover:text-purple transition"
                    onClick={toggleMobileMenu}
                  >
                    <button className="w-full border border-black py-2 px-4 rounded-md cursor-pointer">
                      Register
                    </button>
                  </Link>
                  <Link
                    to="/login"
                    className="hover:text-purple transition"
                    onClick={toggleMobileMenu}
                  >
                    <button className="w-full border border-black py-2 px-4 rounded-md cursor-pointer">
                      Log In
                    </button>
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

export default Navbar;