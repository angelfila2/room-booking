import { prisma } from "../config/db.js";

/* ======================================================
   Helpers (for readable conflict messages only)
   ====================================================== */

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const formatDate = (date) => new Date(date).toISOString().split("T")[0];

/* ======================================================
   INTERNAL: Check for overlapping bookings
   ====================================================== */

const hasConflict = async ({
  roomId,
  courseDate,
  startTime,
  endTime,
  excludeBookingId,
}) => {
  return prisma.booking.findFirst({
    where: {
      roomId,
      courseDate,
      ...(excludeBookingId && {
        id: { not: excludeBookingId },
      }),
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  });
};

/* ======================================================
   READ
   ====================================================== */

const getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: {
      startTime: "asc",
    },
  });
};

const getBookingById = async (id) => {
  return prisma.booking.findUnique({
    where: { id },
  });
};

/* ======================================================
   CREATE (with conflict detection)
   ====================================================== */

const createBooking = async ({
  userId,
  roomId,
  courseCode,
  courseDate,
  startTime,
  endTime,
}) => {
  const conflict = await hasConflict({
    roomId,
    courseDate,
    startTime,
    endTime,
  });

  if (conflict) {
    const error = new Error(
      `Conflict with ${conflict.courseCode} on ${formatDate(
        conflict.courseDate
      )} from ${formatTime(conflict.startTime)} to ${formatTime(
        conflict.endTime
      )}`
    );
    error.status = 409;
    throw error;
  }

  return prisma.booking.create({
    data: {
      userId,
      roomId,
      courseCode,
      courseDate,
      startTime,
      endTime,
    },
  });
};

/* ======================================================
   UPDATE (with conflict detection)
   ====================================================== */

const updateBooking = async (id, updates) => {
  const existing = await prisma.booking.findUnique({
    where: { id },
  });

  if (!existing) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  const conflict = await hasConflict({
    roomId: existing.roomId,
    courseDate: existing.courseDate,
    startTime: updates.startTime ?? existing.startTime,
    endTime: updates.endTime ?? existing.endTime,
    excludeBookingId: id,
  });

  if (conflict) {
    const error = new Error(
      `Conflict with ${conflict.courseCode} on ${formatDate(
        conflict.courseDate
      )} from ${formatTime(conflict.startTime)} to ${formatTime(
        conflict.endTime
      )}`
    );
    error.status = 409;
    throw error;
  }

  return prisma.booking.update({
    where: { id },
    data: updates,
  });
};

/* ======================================================
   DELETE
   ====================================================== */

const deleteBooking = async (id) => {
  return prisma.booking.delete({
    where: { id },
  });
};

/* ======================================================
   EXPORTS
   ====================================================== */

export default {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
