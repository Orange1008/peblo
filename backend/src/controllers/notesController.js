const Note = require("../models/Note");

// ── GET /api/notes ─ list user's notes ───────────
exports.getNotes = async (req, res, next) => {
  try {
    const { search, folder, tag, archived, sort = "newest", page = 1, limit = 50 } = req.query;

    const filter = { user: req.user.id };
    if (archived !== undefined) filter.archived = archived === "true";
    if (folder) filter.folder = folder;
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };

    const sortMap = {
      newest: { updatedAt: -1 },
      oldest: { updatedAt: 1 },
      az:     { title: 1 },
      za:     { title: -1 },
    };

    const notes = await Note.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .lean();

    const total = await Note.countDocuments(filter);
    res.json({ notes, total, page: +page });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/notes/:id ────────────────────────────
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ note });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/notes ───────────────────────────────
exports.createNote = async (req, res, next) => {
  try {
    const { title, content, folder, emoji, tags, color } = req.body;
    const note = await Note.create({
      user: req.user.id,
      title: title || "New Adventure ✨",
      content: content || "",
      folder: folder || "General",
      emoji: emoji || "📚",
      tags: tags || [],
      color: color || "",
    });
    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/notes/:id ────────────────────────────
exports.updateNote = async (req, res, next) => {
  try {
    const allowed = ["title", "content", "folder", "emoji", "tags", "archived", "shared", "color"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ note });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/notes/:id ─────────────────────────
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/notes/share/:shareId ─ public ────────
exports.getSharedNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ shareId: req.params.shareId, shared: true }).lean();
    if (!note) return res.status(404).json({ error: "Note not found or not shared" });
    // Strip user field for privacy
    const { user: _u, ...safeNote } = note;
    res.json({ note: safeNote });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/notes/:id/ai-hit ───────────────────
exports.incrementAI = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $inc: { aiInteractions: 1 } },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ aiInteractions: note.aiInteractions });
  } catch (err) {
    next(err);
  }
};
