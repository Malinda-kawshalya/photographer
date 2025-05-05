import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaUser } from 'react-icons/fa';

function PhotographerChatsPage() {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/chats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setChats(response.data.chats);
        } else {
          setError(response.data.error || 'No chats found');
        }
      } catch (err) {
        setError('Failed to fetch chats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading chats...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Your Client Chats</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {chats.length === 0 && !error && (
        <p className="text-gray-500">No chats available. Start a conversation with a client!</p>
      )}
      <div className="space-y-4">
        {chats.map((chat) => (
          <Link
            to={`/chats/${chat._id}`}
            key={chat._id}
            className="block border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaUser className="text-purple-500" />
                <div>
                  <h3 className="font-semibold">{chat.clientId.name || 'Unknown Client'}</h3>
                  <p className="text-sm text-gray-500">{chat.companyName}</p>
                  {chat.messages.length > 0 ? (
                    <p className="text-sm text-gray-600 truncate max-w-md">
                      {chat.messages[chat.messages.length - 1].content}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">No messages yet</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {new Date(
                    chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].timestamp
                      : chat.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PhotographerChatsPage;