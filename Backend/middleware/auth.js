const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

const JWT_SECRET = process.env.SECRET_KEY || "mySecretKey123";
if (!process.env.SECRET_KEY) {
  console.warn("⚠️  SECRET_KEY is missing in .env — using an insecure default JWT secret");
}

const signToken = (user) =>
  jwt.sign({ user: { id: user.id } }, JWT_SECRET, { expiresIn: "7d" });

// Verifies the Bearer token and attaches the logged-in user as req.user
const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Please log in to continue" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.user?.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Your account no longer exists" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Your session has expired. Please log in again.",
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

// Shape of a user that is safe to send to the browser
const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  location: user.location,
  phone: user.phone || "",
  avatar: user.avatar || "",
  role: user.role,
  isVerified: user.isVerified !== false,
  joinedAt: user.date || user._id.getTimestamp(),
});

module.exports = { signToken, requireAuth, requireAdmin, publicUser };
