import { useState } from "react";
import axios from "axios";

const AddBookingModal = ({ onClose, showNotification, onSuccess }) => {
  const getTodayISO = () => new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(getTodayISO());
  const [course, setCourse] = useState("");
  const [room, setRoom] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  const handleSubmit = async () => {
    console.log("Date:", date);
    console.log("room:", room);
    console.log("course:", course);
    console.log("starttime:", startTime);
    console.log("end:", endTime);
    if (!date || !room || !course) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    const newBooking = {
      date: date,
      roomId: room,
      course: course,
      startTime: startTime,
      endTime: endTime,
    };

    try {
      await axios.post("http://localhost:3001/api/booking", newBooking);
      showNotification("Booking created", "success");
      onSuccess();
      onClose(); // close only after success
    } catch (error) {
      console.error("Booking failed:", error);
      showNotification(error, "error");
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
            <strong>Date:</strong>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <strong>Room Number:</strong>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                console.log(e.target.value);
              }}
            >
              <option value="">Select a room</option>
              <option value="CRoom1">CRoom1</option>
              <option value="CRoom2">CRoom2</option>
            </select>
          </div>

          <div>
            <strong>Course Id:</strong>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="text"
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
                console.log(e.target.value);
              }}
            />
          </div>

          <div>
            <strong>Start Time:</strong>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div>
            <strong>End Time:</strong>
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
