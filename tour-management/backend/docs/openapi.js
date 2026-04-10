module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Take My Trip API",
    version: "1.0.0",
    description:
      "Core APIs for tours, bookings, reviews, auth, and search features.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Base API path",
    },
  ],
  paths: {
    "/tours/search/getNearbyTours": {
      get: {
        summary: "Get nearby tours by latitude/longitude",
        parameters: [
          { in: "query", name: "lat", required: true, schema: { type: "number" } },
          { in: "query", name: "lng", required: true, schema: { type: "number" } },
          {
            in: "query",
            name: "radiusKm",
            required: false,
            schema: { type: "number", default: 50 },
          },
        ],
        responses: {
          200: { description: "Nearby tours fetched successfully" },
        },
      },
    },
    "/tours/{id}/availability": {
      get: {
        summary: "Get seat availability for a tour",
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Availability fetched successfully" },
        },
      },
    },
    "/tours/search/recommendations": {
      get: {
        summary: "Get personalized recommendations for logged-in user",
        responses: {
          200: { description: "Recommendations fetched successfully" },
        },
      },
    },
    "/booking": {
      post: {
        summary: "Create a booking",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["tourId", "fullName", "guestSize", "phone", "bookAt"],
                properties: {
                  tourId: { type: "string" },
                  fullName: { type: "string" },
                  guestSize: { type: "number" },
                  phone: { type: "string" },
                  bookAt: { type: "string", format: "date" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Booking created successfully" },
          409: { description: "Not enough seats left" },
        },
      },
    },
  },
};
