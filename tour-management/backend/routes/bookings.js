const express = require('express');
const {verifyUser, verifyAdmin}=require("../utils/verifyToken.js");
const { createBooking, getBooking, getAllBooking } = require('../controllers/bookingController.js');
const router = express.Router();

router.post('/',verifyUser,createBooking);
router.get('/:id',verifyUser,getBooking);
router.get('/',verifyAdmin,getAllBooking);

module.exports = router; 
 