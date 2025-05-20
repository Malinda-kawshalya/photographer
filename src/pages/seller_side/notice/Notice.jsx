import React, { useState } from 'react';
import PhotographerNavbar from '../../../Components/PhotographerNavbar/PhotographerNavbar';
import Footer from '../../../Components/Footer/Footer';
import Bgvideo from '../../../Components/background/Bgvideo';

function Notice() {
  const [noticeText, setNoticeText] = useState('');
  const [notices, setNotices] = useState([
    {
      id: 1,
      text: "Upcoming photography workshop on May 15th! Sign up now.",
      author: "Admin",
      date: "2023-05-01"
    },
    {
      id: 2,
      text: "Camera equipment maintenance scheduled for next week.",
      author: "Tech Team",
      date: "2023-05-03"
    }
  ]);

  const handlePostNotice = () => {
    if (noticeText.trim() === '') return;
    
    const newNotice = {
      id: Date.now(),
      text: noticeText,
      author: "You",
      date: new Date().toISOString().split('T')[0]
    };
    
    setNotices([newNotice, ...notices]);
    setNoticeText('');
  };

  return (
    <div>
      <PhotographerNavbar />        
      <Bgvideo />
      <div className='flex-grow container mx-auto px-6 py-8 bg-white'>
        <div className='mb-8'>
          <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-3xl font-bold'>
            Community Notice Board
          </h1>
          <p className='text-gray-600 mt-2'>Share your messages and connect with others</p>
        </div>

        {/* Existing Notices */}
        <div className='mb-12 space-y-6'>
          {notices.map(notice => (
            <div key={notice.id} className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
              <p className='text-gray-800'>{notice.text}</p>
              <div className='mt-3 flex justify-between items-center text-sm text-gray-500'>
                <span>Posted by: {notice.author}</span>
                <span>{notice.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Notice Section */}
        <div className='mt-12 bg-purple-50 rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4 text-purple-800'>Post a New Notice</h2>
          <textarea 
            placeholder='Write your message to the community...'
            className='w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]'
            rows='3'
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
          />
          <div className='mt-4 flex justify-end gap-3'>
            <button 
              className='px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors'
              onClick={() => setNoticeText('')}
            >
              Cancel
            </button>
            <button 
              className='px-6 py-2 bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white rounded-lg font-medium hover:opacity-90 transition-opacity'
              onClick={handlePostNotice}
              disabled={!noticeText.trim()}
            >
              Post Notice
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Notice;