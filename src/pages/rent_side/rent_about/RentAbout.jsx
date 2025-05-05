import React from 'react'
import About from '../../../Components/About/About'
import RentNavbar from '../../../Components/RentNavbar/RentNavbar'
import Footer from '../../../Components/Footer/Footer'
import Bgvideo from '../../../Components/background/Bgvideo'

function RentAbout() {
  return (
    <div>
        <RentNavbar/>
        <About/>
        <Bgvideo/>
        <Footer/>
    </div>
  )
}

export default RentAbout