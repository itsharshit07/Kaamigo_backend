import React, { useState } from "react";
import { FaEdit, FaSave, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const Profile = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [manualCityInput, setManualCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);

  const [profileData, setProfileData] = useState({
    name: "Ramesh Kumar",
    skill: "Electrician",
    rating: "4.7",
    phone: "9876543210",
    email: "ramesh@example.com",
    experience: "5 years",
    age: 30,
    location: "Patna, Bihar",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("✅ Profile updated successfully!");
  };

  // 🔴 Current Location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.address;

          const city = address?.city || address?.town || address?.village || "";
          const district = address?.county || address?.state_district || "";
          const state = address?.state || "";

          const fullLocation = [city, district, state]
            .filter((part) => part && part !== city)
            .join(", ");

          setProfileData((prev) => ({
            ...prev,
            location: city ? `${city}, ${fullLocation}` : fullLocation || "Unknown",
          }));

          alert("📍 Location updated!");
        } catch (err) {
          alert("❌ Could not fetch location");
        }
      },
      (err) => {
        alert("❌ Location access denied.");
        console.error(err);
      }
    );
  };

  // 🔴 Manual Location
  const handleManualCitySearch = async (query) => {
    setManualCityInput(query);
    if (query.length < 3) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=7`
      );
      const data = await res.json();
      setCitySuggestions(data);
    } catch (err) {
      console.error("❌ Manual search failed:", err);
    }
  };

  const handleCitySelect = (place) => {
    setProfileData((prev) => ({
      ...prev,
      location: place.display_name,
    }));
    setCitySuggestions([]);
    setManualCityInput("");
    alert("✅ Location selected!");
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-6">
      <h2 className="text-3xl font-bold text-orange-700 text-center mb-6">👤 User Profile</h2>
      <div className="bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 border border-gray-200">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="border rounded px-4 py-2"
              />
              <input
                type="text"
                name="skill"
                value={profileData.skill}
                onChange={handleChange}
                placeholder="Skill"
                className="border rounded px-4 py-2"
              />
              <input
                type="text"
                name="rating"
                value={profileData.rating}
                onChange={handleChange}
                placeholder="Rating"
                className="border rounded px-4 py-2"
              />
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border rounded px-4 py-2"
              />
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded px-4 py-2"
              />
              <input
                type="text"
                name="experience"
                value={profileData.experience}
                onChange={handleChange}
                placeholder="Experience"
                className="border rounded px-4 py-2"
              />
              <input
                type="number"
                name="age"
                value={profileData.age}
                onChange={handleChange}
                placeholder="Age"
                className="border rounded px-4 py-2"
              />
            </div>

            {/* Location controls */}
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                📍 Location
              </label>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <button
                  onClick={handleGetCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaMapMarkerAlt /> Use My Location
                </button>
              </div>

              <input
                type="text"
                placeholder="Search city, town, village..."
                value={manualCityInput}
                onChange={(e) => handleManualCitySearch(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />
              {citySuggestions.length > 0 && (
                <ul className="bg-white border rounded mt-2 max-h-40 overflow-y-auto">
                  {citySuggestions.map((place, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                      onClick={() => handleCitySelect(place)}
                    >
                      {place.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              >
                <FaSave /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-lg font-medium text-gray-800 space-y-2">
              <p>👤 <strong>Name:</strong> {profileData.name}</p>
              <p>🔧 <strong>Skill:</strong> {profileData.skill}</p>
              <p>⭐ <strong>Rating:</strong> {profileData.rating}</p>
            </div>

            {showDetails && (
              <div className="text-sm text-gray-700 mt-4 space-y-1">
                <p>📞 Phone: {profileData.phone}</p>
                <p>📧 Email: {profileData.email}</p>
                <p>🛠 Experience: {profileData.experience}</p>
                <p>🎂 Age: {profileData.age} yrs</p>
                <p>📍 Location: {profileData.location}</p>
              </div>
            )}

            <div className="flex gap-4 mt-5">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 text-sm hover:underline"
              >
                {showDetails ? "Hide Details" : "View All Details"}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="text-orange-600 text-sm hover:underline flex items-center gap-1"
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
