import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Bgvideo from '../../Components/background/Bgvideo';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';

function Signin() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);

    if (role === 'photographer' || role === 'rental' || role === 'shop') {
      formData.append('companyName', companyName);
      formData.append('description', description);
      if (companyLogo) {
        formData.append('companyLogo', companyLogo);
      }
    }

    try {
      const response = await axios.post('http://localhost:5000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Auto-login after registration
      const loginResponse = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      if (loginResponse.data.message === 'Login successful') {
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        localStorage.setItem('token', loginResponse.data.token);

        setRegistrationSuccess(true);

        // Redirect based on role
        const userRole = loginResponse.data.user.role;
        setTimeout(() => {
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
        }, 2000);
      }
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.error);
      setErrorMessage(error.response?.data?.error || 'Registration failed');
    }
  };

  const handleFileChange = (e) => {
    setCompanyLogo(e.target.files[0]);
  };

  return (
    <div>
      <Bgvideo />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-xl shadow-2xl overflow-hidden">
          <div className="w-full lg:w-3/5 p-6 md:p-8 lg:p-12 flex flex-col bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">Registration</h2>

            {registrationSuccess && (
              <div className="mb-4 md:mb-6 p-3 bg-green-500 text-white rounded-lg text-center text-sm md:text-base">
                User registered successfully. Redirecting...
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 md:mb-6 p-3 bg-red-500 text-white rounded-lg text-center text-sm md:text-base">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 md:space-y-6">
              <div>
                <div className="bg-gray-100/10 border border-gray-500 rounded-lg flex items-center p-3">
                  <select
                    className="bg-transparent w-full outline-none appearance-none text-sm md:text-base"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="" disabled className="text-black">
                      Select Role
                    </option>
                    <option value="client" className="text-black">
                      Client
                    </option>
                    <option value="photographer" className="text-black">
                      Photographer
                    </option>
                    <option value="rental" className="text-black">
                      Rental Service
                    </option>
                    <option value="shop" className="text-black">
                      Shop
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <div className="border border-gray-500 rounded-lg flex items-center p-3">
                  <input
                    type="text"
                    placeholder="User name"
                    className="w-full outline-none text-sm md:text-base"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <IoMdPerson className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </div>
              </div>

              <div>
                <div className="border border-gray-500 rounded-lg flex items-center p-3">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full outline-none text-sm md:text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    className="w-full outline-none text-sm md:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <FaLock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                </div>
              </div>

              {(role === 'photographer' || role === 'rental' || role === 'shop') && (
                <>
                  <div>
                    <div className="border border-gray-500 rounded-lg flex items-center p-3">
                      <input
                        type="text"
                        placeholder={role === 'photographer' ? 'Company Name' : role === 'rental' ? 'Rental Service Name' : 'Shop Name'}
                        className="bg-transparent w-full outline-none text-sm md:text-base"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="border border-gray-500 rounded-lg flex items-center p-3">
                      <textarea
                        placeholder={role === 'photographer' ? 'Company Description' : role === 'rental' ? 'Rental Service Description' : 'Shop Description'}
                        className="w-full outline-none resize-none text-sm md:text-base"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="3"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="border border-gray-500 rounded-lg flex items-center p-3">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full outline-none text-xs md:text-sm"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] hover:opacity-90 transition-opacity duration-300 text-white font-semibold py-3 px-4 rounded-lg cursor-pointer text-sm md:text-base"
              >
                Register
              </button>
            </form>

            <div className="mt-6 md:mt-auto flex justify-center">
              <img src="/logo.png" alt="" className="w-40 md:w-50" />
            </div>
          </div>

          <div className="w-full lg:w-2/5 bg-gradient-to-r from-[#850FFD] to-[#DF10FD] p-6 md:p-8 flex flex-col items-center justify-center text-white relative order-first lg:order-last">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Welcome Back!</h1>
              <p className="mb-4 md:mb-6 text-sm md:text-base">Already have an account?</p>
              <button className="w-full md:w-auto border-2 border-white bg-transparent text-white font-semibold py-2 px-6 md:px-8 rounded-full cursor-pointer text-sm md:text-base">
                <Link to="/login">Login</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;