const mongoose = require("mongoose");

const textBlockSchema = new mongoose.Schema(
  {
    block_id: { type: mongoose.Schema.Types.ObjectId, ref: "ArticleBlock", required: true, unique: true, index: true },
    content: { type: String, required: true },
  },
  { timestamps: false },
);

module.exports = mongoose.model("TextBlock", textBlockSchema);
