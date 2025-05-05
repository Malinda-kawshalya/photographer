import React from 'react'


function About() {
  return (
    <div>
        <div className='bg-white flex-grow container mx-auto px-6 py-8'>
            <div className='mb-8'>
                <h1 className='text-3xl  font-bold'>About PHOTOGRAPHER.LK</h1>
                <p className='text-gray-600 mt-2'>Learn more about our plaform and mission</p>
            </div>

            {/* about us section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-6'>
                    <div className=' rounded-lg border border-gray-300 shadow-sm hover:shadow-lg p-6'>
                        <h2 className='text-2xl font-bold mb-4'>Our Story</h2>
                        <p className='mb-4'>PHOTOGRAPHER.LK was founded in 2025 with a simple mission: to connect talented photographers with clients who need their services.</p>

                        <p className='mb-4'>What started as a small community of 50 photographers has now grown into a thriving marketplace with over 5,000 professional photographers across the country.</p>

                        <p className='mb-4'>Our platform provides photographers with the tools they need to showcase their work, manage their bookings, and grow their business, while giving clients a seamless way to find and hire the perfect photographer for their needs.</p>
                    </div>

                    <div className=' rounded-lg border border-gray-300 shadow-sm hover:shadow-lg p-6'>
                        <h2 className='text-2xl font-bold mb-4'>Our Mission</h2>
                        <p className='mb-4'>We believe that every moment deserves to be captured beautifully. Our mission is to make professional photography accessible to everyone while helping photographers build sustainable careers doing what they love.</p>
                        <p>Through our platform, we aim to:</p>

                        <ul className='list-disc pl-5 space-y-2 mt-4'>
                            <li>Empower photographers to showcase their unique style and talent</li>
                            <li>Provide clients with a diverse range of photography options</li>
                            <li>Simplify the booking and payment process</li>
                            <li>Foster a community of creative professionals</li>
                        </ul>
                    </div>
                </div>

                {/* right side */}

                <div className='space-y-6'>
                    <div className='rounded-lg border border-gray-300 shadow-sm hover:shadow-lg p-6'>
                        <h2 className='text-2xl font-bold mb-4'>Our Team</h2>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='text-center'>
                                <div className='w-24 h-24 rounded-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] mx-auto flex items-center justify-center mb-2'>
                                    <span className='text-white font-bold'>DS</span>
                                </div>
                                <h3 className='font-bold'>Dinith sandeepa</h3>
                                <p className='text-sm text-gray-500'>Founder & CEO</p>
                            </div>

                            <div className='text-center'>
                                <div className='w-24 h-24 rounded-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD]  mx-auto flex items-center justify-center mb-2'>
                                    <span className='text-white font-bold'>DS</span>
                                </div>
                                <h3 className='font-bold'>Dinith sandeepa</h3>
                                <p className='text-sm text-gray-500'>Head of Operations</p>
                            </div>

                            <div className='text-center'>
                                <div className='w-24 h-24 rounded-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] mx-auto flex items-center justify-center mb-2'>
                                    <span className='text-white font-bold'>DS</span>
                                </div>
                                <h3 className='font-bold'>Dinith sandeepa</h3>
                                <p className='text-sm text-gray-500'>Lead Developer</p>
                            </div>

                            <div className='text-center'>
                                <div className='w-24 h-24 rounded-full bg-gradient-to-r from-[#850FFD] to-[#DF10FD] mx-auto flex items-center justify-center mb-2'>
                                    <span className='text-white font-bold'>DS</span>
                                </div>
                                <h3 className='font-bold'>Dinith sandeepa</h3>
                                <p className='text-sm text-gray-500'>Marketing Director</p>
                            </div>
                        </div>
                    </div>


                    <div className=' rounded-lg border border-gray-300 shadow-sm hover:shadow-lg p-6'>
                        <h2 className='text-2xl font-bold mb-4'>Contact Us</h2>
                        <div className='space-y-4'>
                            <div className='items-start'>
                                <div className='mb-3'>
                                    <h3 className='font-semibold'>Address</h3>
                                    <p className='text-gray-500'>123 Photography Lane,Anuradhapura, Sri Lanka</p>
                                </div>

                                <div className='mb-3'>
                                    <h3 className='font-semibold'>Email</h3>
                                    <p className='text-gray-500'>info@photographer.lk</p>
                                </div>

                                <div className='mb-3'>
                                    <h3 className='font-semibold'>Phone</h3>
                                    <p className='text-gray-500'>+94 703 644 755</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}



export default About