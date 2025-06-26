// === App.jsx ===
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Reels from "./Pages/Reels";
import Explore from "./Pages/Explore";
import Jobs from "./Pages/Jobs";
import Chat from "./Pages/Chat";
import Profile from "./Pages/Profile";
import BottomNav from "./Components/BottomNav";
import Navbar from "./Components/Navbar";

const App = () => {
  const location = useLocation();
  const hideNavPaths = ["/login"];
  const hideNav = hideNavPaths.includes(location.pathname);

  return (
    <div className="pb-16">
      {/* Top Navbar */}
      {!hideNav && <Navbar />}

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Bottom Navigation */}
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default App;
