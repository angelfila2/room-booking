import axios from "axios";

const Navbar = ({ user, view, onToggleView, onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/auth/logout",
        {},
        { withCredentials: true }
      );
      onLogout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black border-b border-slate-800">
      {/* Left */}
      <h1 className="text-2xl font-bold text-white">Room Booking System</h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* View toggle */}
        <button
          onClick={onToggleView}
          className="rounded-lg border border-slate-600 px-4 py-2 text-white
                     hover:bg-white hover:text-black
                     active:scale-95 transition-all duration-150"
        >
          {view === "daily" ? "Calendar View" : "Daily View"}
        </button>

        {/* Welcome */}
        <span className="text-slate-300">
          Welcome <span className="font-medium text-white">{user?.name}</span>
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded-lg border border-red-500 px-4 py-2 text-red-400
                     hover:bg-red-500 hover:text-white
                     active:scale-95 transition-all duration-150"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
