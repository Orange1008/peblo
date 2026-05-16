const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authenticated — please log in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ error: "User no longer exists" });
    if (!user.isActive) return res.status(403).json({ error: "Account deactivated" });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError")
      return res.status(401).json({ error: "Invalid token" });
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ error: "Token expired — please log in again" });
    next(err);
  }
};

module.exports = protect;
