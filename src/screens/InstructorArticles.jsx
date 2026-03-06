import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InstructorLayout from "../components/instructor/InstructorLayout";
import API_BASE_URL from "../config/api";

const articleSections = [
  { key: "all", label: "All Articles", icon: "solar:document-text-outline" },
  { key: "create", label: "Article Editor", icon: "solar:pen-new-square-outline" },
  { key: "preview", label: "Article Preview", icon: "solar:eye-outline" },
  { key: "draft", label: "Draft Articles", icon: "solar:file-text-outline" },
  { key: "scheduled", label: "Scheduled Articles", icon: "solar:calendar-outline" },
  { key: "categories", label: "Categories", icon: "solar:widget-2-outline" },
  { key: "tags", label: "Tags", icon: "solar:tag-outline" },
  { key: "analytics", label: "Article Analytics", icon: "solar:graph-up-outline" },
  { key: "media", label: "Media Library", icon: "solar:gallery-wide-outline" },
];

const sectionDescriptions = {
  all: "Manage your complete article catalog and jump quickly to edit, preview, and scheduling actions.",
  create: "Compose technical articles with block-based editing tools, slash commands, and live preview toggle.",
  preview: "Review the final published reading experience before releasing the article.",
  draft: "Continue writing unfinished drafts and clean up stale content.",
  scheduled: "Track and adjust planned publication dates for upcoming articles.",
  categories: "Create and maintain category taxonomy for better content organization.",
  tags: "Manage search-friendly tags used across your articles.",
  analytics: "Monitor article performance, engagement, and audience behavior at a glance.",
  media: "Upload and organize reusable images, diagrams, and illustrations.",
};

const editorTools = [
  { key: "heading", label: "Add Heading", icon: "solar:text-bold-outline" },
  { key: "paragraph", label: "Add Paragraph", icon: "solar:text-field-focus-outline" },
  { key: "image", label: "Add Image", icon: "solar:gallery-outline" },
  { key: "code", label: "Add Code Block", icon: "solar:code-square-outline" },
  { key: "quote", label: "Add Quote", icon: "solar:quote-up-outline" },
  { key: "list", label: "Add List", icon: "solar:list-check-outline" },
  { key: "table", label: "Add Table", icon: "solar:rows-group-rounded-outline" },
  { key: "diagram", label: "Add Diagram", icon: "solar:square-bottom-up-outline" },
  { key: "divider", label: "Add Divider", icon: "solar:minus-outline" },
];

const slashCommands = {
  image: "image",
  code: "code",
  quote: "quote",
};

const codeLanguages = ["javascript", "python", "java", "cpp", "html", "css", "bash"];
const imageAlignments = ["Left", "Center", "Right", "Full Width"];

const categoryExamples = ["Web Development", "AI", "Data Science", "Cybersecurity", "Programming", "Career Advice"];
const tagExamples = ["react", "nodejs", "python", "docker", "machine-learning", "devops"];

const statusClasses = {
  published: "bg-(--instructor-status-approved) text-(--instructor-status-text)",
  draft: "bg-(--instructor-status-editing) text-(--instructor-status-text)",
  scheduled: "bg-(--instructor-status-review) text-(--instructor-status-text)",
  archived: "bg-(--instructor-status-revision) text-(--instructor-status-text)",
};

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const slugify = (value = "") =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "article";

const normalizeName = (value = "") => String(value || "").trim().toLowerCase();

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read selected image"));
    reader.readAsDataURL(file);
  });

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const defaultEditorBlocks = () => [
  { id: createId(), type: "heading", data: { text: "Future of AI Agents", level: 2 } },
  {
    id: createId(),
    type: "paragraph",
    data: { text: "AI agents are moving from narrow assistants to autonomous digital collaborators." },
  },
  { id: createId(), type: "image", data: { url: "", caption: "", alignment: "Center", width: 100 } },
  {
    id: createId(),
    type: "paragraph",
    data: { text: "They can plan, reason, and execute multi-step tasks with increasing reliability." },
  },
  {
    id: createId(),
    type: "code",
    data: { language: "javascript", code: "const agent = await orchestrator.run(task);" },
  },
  {
    id: createId(),
    type: "paragraph",
    data: { text: "This creates new workflows for engineering, operations, and support teams." },
  },
  {
    id: createId(),
    type: "quote",
    data: { text: "Agents amplify teams when human judgment remains in the loop.", author: "Editorial Team" },
  },
  { id: createId(), type: "heading", data: { text: "Conclusion", level: 3 } },
];

const getBlockText = (block) => {
  if (!block) return "";
  if (block.type === "heading") return block.data?.text || "";
  if (block.type === "paragraph") return block.data?.text || "";
  if (block.type === "quote") return `${block.data?.text || ""} ${block.data?.author || ""}`.trim();
  if (block.type === "code") return block.data?.code || "";
  if (block.type === "list") return (block.data?.items || []).join(" ");
  if (block.type === "table") return (block.data?.rows || []).flat().join(" ");
  if (block.type === "diagram") return block.data?.source || "";
  return "";
};

const estimateReadingTime = (blocks = []) => {
  const words = blocks
    .map((block) => getBlockText(block))
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const normalizeStatus = (article) => {
  const publishedDate = article?.published_at ? new Date(article.published_at) : null;
  const isFuture = Boolean(publishedDate && !Number.isNaN(publishedDate.getTime()) && publishedDate > new Date());
  if (isFuture) return "scheduled";
  return article?.status || "draft";
};

const blockToApi = (block) => {
  if (block.type === "heading") {
    return { type: "header", data: { text: block.data?.text || "", level: Number(block.data?.level || 2) } };
  }

  if (block.type === "paragraph") {
    return { type: "paragraph", data: { text: block.data?.text || "" } };
  }

  if (block.type === "image") {
    return {
      type: "image",
      data: {
        image_url: block.data?.url || "",
        file: { url: block.data?.url || "" },
        caption: block.data?.caption || "",
        alignment: String(block.data?.alignment || "Center").toLowerCase(),
        width: Number(block.data?.width || 100),
      },
    };
  }

  if (block.type === "code") {
    return {
      type: "code",
      data: {
        content: block.data?.code || "",
        code: block.data?.code || "",
        language: block.data?.language || "javascript",
      },
    };
  }

  if (block.type === "quote") {
    return {
      type: "quote",
      data: {
        content: block.data?.text || "",
        text: block.data?.text || "",
        caption: block.data?.author || "",
      },
    };
  }

  if (block.type === "list") {
    return {
      type: "paragraph",
      data: {
        text: (block.data?.items || []).join("\n"),
      },
    };
  }

  if (block.type === "table") {
    return {
      type: "paragraph",
      data: {
        text: (block.data?.rows || []).map((row) => row.join(" | ")).join("\n"),
      },
    };
  }

  if (block.type === "diagram") {
    return {
      type: "paragraph",
      data: {
        text: block.data?.source || "",
      },
    };
  }

  if (block.type === "divider") {
    return {
      type: "paragraph",
      data: { text: "---" },
    };
  }

  return { type: "paragraph", data: { text: "" } };
};

const apiToEditorBlocks = (article) => {
  const blocks = article?.editorData?.blocks || [];
  if (!blocks.length) return defaultEditorBlocks();

  return blocks.map((item) => {
    const type = item?.block_type || item?.type;

    if (type === "header" || type === "heading") {
      return {
        id: item.id || createId(),
        type: "heading",
        data: {
          text: item?.data?.text || item?.data?.content || "",
          level: Number(item?.data?.level || 2),
        },
      };
    }

    if (type === "image") {
      return {
        id: item.id || createId(),
        type: "image",
        data: {
          url: item?.data?.image_url || item?.data?.file?.url || "",
          caption: item?.data?.caption || "",
          alignment: item?.data?.alignment ? item.data.alignment.charAt(0).toUpperCase() + item.data.alignment.slice(1) : "Center",
          width: Number(item?.data?.width || 100),
        },
      };
    }

    if (type === "code") {
      return {
        id: item.id || createId(),
        type: "code",
        data: {
          language: item?.data?.language || "javascript",
          code: item?.data?.code || item?.data?.content || item?.data?.text || "",
        },
      };
    }

    if (type === "quote") {
      return {
        id: item.id || createId(),
        type: "quote",
        data: {
          text: item?.data?.text || item?.data?.content || "",
          author: item?.data?.caption || "",
        },
      };
    }

    return {
      id: item.id || createId(),
      type: "paragraph",
      data: { text: item?.data?.text || item?.data?.content || "" },
    };
  });
};

const BlockShell = ({ title, icon, children, onDelete }) => (
  <article className="rounded-xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 sm:p-4">
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="inline-flex items-center gap-2 rounded-lg border border-(--instructor-shell-border) px-2 py-1 text-xs font-semibold">
        <Icon icon={icon} width={14} />
        {title}
      </div>
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-lg border border-(--instructor-shell-border) px-2 py-1 text-[11px] text-(--text-secondary)"
        >
          <Icon icon="solar:trash-bin-trash-outline" width={13} />
          Delete
        </button>
      ) : null}
    </div>
    {children}
  </article>
);

const renderPreviewContent = (blocks = []) =>
  blocks.map((block) => {
    if (block.type === "heading") {
      if (Number(block.data?.level || 2) >= 3) {
        return (
          <h3 key={block.id} className="mt-5 text-xl font-semibold">
            {block.data?.text}
          </h3>
        );
      }
      return (
        <h2 key={block.id} className="mt-5 text-2xl font-semibold">
          {block.data?.text}
        </h2>
      );
    }

    if (block.type === "paragraph") {
      return (
        <p key={block.id} className="mt-4 whitespace-pre-line text-sm leading-7 text-(--text-main) sm:text-base">
          {block.data?.text}
        </p>
      );
    }

    if (block.type === "image") {
      const alignClass =
        block.data?.alignment === "Left"
          ? "mr-auto"
          : block.data?.alignment === "Right"
            ? "ml-auto"
            : "mx-auto";
      return (
        <figure key={block.id} className="mt-6 space-y-2">
          {block.data?.url ? (
            <img
              src={block.data.url}
              alt={block.data?.caption || "Article visual"}
              className={`${alignClass} rounded-xl object-cover`}
              style={{ width: block.data?.alignment === "Full Width" ? "100%" : `${Math.min(100, Number(block.data?.width || 100))}%` }}
            />
          ) : null}
          {block.data?.caption ? <figcaption className="text-center text-xs text-(--text-secondary)">{block.data.caption}</figcaption> : null}
        </figure>
      );
    }

    if (block.type === "code") {
      const lines = String(block.data?.code || "").split("\n");
      return (
        <div key={block.id} className="mt-6 overflow-hidden rounded-xl border border-(--instructor-shell-border)">
          <div className="flex items-center justify-between bg-(--bg-background) px-3 py-2 text-xs text-(--text-secondary)">
            <span>{block.data?.language || "javascript"}</span>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-0 bg-[#0f172a] text-[#e2e8f0]">
            <pre className="select-none border-r border-[#334155] px-3 py-3 text-right text-xs leading-6 text-[#94a3b8]">
              {lines.map((_, index) => (
                <span key={`${block.id}-ln-${index}`} className="block">{index + 1}</span>
              ))}
            </pre>
            <pre className="overflow-x-auto px-3 py-3 text-xs leading-6 sm:text-sm">
              <code>{block.data?.code || ""}</code>
            </pre>
          </div>
        </div>
      );
    }

    if (block.type === "quote") {
      return (
        <blockquote key={block.id} className="mt-6 rounded-xl border-l-4 border-(--instructor-button-bg) bg-(--bg-background) px-4 py-3">
          <p className="italic leading-7">“{block.data?.text || ""}”</p>
          {block.data?.author ? <footer className="mt-2 text-xs text-(--text-secondary)">— {block.data.author}</footer> : null}
        </blockquote>
      );
    }

    if (block.type === "list") {
      const items = (block.data?.items || []).filter(Boolean);
      return block.data?.ordered ? (
        <ol key={block.id} className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 sm:text-base">
          {items.map((item, index) => (
            <li key={`${block.id}-ol-${index}`}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul key={block.id} className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 sm:text-base">
          {items.map((item, index) => (
            <li key={`${block.id}-ul-${index}`}>{item}</li>
          ))}
        </ul>
      );
    }

    if (block.type === "table") {
      const rows = block.data?.rows || [];
      return (
        <div key={block.id} className="mt-5 overflow-x-auto rounded-xl border border-(--instructor-shell-border)">
          <table className="w-full min-w-[560px] text-left text-sm">
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${block.id}-tr-${rowIndex}`} className="border-b border-(--instructor-shell-border)">
                  {row.map((cell, cellIndex) => (
                    <td key={`${block.id}-td-${rowIndex}-${cellIndex}`} className="px-3 py-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (block.type === "diagram") {
      return (
        <div key={block.id} className="mt-5 rounded-xl border border-dashed border-(--instructor-shell-border) bg-(--bg-background) p-4">
          <p className="mb-2 text-xs font-semibold text-(--text-secondary)">Diagram Source</p>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6 sm:text-sm">{block.data?.source || ""}</pre>
        </div>
      );
    }

    if (block.type === "divider") {
      return <hr key={block.id} className="my-6 border-(--instructor-shell-border)" />;
    }

    return null;
  });

const InstructorArticles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { section = "all" } = useParams();

  const currentUser = useMemo(() => getCurrentUser(), []);
  const currentUserId = currentUser?._id || currentUser?.id || "";

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editorTitle, setEditorTitle] = useState("");
  const [editorSlug, setEditorSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [editorExcerpt, setEditorExcerpt] = useState("");
  const [editorCoverImage, setEditorCoverImage] = useState("");
  const [editorBlocks, setEditorBlocks] = useState(defaultEditorBlocks);
  const [editorSelectedCategories, setEditorSelectedCategories] = useState([]);
  const [editorSelectedTags, setEditorSelectedTags] = useState([]);
  const [editorSeoTitle, setEditorSeoTitle] = useState("");
  const [editorSeoDescription, setEditorSeoDescription] = useState("");
  const [editorSeoKeywords, setEditorSeoKeywords] = useState("");
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [draggingBlockId, setDraggingBlockId] = useState("");

  const [search, setSearch] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingTagId, setEditingTagId] = useState("");
  const [editingTagName, setEditingTagName] = useState("");

  const [mediaItems, setMediaItems] = useState([]);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFolderFilter, setMediaFolderFilter] = useState("all");
  const [previewMediaItem, setPreviewMediaItem] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(false);

  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [previewArticle, setPreviewArticle] = useState(null);

  const coverInputRef = useRef(null);
  const mediaInputRef = useRef(null);

  const activeSection = useMemo(
    () => articleSections.find((item) => item.key === section) || articleSections[0],
    [section],
  );

  const editArticleId = location.state?.articleId || "";
  const hasEditRequest = activeSection.key === "create" && Boolean(editArticleId);

  const refreshTaxonomy = async () => {
    const [categoryRes, tagRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/content/categories`, { withCredentials: true }),
      axios.get(`${API_BASE_URL}/api/content/tags`, { withCredentials: true }),
    ]);
    setCategories(Array.isArray(categoryRes.data?.categories) ? categoryRes.data.categories : []);
    setTags(Array.isArray(tagRes.data?.tags) ? tagRes.data.tags : []);
  };

  const refreshArticles = async () => {
    if (!currentUserId) {
      setArticles([]);
      return;
    }

    const articleRes = await axios.get(`${API_BASE_URL}/api/content/articles`, {
      params: { author_id: currentUserId, status: "all", search: search || undefined },
      withCredentials: true,
    });
    setArticles(Array.isArray(articleRes.data?.articles) ? articleRes.data.articles : []);
  };

  const refreshArticleAnalytics = async () => {
    if (!currentUserId) {
      setAnalyticsData(null);
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/api/content/articles/analytics`, {
      params: { author_id: currentUserId },
      withCredentials: true,
    });
    setAnalyticsData(response.data || null);
  };

  const refreshMediaLibrary = async ({ searchValue = mediaSearch, folderValue = mediaFolderFilter } = {}) => {
    if (!currentUserId) {
      setMediaItems([]);
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/api/content/articles/media`, {
      params: {
        author_id: currentUserId,
        search: searchValue || undefined,
        folder: folderValue || "all",
      },
      withCredentials: true,
    });

    setMediaItems(Array.isArray(response.data?.media) ? response.data.media : []);
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([refreshTaxonomy(), refreshArticles()]);
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError?.response?.data?.error || "Failed to load article resources");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!search.trim()) {
        return;
      }
      try {
        const articleRes = await axios.get(`${API_BASE_URL}/api/content/articles`, {
          params: { author_id: currentUserId, status: "all", search },
          withCredentials: true,
        });
        if (!cancelled) {
          setArticles(Array.isArray(articleRes.data?.articles) ? articleRes.data.articles : []);
        }
      } catch {
        if (!cancelled) {
          setArticles([]);
        }
      }
    };

    const timeout = setTimeout(run, 350);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, currentUserId]);

  useEffect(() => {
    const fromStateArticle = location.state?.articleData;
    if (activeSection.key === "preview" && fromStateArticle) {
      setPreviewArticle(fromStateArticle);
    }
  }, [activeSection.key, location.state]);

  useEffect(() => {
    if (!hasEditRequest) return;

    let cancelled = false;
    const loadEditArticle = async () => {
      setLoading(true);
      setError("");
      try {
        const articleRes = await axios.get(`${API_BASE_URL}/api/content/articles/${editArticleId}`, {
          withCredentials: true,
        });

        if (cancelled) return;

        const article = articleRes.data?.article;
        if (!article) return;

        setEditorTitle(article.title || "");
        setEditorSlug(article.slug || "");
        setEditorExcerpt(article.excerpt || "");
        setEditorCoverImage(article.cover_image || "");
        setEditorSeoTitle(article.seo?.title || "");
        setEditorSeoDescription(article.seo?.description || "");
        setEditorSeoKeywords(article.seo?.keywords || "");
        setEditorSelectedCategories((article.categories || []).map((item) => item._id));
        setEditorSelectedTags((article.tags || []).map((item) => item._id));
        setEditorBlocks(apiToEditorBlocks(article));
        setSlugTouched(Boolean(article.slug));
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError?.response?.data?.error || "Failed to load article for editing");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEditArticle();
    return () => {
      cancelled = true;
    };
  }, [hasEditRequest, editArticleId]);

  useEffect(() => {
    if (mediaItems.length) return;

    const derived = [];
    articles.forEach((article) => {
      if (article.cover_image) {
        derived.push({
          id: `cover-${article._id}`,
          url: article.cover_image,
          name: `${article.title || "article"}-cover`,
          folder: "article images",
          createdAt: article.updatedAt || article.createdAt || new Date().toISOString(),
        });
      }

      (article.editorData?.blocks || []).forEach((block, index) => {
        const imageUrl = block?.data?.image_url || block?.data?.file?.url;
        if (block.type === "image" && imageUrl) {
          derived.push({
            id: `inline-${article._id}-${index}`,
            url: imageUrl,
            name: `${article.title || "article"}-img-${index + 1}`,
            folder: "article images",
            createdAt: article.updatedAt || article.createdAt || new Date().toISOString(),
          });
        }
      });
    });

    if (derived.length) {
      setMediaItems(derived);
    }
  }, [articles, mediaItems.length]);

  useEffect(() => {
    if (activeSection.key !== "analytics") return;

    let cancelled = false;
    const run = async () => {
      setAnalyticsLoading(true);
      try {
        await refreshArticleAnalytics();
      } catch {
        if (!cancelled) {
          setAnalyticsData(null);
        }
      } finally {
        if (!cancelled) {
          setAnalyticsLoading(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [activeSection.key, currentUserId]);

  useEffect(() => {
    if (activeSection.key !== "media") return;

    let cancelled = false;
    const run = async () => {
      setMediaLoading(true);
      try {
        await refreshMediaLibrary({ searchValue: mediaSearch, folderValue: mediaFolderFilter });
      } catch {
        if (!cancelled) {
          setMediaItems([]);
        }
      } finally {
        if (!cancelled) {
          setMediaLoading(false);
        }
      }
    };

    const timeout = setTimeout(run, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [activeSection.key, currentUserId, mediaSearch, mediaFolderFilter]);

  const categoryOptions = useMemo(() => {
    const map = new Map();
    categories.forEach((item) => map.set(String(item._id), item));
    return [...map.values()];
  }, [categories]);

  const tagOptions = useMemo(() => {
    const map = new Map();
    tags.forEach((item) => map.set(String(item._id), item));
    return [...map.values()];
  }, [tags]);

  const mergedCategorySuggestions = useMemo(() => {
    const names = new Set(categoryExamples.map((item) => normalizeName(item)));
    categories.forEach((item) => names.add(normalizeName(item.name)));
    return [...names].filter(Boolean);
  }, [categories]);

  const mergedTagSuggestions = useMemo(() => {
    const names = new Set(tagExamples.map((item) => normalizeName(item)));
    tags.forEach((item) => names.add(normalizeName(item.name)));
    return [...names].filter(Boolean);
  }, [tags]);

  const filteredAllArticles = useMemo(() => {
    const query = normalizeName(search);
    if (!query) return articles;
    return articles.filter((item) => normalizeName(item.title).includes(query));
  }, [articles, search]);

  const draftArticles = useMemo(
    () => filteredAllArticles.filter((item) => normalizeStatus(item) === "draft"),
    [filteredAllArticles],
  );

  const scheduledArticles = useMemo(
    () => filteredAllArticles.filter((item) => normalizeStatus(item) === "scheduled"),
    [filteredAllArticles],
  );

  const analyticsSummary = useMemo(() => {
    const totalViews = filteredAllArticles.reduce((sum, item) => sum + Number(item.views_count || 0), 0);
    const totalLikes = filteredAllArticles.reduce((sum, item) => sum + Number(item.likes_count || 0), 0);
    const totalComments = filteredAllArticles.reduce((sum, item) => sum + Number(item.comments_count || 0), 0);
    const totalShares = filteredAllArticles.reduce((sum, item) => sum + Number(item.shares_count || 0), 0);
    const averageReadTime = filteredAllArticles.length
      ? Math.round(
          filteredAllArticles.reduce((sum, item) => sum + Number(item.reading_time || 3), 0) / filteredAllArticles.length,
        )
      : 0;

    return {
      totalViews,
      averageReadTime,
      totalLikes,
      totalComments,
      totalShares,
    };
  }, [filteredAllArticles]);

  const topArticles = useMemo(
    () => [...filteredAllArticles].sort((a, b) => Number(b.views_count || 0) - Number(a.views_count || 0)).slice(0, 5),
    [filteredAllArticles],
  );

  const taxonomyArticleCount = useMemo(() => {
    const categoryCountMap = new Map();
    const tagCountMap = new Map();

    filteredAllArticles.forEach((article) => {
      (article.categories || []).forEach((item) => {
        const key = String(item._id);
        categoryCountMap.set(key, Number(categoryCountMap.get(key) || 0) + 1);
      });
      (article.tags || []).forEach((item) => {
        const key = String(item._id);
        tagCountMap.set(key, Number(tagCountMap.get(key) || 0) + 1);
      });
    });

    return { categoryCountMap, tagCountMap };
  }, [filteredAllArticles]);

  const previewPayload = useMemo(() => {
    if (previewArticle) {
      return {
        title: previewArticle.title || "Untitled",
        excerpt: previewArticle.excerpt || "",
        authorName: currentUser?.name || currentUser?.displayName || currentUser?.username || "Instructor",
        publishedDate: previewArticle.published_at || previewArticle.createdAt,
        readingTime: Number(previewArticle.reading_time || 3),
        categories: previewArticle.categories || [],
        tags: previewArticle.tags || [],
        blocks: apiToEditorBlocks(previewArticle),
      };
    }

    return {
      title: editorTitle || "Untitled",
      excerpt: editorExcerpt,
      authorName: currentUser?.name || currentUser?.displayName || currentUser?.username || "Instructor",
      publishedDate: scheduleDateTime || new Date().toISOString(),
      readingTime: estimateReadingTime(editorBlocks),
      categories: categoryOptions.filter((item) => editorSelectedCategories.includes(String(item._id))),
      tags: tagOptions.filter((item) => editorSelectedTags.includes(String(item._id))),
      blocks: editorBlocks,
    };
  }, [
    previewArticle,
    editorTitle,
    editorExcerpt,
    currentUser,
    scheduleDateTime,
    editorBlocks,
    categoryOptions,
    editorSelectedCategories,
    tagOptions,
    editorSelectedTags,
  ]);

  const mediaFolders = ["all", "article images", "course diagrams", "infographics", "illustrations"];

  const filteredMediaItems = useMemo(() => {
    const query = normalizeName(mediaSearch);
    return mediaItems.filter((item) => {
      const byFolder = mediaFolderFilter === "all" ? true : normalizeName(item.folder) === normalizeName(mediaFolderFilter);
      const bySearch = query ? normalizeName(item.name).includes(query) : true;
      return byFolder && bySearch;
    });
  }, [mediaItems, mediaSearch, mediaFolderFilter]);

  const toggleSelection = (value, setter) => {
    setter((previous) =>
      previous.includes(String(value))
        ? previous.filter((item) => String(item) !== String(value))
        : [...previous, String(value)],
    );
  };

  const addEditorBlock = (type) => {
    const base = { id: createId(), type, data: {} };

    if (type === "heading") base.data = { text: "", level: 2 };
    if (type === "paragraph") base.data = { text: "" };
    if (type === "image") base.data = { url: "", caption: "", alignment: "Center", width: 100 };
    if (type === "code") base.data = { language: "javascript", code: "" };
    if (type === "quote") base.data = { text: "", author: "" };
    if (type === "list") base.data = { ordered: false, items: [""] };
    if (type === "table") base.data = { rows: [["", ""], ["", ""]] };
    if (type === "diagram") base.data = { source: "graph LR\nA[Start] --> B[Process]\nB --> C[End]" };
    if (type === "divider") base.data = {};

    setEditorBlocks((previous) => [...previous, base]);
  };

  const updateBlockData = (blockId, data) => {
    setEditorBlocks((previous) => previous.map((item) => (item.id === blockId ? { ...item, data } : item)));
  };

  const deleteBlock = (blockId) => {
    setEditorBlocks((previous) => previous.filter((item) => item.id !== blockId));
  };

  const moveBlockToIndex = (sourceBlockId, targetIndex) => {
    setEditorBlocks((previous) => {
      const fromIndex = previous.findIndex((item) => item.id === sourceBlockId);
      if (fromIndex < 0) return previous;

      const boundedTarget = Math.max(0, Math.min(previous.length - 1, targetIndex));
      if (fromIndex === boundedTarget) return previous;

      const next = [...previous];
      const [moved] = next.splice(fromIndex, 1);
      const insertIndex = fromIndex < boundedTarget ? boundedTarget - 1 : boundedTarget;
      next.splice(insertIndex, 0, moved);
      return next;
    });
  };

  const moveBlockToTop = (blockId) => {
    setEditorBlocks((previous) => {
      const fromIndex = previous.findIndex((item) => item.id === blockId);
      if (fromIndex <= 0) return previous;

      const next = [...previous];
      const [moved] = next.splice(fromIndex, 1);
      next.unshift(moved);
      return next;
    });
  };

  const moveBlockToBottom = (blockId) => {
    setEditorBlocks((previous) => {
      const fromIndex = previous.findIndex((item) => item.id === blockId);
      if (fromIndex < 0 || fromIndex === previous.length - 1) return previous;

      const next = [...previous];
      const [moved] = next.splice(fromIndex, 1);
      next.push(moved);
      return next;
    });
  };

  const handleSlashCommand = (event, blockId, value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed.startsWith("/") || event.key !== "Enter") return;
    const command = trimmed.slice(1).toLowerCase();
    const targetType = slashCommands[command];
    if (!targetType) return;

    event.preventDefault();
    updateBlockData(blockId, { text: "" });
    addEditorBlock(targetType);
  };

  const resetEditor = () => {
    setEditorTitle("");
    setEditorSlug("");
    setSlugTouched(false);
    setEditorExcerpt("");
    setEditorCoverImage("");
    setEditorSeoTitle("");
    setEditorSeoDescription("");
    setEditorSeoKeywords("");
    setEditorSelectedCategories([]);
    setEditorSelectedTags([]);
    setEditorBlocks(defaultEditorBlocks());
    setScheduleDateTime("");
    setPreviewMode(false);
  };

  const ensureCategoryIds = async (names = []) => {
    const ids = [];
    for (const name of names) {
      const existing = categories.find((item) => normalizeName(item.name) === normalizeName(name));
      if (existing?._id) {
        ids.push(existing._id);
        continue;
      }

      const created = await axios.post(
        `${API_BASE_URL}/api/content/categories`,
        { name, slug: slugify(name) },
        { withCredentials: true },
      );

      if (created.data?.category?._id) {
        ids.push(created.data.category._id);
        setCategories((previous) => [created.data.category, ...previous]);
      }
    }
    return ids;
  };

  const ensureTagIds = async (names = []) => {
    const ids = [];
    for (const name of names) {
      const existing = tags.find((item) => normalizeName(item.name) === normalizeName(name));
      if (existing?._id) {
        ids.push(existing._id);
        continue;
      }

      const created = await axios.post(
        `${API_BASE_URL}/api/content/tags`,
        { name, slug: slugify(name) },
        { withCredentials: true },
      );

      if (created.data?.tag?._id) {
        ids.push(created.data.tag._id);
        setTags((previous) => [created.data.tag, ...previous]);
      }
    }
    return ids;
  };

  const createOrUpdateArticle = async (mode) => {
    if (!currentUserId) {
      setError("Unable to identify instructor account");
      return;
    }

    if (!editorTitle.trim()) {
      setError("Article title is required");
      return;
    }

    if (!editorBlocks.some((block) => getBlockText(block).trim() || block.type === "divider" || block.type === "image")) {
      setError("Add article content before saving");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const missingCategoryNames = mergedCategorySuggestions.filter(
        (name) => !categories.some((item) => normalizeName(item.name) === normalizeName(name)),
      );
      const missingTagNames = mergedTagSuggestions.filter(
        (name) => !tags.some((item) => normalizeName(item.name) === normalizeName(name)),
      );

      if (missingCategoryNames.length) {
        await ensureCategoryIds(missingCategoryNames.slice(0, 0));
      }
      if (missingTagNames.length) {
        await ensureTagIds(missingTagNames.slice(0, 0));
      }

      const selectedCategoryIds = [...editorSelectedCategories];
      const selectedTagIds = [...editorSelectedTags];

      const status = mode === "schedule" ? "published" : mode;
      const publishDate = mode === "schedule" ? new Date(scheduleDateTime || Date.now() + 60 * 60 * 1000).toISOString() : mode === "published" ? new Date().toISOString() : null;

      const payload = {
        title: editorTitle.trim(),
        slug: editorSlug ? slugify(editorSlug) : slugify(editorTitle),
        author_id: currentUserId,
        excerpt: editorExcerpt || "",
        cover_image: editorCoverImage || "",
        content_type: "blog",
        status,
        published_at: publishDate,
        reading_time: estimateReadingTime(editorBlocks),
        category_ids: selectedCategoryIds,
        tag_ids: selectedTagIds,
        editorData: {
          time: Date.now(),
          version: "2.29.0",
          blocks: editorBlocks.map((block, index) => ({ ...blockToApi(block), id: `${block.id}-${index}` })),
        },
        seo: {
          title: editorSeoTitle || "",
          description: editorSeoDescription || "",
          keywords: editorSeoKeywords || "",
        },
      };

      if (hasEditRequest) {
        await axios.put(`${API_BASE_URL}/api/content/articles/${editArticleId}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/content/articles`, payload, {
          withCredentials: true,
        });
      }

      await refreshArticles();
      setSuccessMessage(
        mode === "draft"
          ? "Draft saved successfully"
          : mode === "schedule"
            ? "Article scheduled successfully"
            : "Article published successfully",
      );

      if (!hasEditRequest) {
        resetEditor();
      }

      navigate(mode === "draft" ? "/instructor/articles/draft" : mode === "schedule" ? "/instructor/articles/scheduled" : "/instructor/articles/all");
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (articleId) => {
    const confirmed = window.confirm("Delete this article? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/content/articles/${articleId}`, {
        withCredentials: true,
      });
      setArticles((previous) => previous.filter((item) => String(item._id) !== String(articleId)));
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to delete article");
    }
  };

  const updateScheduledDate = async (article, value) => {
    if (!value) return;

    try {
      await axios.put(
        `${API_BASE_URL}/api/content/articles/${article._id}`,
        {
          title: article.title,
          slug: article.slug,
          author_id: article.author_id?._id || article.author_id,
          excerpt: article.excerpt || "",
          cover_image: article.cover_image || "",
          content_type: article.content_type || "blog",
          status: "published",
          published_at: new Date(value).toISOString(),
          category_ids: (article.categories || []).map((item) => item._id),
          tag_ids: (article.tags || []).map((item) => item._id),
          editorData: article.editorData || { blocks: [] },
          reading_time: article.reading_time || 0,
        },
        { withCredentials: true },
      );
      await refreshArticles();
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to update schedule");
    }
  };

  const cancelSchedule = async (article) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/content/articles/${article._id}`,
        {
          title: article.title,
          slug: article.slug,
          author_id: article.author_id?._id || article.author_id,
          excerpt: article.excerpt || "",
          cover_image: article.cover_image || "",
          content_type: article.content_type || "blog",
          status: "draft",
          published_at: null,
          category_ids: (article.categories || []).map((item) => item._id),
          tag_ids: (article.tags || []).map((item) => item._id),
          editorData: article.editorData || { blocks: [] },
          reading_time: article.reading_time || 0,
        },
        { withCredentials: true },
      );
      await refreshArticles();
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to cancel schedule");
    }
  };

  const createCategory = async () => {
    const trimmed = categoryInput.trim();
    if (!trimmed) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/content/categories`,
        { name: trimmed, slug: slugify(trimmed) },
        { withCredentials: true },
      );
      if (response.data?.category) {
        setCategories((previous) => [response.data.category, ...previous]);
        setCategoryInput("");
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to create category");
    }
  };

  const updateCategory = async () => {
    if (!editingCategoryId || !editingCategoryName.trim()) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/content/categories/${editingCategoryId}`,
        { name: editingCategoryName.trim(), slug: slugify(editingCategoryName.trim()) },
        { withCredentials: true },
      );
      if (response.data?.category) {
        setCategories((previous) =>
          previous.map((item) =>
            String(item._id) === String(editingCategoryId) ? response.data.category : item,
          ),
        );
      }
      setEditingCategoryId("");
      setEditingCategoryName("");
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to update category");
    }
  };

  const removeCategory = async (categoryId) => {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/content/categories/${categoryId}`, {
        withCredentials: true,
      });
      setCategories((previous) => previous.filter((item) => String(item._id) !== String(categoryId)));
      setEditorSelectedCategories((previous) => previous.filter((item) => String(item) !== String(categoryId)));
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to delete category");
    }
  };

  const createTag = async () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/content/tags`,
        { name: trimmed, slug: slugify(trimmed) },
        { withCredentials: true },
      );
      if (response.data?.tag) {
        setTags((previous) => [response.data.tag, ...previous]);
        setTagInput("");
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to create tag");
    }
  };

  const updateTag = async () => {
    if (!editingTagId || !editingTagName.trim()) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/content/tags/${editingTagId}`,
        { name: editingTagName.trim(), slug: slugify(editingTagName.trim()) },
        { withCredentials: true },
      );
      if (response.data?.tag) {
        setTags((previous) =>
          previous.map((item) => (String(item._id) === String(editingTagId) ? response.data.tag : item)),
        );
      }
      setEditingTagId("");
      setEditingTagName("");
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to update tag");
    }
  };

  const removeTag = async (tagId) => {
    const confirmed = window.confirm("Delete this tag?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/content/tags/${tagId}`, {
        withCredentials: true,
      });
      setTags((previous) => previous.filter((item) => String(item._id) !== String(tagId)));
      setEditorSelectedTags((previous) => previous.filter((item) => String(item) !== String(tagId)));
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to delete tag");
    }
  };

  const uploadCoverImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file");
      event.target.value = "";
      return;
    }

    try {
      setSaving(true);
      setError("");
      const image = await toDataUrl(file);
      const uploadRes = await axios.post(
        `${API_BASE_URL}/api/course/uploads/thumbnail`,
        { image, folder: "articles" },
        { withCredentials: true },
      );
      if (uploadRes.data?.url) {
        setEditorCoverImage(uploadRes.data.url);
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to upload cover image");
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  const uploadInlineImageToBlock = async (file, blockId) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file");
      return;
    }

    try {
      setSaving(true);
      const image = await toDataUrl(file);
      const uploadRes = await axios.post(
        `${API_BASE_URL}/api/course/uploads/thumbnail`,
        { image, folder: "articles" },
        { withCredentials: true },
      );

      if (uploadRes.data?.url) {
        const current = editorBlocks.find((item) => item.id === blockId);
        if (current) {
          updateBlockData(blockId, { ...current.data, url: uploadRes.data.url });
        }
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const uploadMedia = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file");
      event.target.value = "";
      return;
    }

    try {
      setSaving(true);
      const image = await toDataUrl(file);
      const uploadRes = await axios.post(
        `${API_BASE_URL}/api/course/uploads/thumbnail`,
        { image, folder: "articles/media" },
        { withCredentials: true },
      );

      const url = uploadRes.data?.url;
      if (url) {
        setMediaItems((previous) => [
          {
            id: createId(),
            url,
            name: file.name.replace(/\.[^.]+$/, ""),
            folder: "article images",
            createdAt: new Date().toISOString(),
          },
          ...previous,
        ]);

        if (activeSection.key === "media") {
          await refreshMediaLibrary({ searchValue: mediaSearch, folderValue: mediaFolderFilter });
        }
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to upload media");
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  const deleteMedia = (mediaId) => {
    setMediaItems((previous) => previous.filter((item) => item.id !== mediaId));
    if (previewMediaItem?.id === mediaId) {
      setPreviewMediaItem(null);
    }
  };

  const renderBlockWithControls = (block, blockIndex, content) => (
    <div
      key={block.id}
      draggable
      onDragStart={() => setDraggingBlockId(block.id)}
      onDragEnd={() => setDraggingBlockId("")}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => {
        if (!draggingBlockId || draggingBlockId === block.id) return;
        moveBlockToIndex(draggingBlockId, blockIndex);
        setDraggingBlockId("");
      }}
      className={`rounded-2xl border p-1 transition-colors ${
        draggingBlockId === block.id
          ? "border-(--instructor-highlight-border) bg-(--dash-soft-surface)"
          : "border-transparent"
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-(--text-secondary)">
          <Icon icon="solar:sort-vertical-outline" width={14} />
          Drag to reorder · Block {blockIndex + 1}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={blockIndex === 0}
            onClick={() => moveBlockToTop(block.id)}
            className="rounded-md border border-(--instructor-shell-border) px-2 py-1 text-[11px] disabled:opacity-50"
          >
            Top
          </button>
          <button
            type="button"
            disabled={blockIndex === editorBlocks.length - 1}
            onClick={() => moveBlockToBottom(block.id)}
            className="rounded-md border border-(--instructor-shell-border) px-2 py-1 text-[11px] disabled:opacity-50"
          >
            Bottom
          </button>
        </div>
      </div>
      {content}
    </div>
  );

  const renderEditorBlock = (block, blockIndex) => {
    if (block.type === "heading") {
      return renderBlockWithControls(block, blockIndex, (
        <BlockShell
          title="HeadingBlock"
          icon="solar:text-bold-outline"
          onDelete={editorBlocks.length > 1 ? () => deleteBlock(block.id) : null}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
            <select
              value={String(block.data?.level || 2)}
              onChange={(event) => updateBlockData(block.id, { ...block.data, level: Number(event.target.value) })}
              className="h-10 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-2 text-sm outline-none"
            >
              <option value="1">H1</option>
              <option value="2">H2</option>
              <option value="3">H3</option>
            </select>
            <input
              value={block.data?.text || ""}
              onChange={(event) => updateBlockData(block.id, { ...block.data, text: event.target.value })}
              onKeyDown={(event) => handleSlashCommand(event, block.id, block.data?.text || "")}
              className="h-10 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
              placeholder="Type heading..."
            />
          </div>
        </BlockShell>
      ));
    }

    if (block.type === "paragraph") {
      return renderBlockWithControls(block, blockIndex, (
        <BlockShell
          title="ParagraphBlock"
          icon="solar:text-field-focus-outline"
          onDelete={editorBlocks.length > 1 ? () => deleteBlock(block.id) : null}
        >
          <textarea
            value={block.data?.text || ""}
            onChange={(event) => updateBlockData(block.id, { ...block.data, text: event.target.value })}
            onKeyDown={(event) => handleSlashCommand(event, block.id, block.data?.text || "")}
            className="h-28 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none"
            placeholder="Write paragraph... use /image, /code, /quote"
          />
        </BlockShell>
      ));
    }

    if (block.type === "image") {
      const imageUploadInputId = `image-upload-${block.id}`;
      return renderBlockWithControls(block, blockIndex, (
        <BlockShell
          title="ImageBlock"
          icon="solar:gallery-outline"
          onDelete={editorBlocks.length > 1 ? () => deleteBlock(block.id) : null}
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor={imageUploadInputId}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs font-semibold"
              >
                <Icon icon="solar:upload-outline" width={14} />
                ImageUpload
              </label>
              <input
                id={imageUploadInputId}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) uploadInlineImageToBlock(file, block.id);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => deleteBlock(block.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs font-semibold"
              >
                <Icon icon="solar:trash-bin-trash-outline" width={14} />
                DeleteButton
              </button>
            </div>

            {block.data?.url ? (
              <img
                src={block.data.url}
                alt="Inline"
                className="rounded-xl object-cover"
                style={{ width: block.data?.alignment === "Full Width" ? "100%" : `${Math.min(100, Number(block.data?.width || 100))}%` }}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-(--instructor-shell-border) bg-(--bg-background) p-4 text-xs text-(--text-secondary)">
                No image selected
              </div>
            )}

            <input
              value={block.data?.caption || ""}
              onChange={(event) => updateBlockData(block.id, { ...block.data, caption: event.target.value })}
              className="h-10 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
              placeholder="CaptionInput"
            />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_150px]">
              <select
                value={block.data?.alignment || "Center"}
                onChange={(event) => updateBlockData(block.id, { ...block.data, alignment: event.target.value })}
                className="h-10 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-2.5 text-sm outline-none"
              >
                {imageAlignments.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <input
                type="number"
                min="25"
                max="100"
                value={Number(block.data?.width || 100)}
                onChange={(event) => updateBlockData(block.id, { ...block.data, width: Number(event.target.value || 100) })}
                className="h-10 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-2.5 text-sm outline-none"
                placeholder="ResizeControl"
              />
            </div>
          </div>
        </BlockShell>
      ));
    }

    if (block.type === "code") {
      const lines = String(block.data?.code || "").split("\n");
      return renderBlockWithControls(block, blockIndex, (
        <BlockShell
          title="CodeBlock"
          icon="solar:code-square-outline"
          onDelete={editorBlocks.length > 1 ? () => deleteBlock(block.id) : null}
        >
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <select
                value={block.data?.language || "javascript"}
                onChange={(event) => updateBlockData(block.id, { ...block.data, language: event.target.value })}
                className="h-9 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-2.5 text-xs outline-none"
              >
                {codeLanguages.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(block.data?.code || "")}
                className="inline-flex items-center gap-1 rounded-lg border border-(--instructor-shell-border) px-2.5 py-1.5 text-xs"
              >
                <Icon icon="solar:copy-outline" width={13} />
                CopyButton
              </button>
            </div>

            <div className="grid grid-cols-[auto_1fr] overflow-hidden rounded-xl border border-(--instructor-shell-border)">
              <pre className="select-none border-r border-(--instructor-shell-border) bg-(--bg-background) px-2.5 py-2 text-right text-[11px] leading-6 text-(--text-secondary)">
                {lines.map((_, index) => (
                  <span key={`${block.id}-line-${index}`} className="block">{index + 1}</span>
                ))}
              </pre>
              <textarea
                value={block.data?.code || ""}
                onChange={(event) => updateBlockData(block.id, { ...block.data, code: event.target.value })}
                className="h-44 w-full resize-y bg-[#0f172a] px-3 py-2 font-mono text-xs leading-6 text-[#e2e8f0] outline-none"
                placeholder="CodeEditor"
              />
            </div>
          </div>
        </BlockShell>
      ));
    }

    if (block.type === "quote") {
      return renderBlockWithControls(block, blockIndex, (
        <BlockShell
          title="QuoteBlock"
          icon="solar:quote-up-outline"
          onDelete={editorBlocks.length > 1 ? () => deleteBlock(block.id) : null}
        >
          <div className="space-y-2">
            <textarea
              value={block.data?.text || ""}
              onChange={(event) => updateBlockData(block.id, { ...block.data, text: event.target.value })}
              className="h-24 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none"
              placeholder="Quote text"
            />
            <input
              value={block.data?.author || ""}
              onChange={(event) => updateBlockData(block.id, { ...block.data, author: event.target.value })}
              className="h-10 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
              placeholder="Author"
            />
          </div>
        </BlockShell>
      ));
    }

    if (block.type === "list") {
      return renderBlockWithControls(block, blockIndex, (
        <BlockShell
          title="ListBlock"
          icon="solar:list-check-outline"
          onDelete={editorBlocks.length > 1 ? () => deleteBlock(block.id) : null}
        >
          <div className="space-y-2.5">
            <select
              value={block.data?.ordered ? "ordered" : "unordered"}
              onChange={(event) => updateBlockData(block.id, { ...block.data, ordered: event.target.value === "ordered" })}
              className="h-10 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-2.5 text-sm outline-none"
            >
              <option value="unordered">Bulleted List</option>
              <option value="ordered">Numbered List</option>
            </select>
            <textarea
              value={(block.data?.items || []).join("\n")}
              onChange={(event) => updateBlockData(block.id, { ...block.data, items: event.target.value.split("\n") })}
              className="h-24 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none"
              placeholder="One list item per line"
            />
          </div>
        </BlockShell>
      ));
    }

    if (block.type === "table") {
      const rows = block.data?.rows || [];
      return renderBlockWithControls(block, blockIndex, (
        <BlockShell
          title="TableBlock"
          icon="solar:rows-group-rounded-outline"
          onDelete={editorBlocks.length > 1 ? () => deleteBlock(block.id) : null}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateBlockData(block.id, { ...block.data, rows: [...rows, new Array(rows[0]?.length || 2).fill("")] })}
                className="rounded-lg border border-(--instructor-shell-border) px-2.5 py-1.5 text-xs"
              >
                Add Row
              </button>
              <button
                type="button"
                onClick={() =>
                  updateBlockData(block.id, {
                    ...block.data,
                    rows: rows.map((row) => [...row, ""]),
                  })
                }
                className="rounded-lg border border-(--instructor-shell-border) px-2.5 py-1.5 text-xs"
              >
                Add Column
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-(--instructor-shell-border)">
              <table className="w-full min-w-[520px] text-sm">
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={`${block.id}-row-${rowIndex}`} className="border-b border-(--instructor-shell-border)">
                      {row.map((cell, cellIndex) => (
                        <td key={`${block.id}-cell-${rowIndex}-${cellIndex}`} className="p-1.5">
                          <input
                            value={cell}
                            onChange={(event) => {
                              const updated = rows.map((rowItem) => [...rowItem]);
                              updated[rowIndex][cellIndex] = event.target.value;
                              updateBlockData(block.id, { ...block.data, rows: updated });
                            }}
                            className="h-8 w-full rounded-md border border-(--instructor-shell-border) bg-(--bg-background) px-2 text-xs outline-none"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </BlockShell>
      ));
    }

    if (block.type === "diagram") {
      return renderBlockWithControls(block, blockIndex, (
        <BlockShell
          title="DiagramBlock"
          icon="solar:square-bottom-up-outline"
          onDelete={editorBlocks.length > 1 ? () => deleteBlock(block.id) : null}
        >
          <textarea
            value={block.data?.source || ""}
            onChange={(event) => updateBlockData(block.id, { ...block.data, source: event.target.value })}
            className="h-28 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 font-mono text-xs outline-none"
            placeholder="Diagram source (Mermaid-style or pseudo syntax)"
          />
        </BlockShell>
      ));
    }

    if (block.type === "divider") {
      return renderBlockWithControls(block, blockIndex, (
        <BlockShell
          title="DividerBlock"
          icon="solar:minus-outline"
          onDelete={editorBlocks.length > 1 ? () => deleteBlock(block.id) : null}
        >
          <hr className="border-(--instructor-shell-border)" />
        </BlockShell>
      ));
    }

    return null;
  };

  const renderArticleEditorPage = () => (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[220px_1fr_320px]">
      <aside className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 sm:p-4">
        <h2 className="mb-3 text-sm font-semibold">LeftToolbar</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {editorTools.map((tool) => (
            <button
              key={tool.key}
              type="button"
              onClick={() => addEditorBlock(tool.key)}
              className="inline-flex items-center justify-between gap-2 rounded-xl border border-(--instructor-shell-border) px-3 py-2 text-xs font-semibold transition-colors hover:bg-(--dash-soft-surface)"
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon icon={tool.icon} width={14} />
                {tool.label}
              </span>
              <Icon icon="solar:add-circle-outline" width={14} className="text-(--text-secondary)" />
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-(--instructor-shell-border) bg-(--bg-background) p-3">
          <p className="text-[11px] text-(--text-secondary)">Slash commands:</p>
          <p className="mt-1 text-xs font-semibold">/image · /code · /quote</p>
        </div>
      </aside>

      <main className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 sm:p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold sm:text-base">MainEditor</h2>
            <p className="text-xs text-(--text-secondary)">ArticleContent → HeadingBlock, ParagraphBlock, ImageBlock, CodeBlock, QuoteBlock, ListBlock, TableBlock</p>
          </div>
          <button
            type="button"
            onClick={() => setPreviewMode((previous) => !previous)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs font-semibold"
          >
            <Icon icon="solar:eye-outline" width={14} />
            PreviewToggle
          </button>
        </div>

        <div className="mb-3 space-y-2">
          <input
            value={editorTitle}
            onChange={(event) => {
              const value = event.target.value;
              setEditorTitle(value);
              if (!slugTouched) {
                setEditorSlug(slugify(value));
              }
            }}
            className="h-11 w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
            placeholder="Article title"
          />
          <input
            value={editorSlug}
            onChange={(event) => {
              setSlugTouched(true);
              setEditorSlug(slugify(event.target.value));
            }}
            className="h-10 w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
            placeholder="article-slug"
          />
          <textarea
            value={editorExcerpt}
            onChange={(event) => setEditorExcerpt(event.target.value)}
            className="h-20 w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none"
            placeholder="Short excerpt"
          />
        </div>

        {previewMode ? (
          <div className="rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) p-4">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            <p className="mt-1 text-xs text-(--text-secondary)">{editorExcerpt}</p>
            <div className="mt-2">{renderPreviewContent(editorBlocks)}</div>
          </div>
        ) : (
          <div className="space-y-3">{editorBlocks.map((block, blockIndex) => renderEditorBlock(block, blockIndex))}</div>
        )}
      </main>

      <aside className="space-y-4">
        <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 sm:p-4">
          <h3 className="mb-2 text-sm font-semibold">RightSidebar</h3>
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs font-semibold"
            >
              <Icon icon="solar:upload-outline" width={14} />
              Upload Cover
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={uploadCoverImage} className="hidden" />
            {editorCoverImage ? <img src={editorCoverImage} alt="Cover" className="h-36 w-full rounded-xl object-cover" /> : null}

            <div>
              <p className="mb-1 text-xs text-(--text-secondary)">Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {categoryOptions.map((item) => {
                  const selected = editorSelectedCategories.includes(String(item._id));
                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => toggleSelection(item._id, setEditorSelectedCategories)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        selected
                          ? "bg-(--instructor-button-bg) text-(--instructor-button-text)"
                          : "border border-(--instructor-shell-border) text-(--text-secondary)"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs text-(--text-secondary)">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {tagOptions.map((item) => {
                  const selected = editorSelectedTags.includes(String(item._id));
                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => toggleSelection(item._id, setEditorSelectedTags)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        selected
                          ? "bg-(--instructor-button-bg) text-(--instructor-button-text)"
                          : "border border-(--instructor-shell-border) text-(--text-secondary)"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              value={editorSeoTitle}
              onChange={(event) => setEditorSeoTitle(event.target.value)}
              className="h-10 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
              placeholder="SEO title"
            />
            <textarea
              value={editorSeoDescription}
              onChange={(event) => setEditorSeoDescription(event.target.value)}
              className="h-16 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none"
              placeholder="SEO description"
            />
            <input
              value={editorSeoKeywords}
              onChange={(event) => setEditorSeoKeywords(event.target.value)}
              className="h-10 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
              placeholder="SEO keywords"
            />

            <input
              type="datetime-local"
              value={scheduleDateTime}
              onChange={(event) => setScheduleDateTime(event.target.value)}
              className="h-10 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
            />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => createOrUpdateArticle("draft")}
                disabled={saving}
                className="rounded-lg border border-(--instructor-shell-border) px-2.5 py-2 text-xs font-semibold disabled:opacity-60"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => createOrUpdateArticle("schedule")}
                disabled={saving}
                className="rounded-lg border border-(--instructor-shell-border) px-2.5 py-2 text-xs font-semibold disabled:opacity-60"
              >
                Schedule
              </button>
              <button
                type="button"
                onClick={() => createOrUpdateArticle("published")}
                disabled={saving}
                className="rounded-lg bg-(--instructor-button-bg) px-2.5 py-2 text-xs font-semibold text-(--instructor-button-text) disabled:opacity-60"
              >
                Publish
              </button>
            </div>
          </div>
        </article>
      </aside>
    </section>
  );

  const renderPreviewPage = () => (
    <section className="space-y-4">
      <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-6">
        <header className="border-b border-(--instructor-shell-border) pb-4">
          <h1 className="text-2xl font-semibold sm:text-3xl">{previewPayload.title}</h1>
          {previewPayload.excerpt ? <p className="mt-2 text-sm text-(--text-secondary)">{previewPayload.excerpt}</p> : null}

          <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-(--text-secondary) sm:grid-cols-3">
            <p className="inline-flex items-center gap-1.5"><Icon icon="solar:user-outline" width={14} /> AuthorInfo: {previewPayload.authorName}</p>
            <p className="inline-flex items-center gap-1.5"><Icon icon="solar:calendar-outline" width={14} /> PublishDate: {formatDate(previewPayload.publishedDate)}</p>
            <p className="inline-flex items-center gap-1.5"><Icon icon="solar:clock-circle-outline" width={14} /> ReadingTime: {previewPayload.readingTime} min</p>
          </div>
        </header>

        <div className="mt-5">{renderPreviewContent(previewPayload.blocks)}</div>
      </article>

      <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <h3 className="text-sm font-semibold">Tags</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {(previewPayload.tags || []).map((item) => (
            <span key={item._id} className="rounded-full border border-(--instructor-shell-border) px-3 py-1 text-xs">#{item.name}</span>
          ))}
          {!previewPayload.tags?.length ? <span className="text-xs text-(--text-secondary)">No tags selected</span> : null}
        </div>
      </article>

      <article className="grid grid-cols-1 gap-4 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">ShareButtons</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Copy Link", "X", "LinkedIn", "Facebook"].map((item) => (
              <button key={item} className="rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs">{item}</button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">CommentsSection</h3>
          <p className="mt-2 text-xs text-(--text-secondary)">Comments will appear here in the public article view.</p>
          <div className="mt-2 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) p-3 text-xs text-(--text-secondary)">
            Be the first to comment on this article.
          </div>
        </div>
      </article>
    </section>
  );

  const renderDraftPage = () => (
    <section className="space-y-3">
      {!draftArticles.length ? (
        <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 text-sm text-(--text-secondary)">
          No draft articles yet.
        </article>
      ) : null}

      {draftArticles.map((item) => (
        <article key={item._id} className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-base font-semibold">{item.title || "Untitled"}</p>
              <p className="text-xs text-(--text-secondary)">LastEditedDate: {formatDate(item.updatedAt || item.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/instructor/articles/create", { state: { articleId: item._id } })}
                className="rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs"
              >
                ContinueEditingButton
              </button>
              <button
                onClick={() => deleteArticle(item._id)}
                className="rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs"
              >
                DeleteDraft
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );

  const renderScheduledPage = () => (
    <section className="space-y-3">
      {!scheduledArticles.length ? (
        <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 text-sm text-(--text-secondary)">
          No scheduled articles yet.
        </article>
      ) : null}

      {scheduledArticles.map((item) => (
        <article key={item._id} className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-base font-semibold">{item.title || "Untitled"}</p>
              <p className="text-xs text-(--text-secondary)">PublishDate: {formatDate(item.published_at)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="datetime-local"
                defaultValue={item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : ""}
                onBlur={(event) => updateScheduledDate(item, event.target.value)}
                className="h-10 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-2 text-xs outline-none"
              />
              <button
                onClick={() => cancelSchedule(item)}
                className="rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs"
              >
                CancelSchedule
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );

  const renderCategoriesPage = () => (
    <section className="space-y-4">
      <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <h3 className="mb-3 text-sm font-semibold">CreateCategoryForm</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
          <input
            value={categoryInput}
            onChange={(event) => setCategoryInput(event.target.value)}
            className="h-10 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
            placeholder="New category name"
          />
          <button onClick={createCategory} className="rounded-lg bg-(--instructor-button-bg) px-3 py-2 text-xs font-semibold text-(--instructor-button-text)">
            Create
          </button>
        </div>
      </article>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {categoryOptions.map((item) => {
          const isEditing = String(editingCategoryId) === String(item._id);
          return (
            <article key={item._id} className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
              {isEditing ? (
                <input
                  value={editingCategoryName}
                  onChange={(event) => setEditingCategoryName(event.target.value)}
                  className="h-10 w-full rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
                />
              ) : (
                <p className="text-base font-semibold">{item.name}</p>
              )}

              <p className="mt-1 text-xs text-(--text-secondary)">ArticleCount: {taxonomyArticleCount.categoryCountMap.get(String(item._id)) || 0}</p>

              <div className="mt-3 flex items-center gap-2">
                {isEditing ? (
                  <button onClick={updateCategory} className="rounded-lg border border-(--instructor-shell-border) px-3 py-1.5 text-xs">Save</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingCategoryId(String(item._id));
                      setEditingCategoryName(item.name || "");
                    }}
                    className="rounded-lg border border-(--instructor-shell-border) px-3 py-1.5 text-xs"
                  >
                    EditButton
                  </button>
                )}
                <button
                  onClick={() => removeCategory(item._id)}
                  className="rounded-lg border border-(--instructor-shell-border) px-3 py-1.5 text-xs"
                >
                  DeleteButton
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </section>
  );

  const renderTagsPage = () => (
    <section className="space-y-4">
      <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <h3 className="mb-3 text-sm font-semibold">CreateTagInput</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
          <input
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            className="h-10 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
            placeholder="New tag"
          />
          <button onClick={createTag} className="rounded-lg bg-(--instructor-button-bg) px-3 py-2 text-xs font-semibold text-(--instructor-button-text)">
            Create
          </button>
        </div>
      </article>

      <section className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <h3 className="mb-3 text-sm font-semibold">TagList</h3>
        <div className="space-y-2">
          {tagOptions.map((item) => {
            const isEditing = String(editingTagId) === String(item._id);
            return (
              <div
                key={item._id}
                className="flex flex-col gap-2 rounded-xl border border-(--instructor-shell-border) p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  {isEditing ? (
                    <input
                      value={editingTagName}
                      onChange={(event) => setEditingTagName(event.target.value)}
                      className="h-9 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
                    />
                  ) : (
                    <p className="font-medium">#{item.name}</p>
                  )}
                  <p className="text-xs text-(--text-secondary)">ArticleCount: {taxonomyArticleCount.tagCountMap.get(String(item._id)) || 0}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button onClick={updateTag} className="rounded-lg border border-(--instructor-shell-border) px-3 py-1.5 text-xs">Save</button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingTagId(String(item._id));
                        setEditingTagName(item.name || "");
                      }}
                      className="rounded-lg border border-(--instructor-shell-border) px-3 py-1.5 text-xs"
                    >
                      EditTag
                    </button>
                  )}
                  <button onClick={() => removeTag(item._id)} className="rounded-lg border border-(--instructor-shell-border) px-3 py-1.5 text-xs">
                    DeleteTag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );

  const renderAnalyticsPage = () => {
    const metrics = analyticsData?.metrics
      ? {
          totalViews: Number(analyticsData.metrics.totalViews || 0),
          averageReadTime: Number(analyticsData.metrics.averageReadTime || 0),
          totalLikes: Number(analyticsData.metrics.likes || 0),
          totalComments: Number(analyticsData.metrics.comments || 0),
          totalShares: Number(analyticsData.metrics.shares || 0),
        }
      : analyticsSummary;

    const analyticsTopArticles = Array.isArray(analyticsData?.topArticles) && analyticsData.topArticles.length
      ? analyticsData.topArticles.slice(0, 5)
      : topArticles;

    const viewsBaseline = Math.max(1, ...analyticsTopArticles.map((item) => Number(item.views_count || 0)));
    const engagementBaseline = Math.max(
      1,
      ...analyticsTopArticles.map((item) => Number(item.likes_count || 0) + Number(item.comments_count || 0)),
    );

    const trafficSources = Array.isArray(analyticsData?.trafficSources) && analyticsData.trafficSources.length
      ? analyticsData.trafficSources
      : [
          { label: "Search", value: 46 },
          { label: "Direct", value: 22 },
          { label: "Social", value: 18 },
          { label: "Referrals", value: 14 },
        ];

    const readerLocations = Array.isArray(analyticsData?.readerLocations) && analyticsData.readerLocations.length
      ? analyticsData.readerLocations
      : [
          { country: "India", share: 31 },
          { country: "USA", share: 24 },
          { country: "UK", share: 13 },
          { country: "Germany", share: 10 },
          { country: "Other", share: 22 },
        ];

    return (
      <section className="space-y-4">
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Total Views", value: metrics.totalViews },
            { label: "Average Read Time", value: `${metrics.averageReadTime} min` },
            { label: "Likes", value: metrics.totalLikes },
            { label: "Comments", value: metrics.totalComments },
            { label: "Shares", value: metrics.totalShares },
          ].map((metric) => (
            <article key={metric.label} className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
              <p className="text-xs text-(--text-secondary)">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
            </article>
          ))}
        </section>

        {analyticsLoading ? (
          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 text-sm text-(--text-secondary)">
            Loading analytics...
          </article>
        ) : null}

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
            <h3 className="mb-3 text-sm font-semibold">ViewsChart</h3>
            <div className="space-y-2.5">
              {analyticsTopArticles.map((item) => (
                <div key={item._id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate pr-3">{item.title}</span>
                    <span>{Number(item.views_count || 0)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-(--dash-soft-surface)">
                    <div
                      className="h-2 rounded-full bg-(--instructor-button-bg)"
                      style={{ width: `${Math.max(6, (Number(item.views_count || 0) / viewsBaseline) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
            <h3 className="mb-3 text-sm font-semibold">EngagementChart</h3>
            <div className="space-y-2.5">
              {analyticsTopArticles.map((item) => {
                const engagement = Number(item.likes_count || 0) + Number(item.comments_count || 0);
                return (
                  <div key={`${item._id}-eng`}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="truncate pr-3">{item.title}</span>
                      <span>{engagement}</span>
                    </div>
                    <div className="h-2 rounded-full bg-(--dash-soft-surface)">
                      <div
                        className="h-2 rounded-full bg-(--dash-tag-panel-bg)"
                        style={{ width: `${Math.max(6, (engagement / engagementBaseline) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 xl:col-span-1">
            <h3 className="mb-3 text-sm font-semibold">TopArticles</h3>
            <div className="space-y-2">
              {analyticsTopArticles.map((item, index) => (
                <div key={`${item._id}-top`} className="flex items-center justify-between rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs">
                  <span>{index + 1}. {item.title || "Untitled"}</span>
                  <span>{Number(item.views_count || 0)} views</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 xl:col-span-1">
            <h3 className="mb-3 text-sm font-semibold">TrafficSources</h3>
            <div className="space-y-2">
              {trafficSources.map((source) => (
                <div key={source.label} className="rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs">
                  <div className="mb-1 flex items-center justify-between">
                    <span>{source.label}</span>
                    <span>{source.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-(--dash-soft-surface)">
                    <div className="h-2 rounded-full bg-(--dash-accent-circle-bg)" style={{ width: `${source.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 xl:col-span-1">
            <h3 className="mb-3 text-sm font-semibold">ReaderLocations</h3>
            <div className="space-y-2">
              {readerLocations.map((locationItem) => (
                <div key={locationItem.country} className="flex items-center justify-between rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs">
                  <span>{locationItem.country}</span>
                  <span>{locationItem.share}%</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    );
  };

  const renderMediaLibraryPage = () => (
    <section className="space-y-4">
      <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <button
            type="button"
            onClick={() => mediaInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs font-semibold"
          >
            <Icon icon="solar:upload-outline" width={14} />
            UploadImage
          </button>
          <input ref={mediaInputRef} type="file" accept="image/*" onChange={uploadMedia} className="hidden" />

          <input
            value={mediaSearch}
            onChange={(event) => setMediaSearch(event.target.value)}
            className="h-10 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-3 text-sm outline-none"
            placeholder="SearchBar"
          />

          <select
            value={mediaFolderFilter}
            onChange={(event) => setMediaFolderFilter(event.target.value)}
            className="h-10 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-2.5 text-sm outline-none"
          >
            {mediaFolders.map((folder) => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>
        </div>
      </article>

      <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <h3 className="mb-3 text-sm font-semibold">ImageGrid</h3>
        {mediaLoading ? <p className="mb-2 text-xs text-(--text-secondary)">Loading media...</p> : null}
        {!filteredMediaItems.length ? (
          <p className="text-xs text-(--text-secondary)">No media found.</p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {filteredMediaItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-(--instructor-shell-border)">
              <button type="button" onClick={() => setPreviewMediaItem(item)} className="w-full">
                <img src={item.url} alt={item.name} className="h-28 w-full object-cover" />
              </button>
              <div className="p-2">
                <p className="truncate text-[11px] font-semibold">{item.name}</p>
                <p className="text-[10px] text-(--text-secondary)">{item.folder}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteMedia(item.id)}
                className="absolute right-2 top-2 hidden rounded-full border border-(--instructor-shell-border) bg-(--bg-secondary) p-1 text-(--text-secondary) group-hover:block"
              >
                <Icon icon="solar:trash-bin-trash-outline" width={12} />
              </button>
            </div>
          ))}
        </div>
      </article>

      {previewMediaItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">PreviewModal</h3>
              <button onClick={() => setPreviewMediaItem(null)} className="rounded-lg border border-(--instructor-shell-border) px-2 py-1 text-xs">Close</button>
            </div>
            <img src={previewMediaItem.url} alt={previewMediaItem.name} className="max-h-[70vh] w-full rounded-xl object-contain" />
          </div>
        </div>
      ) : null}
    </section>
  );

  const renderAllArticlesPage = () => (
    <section className="space-y-4">
      <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Articles", value: filteredAllArticles.length, icon: "solar:document-text-outline" },
            { label: "Draft", value: draftArticles.length, icon: "solar:file-text-outline" },
            { label: "Scheduled", value: scheduledArticles.length, icon: "solar:calendar-outline" },
            { label: "Views", value: analyticsSummary.totalViews, icon: "solar:eye-outline" },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) p-3">
              <div className="flex items-center justify-between gap-2 text-xs text-(--text-secondary)">
                <span>{card.label}</span>
                <Icon icon={card.icon} width={15} />
              </div>
              <p className="mt-1.5 text-xl font-semibold">{card.value}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        {!filteredAllArticles.length ? (
          <p className="text-sm text-(--text-secondary)">No articles found.</p>
        ) : null}

        <div className="space-y-2.5">
          {filteredAllArticles.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-3 rounded-xl border border-(--instructor-shell-border) p-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{item.title || "Untitled"}</p>
                <p className="mt-1 text-xs text-(--text-secondary)">
                  {formatDate(item.published_at || item.createdAt)} · {Number(item.views_count || 0)} views
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClasses[normalizeStatus(item)] || statusClasses.draft}`}>
                    {normalizeStatus(item)}
                  </span>
                  {(item.categories || []).slice(0, 2).map((category) => (
                    <span key={category._id} className="rounded-full border border-(--instructor-shell-border) px-2 py-0.5 text-[10px]">{category.name}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => navigate("/instructor/articles/create", { state: { articleId: item._id } })}
                  className="rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setPreviewArticle(item);
                    navigate("/instructor/articles/preview", { state: { articleData: item } });
                  }}
                  className="rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs"
                >
                  Preview
                </button>
                <button onClick={() => deleteArticle(item._id)} className="rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );

  return (
    <InstructorLayout
      pageTitle={activeSection.key === "create" ? "Article Editor" : activeSection.label}
      pageDescription={sectionDescriptions[activeSection.key]}
    >
      <section className="mb-4 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          {articleSections.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(`/instructor/articles/${item.key}`)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                activeSection.key === item.key
                  ? "bg-(--instructor-button-bg) text-(--instructor-button-text)"
                  : "border border-(--instructor-shell-border) text-(--text-secondary)"
              }`}
            >
              <Icon icon={item.icon} width={14} />
              {item.label}
            </button>
          ))}

          <div className="ml-auto flex h-10 min-w-[200px] items-center gap-2 rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 sm:min-w-[260px]">
            <Icon icon="solar:magnifer-outline" width={15} className="text-(--text-secondary)" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-xs outline-none sm:text-sm"
              placeholder="Search articles"
            />
          </div>
        </div>
      </section>

      {error ? (
        <p className="mb-4 rounded-xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 text-sm text-(--instructor-badge-bg)">
          {error}
        </p>
      ) : null}
      {successMessage ? (
        <p className="mb-4 rounded-xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 text-sm text-green-600">
          {successMessage}
        </p>
      ) : null}
      {loading && activeSection.key !== "create" ? (
        <article className="mb-4 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 text-sm text-(--text-secondary)">
          Loading content...
        </article>
      ) : null}

      {activeSection.key === "all" ? renderAllArticlesPage() : null}
      {activeSection.key === "create" ? renderArticleEditorPage() : null}
      {activeSection.key === "preview" ? renderPreviewPage() : null}
      {activeSection.key === "draft" ? renderDraftPage() : null}
      {activeSection.key === "scheduled" ? renderScheduledPage() : null}
      {activeSection.key === "categories" ? renderCategoriesPage() : null}
      {activeSection.key === "tags" ? renderTagsPage() : null}
      {activeSection.key === "analytics" ? renderAnalyticsPage() : null}
      {activeSection.key === "media" ? renderMediaLibraryPage() : null}
    </InstructorLayout>
  );
};

export default InstructorArticles;
