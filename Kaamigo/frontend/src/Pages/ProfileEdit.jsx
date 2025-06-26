import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaSave, FaUser, FaTools, FaStar, FaPhone, FaEnvelope, FaBriefcase, FaBirthdayCake, FaLocationArrow } from "react-icons/fa";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [manualCityInput, setManualCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);

  const [profileData, setProfileData] = useState({
    name: "",
    skill: "",
    rating: "",
    phone: "",
    experience: "",
    age: "",
    location: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        // Try to fetch existing data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          // Set email from auth if no existing data
          setProfileData(prev => ({
            ...prev,
            email: user.email
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await setDoc(doc(db, "users", user.uid), {
        ...profileData,
        email: user.email, // Always use email from auth
        updatedAt: new Date().toISOString()
      });

      alert("✅ Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("❌ Failed to save profile. Please try again.");
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
            <h2 className="text-3xl font-bold">
              {profileData.name ? "Edit Your Profile" : "Complete Your Profile"}
            </h2>
            <p className="text-orange-100 mt-2">Update your professional information</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTools className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="skill"
                    value={profileData.skill}
                    onChange={handleChange}
                    placeholder="Your Skill"
                    className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaStar className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="rating"
                    value={profileData.rating}
                    onChange={handleChange}
                    placeholder="Rating"
                    className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Professional Information</h3>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={auth.currentUser?.email || ""}
                    readOnly
                    className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBriefcase className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="experience"
                    value={profileData.experience}
                    onChange={handleChange}
                    placeholder="Years of Experience"
                    className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBirthdayCake className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Location</h3>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button
                  onClick={handleGetCurrentLocation}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaLocationArrow /> Use Current Location
                </button>
                
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search location..."
                    value={manualCityInput}
                    onChange={(e) => handleManualCitySearch(e.target.value)}
                    className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {citySuggestions.length > 0 && (
                <div className="bg-white border rounded-lg shadow-lg mt-2 max-h-48 overflow-y-auto">
                  {citySuggestions.map((place, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors"
                      onClick={() => handleCitySelect(place)}
                    >
                      <div className="font-medium">{place.display_name}</div>
                    </div>
                  ))}
                </div>
              )}

              {profileData.location && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-gray-500">Selected Location</div>
                  <div className="font-medium text-gray-700">{profileData.location}</div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button
                onClick={handleSave}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <FaSave /> Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit; 