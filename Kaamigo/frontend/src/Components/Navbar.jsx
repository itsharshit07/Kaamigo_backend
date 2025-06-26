// === Navbar.jsx ===
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between  py-3 bg-gray-100 px-5 ">
      {/* Left Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="bg-orange-500 text-white font-bold text-lg px-3 py-1 rounded-lg">
          K
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Kaamigo</h1>
      </div>

      {/* Right User Info */}
      {user ? (
        <div className="flex items-center gap-3">
          {/* Show photo if available */}
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="User"
              className="w-8 h-8 rounded-full border"
            />
          ) : (
            <span className="text-sm text-gray-700 font-medium">
              {user.displayName || user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded hover:bg-orange-600"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
