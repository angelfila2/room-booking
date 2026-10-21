import { useState } from "react";
import axios from "axios";

export default function AddBookingModal({
  initialDate,
  onClose,
  showNotification,
  onSuccess,
}) {
  const [date, setDate] = useState(initialDate);
  const [course, setCourse] = useState("");
  const [room, setRoom] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (!course.trim()) {
      setError("Enter a course or meeting name.");
      return;
    }
    if (endTime <= startTime) {
      setError("End time must be later than start time.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await axios.post("/api/booking", {
        date,
        roomId: room,
        course: course.trim(),
        startTime,
        endTime,
      });
      showNotification("Booking created", "success");
      onSuccess();
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Unable to create the booking. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onKeyDown={(event) => event.key === "Escape" && !saving && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-booking-title"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-blue-800">
              Room reservation
            </p>
            <h2 id="add-booking-title" className="text-xl font-bold mt-1">
              New booking
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close booking form"
            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900"
            >
              {error}
            </p>
          )}
          <label className="block text-sm font-semibold">
            Date
            <input
              autoFocus
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-semibold">
            Room
            <select
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2"
            >
              <option value="">Select a room</option>
              {[1, 2, 3, 4, 5].map((id) => (
                <option key={id} value={`CRoom${id}`}>
                  CRoom{id}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Course / meeting
            <input
              required
              maxLength={100}
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. ICT210 workshop"
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-semibold">
              Start time
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-semibold">
              End time
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2"
              />
            </label>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-400 px-4 py-2 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
            >
              {saving ? "Creating…" : "Create booking"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
