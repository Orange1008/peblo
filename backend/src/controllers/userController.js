const User = require("../models/User");
const Note = require("../models/Note");

// ── GET /api/user/profile ─────────────────────────
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/user/profile ─────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "avatar", "preferences"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    // Prevent email/password update through this route
    if (req.body.email || req.body.password) {
      return res.status(400).json({ error: "Use dedicated endpoints to change email/password" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/user/stats ───────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const totalNotes    = await Note.countDocuments({ user: req.user.id, archived: false });
    const archivedNotes = await Note.countDocuments({ user: req.user.id, archived: true });
    const sharedNotes   = await Note.countDocuments({ user: req.user.id, shared: true });
    const totalAI       = await Note.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: null, total: { $sum: "$aiInteractions" } } },
    ]);

    // Weekly activity (notes updated per day in last 7 days)
    const seven = new Date();
    seven.setDate(seven.getDate() - 7);
    const weeklyNotes = await Note.find({
      user: req.user.id,
      updatedAt: { $gte: seven },
    }).select("updatedAt").lean();

    res.json({
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      totalNotes,
      archivedNotes,
      sharedNotes,
      totalAIInteractions: totalAI[0]?.total || 0,
      weeklyNotes: weeklyNotes.map((n) => n.updatedAt),
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/user/xp ─ add XP + level up ────────
exports.addXP = async (req, res, next) => {
  try {
    const { amount = 10 } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.xp += amount;
    // Level up every 500 XP
    user.level = Math.floor(user.xp / 500) + 1;
    await user.save({ validateBeforeSave: false });

    res.json({ xp: user.xp, level: user.level });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/user ── delete account ───────────
exports.deleteAccount = async (req, res, next) => {
  try {
    await Note.deleteMany({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};
