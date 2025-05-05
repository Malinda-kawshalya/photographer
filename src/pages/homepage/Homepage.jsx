import React from 'react'
import picture1 from '../../assets/img h1.jpg'
import picture2 from '../../assets/img h2.png'
import picture3 from '../../assets/img h6.jpg'
import picture5 from '../../assets/img h5.jpg'
// import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { Link } from 'react-router-dom'
import SearchBar from '../../Components/searchbar/SearchBar'
import Bgvideo from '../../Components/background/Bgvideo'
import ClientNavbar from '../../Components/client_navbar/ClientNavbar'
import { MdDone, MdKeyboardArrowRight, MdOutlineCameraAlt, MdShoppingCartCheckout } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";


function Homepage() {
  return ( 
    <>
    
    <div className='bg-white rounded'>
    {/* <Navbar/>    */}
    <ClientNavbar/>
    <Bgvideo/>
    <section className="relative overflow-hidden">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 transform -skew-y-3 origin-top-left"></div>
  
  <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
    <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-16">
      {/* Text content */}
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#850FFD] to-[#DF10FD] rounded-full text-white text-sm font-semibold mb-4 shadow-md">
          PREMIUM PHOTOGRAPHY
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          <span className="gradient-text">Capture Life's</span><br />
          <span className="gradient-text">Beautiful Moments</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-700 max-w-lg">
          Discover the perfect photographer for your special occasions. From weddings to corporate events, we connect you with talented professionals who tell your story through stunning imagery.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link 
            to="/photographer" 
            className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white px-8 py-3.5 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          >
            Book a Photographer
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link 
            to="/photographer" 
            className="bg-white text-gray-800 px-8 py-3.5 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          >
            Learn More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Image content */}
      <div className="w-full lg:w-1/2 relative">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={picture1} 
            alt="Professional photography session" 
            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden lg:block absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-purple-200 opacity-20"></div>
        <div className="hidden lg:block absolute -top-8 -right-8 w-40 h-40 rounded-full bg-pink-200 opacity-20"></div>
      </div>
    </div>
  </div>
</section>

      {/* Services Cards Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photographer Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MdOutlineCameraAlt className='h-6 w-6 text-white'/>
            </div>
            <h3 className="text-xl font-bold mb-2">Professional Photographers</h3>
            <p className="text-gray-600 mb-4">Hire expert photographers for your special events and occasions.</p>
            <Link to="/photographer" className="text-purple-600 font-medium inline-flex items-center">
              Explore Photographers
              <MdKeyboardArrowRight className='h-5 w-5'/> 
            </Link>
          </div>

          {/* Shop Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <MdShoppingCartCheckout className='h-6 w-6 text-white'/>
            </div>
            <h3 className="text-xl font-bold mb-2">Camera Store</h3>
            <p className="text-gray-600 mb-4">Purchase high-quality cameras, lenses, and photography equipment.</p>
            <Link to="/shop" className="text-purple-600 font-medium inline-flex items-center">
              Visit Our Shop
              <MdKeyboardArrowRight className='h-5 w-5'/> 
            </Link>
          </div>

          {/* Rent Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FaArrowsRotate className='h-6 w-6 text-white'/>
            </div>
            <h3 className="text-xl font-bold mb-2">Equipment Rental</h3>
            <p className="text-gray-600 mb-4">Rent professional photography gear for your projects and events.</p>
            <Link to="/rent" className="text-purple-600 font-medium inline-flex items-center">
              Browse Rentals
              <MdKeyboardArrowRight className='h-5 w-5'/> 
            </Link>
          </div>
        </div>
      </section>

    <section className="container mx-auto px-4 py-10">
    <div className="bg-gradient-to-r from-[#850FFD] to-[#DF10FD] rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
      {/* Decorative Elements  */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-black opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Capture Your Special Moments?</h2>
        
        <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
          Book a photographer today and preserve your memories forever. Our professional photographers are ready to help.
        </p>
        
        <div className=" sm:flex-row  justify-center">
        <SearchBar/>
        </div>
      </div>
    </div>
  </section>
    {/* Professional Photographers Section */}
<section className="container mx-auto px-4 py-12 sm:py-16">
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 md:p-10">
    <div className="flex flex-col lg:flex-row items-center gap-8 xl:gap-12">
      <div className="w-full lg:w-1/2 order-2 lg:order-1">
        <div className="relative inline-block">
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">
            Premium Photography Services
          </h2>
        </div>
        <p className="text-lg text-gray-700 mb-6">
          Elevate your memories with our handpicked professional photographers. 
          Specializing in weddings, corporate events, and portrait sessions, 
          we match you with the perfect visual storyteller for your occasion.
        </p>
        
        <div className="space-y-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] flex items-center justify-center">
                <MdDone className="h-5 w-5 text-white" />
                        
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Customized Packages</h4>
              <p className="text-gray-600">Tailored solutions for every budget and requirement</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] flex items-center justify-center">
              <MdDone className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">4K Quality Assurance</h4>
              <p className="text-gray-600">Stunning high-resolution images with professional editing</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] flex items-center justify-center">
              <MdDone className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">24/7 Support</h4>
              <p className="text-gray-600">Dedicated assistance throughout your photography journey</p>
            </div>
          </div>
        </div>
        
        <Link 
          to="/photographer" 
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#850FFD] to-[#DF10FD] hover:from-[#950FFD] hover:to-[#EF10FD] shadow-lg transform hover:-translate-y-1 transition-all duration-300 "
        >
          Browse Photographers
          <MdKeyboardArrowRight className='mx-2'/>
        </Link>
      </div>
      
      <div className="w-full lg:w-1/2 order-1 lg:order-2">
        <div className="relative rounded-xl overflow-hidden shadow-2xl">
          <img src={picture2} alt="Professional photography session" className="w-full h-auto object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="text-xl font-bold">Wedding Photography</h3>
            <p className="text-sm opacity-90">Capturing your special day with elegance</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Camera Store Section */}
<section className="container mx-auto px-4 py-12 sm:py-16">
  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
    <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-100 to-pink-100 p-8 md:p-10 flex flex-col justify-center">
        <div className="mb-6">
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">
            Camera Store
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Explore our curated collection of premium cameras, lenses, and accessories. 
            From beginner kits to professional setups, we have everything to fuel your 
            photographic passion.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2">
            <MdDone className="h-3 w-3 text-white bg-purple-600 rounded-4xl" />
              <span className="text-gray-700">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
            <MdDone className="h-3 w-3 text-white bg-purple-600 rounded-4xl" />
              <span className="text-gray-700">1-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
            <MdDone className="h-3 w-3 text-white bg-purple-600 rounded-4xl" />
              <span className="text-gray-700">Expert Advice</span>
            </div>
            <div className="flex items-center gap-2">
            <MdDone className="h-3 w-3 text-white bg-purple-600 rounded-4xl" />
              <span className="text-gray-700">Easy Returns</span>
            </div>
          </div>
          
          <Link 
            to="/shop" 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#850FFD] to-[#DF10FD] hover:from-[#950FFD] hover:to-[#EF10FD] shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Shop Now
            <MdKeyboardArrowRight className='mx-2'/>
          </Link>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 bg-gray-50 p-6 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <img src={picture3} alt="Camera equipment" className="w-full h-auto rounded-lg shadow-lg" />
          <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-md">
            <div className="text-sm font-medium text-gray-700">Available</div>
            <div className="text-2xl font-bold text-purple-600">NIKON</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Equipment Rental Section */}
<section className="container mx-auto px-4 py-12 sm:py-16">
  <div className="bg-gradient-to-br from-[#850FFD] to-[#DF10FD] rounded-2xl overflow-hidden">
    <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 p-8 md:p-10 flex items-center justify-center">
        <div className="relative">
          <img src={picture5} alt="Camera rental" className="w-full h-auto rounded-lg shadow-2xl transform rotate-2" />
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
            <div className="text-xs font-semibold text-gray-500">MOST RENTED</div>
            <div className="text-xl font-bold text-purple-600">Canon EOS R5</div>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 p-8 md:p-10 text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Premium Equipment Rental
        </h2>
        <p className="text-lg opacity-90 mb-6">
          Access high-end photography gear without the commitment. Perfect for 
          special projects, travel, or trying before you buy. Our rental process 
          is simple and hassle-free.
        </p>
        
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <MdDone className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Flexible Durations</h4>
              <p className="text-sm opacity-80">Daily, weekly or monthly rentals available</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <MdDone className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Insurance Options</h4>
              <p className="text-sm opacity-80">Protect your rental with affordable coverage</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <MdDone className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Delivery Available</h4>
              <p className="text-sm opacity-80">Get gear delivered to your location</p>
            </div>
          </div>
        </div>
        
        <Link 
          to="/rent" 
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-100 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        >
          View Rental Catalog
          <MdKeyboardArrowRight className='mx-2'/>
        </Link>
      </div>
    </div>
  </div>
</section>

    <section className="py-20 mb-20 relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 transform -skew-y-3"></div>
    
    <div className="container mx-auto px-4 relative">
      <div className="text-center mb-12">
        
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
          What Our Customers Say
        </h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* feedback 1*/}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 transform hover:-translate-y-2 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center text-purple-800 font-bold">
              A
            </div>
            <div>
              <h4 className="font-medium">Amanda K.</h4>
              <p className="text-sm text-gray-600">Wedding Photography</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            "The photographer captured all the special moments of our wedding day perfectly. The photos exceeded our expectations and will be cherished forever!"
          </p>
          
        </div>
        
        {/* feedback 2*/}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 transform hover:-translate-y-2 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center text-purple-800 font-bold">
              M
            </div>
            <div>
              <h4 className="font-medium">Michael T.</h4>
              <p className="text-sm text-gray-600">Product Photography</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            "The camera I rented was in perfect condition and the service was exceptional. Will definitely use again for my next project!"
          </p>
        </div>
        
        {/* feedback 3*/}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 transform hover:-translate-y-2 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center text-purple-800 font-bold">
              S
            </div>
            <div>
              <h4 className="font-medium">Sarah L.</h4>
              <p className="text-sm text-gray-600">Family Portrait</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            "Our family photos turned out amazing! The photographer was great with our kids and captured beautiful candid moments. Highly recommend!"
          </p>
        </div>
      </div>
    </div>
  </section>
    <Footer/>
    </div>
    </>
  )
}

export default Homepage