const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    gallery_id: { type: mongoose.Schema.Types.ObjectId, ref: "GalleryBlock", required: true, index: true },
    image_url: { type: String, required: true },
    caption: { type: String, default: "" },
    order_index: { type: Number, required: true, index: true },
  },
  { timestamps: false },
);

galleryImageSchema.index({ gallery_id: 1, order_index: 1 }, { unique: true });

module.exports = mongoose.model("GalleryImage", galleryImageSchema);
