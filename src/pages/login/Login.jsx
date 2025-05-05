import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import Bgvideo from '../../Components/background/Bgvideo';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      if (response.data.message === 'Login successful') {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);

        // Redirect based on role from backend response
        const userRole = response.data.user.role;
        switch (userRole) {
          case 'photographer':
            navigate('/dashboard');
            break;
          case 'shop':
            navigate('/shopdashboard');
            break;
          case 'rental':
            navigate('/rentdashboard');
            break;
          case 'client':
            navigate('/');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Login failed');
      } else {
        setErrorMessage('Server error, please try again later');
      }
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  return (
    <div>
      <Bgvideo />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-xl shadow-2xl overflow-hidden">
          <div className="w-full lg:w-2/5 bg-gradient-to-r from-[#850FFD] to-[#DF10FD] p-6 md:p-8 flex flex-col items-center justify-center text-white relative order-first">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Hello, welcome!</h1>
              <p className="mb-4 md:mb-6 text-sm md:text-base">Don't have an account?</p>
              <button className="w-full md:w-auto border-2 border-white bg-transparent text-white font-semibold py-2 px-6 md:px-8 rounded-full cursor-pointer text-sm md:text-base">
                <Link to="/signin">Register</Link>
              </button>
            </div>
          </div>

          <div className="w-full lg:w-3/5 glass p-6 md:p-8 lg:p-12 flex flex-col bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">Login</h2>
            {errorMessage && (
              <div className="mb-4 md:mb-6 text-red-500 text-sm md:text-base text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <div className="border border-gray-500 rounded-lg flex items-center p-3">
                  <input
                    type="text"
                    placeholder="User name"
                    value={username}
                    onChange={handleInputChange(setUsername)}
                    className="bg-transparent w-full outline-none text-sm md:text-base"
                    required
                  />
                  <MdEmail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </div>
              </div>

              <div>
                <div className="border border-gray-500 rounded-lg flex items-center p-3">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    className="bg-transparent w-full outline-none text-sm md:text-base"
                    required
                  />
                  <FaLock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] hover:opacity-90 transition-opacity duration-300 text-white font-semibold py-3 px-4 rounded-lg cursor-pointer text-sm md:text-base"
              >
                Login
              </button>
            </form>

            <div className="mt-6 md:mt-auto flex justify-center">
              <img src="/logo.png" alt="Logo" className="w-40 md:w-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;