const express = require("express");
const router  = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getSharedNote,
  incrementAI,
} = require("../controllers/notesController");
const protect = require("../middleware/auth");

// Public — shared note (no auth)
router.get("/share/:shareId", getSharedNote);

// All routes below require auth
router.use(protect);

router.route("/")
  .get(getNotes)       // GET  /api/notes
  .post(createNote);   // POST /api/notes

router.route("/:id")
  .get(getNote)        // GET    /api/notes/:id
  .put(updateNote)     // PUT    /api/notes/:id
  .delete(deleteNote); // DELETE /api/notes/:id

router.patch("/:id/ai-hit", incrementAI); // PATCH /api/notes/:id/ai-hit

module.exports = router;
