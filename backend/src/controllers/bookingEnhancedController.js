import bookingPrismaService from "../services/bookingPrismaService.js";

/**
 * GET /api/booking
 * Get all bookings for logged-in user
 */
const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookings = await bookingPrismaService.getAllBookingsByUser(userId);

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/booking/:id
 * Get single booking (must belong to user)
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await bookingPrismaService.getBookingByIdAndUser(
      id,
      userId
    );

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
 * Create booking for logged-in user
 */
const create = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const booking = await bookingPrismaService.createBooking({
      ...req.body,
      userId, // 🔥 force ownership
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/booking/:id
 * Update booking (must belong to user)
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await bookingPrismaService.updateBookingByUser(
      id,
      userId,
      req.body
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/booking/:id
 * Delete booking (must belong to user)
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await bookingPrismaService.deleteBookingByUser(id, userId);

    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export { getAll, getById, create, update, remove };
