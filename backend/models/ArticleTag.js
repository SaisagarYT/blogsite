const mongoose = require("mongoose");

const articleTagSchema = new mongoose.Schema(
  {
    article_id: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true, index: true },
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true, index: true },
  },
  { timestamps: false },
);

articleTagSchema.index({ article_id: 1, tag_id: 1 }, { unique: true });

module.exports = mongoose.model("ArticleTag", articleTagSchema);
