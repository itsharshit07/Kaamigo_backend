// === components/BottomNav.jsx ===
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiVideo, FiMap, FiMessageCircle, FiUser, FiBriefcase } from "react-icons/fi";

const BottomNav = () => {
  const { pathname } = useLocation();

  const tabs = [
    { path: "/", icon: <FiHome size={20} />, label: "Home" },
    { path: "/reels", icon: <FiVideo size={20} />, label: "Reels" },
    { path: "/explore", icon: <FiMap size={20} />, label: "Explore" },
    { path: "/jobs", icon: <FiBriefcase size={20} />, label: "Jobs" },
    { path: "/chat", icon: <FiMessageCircle size={20} />, label: "Chat" },
    { path: "/profile", icon: <FiUser size={20} />, label: "Profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center px-3">
          {tabs.map((tab, i) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={i}
                to={tab.path}
                className={`relative flex flex-col items-center py-2 min-w-[60px] group transition-all duration-300 ${
                  isActive ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {/* Active Tab Indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-orange-500 rounded-full" />
                )}

                {/* Icon Container */}
                <div 
                  className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-orange-50 text-orange-500 scale-110" 
                      : "group-hover:bg-gray-50 group-hover:scale-105"
                  }`}
                >
                  {tab.icon}
                  
                  {/* Notification Dot for Chat */}
                  {tab.path === "/chat" && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>

                {/* Label */}
                <span 
                  className={`mt-1 text-[10px] font-medium transition-all duration-300 ${
                    isActive 
                      ? "text-orange-500 opacity-100" 
                      : "text-gray-500 group-hover:text-gray-700 opacity-80 group-hover:opacity-100"
                  }`}
                >
                  {tab.label}
                </span>

                {/* Active Tab Background Glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-orange-500/5 rounded-xl -z-10" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Safe Area for iPhone */}
        <div className="h-[env(safe-area-inset-bottom)]"></div>
      </div>
    </div>
  );
};

export default BottomNav;
