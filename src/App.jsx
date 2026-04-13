import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout & Routes
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRoute from "./routes/AuthRoute";

// Auth (Lazy Loaded)
const Login = lazy(() => import("./pages/auth/Login"));

// Feature Pages (Lazy Loaded)
const Home = lazy(() => import("./pages/dashboard/Home"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Notifications = lazy(() => import("./pages/misc/Notifications"));

import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/common/ScrollToTop";

// Minimal Loading Fallback
const PageLoader = () => (
  <div className="h-1 bg-red-900/50 w-full fixed top-0 left-0 animate-pulse"></div>
);

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<PageLoader />}>
        <ScrollToTop />
        <Routes>
          {/* Auth Routes (Public but restricted for logged-in users) */}
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
