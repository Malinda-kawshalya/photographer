import React, { useState } from 'react';
import axios from 'axios';
import { FaComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function StartChat({ companyName }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartChat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to start a chat');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/chats',
        { companyName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigate(`/chat/${response.data.chatId}`);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('Failed to start chat');
      console.error(err);
    }
  };

  return (
    <div>
      <button
        onClick={handleStartChat}
        className="flex items-center bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white px-4 py-2 rounded-lg hover:opacity-90"
      >
        <FaComment className="mr-2" />
        Chat with {companyName}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default StartChat;