const mongoose = require("mongoose");

const articleBlockSchema = new mongoose.Schema(
  {
    article_id: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true, index: true },
    block_type: {
      type: String,
      enum: ["paragraph", "heading", "image", "gallery", "code", "quote", "video"],
      required: true,
    },
    position: { type: Number, required: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ArticleBlock", articleBlockSchema);
