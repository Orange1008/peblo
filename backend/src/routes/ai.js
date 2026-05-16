const express = require("express");
const router  = express.Router();
const { aiAction } = require("../controllers/aiController");
const protect = require("../middleware/auth");

// POST /api/ai — requires auth
router.post("/", protect, aiAction);

module.exports = router;
