const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

// ── POST /api/auth/signup ─────────────────────────
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ error: "Email already registered" });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({ token, user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: "Invalid email or password" });

    if (!user.isActive)
      return res.status(403).json({ error: "Account deactivated" });

    // Update streak
    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate
      ? new Date(user.lastActiveDate).toDateString()
      : null;

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActive === yesterday.toDateString()) {
        user.streak += 1;
      } else if (lastActive !== today) {
        user.streak = 1;
      }
      user.lastActiveDate = new Date();
      await user.save({ validateBeforeSave: false });
    }

    const token = signToken(user._id);
    res.json({ token, user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ──────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};
