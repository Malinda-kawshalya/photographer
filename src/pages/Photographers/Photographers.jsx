import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Bgvideo from "../../Components/background/Bgvideo";
import Footer from "../../Components/Footer/Footer";

function Photographers() {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(""); // New state for district filter

  // List of 25 districts in Sri Lanka
  const sriLankaDistricts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
    "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/photographers");
        let fetchedPhotographers = response.data.photographers;

        // Sort by district if a district is selected
        if (selectedDistrict) {
          fetchedPhotographers = fetchedPhotographers.filter(
            (photographer) => photographer.district === selectedDistrict
          );
        }

        setPhotographers(fetchedPhotographers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching photographers:", err);
      }
    };

    fetchPhotographers();
  }, [selectedDistrict]); // Re-run effect when selectedDistrict changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Bgvideo />

      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2">
              Hire Your Photographers
            </h1>
            {/* District Sorting Dropdown */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="appearance-none bg-white border border-purple-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
              >
                <option value="">All Districts</option>
                {sriLankaDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {photographers.length === 0 ? (
            <div className="text-center text-gray-600">
              No photographers found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {photographers.map((photographer) => (
                <div
                  key={photographer._id}
                  className="border border-purple-100 rounded-lg shadow-lg overflow-hidden hover:shadow-xl duration-300 transform hover:-translate-y-2 transition-all"
                >
                  <div className="p-6">
                    {/* Company Logo */}
                    <div className="flex justify-center mb-4">
                      {photographer.companyLogo ? (
                        <img
                          src={`http://localhost:5000${photographer.companyLogo.url}`}
                          alt={`${photographer.companyName} logo`}
                          className="h-32 w-32 object-cover rounded-full border-2 p-1 border-purple-600"
                        />
                      ) : (
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          No Logo
                        </div>
                      )}
                    </div>

                    {/* Company Name */}
                    <h2 className="text-xl font-semibold text-center mb-2">
                      {photographer.companyName || "Photography Studio"}
                    </h2>

                    {/* Photographer Name */}
                    <p className="text-center text-sm text-purple-900 mb-4">
                      By {photographer.username}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-center mb-6">
                      {photographer.description ||
                        "Professional photography services"}
                    </p>

                    {/* View Profile Button */}
                    <div className="flex justify-center">
                      <Link
                        to={`/portfolio/${photographer.companyName}`}
                        className="px-6 py-2 bg-gradient-to-r from-[#850FFD] to-[#DF10FD] text-white rounded-lg"
                      >
                        View Portfolio
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Photographers;