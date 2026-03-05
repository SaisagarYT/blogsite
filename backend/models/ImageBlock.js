const mongoose = require("mongoose");

const imageBlockSchema = new mongoose.Schema(
  {
    block_id: { type: mongoose.Schema.Types.ObjectId, ref: "ArticleBlock", required: true, unique: true, index: true },
    image_url: { type: String, required: true },
    caption: { type: String, default: "" },
    alt_text: { type: String, default: "" },
    alignment: { type: String, default: "center" },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
  },
  { timestamps: false },
);

module.exports = mongoose.model("ImageBlock", imageBlockSchema);
