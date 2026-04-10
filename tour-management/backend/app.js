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
const allowedOrigins = ["http://localhost:3000"];

/* ================= CORS CONFIG ================= */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
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
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const requestOrigin = req.get("origin");
  const requestSite = req.get("sec-fetch-site");
  const sameSiteRequest = !requestSite || requestSite === "same-origin";
  const allowedCrossSite =
    requestOrigin &&
    (allowedOrigins.includes(requestOrigin) ||
      requestOrigin.endsWith(".vercel.app"));

  if (sameSiteRequest || allowedCrossSite) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Blocked by CSRF protection",
  });
});
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
