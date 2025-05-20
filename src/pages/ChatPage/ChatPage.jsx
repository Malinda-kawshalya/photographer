import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PhotographerNavbar from '../../Components/PhotographerNavbar/PhotographerNavbar';
import Bgvideo from '../../Components/background/Bgvideo';
import { FaUser, FaPaperPlane } from 'react-icons/fa';

function ChatPage() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
  }, []);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/chats/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setChat(response.data.chat);
        }
      } catch (err) {
        setError('Failed to load chat');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
    // Set up periodic refresh
    const interval = setInterval(fetchChat, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/chats/${chatId}/messages`,
        {
          content: newMessage,
          sender: user?.role === 'photographer' ? 'photographer' : 'client',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setNewMessage('');
        // Update chat with new message
        setChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, response.data.message],
        }));
      }
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading chat...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PhotographerNavbar />
      <Bgvideo />

      <div className="max-w-4xl mx-auto p-4 mt-8 bg-white rounded-lg shadow-lg">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4 p-4 border-b">
          <h2 className="text-xl font-semibold">Chat with {chat?.companyName}</h2>
        </div>

        <div className="h-[60vh] overflow-y-auto mb-4 p-4">
          {chat?.messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                message.sender === user?.role ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === user?.role
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="flex items-center mb-1">
                  <FaUser className="mr-2" />
                  <span className="font-medium">{message.sender}</span>
                </div>
                <p>{message.content}</p>
                <span className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;