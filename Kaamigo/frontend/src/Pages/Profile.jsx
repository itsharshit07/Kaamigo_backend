import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBriefcase, FaBirthdayCake } from "react-icons/fa";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    skill: "",
    rating: "",
    phone: "",
    email: "",
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

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          navigate("/profile-edit");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={() => navigate("/profile-edit")}
              className="bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors duration-300 flex items-center gap-2 shadow-lg"
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 text-4xl font-bold">
              {profileData.name ? profileData.name[0].toUpperCase() : "?"}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
              <div className="flex items-center gap-4 text-orange-100">
                <span className="flex items-center gap-1">
                  <FaBriefcase /> {profileData.skill}
                </span>
                <span className="flex items-center gap-1">
                  <FaStar className="text-yellow-300" /> {profileData.rating}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-orange-500" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{profileData.phone}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-orange-500" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{profileData.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaMapMarkerAlt className="text-orange-500" />
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium">{profileData.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Professional Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaBriefcase className="text-orange-500" />
                <div>
                  <div className="text-sm text-gray-500">Experience</div>
                  <div className="font-medium">{profileData.experience}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaBirthdayCake className="text-orange-500" />
                <div>
                  <div className="text-sm text-gray-500">Age</div>
                  <div className="font-medium">{profileData.age} years</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaStar className="text-orange-500" />
                <div>
                  <div className="text-sm text-gray-500">Rating</div>
                  <div className="font-medium flex items-center gap-1">
                    {profileData.rating} <FaStar className="text-yellow-400 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
