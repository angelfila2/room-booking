import bookingPrismaService from "../services/bookingPrismaService.js";

/**
 * GET /api/booking
 */
const getAll = async (req, res, next) => {
  try {
    const bookings = await bookingPrismaService.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/booking/:id
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await bookingPrismaService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/booking
 */
const create = async (req, res, next) => {
  try {
    const booking = await bookingPrismaService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/booking/:id
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await bookingPrismaService.updateBooking(id, req.body);
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/booking/:id
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    await bookingPrismaService.deleteBooking(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export { getAll, getById, create, update, remove };
