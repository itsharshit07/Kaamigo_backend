import React, { useEffect, useState } from "react";
import VoiceSearchInput from "../Components/VoiceSearchInput";
import { FiMapPin } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import MapWithDirection from "../Components/MapWithMarkers";

const allWorkers = [
  {
    id: 1,
    name: "Ramesh Kumar",
    job: "Electrician",
    rating: 4.8,
    location: "Patna",
    phone: "9876543210",
    email: "ramesh@example.com",
    experience: "5 years",
    age: 30,
    coords: { lat: 25.5941, lng: 85.1376 },
  },
  {
    id: 2,
    name: "Suresh Yadav",
    job: "Plumber",
    rating: 4.6,
    location: "Gaya",
    phone: "9123456780",
    email: "suresh@example.com",
    experience: "4 years",
    age: 28,
    coords: { lat: 24.7969, lng: 85.0045 },
  },
  {
    id: 3,
    name: "Amit Singh",
    job: "Carpenter",
    rating: 4.5,
    location: "Muzaffarpur",
    phone: "9012345678",
    email: "amit@example.com",
    experience: "6 years",
    age: 32,
    coords: { lat: 26.1226, lng: 85.3906 },
  },
  {
    id: 4,
    name: "Rahul Verma",
    job: "Electrician",
    rating: 4.7,
    location: "Bhagalpur",
    phone: "9988776655",
    email: "rahul@example.com",
    experience: "3 years",
    age: 27,
    coords: { lat: 25.2445, lng: 86.9718 },
  },
  {
    id: 5,
    name: "Sunita Devi",
    job: "Painter",
    rating: 4.9,
    location: "Darbhanga",
    phone: "9871234560",
    email: "sunita@example.com",
    experience: "7 years",
    age: 35,
    coords: { lat: 26.1526, lng: 85.8918 },
  },
];

const Explore = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("search") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState(allWorkers);
  const [expandedWorkerId, setExpandedWorkerId] = useState(null);
  const [showMapWorkerId, setShowMapWorkerId] = useState(null);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    if (query) setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    const filtered = searchTerm
      ? allWorkers.filter(
          (w) =>
            w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allWorkers;

    setFilteredWorkers(filtered);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredWorkers(allWorkers);
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
      },
      (err) => {
        alert("Location access denied.");
        console.error(err);
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-orange-700 text-center">
        🔍 Explore Skilled Workers
      </h1>

      <div className="mb-6">
        <VoiceSearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleClearSearch}
        />
      </div>

      {/* Trending Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Trending Categories</h2>
        <div className="flex flex-wrap gap-3">
          {["Electrician", "Plumber", "Carpenter", "Painter", "Cleaner"].map((job) => (
            <button
              key={job}
              onClick={() => setSearchTerm(job)}
              className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200"
            >
              {job}
            </button>
          ))}
        </div>
      </div>

      {/* Worker Cards */}
      {filteredWorkers.length > 0 ? (
        filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-white border border-gray-200 shadow-md rounded-xl p-5 mb-5 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{worker.name}</h3>
                <p className="text-sm text-gray-600">{worker.job}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <FiMapPin className="mr-1" />
                  {worker.location}
                </div>
                <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                  <FaStar />
                  {worker.rating}
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setExpandedWorkerId(expandedWorkerId === worker.id ? null : worker.id)
              }
              className="mt-4 text-sm text-orange-600 hover:underline"
            >
              {expandedWorkerId === worker.id ? "Hide Details" : "View Details"}
            </button>

            {expandedWorkerId === worker.id && (
              <div className="mt-3 text-sm text-gray-700 border-t pt-3 space-y-1">
                <p><strong>📞 Phone:</strong> {worker.phone}</p>
                <p><strong>📧 Email:</strong> {worker.email}</p>
                <p><strong>🧰 Experience:</strong> {worker.experience}</p>
                <p><strong>🎂 Age:</strong> {worker.age} yrs</p>

                <button
                  onClick={() => {
                    getUserLocation();
                    setShowMapWorkerId(
                      showMapWorkerId === worker.id ? null : worker.id
                    );
                  }}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  {showMapWorkerId === worker.id ? "Hide Map" : "Show Direction on Map"}
                </button>

                {userCoords && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${worker.coords.lat},${worker.coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-sm text-green-600 hover:underline"
                  >
                    Open in Google Maps
                  </a>
                )}

                {showMapWorkerId === worker.id &&
                  userCoords &&
                  worker.coords && (
                    <MapWithDirection
                      userCoords={userCoords}
                      workerCoords={worker.coords}
                    />
                  )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 text-sm mt-10">
          No workers found matching your search.
        </p>
      )}
    </div>
  );
};

export default Explore;
