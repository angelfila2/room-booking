import { useState } from "react";
import axios from "axios";

const AddBookingModal = ({
  rooms,
  userId,
  onClose,
  showNotification,
  onSuccess,
}) => {
  const todayISO = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(todayISO);
  const [courseCode, setCourseCode] = useState("");
  const [roomId, setRoomId] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  const handleSubmit = async () => {
    if (!date || !roomId || !courseCode) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    const courseDate = new Date(`${date}T00:00:00.000Z`);
    const startDateTime = new Date(`${date}T${startTime}:00.000`);
    const endDateTime = new Date(`${date}T${endTime}:00.000`);

    try {
      await axios.post(
        "http://localhost:3001/api/booking",
        {
          userId,
          roomId,
          courseCode,
          courseDate,
          startTime: startDateTime,
          endTime: endDateTime,
        },
        {
          withCredentials: true,
        }
      );

      showNotification("Booking created", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Booking failed");

      if (error.response) {
        // Backend returned an error (400, 409, 500, etc)
        console.error("Status:", error.response.status);
        console.error("Response data:", error.response.data);

        showNotification(
          error.response.data?.message || "Server rejected booking",
          "error"
        );
      } else if (error.request) {
        // Request sent but no response
        console.error("No response received:", error.request);
        showNotification("No response from server", "error");
      } else {
        // Something else went wrong
        console.error("Error message:", error.message);
        showNotification(error.message, "error");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Booking Details</h2>
          <button onClick={onClose} className="text-slate-400">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-sm">
          <div>
            <strong>Date</strong>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <strong>Room</strong>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomCode} — {room.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <strong>Course Code</strong>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
          </div>

          <div>
            <strong>Start Time</strong>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div>
            <strong>End Time</strong>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Create Booking
          </button>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-300 px-4 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBookingModal;
