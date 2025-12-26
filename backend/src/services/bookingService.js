import data from "../data/booking.js";
import { v4 as uuidv4 } from "uuid";

//get

const getAll = () => {
  return data;
};
//findbyid

const findByDate = (date) => {
  return data.find((d) => d.date === date);
};

const findBookingById = (id) => {
  return data
    .flatMap((date) => date.rooms)
    .flatMap((room) => room.bookings)
    .find((booking) => booking.bookingId === id);
};
//create

//create utils

const addDateToBooking = (date) => {
  const newDate = {
    date: date,
    rooms: [
      {
        roomId: "CRoom1",
        location: "Block A - 101",
        bookings: [],
      },
      {
        roomId: "CRoom2",
        location: "Block A - 102",
        bookings: [],
      },
      {
        roomId: "CRoom3",
        location: "Block B - 201",
        bookings: [],
      },
      {
        roomId: "CRoom4",
        location: "Block B - 202",
        bookings: [],
      },
      {
        roomId: "CRoom5",
        location: "Block C - 301",
        bookings: [],
      },
    ],
  };
  data.push(newDate);
  //cant just push date cause i need to add the rooms in, since these are fixed data
};
const createBooking = (date, roomId, course, startTime, endTime) => {
  console.log("DATE", date);
  console.log("DATE", roomId);
  console.log("DATE", course);
  console.log("DATE", startTime);
  console.log("DATE", endTime);
  if (!date || !roomId || !startTime || !endTime) {
    throw new Error("Missing required booking fields");
  }

  let dateExist = data.find((d) => d.date === date);

  if (!dateExist) {
    console.log("DATE NO EXIST SO I CREATE AND ADD");
    addDateToBooking(date);
    dateExist = data.find((d) => d.date === date);
  }
  console.log("FINDING ROOM");
  const room = dateExist.rooms.find((r) => r.roomId === roomId);

  if (!room) {
    throw new Error(`Room ${roomId} does not exist for date ${date}`);
  }

  const overlap = room.bookings.find(
    (b) => !(endTime <= b.startTime || startTime >= b.endTime)
  );

  if (overlap) {
    throw new Error("Time slot already booked");
  }

  const newBooking = {
    bookingId: uuidv4(),
    course: course?.trim() || null,
    startTime,
    endTime,
  };
  console.log("Created booking");
  room.bookings.push(newBooking);
  console.log("pUSHING");
  return newBooking;
};

//update
const updateBooking = (idToUpdate, newRoomId, course, startTime, endTime) => {
  for (const day of data) {
    for (const room of day.rooms) {
      const bookingIndex = room.bookings.findIndex(
        (b) => b.bookingId === idToUpdate
      );

      if (bookingIndex !== -1) {
        const booking = room.bookings[bookingIndex];

        // ✅ ONLY move room if newRoomId is provided AND different
        if (newRoomId && room.roomId !== newRoomId) {
          const targetRoom = day.rooms.find((r) => r.roomId === newRoomId);

          if (!targetRoom) {
            throw new Error(`Room ${newRoomId} does not exist`);
          }

          // Remove from old room
          room.bookings.splice(bookingIndex, 1);

          // Add to new room
          targetRoom.bookings.push(booking);
        }

        // ✅ Update booking fields
        booking.course = course;
        booking.startTime = startTime;
        booking.endTime = endTime;

        return booking;
      }
    }
  }

  return null;
};

//delete

const deleteBooking = (idToDelete) => {
  for (const day of data) {
    for (const room of day.rooms) {
      const bookingIndex = room.bookings.findIndex(
        (b) => b.bookingId === idToDelete
      );
      if (bookingIndex !== -1) {
        room.bookings.splice(bookingIndex, 1);
        return data;
      }
    }
  }
  return data;
};

export default {
  getAll,
  findByDate,
  findBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
