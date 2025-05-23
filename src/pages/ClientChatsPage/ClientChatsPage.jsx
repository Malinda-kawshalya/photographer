import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaUser, FaCamera, FaStore } from 'react-icons/fa';
import ClientNavbar from '../../Components/client_navbar/ClientNavbar';
import Bgvideo from '../../Components/background/Bgvideo';

function ClientChatsPage() {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser || loggedInUser.role !== 'client') {
          setError('Please log in as a client to view chats');
          setLoading(false);
          return;
        }

        console.log('Attempting to fetch chats for client:', loggedInUser.email || loggedInUser._id);

        // Fetch client chats from the backend with better error handling
        try {
          const response = await axios.get('http://localhost:5000/api/chats/client', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.success) {
            console.log('Fetched client chats:', response.data.chats);
            setChats(response.data.chats || []);
          } else {
            setError(response.data.error || 'No chats found');
          }
        } catch (apiError) {
          console.error('API error fetching client chats:', apiError);
          // Show more user-friendly error message
          setError('Unable to load your chats. Please try again later.');
        }
      } catch (err) {
        console.error('Error in client chats page:', err);
        setError('An unexpected error occurred. Please refresh the page and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading chats...</div>;
  }

  // Function to get the appropriate icon based on chat type
  const getChatIcon = (chat) => {
    switch(chat.type) {
      case 'photographer':
        return <FaCamera className="text-purple-500" />;
      case 'shop':
        return <FaStore className="text-purple-500" />;
      case 'rental':
        return <FaStore className="text-purple-500" />;
      default:
        return <FaUser className="text-purple-500" />;
    }
  };

  // Function to get the name of the other party in the chat
  const getChatName = (chat) => {
    if (chat.type === 'photographer') {
      return chat.photographerName || 'Photographer';
    } else if (chat.type === 'shop') {
      return chat.shopName || 'Shop';
    } else if (chat.type === 'rental') {
      return chat.rentalName || 'Rental Service';
    }
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ClientNavbar />
      <Bgvideo />
      <div className="p-4 max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Your Chats</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {chats.length === 0 && !error && (
          <p className="text-gray-500">No chats available. Start a conversation with a service provider!</p>
        )}
        <div className="space-y-4">
          {chats.map((chat) => {
            console.log('Chat ID:', chat._id);
            return (
              <Link
                to={`/chat-room/${chat._id}`}
                key={chat._id}
                onClick={(e) => {
                  console.log('Clicked on chat:', chat._id);
                  console.log('Link destination:', `/chat-room/${chat._id}`);
                }}
                className="block border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getChatIcon(chat)}
                    <div>
                      <p className="font-medium">
                        {getChatName(chat)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {chat.type ? `${chat.type.charAt(0).toUpperCase() + chat.type.slice(1)} Service` : 'Service'}
                      </p>
                      {chat.messages && chat.messages.length > 0 ? (
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
                      {(() => {
                        let date;
                        if (chat.messages && chat.messages.length > 0 && chat.messages[chat.messages.length - 1].timestamp) {
                          date = new Date(chat.messages[chat.messages.length - 1].timestamp);
                        } else if (chat.createdAt) {
                          date = new Date(chat.createdAt);
                        } else {
                          return 'Unknown date';
                        }
                        return date.toLocaleDateString();
                      })()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ClientChatsPage;
