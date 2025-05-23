import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaBell, FaFileAlt } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { RiUserSettingsFill } from 'react-icons/ri';

function PhotographerNavbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNoticeDropdownOpen, setIsNoticeDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      if (!loggedInUser.companyName && loggedInUser.role === 'photographer') {
        navigate('/Portfoliodetailsform');
      }
      setUser(loggedInUser);
    }
  }, [navigate]);

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
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleNoticeDropdown = () => {
    setIsNoticeDropdownOpen(!isNoticeDropdownOpen);
  };

  const isPhotographer = user?.role === 'photographer';

  return (
    <div>
      <header className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] rounded py-4 px-6 shadow-sm">
        <div className="container flex items-center justify-between mx-auto">
          <Link to="/" className="flex">
            <img src="icon.png" alt="" className="flex w-6 mr-3 h-7" />
            <div className="text-xl font-bold text-white">PHOTOGRAPHER.LK [Studio]</div>
          </Link>

          <nav className="items-center hidden space-x-6 md:flex">
            {isPhotographer && (
              <>
                <Link to="/dashboard" className="text-white transition hover:text-purple-950">
                  Dashboard
                </Link>
                <Link to="/order" className="text-white transition hover:text-purple-950">
                  Booking
                </Link>
                <Link
                  to={`/portfolio/${user?.companyName}`}
                  className="text-white transition hover:text-purple-950"
                >
                  Portfolio
                </Link>
                <Link to="/earning" className="text-white transition hover:text-purple-950">
                  Earnings
                </Link>
                <Link to="/notice" className="text-white transition hover:text-purple-950">
                  Notice
                </Link>
                <Link to="/sellerabout" className="text-white transition hover:text-purple-950">
                  About Us
                </Link>
              </>
            )}
          </nav>

          <button
            className="text-white md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          <div className="items-center hidden space-x-6 md:flex">
            <Link to="/photographerchats" className="text-white transition hover:text-purple-950">
              <FaMessage size={20} />
            </Link>

            <button className="relative text-white transition hover:text-purple-950">
              <FaBell size={20} />
              <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                3
              </span>
            </button>

            <div className="relative">
              <button
                onClick={toggleNoticeDropdown}
                className="flex items-center transition hover:text-purple-950"
              >
                <RiUserSettingsFill className="w-5 h-5 ml-1 text-white transition cursor-pointer hover:text-purple-950" />
              </button>

              {isNoticeDropdownOpen && (
                <div className="absolute left-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                  {isPhotographer && (
                    <>
                      <Link
                        to="/Portfoliodetailsform"
                        className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-200"
                        onClick={() => setIsNoticeDropdownOpen(false)}
                      >
                        <FaFileAlt className="mr-2" /> Form
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-200"
                        onClick={() => setIsNoticeDropdownOpen(false)}
                      >
                        <FaUser className="mr-2" /> Profile
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-200"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="px-6 py-4 bg-white shadow-md md:hidden">
            <nav className="flex flex-col space-y-4">
              {isPhotographer && (
                <>
                  <Link
                    to="/dashboard"
                    className="transition hover:text-purple"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/order"
                    className="transition hover:text-purple"
                    onClick={toggleMobileMenu}
                  >
                    Order
                  </Link>
                  <Link
                    to={`/portfolio/${user?.companyName}`}
                    className="transition hover:text-purple"
                    onClick={toggleMobileMenu}
                  >
                    Portfolio
                  </Link>
                  <Link
                    to="/earning"
                    className="transition hover:text-purple"
                    onClick={toggleMobileMenu}
                  >
                    Earnings
                  </Link>
                  <Link
                    to="/notice"
                    className="transition hover:text-purple"
                    onClick={toggleMobileMenu}
                  >
                    Notice
                  </Link>
                  <Link
                    to="/aboutus"
                    className="transition hover:text-purple"
                    onClick={toggleMobileMenu}
                  >
                    About Us
                  </Link>
                </>
              )}

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setIsNoticeDropdownOpen(!isNoticeDropdownOpen)}
                  className="flex items-center text-left transition hover:text-purple"
                >
                  <RiUserSettingsFill className="mr-2" /> Settings
                </button>

                {isNoticeDropdownOpen && (
                  <div className="flex flex-col pl-4 space-y-2">
                    {isPhotographer && (
                      <>
                        <Link
                          to="/Portfoliodetailsform"
                          className="flex items-center transition hover:text-purple"
                          onClick={toggleMobileMenu}
                        >
                          <FaFileAlt className="mr-2" /> Form
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center transition hover:text-purple"
                          onClick={toggleMobileMenu}
                        >
                          <FaUser className="mr-2" /> Profile
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center transition hover:text-purple"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>

            <div className="flex flex-col mt-4 space-y-4">
              <Link
                to="/message"
                className="flex items-center transition hover:text-purple"
                onClick={toggleMobileMenu}
              >
                <FaMessage className="mr-2" /> Messages
              </Link>
              <Link
                to="/notifications"
                className="flex items-center transition hover:text-purple"
                onClick={toggleMobileMenu}
              >
                <FaBell className="mr-2" /> Notifications
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default PhotographerNavbar;