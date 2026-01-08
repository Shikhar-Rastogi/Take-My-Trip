const jwt = require("jsonwebtoken");

// ================= VERIFY TOKEN =================
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You're not authorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    req.user = user; // 🔥 attach decoded user
    next();
  });
};

// ================= VERIFY USER =================
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "You're not authenticated",
      });
    }
  });
};

// ================= VERIFY ADMIN =================
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "You're not authorized",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyUser,
  verifyAdmin,
};
