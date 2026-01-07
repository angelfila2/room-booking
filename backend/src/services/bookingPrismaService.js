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
   (room-level conflict, user-agnostic)
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
   READ (user-scoped)
   ====================================================== */

const getAllBookingsByUser = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { startTime: "asc" },
  });
};

const getBookingByIdAndUser = async (id, userId) => {
  return prisma.booking.findFirst({
    where: { id, userId },
  });
};

/* ======================================================
   CREATE (ownership enforced + conflict detection)
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
   UPDATE (ownership enforced + conflict detection)
   ====================================================== */

const updateBookingByUser = async (id, userId, updates) => {
  const existing = await prisma.booking.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return null;
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
   DELETE (ownership enforced)
   ====================================================== */

const deleteBookingByUser = async (id, userId) => {
  const existing = await prisma.booking.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    return null;
  }

  await prisma.booking.delete({
    where: { id },
  });

  return true;
};

/* ======================================================
   EXPORTS
   ====================================================== */

export default {
  getAllBookingsByUser,
  getBookingByIdAndUser,
  createBooking,
  updateBookingByUser,
  deleteBookingByUser,
};
