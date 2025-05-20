import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PhotographerNavbar from '../../Components/PhotographerNavbar/PhotographerNavbar';
import Bgvideo from '../../Components/background/Bgvideo';
import { FaUser, FaPaperPlane } from 'react-icons/fa';

function ChatRoom() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);

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
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setChat(response.data.chat);
          setMessages(response.data.chat.messages);
        }
      } catch (err) {
        setError('Failed to load chat');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/chats/${chatId}/messages`,
        {
          content: newMessage,
          sender: 'photographer' // Since this is ChatRoom for photographer
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update messages state with the new message
        setMessages(prevMessages => [...prevMessages, response.data.message]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <PhotographerNavbar />
      <Bgvideo />
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-purple-50">
            
          </div>

          <div className="h-[60vh] overflow-y-auto p-4" id="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${
                  message.sender === 'photographer' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'photographer'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200'
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

          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
            <div className="flex gap-2">
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
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;