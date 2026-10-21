import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DailyViewPage from "./DailyViewPage";
import Notification from "../ui/Notification";

export default function LandingPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);
  const showNotification = (message, type = "success") =>
    setNotification({ message, type });
  return (
    <main className="min-h-screen bg-slate-200 p-5 sm:p-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300 pb-6 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-800 mb-2">
              Room reservations
            </p>
            <h1 className="font-bold text-3xl">Room Booking System</h1>
            <p className="text-slate-700 mt-2">
              View room availability and manage daily reservations.
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("accessToken");
              navigate("/login");
            }}
            className="rounded-lg border border-slate-400 bg-white px-4 py-2 font-semibold hover:bg-slate-100"
          >
            Logout
          </button>
        </header>
        {notification && (
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        )}
        <DailyViewPage showNotification={showNotification} />
      </div>
    </main>
  );
}
