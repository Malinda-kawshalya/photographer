  import React, { useState } from 'react';
  import Navbar from '../../Components/Navbar/Navbar';
  import Bgvideo from '../../Components/background/Bgvideo';

  function BookingForm() {
    const [formData, setFormData] = useState({
      'full-name': '',
      email: '',
      organization: '',
      'event-type': '',
      'event-date': '',
      'event-duration': '',
      guests: '',
      'venue-name': '',
      'venue-type': '',
      'venue-address': '',
      'special-instructions': '',
      terms: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const response = await fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const data = await response.json();
          setSubmitSuccess(true);
          // Reset form after successful submission
          setFormData({
            'full-name': '',
            email: '',
            organization: '',
            'event-type': '',
            'event-date': '',
            'event-duration': '',
            guests: '',
            'venue-name': '',
            'venue-type': '',
            'venue-address': '',
            'special-instructions': '',
            terms: false
          });
        } else {
          throw new Error('Failed to submit booking');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error submitting booking. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div>
        <Navbar/>
        <Bgvideo/>
        <div className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 bg-white">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl  font-bold">Event Booking Form</h1>
            <p className="text-gray-600 mt-2">Fill out the form below to book your photography services</p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-500/30 border border-green-500 rounded-lg text-white">
              Booking submitted successfully! We will contact you shortly to confirm your booking.
            </div>
          )}

          {/* Booking Form */}
          <div className="glass rounded-lg border border-gray-300 p-4 sm:p-6 mb-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Personal & Contact Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-2 border-b border-purple-500">Personal & Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="full-name" className="block text-sm font-medium text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="full-name" 
                      name="full-name" 
                      value={formData['full-name']}
                      onChange={handleChange}
                      required 
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email Address <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-600 mb-1">Organization/Company (if applicable)</label>
                    <input 
                      type="text" 
                      id="organization" 
                      name="organization" 
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-2 border-b border-purple-500">Event Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="event-type" className="block text-sm font-medium text-gray-600 mb-1">Event Type <span className="text-red-500">*</span></label>
                    <select 
                      id="event-type" 
                      name="event-type" 
                      value={formData['event-type']}
                      onChange={handleChange}
                      required 
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    >
                      <option value="" disabled>Select Event Type</option>
                      <option value="wedding" className='text-black'>Wedding</option>
                      <option value="birthday" className='text-black'>Birthday</option>
                      <option value="conference" className='text-black'>Conference</option>
                      <option value="concert" className='text-black'>Concert</option>
                      <option value="corporate" className='text-black'>Corporate Event</option>
                      <option value="graduation" className='text-black'>Graduation</option>
                      <option value="other" className='text-black'>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="event-date" className="block text-sm font-medium text-gray-300 mb-1">Date & Time of Event <span className="text-red-500">*</span></label>
                    <input 
                      type="datetime-local" 
                      id="event-date" 
                      name="event-date" 
                      value={formData['event-date']}
                      onChange={handleChange}
                      required 
                      className="w-full px-3 sm:px-4 py-2 border border-gary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="event-duration" className="block text-sm font-medium text-gray-600 mb-1">Event Duration <span className="text-red-500">*</span></label>
                    <select 
                      id="event-duration" 
                      name="event-duration" 
                      value={formData['event-duration']}
                      onChange={handleChange}
                      required 
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    >
                      <option value="" disabled>Select Duration</option>
                      <option value="2">2 Hours</option>
                      <option value="4">4 Hours</option>
                      <option value="6">6 Hours</option>
                      <option value="8">8 Hours</option>
                      <option value="full-day">Full Day (10+ Hours)</option>
                      <option value="multi-day">Multiple Days</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-600 mb-1">Estimated Number of Guests <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      id="guests" 
                      name="guests" 
                      value={formData.guests}
                      onChange={handleChange}
                      min="1" 
                      required 
                      className="w-full px-3 sm:px-4 py-2 border border-purple-300/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Venue Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-2 border-b border-purple-500">Venue Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="venue-name" className="block text-sm font-medium text-gray-600 mb-1">Venue Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="venue-name" 
                      name="venue-name" 
                      value={formData['venue-name']}
                      onChange={handleChange}
                      required 
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="venue-type" className="block text-sm font-medium text-gray-600 mb-1">Venue Type <span className="text-red-500">*</span></label>
                    <select 
                      id="venue-type" 
                      name="venue-type" 
                      value={formData['venue-type']}
                      onChange={handleChange}
                      required 
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    >
                      <option value="" disabled>Select Venue Type</option>
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="both">Both Indoor & Outdoor</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="venue-address" className="block text-sm font-medium text-gray-600 mb-1">Venue Address <span className="text-red-500">*</span></label>
                    <textarea 
                      id="venue-address" 
                      name="venue-address" 
                      value={formData['venue-address']}
                      onChange={handleChange}
                      rows="2" 
                      required 
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Photography/Videography */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-2 border-b border-purple-500">Photography/Videography</h2>
                <div className="bg-purple-light/30 p-3 sm:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="font-medium mb-1 sm:mb-0">Photography/Videography Package:</span>
                    {/* <span className="font-bold text-base sm:text-lg">80,000 LKR</span> */}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">Includes professional photography and videography services for your event with edited photos and a highlight video.</p>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 pb-2 border-b border-purple-500">Additional Information</h2>
                <div>
                  <label htmlFor="special-instructions" className="block text-sm font-medium text-gray-600 mb-1">Special Instructions</label>
                  <textarea 
                    id="special-instructions" 
                    name="special-instructions" 
                    value={formData['special-instructions']}
                    onChange={handleChange}
                    rows="3" 
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-sm sm:text-base"
                  ></textarea>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      id="terms" 
                      name="terms" 
                      type="checkbox" 
                      checked={formData.terms}
                      onChange={handleChange}
                      required 
                      className="h-4 w-4 text-purple focus:ring-purple border-purple-300/30 rounded"
                    />
                  </div>
                  <div className="ml-3 text-xs sm:text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-900">I agree to the <a href="#" className="text-purple hover:underline">Terms and Conditions</a> <span className="text-red-500">*</span></label>
                    <p className="text-gray-500">By submitting this form, you agree to our booking policies and cancellation terms.</p>
                  </div>
                </div>
                
                <div className="flex justify-center pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="shadow-lg bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors text-base sm:text-lg w-full sm:w-auto sm:min-w-[200px] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Book Now'}
                  </button>
                  
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  export default BookingForm;