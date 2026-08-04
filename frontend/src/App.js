import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Home from "./pages/Home";
import SinglePrediction from "./pages/SinglePrediction";
import BatchPrediction from "./pages/BatchPrediction";
import Analytics from "./pages/Analytics";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "@/App.css";

// 🔐 Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role check (for admin-only pages)
  if (role && userRole !== role) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Access Denied
      </h2>
    );
  }

  return children;
};

function App() {
  return (
    <div className="App min-h-screen bg-slate-50">
      <BrowserRouter>
        <Navigation />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Student + Admin) */}
          <Route
            path="/predict"
            element={
              <ProtectedRoute>
                <SinglePrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/batch"
            element={
              <ProtectedRoute>
                <BatchPrediction />
              </ProtectedRoute>
            }
          />

          {/* Admin Only */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute role="admin">
                <Analytics />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
