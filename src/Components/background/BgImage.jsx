import React from 'react';
import backgroundImage from '../../assets/admin_bg.avif';

function BgImage() {
  return (
    <div>
      <div>
        <img 
          src={backgroundImage} 
          alt="Admin Background" 
          className="background-clip image-background"
          style={{
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1
          }}
        />
      </div>
    </div>
  );
}

export default BgImage;