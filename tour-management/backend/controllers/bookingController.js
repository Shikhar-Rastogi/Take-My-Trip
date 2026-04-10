const Booking = require("../models/Booking.js");
const Tour = require("../models/Tour.js");
const { deleteCacheByPattern } = require("../utils/cache");

/* ================= CREATE BOOKING ================= */
const createBooking = async (req, res) => {
  try {
    const guestSize = Number(req.body.guestSize);
    if (!Number.isInteger(guestSize) || guestSize <= 0) {
      return res.status(400).json({
        success: false,
        message: "Guest size should be a positive number",
      });
    }

    const tourId = req.body.tourId;
    const selectedTour = await Tour.findById(tourId);
    if (!selectedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const updatedTour = await Tour.findOneAndUpdate(
      {
        _id: tourId,
        $expr: {
          $gte: [{ $subtract: ["$maxGroupSize", "$bookedSeats"] }, guestSize],
        },
      },
      { $inc: { bookedSeats: guestSize } },
      { new: true }
    );

    if (!updatedTour) {
      return res.status(409).json({
        success: false,
        message: "Not enough seats left for this tour",
      });
    }

    const newBooking = new Booking({
      ...req.body,
      guestSize,
      tourName: selectedTour.title,
      userId: req.user.id,        // 🔥 attach logged-in user
      userEmail: req.user.email,  // optional but useful
    });

    const savedBooking = await newBooking.save();
    const io = req.app.get("io");

    if (io) {
      io.emit("tour:availabilityUpdated", {
        tourId: String(updatedTour._id),
        remainingSeats: updatedTour.maxGroupSize - updatedTour.bookedSeats,
        bookedSeats: updatedTour.bookedSeats,
      });
    }

    await deleteCacheByPattern("tour:*");
    await deleteCacheByPattern(`recommendations:${req.user.id}:*`);

    res.status(200).json({
      success: true,
      message: "Tour booked successfully",
      data: savedBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
/* ================= CANCEL BOOKING ================= */
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // 🔐 ensure user owns the booking or is admin
    if (
      booking.userId !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this booking",
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    const updatedTour = await Tour.findByIdAndUpdate(
      booking.tourId,
      [
        {
          $set: {
            bookedSeats: {
              $max: [0, { $subtract: ["$bookedSeats", booking.guestSize] }],
            },
          },
        },
      ],
      { new: true }
    );

    const io = req.app.get("io");
    if (io && updatedTour) {
      io.emit("tour:availabilityUpdated", {
        tourId: String(updatedTour._id),
        remainingSeats: updatedTour.maxGroupSize - updatedTour.bookedSeats,
        bookedSeats: updatedTour.bookedSeats,
      });
    }

    await deleteCacheByPattern("tour:*");
    await deleteCacheByPattern(`recommendations:${req.user.id}:*`);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

/* ================= GET SINGLE BOOKING ================= */
const getBooking = async (req, res) => {
  try {
    const book = await Booking.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ================= GET ALL BOOKINGS (ADMIN) ================= */
const getAllBooking = async (req, res) => {
  try {
    const books = await Booking.find();

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ================= GET LOGGED-IN USER BOOKINGS ================= */
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id, // 🔥 SAFE & CORRECT
    });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
    });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  getBooking,
  getAllBooking,
  getUserBookings,
};
