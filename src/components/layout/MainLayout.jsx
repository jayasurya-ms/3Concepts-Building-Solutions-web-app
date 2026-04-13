import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  Home, 
  MapPin, 
  Gauge, 
  User, 
  Bell, 
  LogOut, 
  ChevronRight,
  PlusCircle,
  Menu,
  X
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import AddTripModal from "../trips/AddTripModal";
import { ContextPanel } from "../../lib/ContextPanel";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isAddTripOpen, setIsAddTripOpen } = React.useContext(ContextPanel);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Create", path: "/trips/add", icon: PlusCircle, isModal: true },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Desktop Sidebar (Only visible on md+) */}
      <aside className={`hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm transition-all duration-300`}>
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            3Concepts
          </h1>
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
                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-400"} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header (Simplified) */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {navItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Professional</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-gray-50/30">
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation (Always Center Stage) */}
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl flex items-center justify-around p-2 z-[40]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            if (item.isModal) {
              return (
                <button
                  key={item.name}
                  onClick={() => setIsAddTripOpen(true)}
                  className={`flex flex-col items-center p-2 transition-all active:scale-90 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-blue-600 text-white shadow-lg`}>
                    <Icon size={20} />
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 transition-all ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive ? "bg-blue-600 text-white shadow-lg" : ""}`}>
                  <Icon size={20} />
                </div>
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
