// === components/BottomNav.jsx ===
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiVideo, FiMap, FiMessageCircle, FiUser, FiBriefcase } from "react-icons/fi";

const BottomNav = () => {
  const { pathname } = useLocation();

  const tabs = [
    { path: "/", icon: <FiHome />, label: "Home" },
    { path: "/reels", icon: <FiVideo />, label: "Reels" },
    { path: "/explore", icon: <FiMap />, label: "Explore" },
    { path: "/jobs", icon: <FiBriefcase />, label: "Jobs" },
    { path: "/chat", icon: <FiMessageCircle />, label: "Chat" },
    { path: "/profile", icon: <FiUser />, label: "Profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-300 border-t shadow-md flex justify-around py-2 z-10">
      {tabs.map((tab, i) => (
        <Link key={i} to={tab.path} className={`flex flex-col items-center text-xs ${pathname === tab.path ? "text-orange-500" : "text-gray-400"}`}>
          {tab.icon}
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
