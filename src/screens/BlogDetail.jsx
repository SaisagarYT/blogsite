import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
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

const cleanText = (value) => value?.replace(/<[^>]*>/g, "") || "";

const getInlineValue = (value) => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value.map((item) => getInlineValue(item)).filter(Boolean).join(" ");
  }
  if (value && typeof value === "object") {
    if (typeof value.content === "string") return value.content;
    if (typeof value.text === "string") return value.text;
    if (Array.isArray(value.items)) {
      return value.items.map((item) => getInlineValue(item)).join(" ");
    }

    const flattened = Object.values(value)
      .map((item) => getInlineValue(item))
      .filter(Boolean)
      .join(" ")
      .trim();

    if (flattened) return flattened;
  }
  return "";
};

const getLessonBlocks = (lesson = {}) => {
  const blocks =
    lesson?.editor_data?.blocks ||
    lesson?.editorData?.blocks ||
    lesson?.blocks ||
    [];

  return Array.isArray(blocks) ? blocks : [];
};

const normalizeInlineHtml = (value) =>
  getInlineValue(value)
    .replace(/&amp;lt;/gi, "&lt;")
    .replace(/&amp;gt;/gi, "&gt;")
    .replace(/&amp;quot;/gi, "&quot;")
    .replace(/&amp;#39;/gi, "&#39;")
    .replace(/&amp;amp;/gi, "&amp;")
    .replace(/<font\s+color=["']([^"']+)["']\s*>/gi, '<span style="color:$1">')
    .replace(/<font\s+style=["']([^"']+)["']\s*>/gi, '<span style="$1">')
    .replace(/<\/font>/gi, "</span>");

const renderInlineHtml = (value) => ({ __html: normalizeInlineHtml(value) });

const headingIdFromText = (value = "") =>
  cleanText(getInlineValue(value))
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") || "section";

const renderBlock = (block, index, anchorId = "") => {
  const type = String(block?.type || block?.block_type || "paragraph").toLowerCase();
  const text = normalizeInlineHtml(blockText(block));

  if (type === "header" || type === "heading" || type === "h1" || type === "h2" || type === "h3") {
    const explicitLevel = type === "h1" ? 1 : type === "h2" ? 2 : type === "h3" ? 3 : Number(block?.data?.level || 2);
    const level = Math.min(3, Math.max(1, explicitLevel));

    if (level === 1) {
      return (
        <h1
          key={index}
          id={anchorId || undefined}
          className="mt-8 scroll-mt-24 text-2xl font-bold leading-tight md:text-2xl"
          dangerouslySetInnerHTML={renderInlineHtml(text)}
        />
      );
    }

    if (level === 2) {
      return (
        <h2
          key={index}
          id={anchorId || undefined}
          className="mt-7 scroll-mt-24 text-xl font-semibold leading-snug md:text-xl"
          dangerouslySetInnerHTML={renderInlineHtml(text)}
        />
      );
    }

    return (
      <h3
        key={index}
        id={anchorId || undefined}
        className="mt-6 scroll-mt-24 text-lg font-semibold leading-snug md:text-lg"
        dangerouslySetInnerHTML={renderInlineHtml(text)}
      />
    );
  }

  if (type === "quote") {
    return (
      <blockquote key={index} className="mt-4 rounded-r-md border-l-4 border-(--text-accent) bg-(--bg-background) px-4 py-3">
        <p dangerouslySetInnerHTML={renderInlineHtml(text)} />
      </blockquote>
    );
  }

  if (type === "code") {
    return (
      <pre key={index} className="mt-4 overflow-auto rounded-lg border border-(--bg-primary) bg-(--bg-background) p-3 text-sm">
        <code>{getInlineValue(block?.data?.code || text)}</code>
      </pre>
    );
  }

  if (type === "image") {
    const imageUrl = block?.data?.file?.url || block?.data?.image_url || block?.data?.url || "";
    if (!imageUrl) return null;
    return (
      <figure key={index} className="mt-5">
        <img src={imageUrl} alt={block?.data?.alt_text || block?.data?.caption || "Content image"} className="w-full rounded-xl object-cover" />
        {block?.data?.caption ? <figcaption className="mt-2 text-xs text-(--text-secondary)">{cleanText(getInlineValue(block.data.caption))}</figcaption> : null}
      </figure>
    );
  }

  if (type === "list") {
    const style = String(block?.data?.style || block?.data?.meta?.style || "unordered").toLowerCase();
    const items = Array.isArray(block?.data?.items) ? block.data.items : [];
    const ListTag = style === "ordered" ? "ol" : "ul";
    return (
      <ListTag key={index} className={`mt-4 space-y-1 pl-5 ${style === "ordered" ? "list-decimal" : "list-disc"}`}>
        {items.map((item, itemIndex) => (
          <li key={`${index}-${itemIndex}`} dangerouslySetInnerHTML={renderInlineHtml(item)} />
        ))}
      </ListTag>
    );
  }

  if (type === "checklist") {
    return (
      <div key={index} className="mt-4 space-y-1.5 text-sm">
        {(block.data?.items || []).map((item, itemIndex) => (
          <label key={`${getInlineValue(item?.text) || "item"}-${itemIndex}`} className="flex items-start gap-2">
            <input type="checkbox" checked={Boolean(item?.checked)} readOnly className="mt-1" />
            <span dangerouslySetInnerHTML={renderInlineHtml(item?.text)} />
          </label>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div key={index} className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {(block.data?.content || []).map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`} className="border border-(--bg-primary) px-2 py-1.5">
                    {cleanText(getInlineValue(cell))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "delimiter") {
    return <hr key={index} className="my-4 border-(--bg-primary)" />;
  }

  return <p key={index} className="mt-4 text-sm leading-7 text-(--text-main) md:text-base md:leading-8" dangerouslySetInnerHTML={renderInlineHtml(text)} />;
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
  const [lessonData, setLessonData] = useState(null);
  const [activeCourseLessonIndex, setActiveCourseLessonIndex] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [tocIndicatorStyle, setTocIndicatorStyle] = useState({ top: 0, height: 24, opacity: 0 });
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const tocListRef = useRef(null);

  const fallbackPost = location.state?.post || null;

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const loadContent = async () => {
      setLoading(true);
      setError("");
      setArticleData(null);
      setCourseData(null);
      setLessonData(null);

      try {
        const response = await axios.get(`${API_BASE_URL}/api/content/slug/${encodeURIComponent(slug)}`, {
          withCredentials: true,
        });
        console.log(response.data);

        if (cancelled) return;
        if (!response.data?.success || !response.data?.source) {
          setError("Content not found");
          return;
        }

        if (response.data.source === "article") {
          setSourceType("article");
          setArticleData(response.data.content || null);
          return;
        }

        if (response.data.source === "course") {
          setSourceType("course");
          setCourseData(response.data.content || null);
          return;
        }

        if (response.data.source === "lesson") {
          setSourceType("lesson");
          setLessonData(response.data.content || null);
          return;
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError?.response?.data?.error || "Content not found");
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
        createdDate: formatDate(articleData.createdAt),
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
        createdDate: formatDate(courseData.createdAt),
        readTime: courseData.estimated_duration || "-",
        date: formatDate(courseData.updatedAt || courseData.createdAt),
        image: courseData.thumbnail_url || "",
      };
    }

    if (sourceType === "lesson" && lessonData) {
      return {
        title: lessonData?.lesson?.title || "Untitled lesson",
        category: "lesson",
        author: lessonData?.course?.instructor_id?.username || "Instructor",
        createdDate: formatDate(lessonData?.course?.createdAt),
        readTime: lessonData?.lesson?.reading_time || "-",
        date: formatDate(lessonData?.course?.updatedAt || lessonData?.course?.createdAt),
        image: lessonData?.course?.thumbnail_url || "",
      };
    }

    return {
      title: fallbackPost?.title || "Loading...",
      category: fallbackPost?.category || "content",
      author: fallbackPost?.author || "-",
      createdDate: "-",
      readTime: fallbackPost?.readTime || "-",
      date: fallbackPost?.date || "-",
      image: fallbackPost?.image || "",
    };
  }, [sourceType, articleData, courseData, lessonData, fallbackPost]);

  const articleBlocks = useMemo(() => articleData?.editorData?.blocks || [], [articleData]);

  const courseLessonEntries = useMemo(() => {
    if (sourceType !== "course" || !courseData?.modules?.length) return [];

    const entries = [];
    (courseData.modules || []).forEach((moduleItem, moduleIndex) => {
      (moduleItem.lessons || []).forEach((lessonItem, lessonIndex) => {
        entries.push({
          moduleIndex,
          lessonIndex,
          module: moduleItem,
          lesson: lessonItem,
        });
      });
    });

    return entries;
  }, [sourceType, courseData]);

  const activeCourseLesson = useMemo(() => {
    if (!courseLessonEntries.length) return null;
    return courseLessonEntries[Math.max(0, Math.min(activeCourseLessonIndex, courseLessonEntries.length - 1))] || null;
  }, [courseLessonEntries, activeCourseLessonIndex]);

  useEffect(() => {
    if (sourceType === "course") {
      setActiveCourseLessonIndex(0);
    }
  }, [sourceType, courseData?._id]);

  useEffect(() => {
    if (!courseLessonEntries.length) return;
    if (activeCourseLessonIndex > courseLessonEntries.length - 1) {
      setActiveCourseLessonIndex(courseLessonEntries.length - 1);
    }
  }, [courseLessonEntries, activeCourseLessonIndex]);

  const detailBlocks = useMemo(() => {
    if (sourceType === "article") return articleBlocks;
    if (sourceType === "course") return getLessonBlocks(activeCourseLesson?.lesson);
    if (sourceType === "lesson") return lessonData?.lesson?.editor_data?.blocks || [];
    return [];
  }, [sourceType, articleBlocks, lessonData, activeCourseLesson]);

  const tocItems = useMemo(() => {
    const used = new Map();
    return detailBlocks
      .map((block, index) => {
        const type = String(block?.type || block?.block_type || "").toLowerCase();
        if (!["header", "heading", "h1", "h2", "h3"].includes(type)) return null;

        const explicitLevel = type === "h1" ? 1 : type === "h2" ? 2 : type === "h3" ? 3 : Number(block?.data?.level || 2);
        const level = Math.min(3, Math.max(1, explicitLevel));
        const title = cleanText(getInlineValue(block?.data?.text || blockText(block))) || `Section ${index + 1}`;
        const baseId = headingIdFromText(title);
        const count = used.get(baseId) || 0;
        used.set(baseId, count + 1);
        const id = count ? `${baseId}-${count + 1}` : baseId;

        return { index, id, title, level };
      })
      .filter(Boolean);
  }, [detailBlocks]);

  const headingAnchorByIndex = useMemo(() => {
    const map = {};
    tocItems.forEach((item) => {
      map[item.index] = item.id;
    });
    return map;
  }, [tocItems]);

  const scrollToHeading = (id) => {
    setActiveHeadingId(id);
    const section = document.getElementById(id);
    if (!section) return;

    const stickyOffset = 96;
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const topPosition = section.getBoundingClientRect().top + currentScroll - stickyOffset;

    section.scrollIntoView({ behavior: "smooth", block: "start" });

    window.scrollTo({
      top: Math.max(topPosition, 0),
      behavior: "smooth",
    });

    if (window.history?.replaceState) {
      window.history.replaceState(null, "", `#${id}`);
    }

    setIsMobileTocOpen(false);
  };

  const getTocIndentUnits = (level) => {
    if (level <= 1) return 0;
    if (level === 2) return 1;
    return 3;
  };

  const getTocPaddingLeft = (level) => `${0.5 + getTocIndentUnits(level) * 0.8}rem`;

  const getTocNodeIcon = (level) => {
    if (level <= 1) return "solar:folder-with-files-outline";
    if (level === 2) return "solar:file-text-outline";
    return "solar:file-outline";
  };

  const getTocBranchPrefix = (level) => {
    if (level <= 1) return "";
    if (level === 2) return "└─";
    return "   └─";
  };

  useEffect(() => {
    if (!tocItems.length) {
      setActiveHeadingId("");
      return;
    }

    const ids = tocItems.map((item) => item.id);
    setActiveHeadingId((previous) => (ids.includes(previous) ? previous : ids[0]));
  }, [tocItems]);

  useEffect(() => {
    if (!tocItems.length) return;

    const headingElements = tocItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!headingElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (!visibleEntries.length) return;

        const nearest = visibleEntries.sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top - 120) - Math.abs(b.boundingClientRect.top - 120),
        )[0];

        setActiveHeadingId(nearest.target.id);
      },
      {
        root: null,
        rootMargin: "-15% 0px -70% 0px",
        threshold: [0.1, 0.3, 0.6],
      },
    );

    headingElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [tocItems]);

  useEffect(() => {
    if (!activeHeadingId || !tocListRef.current) {
      setTocIndicatorStyle((previous) => ({ ...previous, opacity: 0 }));
      return;
    }

    const activeButton = tocListRef.current.querySelector(`[data-toc-id="${activeHeadingId}"]`);
    if (!activeButton) {
      setTocIndicatorStyle((previous) => ({ ...previous, opacity: 0 }));
      return;
    }

    const nextTop = activeButton.offsetTop;
    const nextHeight = activeButton.offsetHeight;

    setTocIndicatorStyle({
      top: nextTop,
      height: nextHeight,
      opacity: 1,
    });

    activeButton.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeHeadingId, tocItems]);

  const renderLessonNavigation = () => (
    <div className="flex items-center gap-2">
      <p className="text-xs text-(--text-secondary)">
        Lesson {activeCourseLessonIndex + 1} of {courseLessonEntries.length}
      </p>
      <button
        type="button"
        onClick={() => setActiveCourseLessonIndex((previous) => Math.max(0, previous - 1))}
        disabled={activeCourseLessonIndex <= 0}
        className="rounded-lg border border-(--text-accent) bg-(--text-accent) px-3 py-2 text-sm font-semibold text-(--text-button) transition-all duration-200 hover:brightness-95 hover:shadow-[0_6px_18px_rgba(0,0,0,0.18)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:border-(--bg-primary) disabled:bg-(--bg-primary) disabled:text-(--text-secondary) disabled:shadow-none"
      >
        Previous Lesson
      </button>
      <button
        type="button"
        onClick={() =>
          setActiveCourseLessonIndex((previous) => Math.min(courseLessonEntries.length - 1, previous + 1))
        }
        disabled={activeCourseLessonIndex >= courseLessonEntries.length - 1}
        className="rounded-lg border border-(--text-accent) bg-(--text-accent) px-3 py-2 text-sm font-semibold text-(--text-button) transition-all duration-200 hover:brightness-95 hover:shadow-[0_6px_18px_rgba(0,0,0,0.18)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:border-(--bg-primary) disabled:bg-(--bg-primary) disabled:text-(--text-secondary) disabled:shadow-none"
      >
        Next Lesson
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full text-(--text-main)">
      <header className="sticky top-0 z-40 border-b border-(--bg-primary) bg-(--bg-secondary)">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-2 px-2 py-3 md:px-5">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--bg-primary)"
          >
            <Icon icon="mdi:arrow-left" width="18" height="18" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open table of contents"
              onClick={() => setIsMobileTocOpen((previous) => !previous)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--bg-primary) lg:hidden"
            >
              <Icon icon={isMobileTocOpen ? "solar:close-circle-outline" : "solar:hamburger-menu-outline"} width="18" height="18" />
            </button>
            <span className="rounded-lg border border-(--bg-primary) px-3 py-1.5 text-xs text-(--text-secondary)">{meta.date}</span>
          </div>
        </div>
      </header>

      {isMobileTocOpen ? (
        <div className="sticky top-[58px] z-30 border-b border-(--bg-primary) bg-(--bg-secondary) lg:hidden">
          <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-(--text-secondary)">Tab of contents</h3>
              <button
                type="button"
                aria-label="Close table of contents"
                onClick={() => setIsMobileTocOpen(false)}
                className="rounded-md border border-(--bg-primary) p-1 text-(--text-secondary)"
              >
                <Icon icon="solar:close-circle-outline" width={16} />
              </button>
            </div>

            {tocItems.length ? (
              <div className="space-y-1.5 pb-1">
                {tocItems.map((item) => (
                  <button
                    key={`mobile-${item.id}`}
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                      activeHeadingId === item.id
                        ? "bg-(--bg-background) text-(--text-main)"
                        : "text-(--text-secondary) hover:bg-(--bg-background)"
                    } ${item.level === 1 ? "font-semibold" : "font-normal"}`}
                    style={{
                      paddingLeft: getTocPaddingLeft(item.level),
                      fontSize: item.level === 1 ? "1rem" : "0.9rem",
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {item.level > 1 ? (
                        <span className="shrink-0 font-mono text-[11px] text-(--text-secondary)">{getTocBranchPrefix(item.level)}</span>
                      ) : null}
                      <Icon icon={getTocNodeIcon(item.level)} width={14} className="shrink-0 text-(--text-secondary)" />
                      <span>{item.title}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-2 py-1 text-xs text-(--text-secondary)">No sections available.</p>
            )}
          </div>
        </div>
      ) : null}

      <main
        className={`mx-auto grid w-full max-w-[1560px] grid-cols-1 gap-0 px-0 py-2 transition-[grid-template-columns] duration-300 ease-in-out md:gap-5 md:px-5 md:py-8 lg:justify-center ${
          isTocCollapsed ? "lg:grid-cols-[78px_minmax(0,1180px)]" : "lg:grid-cols-[280px_minmax(0,1180px)]"
        }`}
      >
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-(--bg-primary) bg-(--bg-secondary) p-3 transition-all duration-300">
            <div className={`flex items-center ${isTocCollapsed ? "justify-center" : "justify-between"} gap-2 px-1 pb-2`}>
              <h3
                className={`text-[11px] font-bold uppercase tracking-[0.08em] text-(--text-secondary) transition-all duration-300 ${
                  isTocCollapsed ? "max-w-0 -translate-x-1 overflow-hidden opacity-0" : "max-w-[180px] translate-x-0 opacity-100"
                }`}
              >
                Tab of contents
              </h3>
              <button
                type="button"
                aria-label={isTocCollapsed ? "Expand table of contents" : "Collapse table of contents"}
                onClick={() => setIsTocCollapsed((previous) => !previous)}
                className="rounded-md border border-(--bg-primary) p-1 text-(--text-secondary) hover:bg-(--bg-background)"
              >
                <Icon icon={isTocCollapsed ? "solar:alt-arrow-right-outline" : "solar:alt-arrow-left-outline"} width={14} />
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isTocCollapsed ? "max-h-0 opacity-0 pointer-events-none" : "max-h-[calc(100vh-170px)] opacity-100"
              }`}
            >
              <div
                className="h-[calc(100vh-170px)] overflow-y-auto pr-1"
                ref={tocListRef}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {tocItems.length ? (
                  <div className="relative pl-4">
                    <span className="absolute left-[8px] top-1 bottom-1 w-[1px] bg-(--bg-primary)" />
                    <span
                      className="absolute left-[7px] w-[3px] rounded-full bg-(--text-accent) transition-all duration-300 ease-out"
                      style={{
                        transform: `translateY(${tocIndicatorStyle.top}px)`,
                        height: `${tocIndicatorStyle.height}px`,
                        opacity: tocIndicatorStyle.opacity,
                      }}
                    />

                    <div className="space-y-1.5">
                      {tocItems.map((item) => (
                        <button
                          key={item.id}
                          data-toc-id={item.id}
                          type="button"
                          onClick={() => scrollToHeading(item.id)}
                          className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                            activeHeadingId === item.id
                              ? "bg-(--bg-background) text-(--text-main)"
                              : "text-(--text-secondary) hover:bg-(--bg-background)"
                          } ${item.level === 1 ? "font-semibold" : "font-normal"}`}
                          style={{
                            paddingLeft: getTocPaddingLeft(item.level),
                            fontSize: item.level === 1 ? "1rem" : "0.9rem",
                          }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {item.level > 1 ? (
                              <span className="shrink-0 font-mono text-[11px] text-(--text-secondary)">{getTocBranchPrefix(item.level)}</span>
                            ) : null}
                            <Icon icon={getTocNodeIcon(item.level)} width={14} className="shrink-0 text-(--text-secondary)" />
                            <span>{item.title}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="px-2 py-1 text-xs text-(--text-secondary)">No sections available.</p>
                )}
              </div>
            </div>
          </div>
        </aside>

        <article className="w-full rounded-none p-2 md:rounded-2xl md:p-8">
          {meta.image ? <img src={meta.image} alt={meta.title} className="mb-5 h-52 w-full rounded-xl object-cover md:h-72" /> : null}

          <h1 className="text-3xl font-bold leading-tight md:text-5xl">{meta.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className="rounded-full bg-(--bg-background) px-2.5 py-1 capitalize">{meta.category}</span>
            <span className="text-(--text-secondary)">{meta.author}</span>
            <span className="text-(--text-secondary)">•</span>
            <span className="text-(--text-secondary)">Created {meta.createdDate}</span>
            <span className="text-(--text-secondary)">•</span>
            <span className="text-(--text-secondary)">{meta.readTime}</span>
          </div>

          {loading ? <p className="mt-6 text-sm text-(--text-secondary)">Loading content...</p> : null}
          {error && !loading ? <p className="mt-6 text-sm text-(--instructor-badge-bg)">{error}</p> : null}

          {!loading && !error && sourceType === "article" ? (
            <section className="mt-6">
              {articleBlocks.length ? articleBlocks.map((block, index) => renderBlock(block, index, headingAnchorByIndex[index])) : <p className="text-(--text-secondary)">No article content available.</p>}
            </section>
          ) : null}

          {!loading && !error && sourceType === "course" ? (
            <section className="mt-6 space-y-6">
              {courseData?.description ? <p className="text-base leading-8 text-(--text-main)">{courseData.description}</p> : null}

              {activeCourseLesson ? (
                <div className="rounded-xl border border-(--bg-primary) p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="rounded-lg border-l-4 border-(--text-accent) bg-(--bg-background) px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-(--text-secondary)">Current Module</p>
                      <h2 className="text-xl font-semibold">
                        Module {activeCourseLesson.moduleIndex + 1}: {activeCourseLesson.module?.name}
                      </h2>
                      <p className="text-xs text-(--text-secondary)">
                        Lesson {activeCourseLesson.lessonIndex + 1} of {activeCourseLesson.module?.lessons?.length || 0} in this module
                      </p>
                    </div>
                    {renderLessonNavigation()}
                  </div>

                  <div className="rounded-lg bg-(--bg-background) p-3">
                    <h3 className="text-2xl font-semibold">{activeCourseLesson.lesson?.title}</h3>
                    {activeCourseLesson.lesson?.reading_time ? <p className="mt-1 text-xs text-(--text-secondary)">{activeCourseLesson.lesson.reading_time}</p> : null}
                    <div className="mt-3">
                      {getLessonBlocks(activeCourseLesson.lesson).map((block, index) =>
                        renderBlock(block, `${activeCourseLesson.lesson?._id || activeCourseLessonIndex}-${index}`, headingAnchorByIndex[index]),
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">{renderLessonNavigation()}</div>

                </div>
              ) : (
                <p className="text-(--text-secondary)">No course lesson content available.</p>
              )}
            </section>
          ) : null}

          {!loading && !error && sourceType === "lesson" ? (
            <section className="mt-6 space-y-5">
              <div className="rounded-xl border border-(--bg-primary) p-4">
                <p className="text-xs text-(--text-secondary)">Course</p>
                <h2 className="text-xl font-semibold">{lessonData?.course?.title || "-"}</h2>
                <p className="mt-2 text-xs text-(--text-secondary)">Module: {lessonData?.module?.name || "-"}</p>
              </div>

              <div>
                {(lessonData?.lesson?.editor_data?.blocks || []).length ? (
                  (lessonData.lesson.editor_data.blocks || []).map((block, index) => renderBlock(block, `lesson-${index}`, headingAnchorByIndex[index]))
                ) : (
                  <p className="text-(--text-secondary)">No lesson content available.</p>
                )}
              </div>
            </section>
          ) : null}
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;