import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkProfileCompletion = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      return userDoc.exists();
    } catch (error) {
      console.error("Error checking profile:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!email || !pass) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      let userCredential;
      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        alert("Account created successfully!");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, pass);
      }
      
      const hasProfile = await checkProfileCompletion(userCredential.user.uid);
      navigate(hasProfile ? "/" : "/profile-edit");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const hasProfile = await checkProfileCompletion(result.user.uid);
      navigate(hasProfile ? "/" : "/profile-edit");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome to Kaamigo</h2>
            <p className="text-orange-100">
              {isSignup ? "Create an account to get started" : "Sign in to continue"}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="pl-10 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  isSignup ? "Create Account" : "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full border-2 border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <FaGoogle className="text-red-500" />
                <span>Google</span>
              </button>

              {/* Toggle Sign In/Sign Up */}
              <div className="text-center mt-6">
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  {isSignup
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
