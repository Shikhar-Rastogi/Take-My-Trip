const Booking = require("../models/Booking.js");

/* ================= CREATE BOOKING ================= */
const createBooking = async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      userId: req.user.id,        // 🔥 attach logged-in user
      userEmail: req.user.email,  // optional but useful
    });

    const savedBooking = await newBooking.save();

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
