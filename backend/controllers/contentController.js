const mongoose = require("mongoose");
const Article = require("../models/Article");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const ArticleCategory = require("../models/ArticleCategory");
const ArticleTag = require("../models/ArticleTag");
const ArticleBlock = require("../models/ArticleBlock");
const TextBlock = require("../models/TextBlock");
const ImageBlock = require("../models/ImageBlock");
const GalleryBlock = require("../models/GalleryBlock");
const GalleryImage = require("../models/GalleryImage");

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ""));

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getEditorBlocks = (payload = {}) => {
  if (Array.isArray(payload.editorData?.blocks)) return payload.editorData.blocks;
  if (Array.isArray(payload.blocks)) return payload.blocks;
  return [];
};

const mapEditorTypeToBlockType = (type = "") => {
  const key = String(type).toLowerCase();
  if (key === "paragraph") return "paragraph";
  if (key === "header" || key === "heading") return "heading";
  if (key === "image") return "image";
  if (key === "gallery") return "gallery";
  if (key === "code") return "code";
  if (key === "quote") return "quote";
  if (key === "video" || key === "embed") return "video";
  return "paragraph";
};

const normalizeBlocks = (blocks = []) =>
  blocks.map((block, index) => {
    const blockType = mapEditorTypeToBlockType(block.block_type || block.type);
    const data = block.data || block;

    return {
      block_type: blockType,
      position: Number(block.position ?? index),
      data,
    };
  });

const syncArticleCategories = async (articleId, categoryIds = []) => {
  await ArticleCategory.deleteMany({ article_id: articleId });
  if (!Array.isArray(categoryIds) || !categoryIds.length) return;

  const rows = [...new Set(categoryIds.map(String))]
    .filter(isObjectId)
    .map((categoryId) => ({ article_id: articleId, category_id: categoryId }));

  if (rows.length) await ArticleCategory.insertMany(rows);
};

const syncArticleTags = async (articleId, tagIds = []) => {
  await ArticleTag.deleteMany({ article_id: articleId });
  if (!Array.isArray(tagIds) || !tagIds.length) return;

  const rows = [...new Set(tagIds.map(String))]
    .filter(isObjectId)
    .map((tagId) => ({ article_id: articleId, tag_id: tagId }));

  if (rows.length) await ArticleTag.insertMany(rows);
};

const deleteArticleBlocks = async (articleId) => {
  const blocks = await ArticleBlock.find({ article_id: articleId }).select("_id").lean();
  const blockIds = blocks.map((item) => item._id);
  if (!blockIds.length) return;

  const galleries = await GalleryBlock.find({ block_id: { $in: blockIds } }).select("_id").lean();
  const galleryIds = galleries.map((item) => item._id);

  if (galleryIds.length) await GalleryImage.deleteMany({ gallery_id: { $in: galleryIds } });
  await TextBlock.deleteMany({ block_id: { $in: blockIds } });
  await ImageBlock.deleteMany({ block_id: { $in: blockIds } });
  await GalleryBlock.deleteMany({ block_id: { $in: blockIds } });
  await ArticleBlock.deleteMany({ _id: { $in: blockIds } });
};

const saveArticleBlocks = async (articleId, blocks = []) => {
  await deleteArticleBlocks(articleId);
  const normalized = normalizeBlocks(blocks);
  for (const block of normalized) {
    const base = await ArticleBlock.create({
      article_id: articleId,
      block_type: block.block_type,
      position: block.position,
    });

    if (["paragraph", "heading", "code", "quote", "video"].includes(block.block_type)) {
      const content =
        block.data?.content ||
        block.data?.text ||
        block.data?.code ||
        block.data?.caption ||
        block.data?.url ||
        "";
      await TextBlock.create({ block_id: base._id, content });
      continue;
    }

    if (block.block_type === "image") {
      await ImageBlock.create({
        block_id: base._id,
        image_url: block.data?.image_url || block.data?.file?.url || block.data?.url || "",
        caption: block.data?.caption || "",
        alt_text: block.data?.alt_text || block.data?.alt || "",
        alignment: block.data?.alignment || "center",
        width: block.data?.width ?? null,
        height: block.data?.height ?? null,
      });
      continue;
    }

    if (block.block_type === "gallery") {
      const gallery = await GalleryBlock.create({
        block_id: base._id,
        layout_type: block.data?.layout_type || block.data?.layout || "grid",
      });

      const images = Array.isArray(block.data?.gallery_images)
        ? block.data.gallery_images
        : Array.isArray(block.data?.images)
          ? block.data.images
          : [];

      if (images.length) {
        await GalleryImage.insertMany(
          images.map((image, idx) => ({
            gallery_id: gallery._id,
            image_url: image.image_url || image.url || "",
            caption: image.caption || "",
            order_index: Number(image.order_index ?? idx),
          })),
        );
      }
    }
  }
};

const buildArticlePayload = async (articleDoc) => {
  if (!articleDoc) return null;
  const article = articleDoc.toObject ? articleDoc.toObject() : articleDoc;

  const [articleCategories, articleTags, blocks] = await Promise.all([
    ArticleCategory.find({ article_id: article._id }).populate("category_id").lean(),
    ArticleTag.find({ article_id: article._id }).populate("tag_id").lean(),
    ArticleBlock.find({ article_id: article._id }).sort({ position: 1 }).lean(),
  ]);

  const blockIds = blocks.map((item) => item._id);
  const [textRows, imageRows, galleryRows] = await Promise.all([
    TextBlock.find({ block_id: { $in: blockIds } }).lean(),
    ImageBlock.find({ block_id: { $in: blockIds } }).lean(),
    GalleryBlock.find({ block_id: { $in: blockIds } }).lean(),
  ]);

  const galleryIds = galleryRows.map((item) => item._id);
  const galleryImages = galleryIds.length ? await GalleryImage.find({ gallery_id: { $in: galleryIds } }).sort({ order_index: 1 }).lean() : [];

  const textMap = new Map(textRows.map((item) => [String(item.block_id), item]));
  const imageMap = new Map(imageRows.map((item) => [String(item.block_id), item]));
  const galleryMap = new Map(galleryRows.map((item) => [String(item.block_id), item]));

  const editorBlocks = blocks.map((block) => {
    const blockId = String(block._id);

    if (["paragraph", "heading", "code", "quote", "video"].includes(block.block_type)) {
      const text = textMap.get(blockId)?.content || "";
      const type = block.block_type === "heading" ? "header" : block.block_type;
      const data = type === "header" ? { text, level: 2 } : { text, content: text };
      return { id: blockId, type, block_type: block.block_type, position: block.position, data };
    }

    if (block.block_type === "image") {
      const row = imageMap.get(blockId);
      return {
        id: blockId,
        type: "image",
        block_type: "image",
        position: block.position,
        data: {
          image_url: row?.image_url || "",
          caption: row?.caption || "",
          alt_text: row?.alt_text || "",
          alignment: row?.alignment || "center",
          width: row?.width ?? null,
          height: row?.height ?? null,
          file: { url: row?.image_url || "" },
        },
      };
    }

    if (block.block_type === "gallery") {
      const gallery = galleryMap.get(blockId);
      const images = gallery
        ? galleryImages
            .filter((img) => String(img.gallery_id) === String(gallery._id))
            .map((img) => ({ image_url: img.image_url, caption: img.caption, order_index: img.order_index }))
        : [];

      return {
        id: blockId,
        type: "gallery",
        block_type: "gallery",
        position: block.position,
        data: { layout_type: gallery?.layout_type || "grid", gallery_images: images },
      };
    }

    return { id: blockId, type: block.block_type, block_type: block.block_type, position: block.position, data: {} };
  });

  return {
    ...article,
    categories: articleCategories.map((row) => row.category_id).filter(Boolean),
    tags: articleTags.map((row) => row.tag_id).filter(Boolean),
    editorData: {
      time: Date.now(),
      version: "2.29.0",
      blocks: editorBlocks,
    },
  };
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "name is required" });

    const category = await Category.create({
      name,
      slug: slug ? slugify(slug) : slugify(name),
      description: description || "",
    });

    return res.status(201).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to create category" });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  return res.json({ success: true, categories });
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ success: false, error: "Invalid id" });

    const payload = { ...req.body };
    if (payload.slug) payload.slug = slugify(payload.slug);
    if (!payload.slug && payload.name) payload.slug = slugify(payload.name);

    const category = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, error: "Category not found" });
    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update category" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!isObjectId(id)) return res.status(400).json({ success: false, error: "Invalid id" });

  await Category.findByIdAndDelete(id);
  await ArticleCategory.deleteMany({ category_id: id });
  return res.json({ success: true, message: "Category deleted" });
};

exports.createTag = async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "name is required" });

    const tag = await Tag.create({ name, slug: slug ? slugify(slug) : slugify(name) });
    return res.status(201).json({ success: true, tag });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to create tag" });
  }
};

exports.getTags = async (req, res) => {
  const tags = await Tag.find().sort({ createdAt: -1 });
  return res.json({ success: true, tags });
};

exports.updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ success: false, error: "Invalid id" });

    const payload = { ...req.body };
    if (payload.slug) payload.slug = slugify(payload.slug);
    if (!payload.slug && payload.name) payload.slug = slugify(payload.name);

    const tag = await Tag.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!tag) return res.status(404).json({ success: false, error: "Tag not found" });
    return res.json({ success: true, tag });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update tag" });
  }
};

exports.deleteTag = async (req, res) => {
  const { id } = req.params;
  if (!isObjectId(id)) return res.status(400).json({ success: false, error: "Invalid id" });

  await Tag.findByIdAndDelete(id);
  await ArticleTag.deleteMany({ tag_id: id });
  return res.json({ success: true, message: "Tag deleted" });
};

exports.createArticle = async (req, res) => {
  try {
    const {
      title,
      slug,
      author_id,
      excerpt,
      cover_image,
      content_type,
      status,
      reading_time,
      views_count,
      published_at,
      category_ids = [],
      tag_ids = [],
    } = req.body;

    if (!title || !author_id || !content_type) {
      return res.status(400).json({ success: false, error: "title, author_id and content_type are required" });
    }

    const article = await Article.create({
      title,
      slug: slug ? slugify(slug) : slugify(title),
      author_id,
      excerpt,
      cover_image,
      content_type,
      status,
      reading_time,
      views_count,
      published_at,
    });

    await Promise.all([
      syncArticleCategories(article._id, category_ids),
      syncArticleTags(article._id, tag_ids),
      saveArticleBlocks(article._id, getEditorBlocks(req.body)),
    ]);

    const payload = await buildArticlePayload(article);
    return res.status(201).json({ success: true, article: payload });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to create article" });
  }
};

exports.getArticles = async (req, res) => {
  const { status, content_type, author_id, category_id, tag_id, search } = req.query;
  const query = {};

  if (status) query.status = status;
  if (content_type) query.content_type = content_type;
  if (author_id && isObjectId(author_id)) query.author_id = author_id;
  if (search) query.title = { $regex: search, $options: "i" };

  let articles = await Article.find(query).sort({ createdAt: -1 }).populate("author_id", "_id email username picture");

  if (category_id && isObjectId(category_id)) {
    const articleIds = await ArticleCategory.find({ category_id }).distinct("article_id");
    articles = articles.filter((item) => articleIds.some((id) => String(id) === String(item._id)));
  }

  if (tag_id && isObjectId(tag_id)) {
    const articleIds = await ArticleTag.find({ tag_id }).distinct("article_id");
    articles = articles.filter((item) => articleIds.some((id) => String(id) === String(item._id)));
  }

  return res.json({ success: true, articles });
};

exports.getDashboardBlogs = async (req, res) => {
  try {
    const { limit = 12, status = "all", content_type = "all" } = req.query;
    const limitNumber = Math.max(1, Math.min(50, Number(limit) || 12));

    const query = {};

    if (String(status).toLowerCase() !== "all") {
      query.status = status;
    }

    if (String(content_type).toLowerCase() !== "all") {
      const contentTypes = String(content_type)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (contentTypes.length === 1) {
        query.content_type = contentTypes[0];
      } else if (contentTypes.length > 1) {
        query.content_type = { $in: contentTypes };
      }
    }

    const articles = await Article.find(query)
      .sort({ published_at: -1, createdAt: -1 })
      .limit(limitNumber)
      .populate("author_id", "_id email username picture");

    return res.json({ success: true, blogs: articles });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to load dashboard blogs" });
  }
};

exports.getArticleById = async (req, res) => {
  const { id } = req.params;
  if (!isObjectId(id)) return res.status(400).json({ success: false, error: "Invalid id" });

  const article = await Article.findById(id).populate("author_id", "_id email username picture");
  if (!article) return res.status(404).json({ success: false, error: "Article not found" });

  const payload = await buildArticlePayload(article);
  return res.json({ success: true, article: payload });
};

exports.getArticleBySlug = async (req, res) => {
  const { slug } = req.params;
  const article = await Article.findOne({ slug }).populate("author_id", "_id email username picture");
  if (!article) return res.status(404).json({ success: false, error: "Article not found" });

  const payload = await buildArticlePayload(article);
  return res.json({ success: true, article: payload });
};

exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ success: false, error: "Invalid id" });

    const payload = { ...req.body };
    delete payload.category_ids;
    delete payload.tag_ids;
    delete payload.blocks;
    delete payload.editorData;

    if (payload.slug) payload.slug = slugify(payload.slug);
    if (!payload.slug && payload.title) payload.slug = slugify(payload.title);

    const article = await Article.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate(
      "author_id",
      "_id email username picture",
    );
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });

    if (Array.isArray(req.body.category_ids)) {
      await syncArticleCategories(article._id, req.body.category_ids);
    }

    if (Array.isArray(req.body.tag_ids)) {
      await syncArticleTags(article._id, req.body.tag_ids);
    }

    if (req.body.editorData || req.body.blocks) {
      await saveArticleBlocks(article._id, getEditorBlocks(req.body));
    }

    const result = await buildArticlePayload(article);
    return res.json({ success: true, article: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update article" });
  }
};

exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  if (!isObjectId(id)) return res.status(400).json({ success: false, error: "Invalid id" });

  await Promise.all([
    deleteArticleBlocks(id),
    ArticleCategory.deleteMany({ article_id: id }),
    ArticleTag.deleteMany({ article_id: id }),
    Article.findByIdAndDelete(id),
  ]);

  return res.json({ success: true, message: "Article deleted" });
};

exports.incrementViews = async (req, res) => {
  const { id } = req.params;
  if (!isObjectId(id)) return res.status(400).json({ success: false, error: "Invalid id" });

  const article = await Article.findByIdAndUpdate(id, { $inc: { views_count: 1 } }, { new: true });
  if (!article) return res.status(404).json({ success: false, error: "Article not found" });

  return res.json({ success: true, views_count: article.views_count });
};
