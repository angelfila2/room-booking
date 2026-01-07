import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

import Modal from "../modals/ViewModal";
import AddBookingModal from "../modals/AddBookingModal";

const CalendarView = ({ showNotification }) => {
  const HARDCODED_USER_ID = "c290a99e-fe6c-4855-bb73-2d5eda459978";

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openBookingModal, setOpenBookingModal] = useState(false);

  // temporary frontend mapping (backend should handle this later)
  const ROOM_LABELS = {
    1: "CET Room 1",
    2: "CET Room 2",
    3: "CET Room 3",
    4: "CET Room 4",
    5: "CET Room 5",
  };

  const fetchCalendarData = async () => {
    try {
      setLoading(true);

      const bookingsRes = await axios.get("http://localhost:3001/api/booking", {
        withCredentials: true,
      });

      setBookings(bookingsRes.data);

      const calendarEvents = bookingsRes.data.map((booking) => {
        const roomLabel =
          ROOM_LABELS[booking.roomId] || `Room ${booking.roomId}`;

        return {
          id: booking.id,
          title: `${booking.courseCode} (${roomLabel})`,
          start: booking.startTime,
          end: booking.endTime,
        };
      });

      setEvents(calendarEvents);
    } catch (err) {
      showNotification("Failed to load calendar data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading calendar…</p>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Calendar View</h2>

        <button
          onClick={() => setOpenBookingModal(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Add new booking
        </button>
      </div>

      {/* Calendar */}
      <div className="rounded-xl bg-white p-4 shadow">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={events}
          selectable={true}
          editable={false}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          eventClick={(info) => {
            const booking = bookings.find((b) => b.id === info.event.id);
            if (booking) {
              setSelectedBooking(booking);
            }
          }}
        />
      </div>

      {/* Booking details modal */}
      {selectedBooking && (
        <Modal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          showNotification={showNotification}
          onSuccess={fetchCalendarData}
        />
      )}

      {/* Add booking modal */}
      {openBookingModal && (
        <AddBookingModal
          userId={HARDCODED_USER_ID}
          onClose={() => setOpenBookingModal(false)}
          showNotification={showNotification}
          onSuccess={fetchCalendarData}
        />
      )}
    </div>
  );
};

export default CalendarView;
