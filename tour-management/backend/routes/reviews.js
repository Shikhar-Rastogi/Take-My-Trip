const express = require('express');
const { createReview } = require('../controllers/reviewController.js');
const { verifyToken } = require("../utils/verifyToken.js")
const router = express.Router();

router.post('/:tourId', verifyToken, createReview)

module.exports = router; 
 
