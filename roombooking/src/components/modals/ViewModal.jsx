import axios from "axios";
import { useState } from "react";

const Modal = ({ booking, onClose, showNotification, onSuccess }) => {
  const [courseCode, setCourseCode] = useState(booking.courseCode || "");

  // Convert ISO datetime → HH:mm for input[type=time]
  const toTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const [startTime, setStartTime] = useState(toTime(booking.startTime));
  const [endTime, setEndTime] = useState(toTime(booking.endTime));

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/booking/${booking.id}`, {
        withCredentials: true,
      });

      showNotification("Booking deleted", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Delete failed:", error);
      showNotification("Failed to delete booking", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      const date = booking.courseDate.split("T")[0];

      const updatedStart = new Date(`${date}T${startTime}:00.000Z`);
      const updatedEnd = new Date(`${date}T${endTime}:00.000Z`);

      await axios.put(
        `http://localhost:3001/api/booking/${booking.id}`,
        {
          courseCode,
          startTime: updatedStart,
          endTime: updatedEnd,
        },
        {
          withCredentials: true,
        }
      );

      showNotification("Booking updated", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      showNotification("Failed to update booking", "error");
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
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-sm font-medium">Course Code</label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
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

          <p className="text-xs text-slate-500">Booking ID: {booking.id}</p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-5">
          <button
            onClick={handleUpdate}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Update
          </button>

          <button
            onClick={handleDelete}
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
