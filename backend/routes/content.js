const express = require("express");
const contentController = require("../controllers/contentController");

const router = express.Router();

router.post("/categories", contentController.createCategory);
router.get("/categories", contentController.getCategories);
router.put("/categories/:id", contentController.updateCategory);
router.delete("/categories/:id", contentController.deleteCategory);

router.post("/tags", contentController.createTag);
router.get("/tags", contentController.getTags);
router.put("/tags/:id", contentController.updateTag);
router.delete("/tags/:id", contentController.deleteTag);

router.post("/articles", contentController.createArticle);
router.get("/articles", contentController.getArticles);
router.get("/dashboard/blogs", contentController.getDashboardBlogs);
router.get("/slug/:slug", contentController.getContentBySlug);
router.get("/articles/slug/:slug", contentController.getArticleBySlug);
router.get("/articles/:id", contentController.getArticleById);
router.put("/articles/:id", contentController.updateArticle);
router.patch("/articles/:id/views", contentController.incrementViews);
router.delete("/articles/:id", contentController.deleteArticle);

module.exports = router;
