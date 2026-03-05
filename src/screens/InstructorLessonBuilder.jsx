import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import Checklist from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import Underline from "@editorjs/underline";
import ColorPlugin from "editorjs-text-color-plugin";
import { useSearchParams } from "react-router-dom";
import InstructorLayout from "../components/instructor/InstructorLayout";
import { getCourseBuilderApi, getLessonApi, saveLessonContentApi } from "../services/courseApi";

const initialEditorData = {
  blocks: [
    {
      type: "h2",
      data: {
        text: "Introduction to HTML",
        level: 2,
      },
    },
    {
      type: "paragraph",
      data: {
        text: "HTML gives structure to a webpage using semantic elements like headers, sections, articles, and forms.",
      },
    },
    {
      type: "code",
      data: {
        code: "<h1>Hello World</h1>\n<p>My first lesson page</p>",
      },
    },
  ],
};

const cleanText = (value) => value?.replace(/<[^>]*>/g, "") || "";
const normalizeInlineHtml = (value) =>
  (value || "")
    .replace(/<font\s+color=["']([^"']+)["']\s*>/gi, '<span style="color:$1">')
    .replace(/<font\s+style=["']([^"']+)["']\s*>/gi, '<span style="$1">')
    .replace(/<\/font>/gi, "</span>");

const renderInlineHtml = (value) => ({ __html: normalizeInlineHtml(value) });

const getThemeAccentColor = () => {
  if (typeof window === "undefined") {
    return "#FFD11A";
  }

  const color = getComputedStyle(document.documentElement).getPropertyValue("--text-accent").trim();
  return color || "#FFD11A";
};

const getThemeAccentHighlightColor = () => {
  if (typeof window === "undefined") {
    return "rgba(255, 209, 26, 0.32)";
  }

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--text-accent").trim() || "#FFD11A";

  if (accent.startsWith("#") && (accent.length === 7 || accent.length === 4)) {
    const hex = accent.length === 4
      ? `#${accent[1]}${accent[1]}${accent[2]}${accent[2]}${accent[3]}${accent[3]}`
      : accent;
    const red = parseInt(hex.slice(1, 3), 16);
    const green = parseInt(hex.slice(3, 5), 16);
    const blue = parseInt(hex.slice(5, 7), 16);
    return `rgba(${red}, ${green}, ${blue}, 0.32)`;
  }

  return "rgba(255, 209, 26, 0.32)";
};

const autoResizeCodeTextarea = (textarea) => {
  if (!textarea) {
    return;
  }

  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const resizeAllCodeTextareas = (rootElement) => {
  if (!rootElement) {
    return;
  }

  rootElement.querySelectorAll(".ce-code__textarea").forEach((textarea) => {
    autoResizeCodeTextarea(textarea);
  });
};

const syncEditorInlineTextColor = (rootElement) => {
  if (!rootElement) {
    return;
  }

  rootElement.querySelectorAll("font[color]").forEach((element) => {
    const colorValue = element.getAttribute("color");
    if (colorValue) {
      element.style.color = colorValue;
    }
  });
};

const InstructorLessonBuilder = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const moduleId = searchParams.get("moduleId");
  const lessonId = searchParams.get("lessonId");

  const editorRef = useRef(null);
  const [editorOutput, setEditorOutput] = useState(initialEditorData);
  const [saveState, setSaveState] = useState("Not saved");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moduleOptions, setModuleOptions] = useState([]);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    slug: "",
    lesson_type: "article",
    reading_time: "",
    module_id: moduleId || "",
  });

  useEffect(() => {
    if (editorRef.current) {
      return;
    }

    editorRef.current = new EditorJS({
      holder: "lesson-editorjs",
      autofocus: true,
      placeholder: "Write your lesson like Notion... Use + to add blocks",
      defaultBlock: "paragraph",
      data: initialEditorData,
      inlineToolbar: ["bold", "italic", "link", "marker", "textColor", "underline"],
      tools: {
        h1: {
          class: Header,
          config: {
            levels: [1],
            defaultLevel: 1,
          },
          shortcut: "CMD+ALT+1",
          toolbox: {
            title: "H1 Heading",
          },
          inlineToolbar: true,
        },
        h2: {
          class: Header,
          config: {
            levels: [2],
            defaultLevel: 2,
          },
          shortcut: "CMD+ALT+2",
          toolbox: {
            title: "H2 Heading",
          },
          inlineToolbar: true,
        },
        h3: {
          class: Header,
          config: {
            levels: [3],
            defaultLevel: 3,
          },
          shortcut: "CMD+ALT+3",
          toolbox: {
            title: "H3 Heading",
          },
          inlineToolbar: true,
        },
        list: {
          class: List,
          shortcut: "CMD+SHIFT+L",
          toolbox: {
            title: "List",
          },
          inlineToolbar: true,
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
          toolbox: {
            title: "Checklist",
          },
        },
        quote: {
          class: Quote,
          shortcut: "CMD+SHIFT+Q",
          toolbox: {
            title: "Quote",
          },
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Write a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        code: {
          class: CodeTool,
          toolbox: {
            title: "Code Block",
          },
        },
        table: {
          class: Table,
          inlineToolbar: true,
          toolbox: {
            title: "Table",
          },
          config: {
            rows: 2,
            cols: 3,
          },
        },
        image: {
          class: ImageTool,
          inlineToolbar: true,
          toolbox: {
            title: "Image",
          },
          config: {
            uploader: {
              uploadByFile(file) {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve({
                      success: 1,
                      file: {
                        url: reader.result,
                      },
                    });
                  };
                  reader.onerror = () => reject(new Error("Image upload failed"));
                  reader.readAsDataURL(file);
                });
              },
              uploadByUrl(url) {
                return Promise.resolve({
                  success: 1,
                  file: {
                    url,
                  },
                });
              },
            },
          },
        },
        delimiter: {
          class: Delimiter,
          toolbox: {
            title: "Divider",
          },
        },
        marker: {
          class: ColorPlugin,
          config: {
            defaultColor: getThemeAccentHighlightColor(),
            colorCollections: [getThemeAccentHighlightColor()],
            type: "marker",
            customPicker: false,
          },
          toolbox: {
            title: "Highlight (Accent)",
          },
        },
        textColor: {
          class: ColorPlugin,
          config: {
            defaultColor: getThemeAccentColor(),
            colorCollections: [getThemeAccentColor()],
            type: "text",
            customPicker: false,
          },
          toolbox: {
            title: "Text Color (Accent)",
          },
        },
        underline: Underline,
      },
      async onChange() {
        const saved = await editorRef.current.save();
        setEditorOutput(saved);
        const editorHolder = document.getElementById("lesson-editorjs");
        resizeAllCodeTextareas(editorHolder);
        syncEditorInlineTextColor(editorHolder);
      },
    });

    const holderElement = document.getElementById("lesson-editorjs");

    const handleEditorInput = (event) => {
      if (event.target?.classList?.contains("ce-code__textarea")) {
        autoResizeCodeTextarea(event.target);
      }
    };

    holderElement?.addEventListener("input", handleEditorInput);

    setTimeout(() => {
      resizeAllCodeTextareas(holderElement);
      syncEditorInlineTextColor(holderElement);
    }, 50);

    return () => {
      holderElement?.removeEventListener("input", handleEditorInput);
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!courseId || !moduleId || !lessonId) {
      setError("Missing courseId/moduleId/lessonId in URL");
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [builderData, lessonData] = await Promise.all([
          getCourseBuilderApi(courseId),
          getLessonApi(courseId, moduleId, lessonId),
        ]);

        if (cancelled) return;

        setModuleOptions(builderData?.module_structure || []);

        const lesson = lessonData?.lesson;
        if (lesson) {
          setLessonForm({
            title: lesson.title || "",
            slug: lesson.slug || "",
            lesson_type: lesson.lesson_type || "article",
            reading_time: lesson.reading_time || "",
            module_id: moduleId,
          });

          const incomingEditorData = lesson.editor_data?.blocks
            ? lesson.editor_data
            : { time: Date.now(), version: "2.29.0", blocks: [] };

          setEditorOutput(incomingEditorData);
          if (editorRef.current) {
            await editorRef.current.render(incomingEditorData);
          }
        }
      } catch (requestError) {
        if (cancelled) return;
        setError(requestError?.response?.data?.error || "Failed to load lesson data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [courseId, moduleId, lessonId]);

  const handleSave = async (mode) => {
    if (!editorRef.current || !courseId || !moduleId || !lessonId) {
      return;
    }

    try {
      const saved = await editorRef.current.save();
      setEditorOutput(saved);

      await saveLessonContentApi(courseId, moduleId, lessonId, {
        title: lessonForm.title,
        slug: lessonForm.slug,
        lesson_type: lessonForm.lesson_type,
        reading_time: lessonForm.reading_time,
        status: mode === "draft" ? "draft" : "published",
        editor_data: saved,
      });

      setSaveState(mode === "draft" ? "Draft saved" : "Lesson published");
      setError("");
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to save lesson");
    }
  };

  return (
    <InstructorLayout
      pageTitle="Lesson Builder Page"
      pageDescription="Create rich lesson content with structured metadata, editor blocks, and instant preview."
    >
      {error ? <p className="mb-3 text-sm text-(--instructor-badge-bg)">{error}</p> : null}
      {loading ? (
        <div className="mb-3 rounded-xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 text-sm text-(--text-secondary)">
          Loading lesson...
        </div>
      ) : null}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Lesson Title Input</h3>
            <input
              value={lessonForm.title}
              onChange={(event) => setLessonForm((previous) => ({ ...previous, title: event.target.value }))}
              className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none"
              placeholder="Write your lesson title"
            />
          </article>

          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Lesson Metadata</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-(--text-secondary)">Lesson Slug</label>
                <input
                  value={lessonForm.slug}
                  onChange={(event) => setLessonForm((previous) => ({ ...previous, slug: event.target.value }))}
                  className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none"
                  placeholder="intro-to-html"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-(--text-secondary)">Lesson Type</label>
                <select
                  value={lessonForm.lesson_type}
                  onChange={(event) => setLessonForm((previous) => ({ ...previous, lesson_type: event.target.value }))}
                  className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none"
                >
                  <option value="article">Article</option>
                  <option value="video_article">Video + Article</option>
                  <option value="practice">Practice</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-(--text-secondary)">Reading Time</label>
                <input
                  value={lessonForm.reading_time}
                  onChange={(event) => setLessonForm((previous) => ({ ...previous, reading_time: event.target.value }))}
                  className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none"
                  placeholder="8 min"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-(--text-secondary)">Module Selector</label>
                <select
                  value={lessonForm.module_id}
                  disabled
                  className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none disabled:opacity-70"
                >
                  {moduleOptions.map((moduleOption) => (
                    <option key={moduleOption._id} value={moduleOption._id}>{moduleOption.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Block Editor</h3>
            <div className="mb-3 rounded-lg border border-(--instructor-shell-border) bg-(--dash-soft-surface) px-3 py-2 text-xs text-(--text-secondary)">
              Type <span className="font-semibold text-(--text-main)">/</span> for quick block commands. Select text to open inline options for <span className="font-semibold text-(--text-accent)">Highlight</span> and <span className="font-semibold text-(--text-accent)">Text Color</span> in accent yellow.
            </div>
            <div className="instructor-editorjs min-h-[320px] rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) p-3 sm:p-4">
              <div id="lesson-editorjs" />
            </div>
          </article>
        </div>

        <div className="space-y-4">
          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Preview Lesson</h3>
            <div className="rounded-xl border border-(--instructor-shell-border) bg-(--dash-soft-surface) p-3">
              <h4 className="text-sm font-semibold">Introduction to HTML</h4>
              <p className="mt-2 text-xs text-(--text-secondary)">Live preview summary from Editor.js output</p>
              <div className="preview-lesson mt-3 rounded-lg bg-(--bg-secondary) p-3 overflow-visible">
                {(editorOutput?.blocks || []).map((block, index) => (
                  <div key={`${block.type}-${index}`}>
                    {block.type === "header" || block.type === "h1" || block.type === "h2" || block.type === "h3" ? (
                      <div>
                        {Number(block.data?.level || (block.type === "h1" ? 1 : block.type === "h2" ? 2 : 3)) === 1 ? (
                          <h1 className="mb-2 mt-1 text-xl font-bold" dangerouslySetInnerHTML={renderInlineHtml(block.data?.text)} />
                        ) : null}
                        {Number(block.data?.level || (block.type === "h1" ? 1 : block.type === "h2" ? 2 : 3)) === 2 ? (
                          <h2 className="mb-2 mt-1 text-lg font-semibold" dangerouslySetInnerHTML={renderInlineHtml(block.data?.text)} />
                        ) : null}
                        {Number(block.data?.level || (block.type === "h1" ? 1 : block.type === "h2" ? 2 : 3)) === 3 || !block.data?.level ? (
                          <h3 className="mb-2 mt-1 text-base font-semibold" dangerouslySetInnerHTML={renderInlineHtml(block.data?.text)} />
                        ) : null}
                      </div>
                    ) : null}

                    {block.type === "paragraph" ? (
                      <p className="mb-2 text-sm leading-6" dangerouslySetInnerHTML={renderInlineHtml(block.data?.text)} />
                    ) : null}

                    {block.type === "quote" ? (
                      <blockquote
                        className="mb-2 border-l-2 border-(--instructor-highlight-border) pl-3 text-sm italic text-(--text-secondary)"
                        dangerouslySetInnerHTML={renderInlineHtml(block.data?.text)}
                      />
                    ) : null}

                    {block.type === "list" ? (
                      <ul className="mb-2 list-disc space-y-1 pl-5 text-sm">
                        {(block.data?.items || []).map((item, itemIndex) => (
                          <li key={`${item}-${itemIndex}`} dangerouslySetInnerHTML={renderInlineHtml(item)} />
                        ))}
                      </ul>
                    ) : null}

                    {block.type === "checklist" ? (
                      <div className="mb-2 space-y-1.5 text-sm">
                        {(block.data?.items || []).map((item, itemIndex) => (
                          <label key={`${item.text}-${itemIndex}`} className="flex items-start gap-2">
                            <input type="checkbox" checked={Boolean(item.checked)} readOnly className="mt-1" />
                            <span dangerouslySetInnerHTML={renderInlineHtml(item.text)} />
                          </label>
                        ))}
                      </div>
                    ) : null}

                    {block.type === "code" ? (
                      <pre className="mb-2 overflow-x-auto rounded-lg bg-(--dash-soft-surface) p-2 text-[11px]">
                        <code>{block.data?.code}</code>
                      </pre>
                    ) : null}

                    {block.type === "image" && block.data?.file?.url ? (
                      <img src={block.data.file.url} alt={cleanText(block.data?.caption) || "Lesson"} className="mb-2 rounded-lg" />
                    ) : null}

                    {block.type === "table" ? (
                      <div className="mb-2 overflow-x-auto">
                        <table className="w-full border-collapse text-xs">
                          <tbody>
                            {(block.data?.content || []).map((row, rowIndex) => (
                              <tr key={`row-${rowIndex}`}>
                                {row.map((cell, cellIndex) => (
                                  <td key={`cell-${rowIndex}-${cellIndex}`} className="border border-(--instructor-shell-border) px-2 py-1">
                                    {cleanText(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}

                    {block.type === "delimiter" ? <hr className="my-3 border-(--instructor-shell-border)" /> : null}
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSave("draft")}
              className="rounded-lg border border-(--instructor-shell-border) px-4 py-2 text-sm font-semibold"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave("publish")}
              className="rounded-lg bg-(--instructor-button-bg) px-4 py-2 text-sm font-semibold text-(--instructor-button-text)"
            >
              Publish Lesson
            </button>
            <span className="self-center text-xs text-(--text-secondary)">{saveState}</span>
          </div>
        </div>
      </section>
    </InstructorLayout>
  );
};

export default InstructorLessonBuilder;
