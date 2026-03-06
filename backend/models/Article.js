const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    excerpt: { type: String, default: "" },
    cover_image: { type: String, default: "" },
    content_type: {
      type: String,
      enum: ["news", "tutorial", "blog", "course_article"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    reading_time: { type: Number, default: 0 },
    views_count: { type: Number, default: 0 },
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    shares_count: { type: Number, default: 0 },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: { type: String, default: "" },
    },
    published_at: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Article", articleSchema);
