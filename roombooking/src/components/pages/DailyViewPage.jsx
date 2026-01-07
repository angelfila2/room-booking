import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../modals/ViewModal";
import AddBookingModal from "../modals/AddBookingModal";

const DailyViewPage = ({ showNotification }) => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [roomsRes, bookingsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/room", {
          withCredentials: true,
        }),
        axios.get("http://localhost:3001/api/booking", {
          withCredentials: true,
        }),
      ]);

      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
      showNotification("Failed to load data" + err, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Filter bookings for today
  const todaysBookings = bookings.filter(
    (b) => b.courseDate.split("T")[0] === todayISO
  );

  // Group bookings by roomId
  const bookingsByRoom = todaysBookings.reduce((acc, booking) => {
    if (!acc[booking.roomId]) acc[booking.roomId] = [];
    acc[booking.roomId].push(booking);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-lg font-semibold text-slate-900">
        {formattedDate}

        <div className="mt-4">
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            onClick={() => setOpenBookingModal(true)}
          >
            Add new booking
          </button>
        </div>
      </div>

      {/* Room cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const roomBookings = bookingsByRoom[room.id] || [];

          return (
            <div
              key={room.id}
              className={`rounded-2xl p-4 transition ${
                roomBookings.length === 0
                  ? "bg-slate-200 text-slate-400 opacity-70"
                  : "bg-blue-300"
              }`}
            >
              <h1 className="font-semibold">{room.roomCode}</h1>
              <p className="text-sm">{room.location}</p>

              <p className="mt-2 text-xs">
                {roomBookings.length === 0
                  ? "No bookings"
                  : `${roomBookings.length} booking(s)`}
              </p>

              <div className="mt-3 space-y-3">
                {roomBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="rounded-xl bg-white p-3 text-sm cursor-pointer hover:bg-slate-100"
                  >
                    <strong>{booking.courseCode}</strong>
                    <br />
                    {new Date(booking.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(booking.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking details modal */}
      {selectedBooking && (
        <Modal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          showNotification={showNotification}
          onSuccess={fetchData}
        />
      )}

      {/* Add booking modal */}
      {openBookingModal && (
        <AddBookingModal
          rooms={rooms}
          onClose={() => setOpenBookingModal(false)}
          showNotification={showNotification}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default DailyViewPage;
