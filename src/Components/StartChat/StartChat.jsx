import React, { useState } from 'react';
import axios from 'axios';
import { FaComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function StartChat({ companyName, userId, type = 'photographer' }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to start a chat');
        navigate('/login', { state: { from: window.location.pathname, message: 'Please login to chat' } });
        return;
      }

      // Get client information from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || currentUser.role !== 'client') {
        setError('You must be logged in as a client to start a chat');
        return;
      }

      // Validate payload
      if (type === 'photographer' && !companyName) {
        setError('Photographer company name is required');
        return;
      }
      if ((type === 'shop' || type === 'rental') && !userId) {
        setError(`${type.charAt(0).toUpperCase() + type.slice(1)} user ID is required`);
        return;
      }

      // Normalize the type to ensure consistent handling
      const normalizedType = String(type).toLowerCase();
      
      // Log the exact props received
      console.log('StartChat props:', { companyName, userId, type });
      
      // Create payload with common fields for all chat types
      const payload = {
        clientId: currentUser._id, // Explicitly include the client ID
        type: normalizedType
      };
      
      if (normalizedType === 'photographer') {
        // For photographer chats, include the company name
        payload.companyName = companyName;
      } else if (normalizedType === 'shop') {
        payload.userId = userId;
      } else if (normalizedType === 'rental') {
        payload.userId = userId;
        
        try {
          const cleanUserId = String(userId).trim();
          payload.userId = cleanUserId;
        } catch (err) {
          console.error('Error processing userId:', err);
          setError('Invalid rental provider ID format');
          return;
        }
      } else {
        setError(`Invalid chat type: ${normalizedType}`);
        return;
      }
      
      console.log('Chat payload:', payload);

      const response = await axios.post(
        'http://localhost:5000/api/chats',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigate(`/chat-room/${response.data.chatId}`);
      } else {
        setError(response.data.error || 'Failed to start chat');
      }
    } catch (err) {
      console.error('Error starting chat:', err);
      console.error('Backend error response:', err.response?.data);
      if (err.response?.status === 401) {
        navigate('/login', { state: { from: window.location.pathname, message: 'Your session has expired. Please login again.' } });
      } else {
        setError(err.response?.data?.error || 'Failed to start chat');
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleStartChat}
        className="flex items-center bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white px-4 py-2 rounded-lg hover:opacity-90"
      >
        <FaComment className="mr-2" />
        Chat with {type === 'photographer' ? 'Photographer' : type === 'shop' ? 'Shop' : 'Rental'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default StartChat;