import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaSearch, FaUserTie, FaHandshake, FaMapMarkedAlt } from "react-icons/fa";
import VoiceSearchInput from "../Components/VoiceSearchInput";
import Worker from "../assets/worker.jpeg";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Find Skilled Professionals
              <br />
              <span className="text-yellow-300">Near You</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-orange-100">
              Voice-powered search to connect with trusted local workers instantly
            </p>

            {/* Voice Search Input */}
            <div className="max-w-2xl mx-auto">
              <VoiceSearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm("")}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="text-orange-500 text-4xl mb-4">
              <FaUserTie />
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Professionals</h3>
            <p className="text-gray-600">
              Every worker is thoroughly vetted and verified for your safety
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="text-orange-500 text-4xl mb-4">
              <FaHandshake />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Hiring</h3>
            <p className="text-gray-600">
              Safe and transparent hiring process with guaranteed satisfaction
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="text-orange-500 text-4xl mb-4">
              <FaMapMarkedAlt />
            </div>
            <h3 className="text-xl font-bold mb-2">Local Experts</h3>
            <p className="text-gray-600">
              Find skilled workers in your neighborhood within minutes
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-orange-500 mb-2">1,200+</div>
              <div className="text-gray-600 font-medium">Active Workers</div>
              <div className="mt-2 text-sm text-gray-500">Ready to help you</div>
            </div>
            
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-green-500 mb-2">850+</div>
              <div className="text-gray-600 font-medium">Jobs Completed</div>
              <div className="mt-2 text-sm text-gray-500">Successfully delivered</div>
            </div>
            
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-500 mb-2 flex items-center justify-center">
                4.8 <FaStar className="ml-1 text-yellow-400" />
              </div>
              <div className="text-gray-600 font-medium">Average Rating</div>
              <div className="mt-2 text-sm text-gray-500">From happy clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Workers Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Trending Workers</h2>
          <p className="text-gray-600">Meet our top-rated professionals</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <img
                src={Worker}
                alt="Trending Worker"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="font-semibold">John Doe</div>
                  <div className="text-sm flex items-center">
                    4.9 <FaStar className="text-yellow-400 ml-1" />
                    <span className="ml-2">Electrician</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
