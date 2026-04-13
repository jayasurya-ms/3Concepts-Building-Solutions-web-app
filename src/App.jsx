import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout & Routes
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRoute from "./routes/AuthRoute";

// Auth
import Login from "./pages/auth/Login";

// Feature Pages
import Home from "./pages/dashboard/Home";
import TripHistory from "./pages/trips/TripHistory";
import Profile from "./pages/profile/Profile";
import Notifications from "./pages/misc/Notifications";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
      {/* Auth Routes (Public but restricted for logged-in users) */}
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<TripHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
