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
import KmReading from "./pages/km-reading/KmReading";
import Profile from "./pages/profile/Profile";
import Notifications from "./pages/misc/Notifications";
import Feedback from "./pages/misc/Feedback";
import DeveloperInfo from "./pages/misc/DeveloperInfo";

function App() {
  return (
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
          <Route path="/km-reading" element={<KmReading />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/developer" element={<DeveloperInfo />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
