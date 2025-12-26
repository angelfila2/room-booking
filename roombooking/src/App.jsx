import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import LandingPage from "./components/pages/LandingPage";
import Unauthorized from "./components/pages/Unauthorized";
import ProtectedRoute from "./components/pages/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default App;
