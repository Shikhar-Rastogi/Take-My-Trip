const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const connectToDb = require("./db/db");
const openApiSpec = require("./docs/openapi");

const tourRoute = require("./routes/tours");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const reviewRoute = require("./routes/reviews");
const bookingRoute = require("./routes/bookings");

const app = express();

/* ================= CORS CONFIG ================= */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (origin === "http://localhost:3000") {
      return callback(null, true);
    }

    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(cookieParser());
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

/* ================= DATABASE ================= */
connectToDb();

/* ================= ROUTES ================= */
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);

/* ================= TEST ================= */
app.get("/", (req, res) => {
  res.send("API is working ✅");
});

module.exports = app;
