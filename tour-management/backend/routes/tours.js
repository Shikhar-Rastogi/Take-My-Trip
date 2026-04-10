const express = require('express');
const {
  createTour,
  updateTour,
  deleteTour,
  getSingleTour,
  getAllTour,
  getTourBySearch,
  getNearbyTours,
  getFeaturedTour,
  getTourCount,
  getTourAvailability,
  getPersonalizedRecommendations,
} = require('../controllers/tourController.js');
const { verifyAdmin, verifyToken } = require("../utils/verifyToken.js")
const router = express.Router();
//create new tour
router.post('/',verifyAdmin, createTour);

//update tour
router.put('/:id',verifyAdmin, updateTour);

//delete tour
router.delete('/:id',verifyAdmin, deleteTour);

//get tour by search
router.get("/search/getTourBySearch",getTourBySearch);
router.get("/search/getNearbyTours", getNearbyTours);
router.get("/search/getFeaturedTours",getFeaturedTour);
router.get("/search/getTourCount",getTourCount);
router.get("/search/recommendations", verifyToken, getPersonalizedRecommendations);

//set all tour
router.get('/', getAllTour);
router.get("/:id/availability", getTourAvailability);
//set single tour
router.get('/:id', getSingleTour);

module.exports = router; 
 
