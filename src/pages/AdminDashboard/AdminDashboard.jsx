import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaPlus, FaUser, FaCamera, FaStore, FaCar, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import BgImage from '../../Components/background/BgImage';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
    companyName: '',
    description: '',
    district: '',
    companyLogo: null,
  });
  const [editUser, setEditUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [activeSection, setActiveSection] = useState('client');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const sriLankaDistricts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  useEffect(() => {
    fetchUsers();
  }, [activeSection, currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in again.');
      const response = await axios.get(`http://localhost:5000/api/users?role=${activeSection}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let filteredUsers = response.data.users || [];
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setUsers(filteredUsers);
      setLoading(false);
    } catch (err) {
      console.error('Fetch users error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUser.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!newUser.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError('Please enter a valid email');
      return;
    }
    if (newUser.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!newUser.role) {
      setError('Role is required');
      return;
    }
    if (['photographer', 'rental', 'shop'].includes(newUser.role)) {
      if (!newUser.companyName.trim()) {
        setError(`${newUser.role === 'photographer' ? 'Company' : newUser.role === 'rental' ? 'Rental Service' : 'Shop'} Name is required`);
        return;
      }
      if (!newUser.description.trim()) {
        setError('Description is required');
        return;
      }
      if (newUser.role === 'photographer' && !newUser.district) {
        setError('District is required for photographers');
        return;
      }
    }

    const formData = new FormData();
    formData.append('username', newUser.username);
    formData.append('email', newUser.email);
    formData.append('password', newUser.password);
    formData.append('role', newUser.role);
    if (['photographer', 'rental', 'shop'].includes(newUser.role)) {
      formData.append('companyName', newUser.companyName);
      formData.append('description', newUser.description);
      if (newUser.companyLogo) {
        formData.append('companyLogo', newUser.companyLogo);
      }
      if (newUser.role === 'photographer') {
        formData.append('district', newUser.district);
      }
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: 'client',
        companyName: '',
        description: '',
        district: '',
        companyLogo: null,
      });
      setShowCreateModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Create user error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editUser.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!editUser.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in again.');

      // Check if companyLogo is a File object (new file uploaded)
      const isFileUpload = editUser.companyLogo instanceof File;

      if (isFileUpload) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('username', editUser.username);
        formData.append('email', editUser.email);
        if (editUser.password) formData.append('password', editUser.password);
        formData.append('role', editUser.role || 'client');
        formData.append('companyName', editUser.companyName || '');
        formData.append('description', editUser.description || '');
        formData.append('companyLogo', editUser.companyLogo);
        formData.append('district', editUser.district || '');

        await axios.put(`http://localhost:5000/api/users/${editUser._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Use JSON for non-file updates
        const updateData = {
          username: editUser.username,
          email: editUser.email,
          role: editUser.role || 'client',
          companyName: editUser.companyName || '',
          description: editUser.description || '',
          companyLogo: editUser.companyLogo || '',
          district: editUser.district || '',
        };
        if (editUser.password) updateData.password = editUser.password;

        await axios.put(`http://localhost:5000/api/users/${editUser._id}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Update user error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (editUser) {
      setEditUser({ ...editUser, companyLogo: file });
    } else {
      setNewUser({ ...newUser, companyLogo: file });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in again.');
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (err) {
        console.error('Delete user error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

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
    <div className="flex flex-col min-h-screen w-screen bg-gray-100 m-0 p-0 overflow-hidden">
      <BgImage />
      <div className="flex flex-1 w-full">
        <aside className="w-64 bg-[#2C3E50] text-white flex-shrink-0">
          <div className="p-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <nav className="mt-6">
            <button
              onClick={() => { setActiveSection('client'); setCurrentPage(1); setSearchTerm(''); }}
              className={`flex items-center w-full px-6 py-3 text-lg ${activeSection === 'client' ? 'bg-[#34495E]' : 'hover:bg-[#34495E]'}`}
            >
              <FaUser className="mr-3" /> Clients
            </button>
            <button
              onClick={() => { setActiveSection('photographer'); setCurrentPage(1); setSearchTerm(''); }}
              className={`flex items-center w-full px-6 py-3 text-lg ${activeSection === 'photographer' ? 'bg-[#34495E]' : 'hover:bg-[#34495E]'}`}
            >
              <FaCamera className="mr-3" /> Photographers
            </button>
            <button
              onClick={() => { setActiveSection('shop'); setCurrentPage(1); setSearchTerm(''); }}
              className={`flex items-center w-full px-6 py-3 text-lg ${activeSection === 'shop' ? 'bg-[#34495E]' : 'hover:bg-[#34495E]'}`}
            >
              <FaStore className="mr-3" /> Shops
            </button>
            <button
              onClick={() => { setActiveSection('rental'); setCurrentPage(1); setSearchTerm(''); }}
              className={`flex items-center w-full px-6 py-3 text-lg ${activeSection === 'rental' ? 'bg-[#34495E]' : 'hover:bg-[#34495E]'}`}
            >
              <FaCar className="mr-3" /> Rentals
            </button>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-8 py-4">
              <div className="flex items-center">
                <h2 className="text-xl">Admin: {user?.username}</h2>
                <span className="ml-2 text-gray-500">({user?.email})</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FaSignOutAlt className="mr-2" size={20} /> Logout
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  <FaPlus className="mr-2" size={20} /> Add New {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}s</h2>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-4">
                <div className="relative mb-4">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={`Search ${activeSection}s...`}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#3498DB] text-white">
                      <tr>
                        <th className="px-6 py-3 text-left">ID</th>
                        <th className="px-6 py-3 text-left">Name</th>
                        <th className="px-6 py-3 text-left">Email</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-left">Company Name</th>
                        <th className="px-6 py-3 text-left">Description</th>
                        <th className="px-6 py-3 text-left">Company Logo</th>
                        <th className="px-6 py-3 text-left">District</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentUsers.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{indexOfFirstUser + index + 1}</td>
                          <td className="px-6 py-4">{user.username || 'N/A'}</td>
                          <td className="px-6 py-4">{user.email || 'N/A'}</td>
                          <td className="px-6 py-4">{user.role || 'N/A'}</td>
                          <td className="px-6 py-4">{user.companyName || 'N/A'}</td>
                          <td className="px-6 py-4">{user.description || 'N/A'}</td>
                          <td className="px-6 py-4">
                            {user.companyLogo ? (
                              <a href={`http://localhost:5000${user.companyLogo}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View Logo
                              </a>
                            ) : 'N/A'}
                          </td>
                          <td className="px-6 py-4">{user.district || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditUser(user)}
                                className="p-1 text-blue-500 hover:text-blue-700"
                              >
                                <FaEdit size={20} />
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <FaTrash size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-4 px-6 py-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {(editUser || showCreateModal) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditUser(null);
              setShowCreateModal(false);
            }
          }}
        >
          <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-xl shadow-2xl overflow-hidden bg-white h-full max-h-[90vh]">
            <div className="w-full lg:w-3/5 p-6 md:p-8 lg:p-12 flex flex-col overflow-y-auto max-h-[70vh] min-h-0">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10">
                {editUser ? `Edit ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}` : `Add New ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}`}
              </h2>

              {error && (
                <div className="mb-4 md:mb-6 p-3 bg-red-500 text-white rounded-lg text-center text-sm md:text-base">
                  {error}
                </div>
              )}

              <form onSubmit={editUser ? handleUpdate : handleCreate} encType="multipart/form-data" className="space-y-4 md:space-y-6" onClick={(e) => e.stopPropagation()}>
                <div>
                  <div className="bg-gray-100/10 border border-gray-500 rounded-lg flex items-center p-3">
                    <select
                      className="bg-transparent w-full outline-none appearance-none text-sm md:text-base"
                      value={editUser ? editUser.role : newUser.role}
                      onChange={(e) => editUser ? setEditUser({ ...editUser, role: e.target.value }) : setNewUser({ ...newUser, role: e.target.value })}
                      required
                    >
                      <option value="" disabled className="text-black">
                        Select Role
                      </option>
                      <option value="client" className="text-black">Client</option>
                      <option value="photographer" className="text-black">Photographer</option>
                      <option value="shop" className="text-black">Shop</option>
                      <option value="rental" className="text-black">Rental Service</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="border border-gray-500 rounded-lg flex items-center p-3">
                    <input
                      type="text"
                      placeholder="User name"
                      className="w-full outline-none text-sm md:text-base"
                      value={editUser ? editUser.username : newUser.username}
                      onChange={(e) => editUser ? setEditUser({ ...editUser, username: e.target.value }) : setNewUser({ ...newUser, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="border border-gray-500 rounded-lg flex items-center p-3">
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full outline-none text-sm md:text-base"
                      value={editUser ? editUser.email : newUser.email}
                      onChange={(e) => editUser ? setEditUser({ ...editUser, email: e.target.value }) : setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="border border-gray-500 rounded-lg flex items-center p-3">
                    <input
                      type="password"
                      placeholder={editUser ? "Enter new password (leave blank to keep unchanged)" : "Password"}
                      className="w-full outline-none text-sm md:text-base"
                      value={editUser ? editUser.password || '' : newUser.password}
                      onChange={(e) => editUser ? setEditUser({ ...editUser, password: e.target.value }) : setNewUser({ ...newUser, password: e.target.value })}
                      required={!editUser}
                    />
                  </div>
                </div>

                {(editUser ? editUser.role : newUser.role) === 'photographer' || (editUser ? editUser.role : newUser.role) === 'rental' || (editUser ? editUser.role : newUser.role) === 'shop' ? (
                  <>
                    <div>
                      <div className="border border-gray-500 rounded-lg flex items-center p-3">
                        <input
                          type="text"
                          placeholder={(editUser ? editUser.role : newUser.role) === 'photographer' ? 'Company Name' : (editUser ? editUser.role : newUser.role) === 'rental' ? 'Rental Service Name' : 'Shop Name'}
                          className="bg-transparent w-full outline-none text-sm md:text-base"
                          value={editUser ? editUser.companyName || '' : newUser.companyName}
                          onChange={(e) => editUser ? setEditUser({ ...editUser, companyName: e.target.value }) : setNewUser({ ...newUser, companyName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="border border-gray-500 rounded-lg flex items-center p-3">
                        <textarea
                          placeholder={(editUser ? editUser.role : newUser.role) === 'photographer' ? 'Company Description' : (editUser ? editUser.role : newUser.role) === 'rental' ? 'Rental Service Description' : 'Shop Description'}
                          className="w-full outline-none resize-none text-sm md:text-base"
                          value={editUser ? editUser.description || '' : newUser.description}
                          onChange={(e) => editUser ? setEditUser({ ...editUser, description: e.target.value }) : setNewUser({ ...newUser, description: e.target.value })}
                          required
                          rows="3"
                        />
                      </div>
                    </div>

                    {(editUser ? editUser.role : newUser.role) === 'photographer' && (
                      <div>
                        <div className="bg-gray-100/10 border border-gray-500 rounded-lg flex items-center p-3">
                          <select
                            className="bg-transparent w-full outline-none appearance-none text-sm md:text-base"
                            value={editUser ? editUser.district || '' : newUser.district}
                            onChange={(e) => editUser ? setEditUser({ ...editUser, district: e.target.value }) : setNewUser({ ...newUser, district: e.target.value })}
                            required
                          >
                            <option value="" disabled className="text-black">
                              Select District
                            </option>
                            {sriLankaDistricts.map((district) => (
                              <option key={district} value={district} className="text-black">
                                {district}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="border border-gray-500 rounded-lg flex items-center p-3">
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full outline-none text-xs md:text-sm"
                          onChange={handleFileChange}
                        />
                      </div>
                      {editUser && editUser.companyLogo && !(editUser.companyLogo instanceof File) && (
                        <div className="mt-2 text-sm text-gray-600">
                          Current Logo: <a href={`http://localhost:5000${editUser.companyLogo}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Logo</a>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] hover:opacity-90 transition-opacity duration-300 text-white font-semibold py-3 px-4 rounded-lg cursor-pointer text-sm md:text-base"
                >
                  Save
                </button>
              </form>
            </div>

            <div className="w-full lg:w-2/5 bg-gradient-to-r from-[#850FFD] to-[#DF10FD] p-6 md:p-8 flex flex-col items-center justify-center text-white relative order-first lg:order-last">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Welcome Admin!</h1>
                <p className="mb-4 md:mb-6 text-sm md:text-base">{editUser ? 'Editing an existing user.' : 'Adding a new user to manage.'}</p>
                <button
                  type="button"
                  onClick={() => {
                    setEditUser(null);
                    setShowCreateModal(false);
                    setNewUser({
                      username: '',
                      email: '',
                      password: '',
                      role: 'client',
                      companyName: '',
                      description: '',
                      district: '',
                      companyLogo: null,
                    });
                  }}
                  className="w-full md:w-auto border-2 border-white bg-transparent text-white font-semibold py-2 px-6 md:px-8 rounded-full cursor-pointer text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;