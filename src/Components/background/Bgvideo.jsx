import React from 'react'
import backgroundvideo from '../../assets/4.mp4'

function Bgvideo() {
  return (
    <div>
      
    <div>
      <video autoPlay loop muted plays-inline  className='background-clip video-background  video-background'>
        <source src={backgroundvideo} className=''/>
      </video>
    </div>
    </div>
  )
}

export default Bgvideo