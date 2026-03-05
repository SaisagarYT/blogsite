const mongoose = require("mongoose");

const galleryBlockSchema = new mongoose.Schema(
  {
    block_id: { type: mongoose.Schema.Types.ObjectId, ref: "ArticleBlock", required: true, unique: true, index: true },
    layout_type: { type: String, default: "grid" },
  },
  { timestamps: false },
);

module.exports = mongoose.model("GalleryBlock", galleryBlockSchema);
