import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Home, User, Bell, PlusCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import AddTripModal from "../trips/AddTripModal";
import { ContextPanel } from "../../lib/ContextPanel";

const MainLayout = ({ children }) => {
  const { user, userUrls, logout } = useAuth();
  const { isAddTripOpen, setIsAddTripOpen } = React.useContext(ContextPanel);
  const location = useLocation();
  const navigate = useNavigate();

  const userImageUrl =
    "https://agsdemo.in/3CBSapi/public/assets/images/user_images/";
  const fullUserImageUrl = user?.user_image
    ? `${userImageUrl}${user.user_image}`
    : null;

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Create", path: "/trips/add", icon: PlusCircle, isModal: true },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Desktop Sidebar (Only visible on md+) */}
      <aside
        className={`hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm transition-all duration-300`}
      >
        <div className="p-6 text-center">
          <h1 className="text-xl font-bold bg-linear-to-r from-red-950 via-red-800 to-red-950 bg-clip-text text-transparent">
            3Concepts
          </h1>
          <p className="text-[8px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">
            Building Solutions
          </p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            if (item.isModal) {
              return (
                <button
                  key={item.name}
                  onClick={() => setIsAddTripOpen(true)}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon size={20} className="text-gray-400" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-red-50 text-red-900 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-red-900" : "text-gray-400"}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header (Simplified) */}
        <header className="h-32 relative bg-[#B23A3A] flex items-center justify-between px-6 md:px-10 z-20 overflow-hidden border-0">
          <div className="absolute h-6 rounded-t-5xl bg-white w-full left-0 bottom-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-0"></div>

          <div className="flex items-center space-x-2 mb-4">
            <div className="relative">
              <div className="size-12 rounded-full bg-white p-0.5 backdrop-blur-md shadow-inner">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/30 shadow-sm relative group">
                  {fullUserImageUrl ? (
                    <img
                      src={fullUserImageUrl}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://agsdemo.in/3CBSapi/public/assets/images/no_image.jpg";
                      }}
                    />
                  ) : (
                    <div className="text-xl font-black text-red-800 uppercase">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="-space-y-1">
              <p className="text-white/80 text-xs font-bold">Welcome Back,</p>
              <h2 className="text-white text-xl font-black">
                {user?.name || "Member"}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <Link
              to="/notifications"
              className="relative p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all backdrop-blur-md border border-white/10 group active:scale-95"
            >
              <Bell
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-yellow-400 rounded-full border-2 border-[#B23A3A] shadow-sm"></span>
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-white">
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation (Always Center Stage) */}
        <nav className="md:hidden bg-red-900 fixed bottom-2 left-1/2 -translate-x-1/2 w-[95%] max-w-sm  backdrop-blur-lg border border-white/20 shadow-2xl rounded-xl flex items-center justify-around z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            if (item.isModal) {
              return (
                <button
                  key={item.name}
                  onClick={() => setIsAddTripOpen(true)}
                  className={`flex flex-col items-center p-2 transition-all bg-red-900 ${
                    isActive ? "text-red-900" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`absolute bottom-6 p-2 rounded-full outline-8 outline-white border-0 bg-red-900 text-gray-200`}
                  >
                    <Icon size={30} />
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-1 transition-all ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              >
                <div className="p-1">
                  <Icon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Global Modals */}
      <AddTripModal
        isOpen={isAddTripOpen}
        onClose={() => setIsAddTripOpen(false)}
      />
    </div>
  );
};

export default MainLayout;
