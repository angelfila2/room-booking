import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DailyViewPage from "./DailyViewPage";
import Notification from "../ui/Notification";

const LandingPage = () => {
  const navigate = useNavigate();

  // ✅ FIX: make token reactive
  const [accessToken, setAccessToken] = useState(() =>
    sessionStorage.getItem("accessToken")
  );

  const [notification, setNotification] = useState(null);
  const [data, setData] = useState([]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    setAccessToken(null); // ✅ keep state in sync
    navigate("/login");
  };

  useEffect(() => {
    if (!accessToken) return;

    fetch("http://localhost:3001/api/booking", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/unauthorized");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch(() => {});
  }, [accessToken, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="font-bold text-3xl">Room Booking System</h1>
          <p className="text-slate-500">You are logged in</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
        >
          Logout
        </button>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <hr className="my-4 border-slate-300" />

      <DailyViewPage showNotification={showNotification} data={data} />
    </div>
  );
};

export default LandingPage;
