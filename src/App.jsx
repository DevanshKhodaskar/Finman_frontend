import { Routes, Route } from "react-router-dom";

import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AIFeatures from "./components/AIFeatures.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/landing-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ai-features" element={<AIFeatures />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
