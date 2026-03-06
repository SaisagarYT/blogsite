import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../config/api";

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

const blockText = (block = {}) =>
  block?.data?.text ||
  block?.data?.content ||
  block?.data?.code ||
  block?.data?.caption ||
  block?.data?.message ||
  "";

const renderBlock = (block, index) => {
  const type = String(block?.type || block?.block_type || "paragraph").toLowerCase();
  const text = blockText(block);

  if (type === "header" || type === "heading") {
    const level = Math.min(3, Math.max(1, Number(block?.data?.level || 2)));
    if (level === 1) return <h1 key={index} className="mt-6 text-3xl font-bold" dangerouslySetInnerHTML={{ __html: text }} />;
    if (level === 2) return <h2 key={index} className="mt-6 text-2xl font-semibold" dangerouslySetInnerHTML={{ __html: text }} />;
    return <h3 key={index} className="mt-5 text-xl font-semibold" dangerouslySetInnerHTML={{ __html: text }} />;
  }

  if (type === "quote") {
    return (
      <blockquote key={index} className="mt-4 rounded-r-md border-l-4 border-(--text-accent) bg-(--bg-background) px-4 py-3">
        <p dangerouslySetInnerHTML={{ __html: text }} />
      </blockquote>
    );
  }

  if (type === "code") {
    return (
      <pre key={index} className="mt-4 overflow-auto rounded-lg border border-(--bg-primary) bg-(--bg-background) p-3 text-sm">
        <code>{block?.data?.code || text}</code>
      </pre>
    );
  }

  if (type === "image") {
    const imageUrl = block?.data?.file?.url || block?.data?.image_url || block?.data?.url || "";
    if (!imageUrl) return null;
    return (
      <figure key={index} className="mt-5">
        <img src={imageUrl} alt={block?.data?.alt_text || block?.data?.caption || "Content image"} className="w-full rounded-xl object-cover" />
        {block?.data?.caption ? <figcaption className="mt-2 text-xs text-(--text-secondary)">{block.data.caption}</figcaption> : null}
      </figure>
    );
  }

  if (type === "list") {
    const style = String(block?.data?.style || "unordered").toLowerCase();
    const items = Array.isArray(block?.data?.items) ? block.data.items : [];
    const ListTag = style === "ordered" ? "ol" : "ul";
    return (
      <ListTag key={index} className={`mt-4 space-y-1 pl-5 ${style === "ordered" ? "list-decimal" : "list-disc"}`}>
        {items.map((item, itemIndex) => (
          <li key={`${index}-${itemIndex}`} dangerouslySetInnerHTML={{ __html: String(item || "") }} />
        ))}
      </ListTag>
    );
  }

  return <p key={index} className="mt-4 text-base leading-8 text-(--text-main)" dangerouslySetInnerHTML={{ __html: text }} />;
};

const BlogDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [articleData, setArticleData] = useState(null);
  const [courseData, setCourseData] = useState(null);

  const fallbackPost = location.state?.post || null;

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const loadContent = async () => {
      setLoading(true);
      setError("");
      setArticleData(null);
      setCourseData(null);

      try {
        const articleRes = await axios.get(`${API_BASE_URL}/api/content/articles/slug/${encodeURIComponent(slug)}`, {
          withCredentials: true,
        });

        if (cancelled) return;
        if (articleRes.data?.success && articleRes.data?.article) {
          setSourceType("article");
          setArticleData(articleRes.data.article);
          return;
        }
      } catch (articleError) {
        if (articleError?.response?.status !== 404) {
          if (!cancelled) {
            setError(articleError?.response?.data?.error || "Failed to load content");
          }
          return;
        }
      }

      try {
        const courseRes = await axios.get(`${API_BASE_URL}/api/course/courses/slug/${encodeURIComponent(slug)}`, {
          withCredentials: true,
        });

        if (cancelled) return;
        if (courseRes.data?.success && courseRes.data?.course) {
          setSourceType("course");
          setCourseData(courseRes.data.course);
          return;
        }
      } catch (courseError) {
        if (!cancelled) {
          setError(courseError?.response?.data?.error || "Content not found");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadContent();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const meta = useMemo(() => {
    if (sourceType === "article" && articleData) {
      return {
        title: articleData.title || "Untitled",
        category: articleData.content_type || "article",
        author: articleData?.author_id?.username || "Author",
        readTime: articleData.reading_time || "-",
        date: formatDate(articleData.published_at || articleData.createdAt),
        image: articleData.cover_image || "",
      };
    }

    if (sourceType === "course" && courseData) {
      return {
        title: courseData.title || "Untitled course",
        category: "course",
        author: courseData?.instructor_id?.username || "Instructor",
        readTime: courseData.estimated_duration || "-",
        date: formatDate(courseData.updatedAt || courseData.createdAt),
        image: courseData.thumbnail_url || "",
      };
    }

    return {
      title: fallbackPost?.title || "Loading...",
      category: fallbackPost?.category || "content",
      author: fallbackPost?.author || "-",
      readTime: fallbackPost?.readTime || "-",
      date: fallbackPost?.date || "-",
      image: fallbackPost?.image || "",
    };
  }, [sourceType, articleData, courseData, fallbackPost]);

  const articleBlocks = articleData?.editorData?.blocks || [];

  return (
    <div className="min-h-screen w-full bg-(--bg-background) text-(--text-main)">
      <header className="sticky top-0 z-40 border-b border-(--bg-primary) bg-(--bg-secondary)">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-2 px-3 py-3 md:px-5">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--bg-primary)"
          >
            <Icon icon="mdi:arrow-left" width="18" height="18" />
          </button>
          <span className="rounded-lg border border-(--bg-primary) px-3 py-1.5 text-xs text-(--text-secondary)">{meta.date}</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1000px] px-3 py-5 md:px-5 md:py-8">
        <article className="rounded-2xl bg-(--bg-secondary) p-4 md:p-8">
          {meta.image ? <img src={meta.image} alt={meta.title} className="mb-5 h-52 w-full rounded-xl object-cover md:h-72" /> : null}

          <h1 className="text-3xl font-bold leading-tight md:text-5xl">{meta.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className="rounded-full bg-(--bg-background) px-2.5 py-1 capitalize">{meta.category}</span>
            <span className="text-(--text-secondary)">{meta.author}</span>
            <span className="text-(--text-secondary)">•</span>
            <span className="text-(--text-secondary)">{meta.readTime}</span>
          </div>

          {loading ? <p className="mt-6 text-sm text-(--text-secondary)">Loading content...</p> : null}
          {error && !loading ? <p className="mt-6 text-sm text-(--instructor-badge-bg)">{error}</p> : null}

          {!loading && !error && sourceType === "article" ? (
            <section className="mt-6">
              {articleBlocks.length ? articleBlocks.map((block, index) => renderBlock(block, index)) : <p className="text-(--text-secondary)">No article content available.</p>}
            </section>
          ) : null}

          {!loading && !error && sourceType === "course" ? (
            <section className="mt-6 space-y-6">
              {courseData?.description ? <p className="text-base leading-8 text-(--text-main)">{courseData.description}</p> : null}

              {(courseData?.modules || []).map((moduleItem) => (
                <div key={moduleItem._id} className="rounded-xl border border-(--bg-primary) p-4">
                  <h2 className="text-xl font-semibold">{moduleItem.name}</h2>
                  <div className="mt-3 space-y-4">
                    {(moduleItem.lessons || []).map((lesson) => (
                      <div key={lesson._id} className="rounded-lg bg-(--bg-background) p-3">
                        <h3 className="text-base font-semibold">{lesson.title}</h3>
                        {lesson.reading_time ? <p className="mt-1 text-xs text-(--text-secondary)">{lesson.reading_time}</p> : null}
                        <div className="mt-2">{(lesson?.editor_data?.blocks || []).map((block, index) => renderBlock(block, `${lesson._id}-${index}`))}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {!courseData?.modules?.length ? <p className="text-(--text-secondary)">No course module content available.</p> : null}
            </section>
          ) : null}
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;