// === components/BottomNav.jsx ===
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiVideo,
  FiMap,
  FiMessageCircle,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";

const BottomNav = () => {
  const { pathname } = useLocation();

  /* ↓ icons a hair smaller (18 px) */
  const tabs = [
    { path: "/",        icon: <FiHome         size={18} />, label: "Home"    },
    { path: "/reels",   icon: <FiVideo        size={18} />, label: "Reels"   },
    { path: "/explore", icon: <FiMap          size={18} />, label: "Explore" },
    { path: "/jobs",    icon: <FiBriefcase    size={18} />, label: "Jobs"    },
    { path: "/chat",    icon: <FiMessageCircle size={18} />, label: "Chat"   },
    { path: "/profile", icon: <FiUser         size={18} />, label: "Profile" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
      <div className="max-w-7xl mx-auto">
        {/* ↓ py-1 on the flex container; px-2 keeps some side breathing-room */}
        <nav className="flex justify-between items-center px-2 py-1">
          {tabs.map((tab, i) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={i}
                to={tab.path}
                /* ↓ min-w 48 px (was 60) | py-1 */
                className={`relative flex flex-col items-center py-1 min-w-[48px] group transition-all duration-300 ${
                  isActive
                    ? "text-orange-500"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {/* active indicator */}
                {isActive && (
                  <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-orange-500 rounded-full" />
                )}

                {/* ↓ icon container p-2 (was 2.5) */}
                <span
                  className={`relative p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-orange-50 text-orange-500 scale-105"
                      : "group-hover:bg-gray-50 group-hover:scale-105"
                  }`}
                >
                  {tab.icon}

                  {/* chat dot */}
                  {tab.path === "/chat" && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </span>

                {/* ↓ label slightly tighter font size & spacing */}
                <span
                  className={`mt-0.5 text-[9px] font-medium transition-all duration-300 ${
                    isActive
                      ? "text-orange-500 opacity-100"
                      : "text-gray-500 group-hover:text-gray-700 opacity-80 group-hover:opacity-100"
                  }`}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <span className="absolute inset-0 bg-orange-500/5 rounded-xl -z-10" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* safe-area inset */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </footer>
  );
};

export default BottomNav;
