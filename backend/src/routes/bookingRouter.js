import express, { response } from "express";
import bookingService from "../services/bookingService.js";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("trigger get api");
  const data = bookingService.getAll();
  res.json(data);
});

router.put("/", (req, res) => {
  console.log("Updating Data");

  try {
    const { id, roomId, course, startTime, endTime } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    const result = bookingService.updateBooking(
      id,
      roomId,
      course,
      startTime,
      endTime
    );

    // 🔥 IMPORTANT: handle not-found case
    if (!result) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ✅ RETURN THE OBJECT DIRECTLY
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/", (req, res) => {
  console.log("Deleting API triggered");

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    const updatedData = bookingService.deleteBooking(id);

    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", (req, res) => {
  console.log("trying to add");
  try {
    const { date, roomId, course, startTime, endTime } = req.body;

    const booking = bookingService.createBooking(
      date,
      roomId,
      course,
      startTime,
      endTime
    );

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
