const express = require("express");
const router  = express.Router();
const {
  getProfile,
  updateProfile,
  getStats,
  addXP,
  deleteAccount,
} = require("../controllers/userController");
const protect = require("../middleware/auth");

router.use(protect); // all user routes are protected

router.route("/profile")
  .get(getProfile)      // GET /api/user/profile
  .put(updateProfile);  // PUT /api/user/profile

router.get("/stats", getStats);          // GET  /api/user/stats
router.post("/xp", addXP);              // POST /api/user/xp
router.delete("/", deleteAccount);      // DELETE /api/user

module.exports = router;
