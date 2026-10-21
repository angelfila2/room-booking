import { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import AddBookingModal from "../modals/AddBookingModal";
import axios from "axios";

const ROOMS = [
  { roomId: "CRoom1", location: "Block A - 101" },
  { roomId: "CRoom2", location: "Block A - 102" },
  { roomId: "CRoom3", location: "Block B - 201" },
  { roomId: "CRoom4", location: "Block B - 202" },
  { roomId: "CRoom5", location: "Block C - 301" },
];
const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function DailyViewPage({ showNotification }) {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(localDate);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [adding, setAdding] = useState(false);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await axios.get("/api/booking", {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setData(response.data);
          setError("");
        }
      } catch {
        if (!controller.signal.aborted)
          setError("Unable to load bookings. Check the backend and try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [revision]);
  const reload = () => setRevision((value) => value + 1);
  const rooms =
    data.find((day) => day.date === date)?.rooms ||
    ROOMS.map((room) => ({ ...room, bookings: [] }));
  const count = rooms.reduce((sum, room) => sum + room.bookings.length, 0);
  return (
    <section className="space-y-6" aria-label="Daily room schedule">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Daily schedule</h2>
          <p className="text-slate-700 mt-1">
            {new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {count} booking{count === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <label className="font-semibold" htmlFor="schedule-date">
            View date
          </label>
          <input
            id="schedule-date"
            type="date"
            required
            value={date}
            onChange={(event) =>
              event.target.value && setDate(event.target.value)
            }
            className="rounded-lg border border-slate-400 bg-white px-3 py-2"
          />
          <button
            onClick={() => setAdding(true)}
            className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
          >
            Add new booking
          </button>
        </div>
      </div>
      {loading ? (
        <p role="status">Loading bookings…</p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-900"
        >
          {error}{" "}
          <button onClick={reload} className="underline font-semibold">
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <article
              key={room.roomId}
              className={`rounded-2xl border p-5 shadow-sm ${room.bookings.length ? "bg-blue-50 border-blue-300" : "bg-white border-slate-300"}`}
            >
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-lg font-bold">{room.roomId}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${room.bookings.length ? "bg-blue-100 text-blue-900" : "bg-emerald-100 text-emerald-900"}`}
                >
                  {room.bookings.length
                    ? `${room.bookings.length} booked`
                    : "Available"}
                </span>
              </div>
              <p className="text-sm text-slate-700 mt-1">{room.location}</p>
              <div className="mt-5 space-y-3">
                {room.bookings.length ? (
                  [...room.bookings]
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((booking) => (
                      <button
                        key={booking.bookingId}
                        onClick={() => setSelectedBooking(booking)}
                        className="block w-full rounded-xl border border-blue-200 bg-white p-4 text-left hover:border-blue-600 hover:shadow-sm"
                      >
                        <strong className="block text-slate-900">
                          {booking.course || "Room reservation"}
                        </strong>
                        <span className="block text-sm text-slate-700 mt-1">
                          {booking.startTime} – {booking.endTime}
                        </span>
                        <span className="block text-xs text-blue-800 mt-2 font-semibold">
                          View booking →
                        </span>
                      </button>
                    ))
                ) : (
                  <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-700">
                    No bookings for this date.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {selectedBooking && (
        <Modal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          showNotification={showNotification}
          onSuccess={reload}
        />
      )}
      {adding && (
        <AddBookingModal
          initialDate={date}
          onClose={() => setAdding(false)}
          showNotification={showNotification}
          onSuccess={reload}
        />
      )}
    </section>
  );
}
