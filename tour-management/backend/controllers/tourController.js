const Tour = require("../models/Tour.js");
const Booking = require("../models/Booking.js");
const {
  getCache,
  setCache,
  deleteCacheByPattern,
} = require("../utils/cache");

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

const createTour = async (req, res) => {
  const newTour = new Tour(req.body);
  try {
    const savedTour = await newTour.save();
    await deleteCacheByPattern("tour:*");
    await deleteCacheByPattern("recommendations:*");
    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedTour,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create. Try again" });
  }
};

const updateTour = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    await deleteCacheByPattern("tour:*");
    await deleteCacheByPattern("recommendations:*");
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedTour,
    });
  } catch (err) {
    res.status(500).json({
      success: true,
      message: "failed to update",
    });
  }
};

const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);
    await deleteCacheByPattern("tour:*");
    await deleteCacheByPattern("recommendations:*");

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: true,
      message: "failed to delete",
    });
  }
};

const getSingleTour = async (req, res) => {
  const id = req.params.id;
  const cacheKey = `tour:single:${id}`;
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const tour = await Tour.findById(id).populate("reviews");
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "not found",
      });
    }

    const response = {
      success: true,
      message: "Successful",
      data: tour,
    };
    await setCache(cacheKey, response, 300);

    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

const getAllTour = async (req, res) => {
  const page = parseInt(req.query.page || "0");
  const cacheKey = `tour:list:page:${page}`;
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const tours = await Tour.find({})
      .populate("reviews")
      .skip(page * 8)
      .limit(8);
    const response = {
      success: true,
      count: tours.length,
      message: "Successful",
      data: tours,
    };

    await setCache(cacheKey, response, 180);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

const getTourBySearch = async (req, res) => {
  const cityQuery = req.query.city || "";
  const city = new RegExp(cityQuery, "i");
  const distance = parseInt(req.query.distance || "0");
  const maxGroupSize = parseInt(req.query.maxGroupSize || "0");
  const cacheKey = `tour:search:city:${cityQuery}:distance:${distance}:group:${maxGroupSize}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const tours = await Tour.find({
      city,
      distance: { $gte: distance },
      maxGroupSize: { $gte: maxGroupSize },
    }).populate("reviews");

    const response = {
      success: true,
      message: "Successful",
      data: tours,
    };

    await setCache(cacheKey, response, 180);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

const getNearbyTours = async (req, res) => {
  const lat = toNumber(req.query.lat, null);
  const lng = toNumber(req.query.lng, null);
  const radiusKm = toNumber(req.query.radiusKm, 50);

  if (lat === null || lng === null) {
    return res.status(400).json({
      success: false,
      message: "lat and lng are required",
    });
  }

  const cacheKey = `tour:nearby:${lat}:${lng}:${radiusKm}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const tours = await Tour.find({
      "coordinates.lat": { $ne: null },
      "coordinates.lng": { $ne: null },
    }).populate("reviews");

    const filteredTours = tours.filter((tour) => {
      const distanceKm = haversineDistanceKm(
        lat,
        lng,
        tour.coordinates.lat,
        tour.coordinates.lng
      );
      return distanceKm <= radiusKm;
    });

    const response = {
      success: true,
      message: "Successful",
      data: filteredTours,
    };
    await setCache(cacheKey, response, 120);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby tours",
    });
  }
};

const getFeaturedTour = async (req, res) => {
  const cacheKey = "tour:featured";
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const tours = await Tour.find({ featured: true }).populate("reviews").limit(8);
    const response = {
      success: true,
      message: "Successful",
      data: tours,
    };

    await setCache(cacheKey, response, 300);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

const getTourCount = async (req, res) => {
  const cacheKey = "tour:count";
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const tourCount = await Tour.estimatedDocumentCount();
    const response = { success: true, data: tourCount };
    await setCache(cacheKey, response, 300);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ success: false, message: "failed to fetch" });
  }
};

const getTourAvailability = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    const remainingSeats = Math.max(tour.maxGroupSize - tour.bookedSeats, 0);
    res.status(200).json({
      success: true,
      data: {
        tourId: tour._id,
        maxGroupSize: tour.maxGroupSize,
        bookedSeats: tour.bookedSeats,
        remainingSeats,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch seats" });
  }
};

const getPersonalizedRecommendations = async (req, res) => {
  const userId = req.user?.id;
  const currentTourId = req.query.currentTourId;
  const cacheKey = `recommendations:${userId}:current:${currentTourId || "none"}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const recentBookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    const bookedTourIds = recentBookings
      .map((booking) => booking.tourId)
      .filter(Boolean);

    const bookedTours = await Tour.find({
      _id: { $in: bookedTourIds },
    });
    const favoriteCities = [...new Set(bookedTours.map((tour) => tour.city))];

    const query = {
      _id: { $nin: bookedTourIds },
    };

    if (currentTourId) {
      query._id.$nin.push(currentTourId);
    }

    if (favoriteCities.length > 0) {
      query.city = { $in: favoriteCities };
    }

    let recommendations = await Tour.find(query)
      .populate("reviews")
      .sort({ featured: -1, createdAt: -1 })
      .limit(4);

    if (recommendations.length < 4) {
      const excludedIds = [
        ...bookedTourIds,
        ...recommendations.map((tour) => tour._id),
      ];
      if (currentTourId) excludedIds.push(currentTourId);

      const fallbackTours = await Tour.find({
        _id: { $nin: excludedIds },
      })
        .populate("reviews")
        .sort({ featured: -1, createdAt: -1 })
        .limit(4 - recommendations.length);
      recommendations = [...recommendations, ...fallbackTours];
    }

    const response = {
      success: true,
      data: recommendations,
    };
    await setCache(cacheKey, response, 300);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
};

module.exports = {
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
};
