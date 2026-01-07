import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../ui/Navbar";
import DailyViewPage from "./DailyViewPage";
import CalendarView from "./CalendarView";
import Notification from "../ui/Notification";

const LandingPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [view, setView] = useState("daily");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });

    const duration = type === "error" ? 10000 : 5000;

    setTimeout(() => {
      setNotification(null);
    }, duration);
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/me", {
        withCredentials: true,
      })
      .then((res) => setUser(res.data.data.user))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogoutSuccess = () => {
    setUser(null);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar
        user={user}
        view={view}
        onToggleView={() =>
          setView((prev) => (prev === "daily" ? "calendar" : "daily"))
        }
        onLogout={handleLogoutSuccess}
      />

      {notification && (
        <div className="px-4 pt-4">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      <div className="p-4">
        {view === "daily" ? (
          <DailyViewPage showNotification={showNotification} />
        ) : (
          <CalendarView showNotification={showNotification} />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
