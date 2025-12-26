import { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import AddBookingModal from "../modals/AddBookingModal";
import axios from "axios";

const DailyViewPage = ({ showNotification }) => {
  const [data, setData] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const jsScript = today.toLocaleDateString("en-GB");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/booking");
      setData(res.data);
    } catch (err) {
      showNotification("Failed to load bookings", "error");
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading bookings…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!data || data.length === 0) {
    return <p>No booking data available</p>;
  }
  const todayISO = new Date().toISOString().split("T")[0];

  const todayData = data.find((d) => d.date === todayISO);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-lg font-semibold text-slate-900">
      
        {formattedDate}
        <p>Date by js {jsScript}</p>
        <p>Date by data storage {data[0].date}</p>
        <p>today iso {todayISO}</p>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          onClick={() => setOpenBookingModal(true)}
        >
          Add new booking
        </button>
      </div>

      {/* Room cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {todayData ? (
          todayData.rooms.map((room) => (
            <div
              key={room.roomId}
              className={`rounded-2xl p-4 transition
          ${
            room.bookings.length === 0
              ? "bg-slate-200 text-slate-400 opacity-70"
              : "bg-blue-300"
          }
        `}
            >
              <h1 className="font-semibold">{room.roomId}</h1>
              <p className="text-sm text-slate-700">{room.location}</p>

              <p className="mt-2 text-xs text-slate-700">
                {room.bookings.length === 0
                  ? "No bookings"
                  : `${room.bookings.length} booking(s)`}
              </p>

              <div className="mt-3 space-y-3">
                {room.bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    onClick={() => setSelectedBooking(booking)}
                    className="rounded-xl bg-white p-3 text-sm cursor-pointer hover:bg-slate-100"
                  >
                    <strong>{booking.course}</strong>
                    <br></br>
                    {booking.startTime} – {booking.endTime}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No bookings for today</p>
        )}
      </div>

      {/* Booking details modal */}
      {selectedBooking && (
        <Modal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          showNotification={showNotification}
          onSuccess={fetchBookings}
        />
      )}

      {/* Add booking modal */}
      {openBookingModal && (
        <AddBookingModal
          onClose={() => setOpenBookingModal(false)}
          showNotification={showNotification}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
};

export default DailyViewPage;
