const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://take-my-trip.onrender.com/api/v1"
    : "http://localhost:4000/api/v1";

export default BASE_URL;
