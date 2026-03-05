const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    lesson_type: {
      type: String,
      enum: ["article", "video_article", "practice"],
      default: "article",
    },
    reading_time: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published", "archived", "review"],
      default: "draft",
      index: true,
    },
    order_index: { type: Number, default: 0 },
    editor_data: {
      type: mongoose.Schema.Types.Mixed,
      default: { time: Date.now(), version: "2.29.0", blocks: [] },
    },
  },
  { _id: true }
);

const moduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    order_index: { type: Number, default: 0 },
    lessons: { type: [lessonSchema], default: [] },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    tags: { type: [String], default: [] },
    thumbnail_url: { type: String, default: "" },
    estimated_duration: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published", "archived", "review"],
      default: "draft",
      index: true,
    },
    students_count: { type: Number, default: 0 },
    instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    modules: { type: [moduleSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
