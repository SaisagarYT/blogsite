const mongoose = require("mongoose");

const articleCategorySchema = new mongoose.Schema(
  {
    article_id: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true, index: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  },
  { timestamps: false },
);

articleCategorySchema.index({ article_id: 1, category_id: 1 }, { unique: true });

module.exports = mongoose.model("ArticleCategory", articleCategorySchema);
