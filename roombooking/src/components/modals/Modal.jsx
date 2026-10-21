import axios from "axios";
import { useState } from "react";

export default function Modal({
  booking,
  onClose,
  showNotification,
  onSuccess,
}) {
  const [course, setCourse] = useState(booking.course || "");
  const [startTime, setStartTime] = useState(booking.startTime);
  const [endTime, setEndTime] = useState(booking.endTime);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function save(event) {
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
      await axios.put("/api/booking", {
        id: booking.bookingId,
        course: course.trim(),
        startTime,
        endTime,
      });
      showNotification("Booking updated", "success");
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || "Unable to update the booking.");
    } finally {
      setSaving(false);
    }
  }
  async function remove() {
    if (!window.confirm("Delete this booking?")) return;
    setSaving(true);
    setError("");
    try {
      await axios.delete("/api/booking", { data: { id: booking.bookingId } });
      showNotification("Booking deleted", "success");
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || "Unable to delete the booking.");
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
        aria-labelledby="booking-title"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-blue-800">
              Room reservation
            </p>
            <h2 id="booking-title" className="text-xl font-bold mt-1">
              Booking details
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close booking details"
            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <form onSubmit={save} className="space-y-4">
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900"
            >
              {error}
            </p>
          )}
          <label className="block text-sm font-semibold">
            Course / meeting
            <input
              autoFocus
              required
              maxLength={100}
              value={course}
              onChange={(e) => setCourse(e.target.value)}
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
          <p className="text-xs text-slate-700 break-all">
            Booking reference: {booking.bookingId}
          </p>
          <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={remove}
              disabled={saving}
              className="rounded-lg border border-red-300 bg-red-50 text-red-800 px-4 py-2 font-semibold"
            >
              Delete booking
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
