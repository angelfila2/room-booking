import axios from "axios";
import { useState } from "react";
const Modal = ({ booking, onClose, showNotification, onSuccess }) => {
  const [course, setCourse] = useState(booking.course || "");
  const [startTime, setStartTime] = useState(booking.startTime);
  const [endTime, setEndTime] = useState(booking.endTime);
  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:3001/api/booking", {
        data: { id }, // 👈 DELETE body goes here
      });
      showNotification("Booking deleted", "success");
      onSuccess();
      onClose(); // close only after success
    } catch (error) {
      console.error("Delete failed:", error);
      showNotification("Failed to delete booking:" + error, "error");
    }
  };
  const handleUpdate = async (id) => {
    try {
      await axios.put("http://localhost:3001/api/booking", {
        id,
        course,
        startTime,
        endTime,
      });
      onSuccess();

      onClose(); // close only after success
    } catch (error) {
      showNotification("Booking updated", "success");
      console.error("Update failed:", error);
      showNotification("Failed to update booking " + error, "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 text-sm">
          <div>
            <label className="block text-sm font-medium">Course</label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>

          <p>
            <strong>Booking ID:</strong> {booking.bookingId}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-5">
          <button
            onClick={() => handleUpdate(booking.bookingId)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Update
          </button>

          <button
            onClick={() => handleDelete(booking.bookingId)} // ✅ wrapped
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
