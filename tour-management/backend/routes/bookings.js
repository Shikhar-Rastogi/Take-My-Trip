const express = require('express');
const { verifyToken, verifyAdmin } = require("../utils/verifyToken.js");
const {
  createBooking,
  cancelBooking,
  getBooking,
  getAllBooking,
  getUserBookings,
} = require('../controllers/bookingController.js');

const router = express.Router();

/* ================= BOOKINGS ================= */

// create booking (login required)
router.post('/', verifyToken, createBooking);

// get logged-in user's bookings
router.get('/my-bookings', verifyToken, getUserBookings);

// cancel booking (ownership checked in controller)
router.delete('/:id', verifyToken, cancelBooking);

// get single booking (optional)
router.get('/:id', verifyToken, getBooking);

// admin only
router.get('/', verifyAdmin, getAllBooking);

module.exports = router;
