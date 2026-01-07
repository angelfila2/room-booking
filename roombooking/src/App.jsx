import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import LandingPage from "./components/pages/LandingPage";
import CalendarView from "./components/pages/CalendarView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/calendar" element={<CalendarView />} />

      <Route path="/dashboard" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
