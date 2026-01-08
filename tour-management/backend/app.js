const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db");

const tourRoute = require("./routes/tours");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const reviewRoute = require("./routes/reviews");
const bookingRoute = require("./routes/bookings");

const app = express();

// ✅ CORS (local + production later)
app.use(
  cors({
    origin: ["http://localhost:3000", "https://takemytrip.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// DB
connectToDb();

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);

// Test route
app.get("/", (req, res) => {
  res.send("API is working ✅");
});

module.exports = app;
