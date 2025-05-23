import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import RentNavbar from '../../Components/RentNavbar/RentNavbar';
import Bgvideo from '../../Components/background/Bgvideo';

function RentalChatsPage() {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser || loggedInUser.role !== 'rental') {
          setError('Please log in as a rental service provider to view chats');
          setLoading(false);
          return;
        }

        console.log('Rental user ID:', loggedInUser._id);

        // Fetch rental service chats from the backend with better error handling
        try {
          const response = await axios.get('http://localhost:5000/api/chats/rental', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.success) {
            console.log('Fetched rental chats:', response.data.chats);
            setChats(response.data.chats || []);
          } else {
            setError(response.data.error || 'No chats found');
          }
        } catch (apiError) {
          console.error('API error fetching rental chats:', apiError);
          // Show more user-friendly error message
          setError('Unable to load your chats. Please try again later.');
        }
      } catch (err) {
        console.error('Error in rental chats page:', err);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <RentNavbar />
      <Bgvideo />
      <div className="p-4 max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Your Client Chats</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {chats.length === 0 && !error && (
          <p className="text-gray-500">No chats available. Clients will contact you here when they have inquiries.</p>
        )}
        <div className="space-y-4">
          {chats.map((chat) => {
            console.log('Chat ID:', chat._id);
            return (
              <Link
                to={`/rental-chats/chat-room/${chat._id}`}
                key={chat._id}
                onClick={() => console.log('Navigating to rental chat:', chat._id)}
                className="block border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-purple-500" />
                    <div>
                      <p className="font-semibold">
                        {chat.clientId?.name || chat.clientId?.email || 'Client'}
                      </p>
                      {chat.rentalName && (
                        <p className="text-xs text-purple-600">
                          Rental: {chat.rentalName}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {chat.clientId?.email || 'No email available'}
                      </p>
                      {chat.messages && chat.messages.length > 0 ? (
                        <div>
                          <p className="text-sm text-gray-600 truncate max-w-md">
                            <span className="{chat.messages[chat.messages.length - 1].sender === 'client' ? 'text-blue-500' : 'text-purple-500'}">
                              {chat.messages[chat.messages.length - 1].sender === 'client' ? 'Client: ' : 'You: '}
                            </span>
                            {chat.messages[chat.messages.length - 1].content}
                          </p>
                          <p className="text-xs text-gray-400">
                            {chat.messages.length} message{chat.messages.length !== 1 ? 's' : ''} in conversation
                          </p>
                        </div>
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

export default RentalChatsPage;
