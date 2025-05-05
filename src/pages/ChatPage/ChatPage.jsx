import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';

function ChatPage() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/chats/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setChat(response.data.chat);
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        setError('Failed to fetch chat');
        console.error(err);
      }
    };
    fetchChat();
  }, [chatId]);

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const sender = user.role === 'photographer' ? 'photographer' : 'client';
      const response = await axios.post(
        `http://localhost:5000/api/chats/${chatId}/messages`,
        { content: message, sender },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setChat((prev) => ({
          ...prev,
          messages: [...prev.messages, response.data.message],
        }));
        setMessage('');
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  if (!chat) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Chat with {chat.companyName}</h2>
      <div className="border rounded-lg h-96 overflow-y-auto p-4 mb-4 bg-gray-50">
        {chat.messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.sender === 'client' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.sender === 'client' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              <span className="font-bold">{msg.sender}: </span>
              <span>{msg.content}</span>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border p-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white px-4 py-2 rounded-r-lg hover:opacity-90"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default ChatPage;