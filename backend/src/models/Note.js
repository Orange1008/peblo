const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title too long"],
      default: "New Adventure ✨",
    },
    content: {
      type: String,
      default: "",
      maxlength: [50000, "Content too long"],
    },
    folder: {
      type: String,
      default: "General",
      trim: true,
    },
    emoji: {
      type: String,
      default: "📚",
    },
    tags: {
      type: [String],
      default: [],
    },
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },
    shared: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      unique: true,
      default: () => `share-${uuidv4()}`,
    },
    aiInteractions: {
      type: Number,
      default: 0,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ── Text index for full-text search ──────────────
noteSchema.index({ title: "text", content: "text", tags: "text" });

// ── Auto-update word count ────────────────────────
noteSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.wordCount = this.content
      ? this.content.trim().split(/\s+/).filter(Boolean).length
      : 0;
  }
  next();
});

module.exports = mongoose.model("Note", noteSchema);
