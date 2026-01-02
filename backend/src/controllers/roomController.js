import roomService from "../services/roomService.js";

const getAll = async (req, res, next) => {
  try {
    const bookings = await roomService.getAllRooms();
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export { getAll };
