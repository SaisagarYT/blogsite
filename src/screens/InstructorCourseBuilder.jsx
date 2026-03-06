import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InstructorLayout from "../components/instructor/InstructorLayout";
import {
  addLessonApi,
  addModuleApi,
  getCourseBuilderApi,
  listCoursesApi,
  updateCourseApi,
  uploadCourseThumbnailApi,
} from "../services/courseApi";

const InstructorCourseBuilder = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCourseId = searchParams.get("courseId") || "";
  const [courseInfo, setCourseInfo] = useState(null);
  const [modules, setModules] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [newModuleName, setNewModuleName] = useState("");
  const [lessonNameByModule, setLessonNameByModule] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadCourses = async () => {
      try {
        const data = await listCoursesApi({ page: 1, limit: 100, status: "all" });
        if (cancelled) return;
        const options = data?.courses || [];
        setCourseOptions(options);

        if (!selectedCourseId && options.length) {
          setSearchParams({ courseId: options[0]._id });
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load courses list");
        }
      }
    };

    loadCourses();
    return () => {
      cancelled = true;
    };
  }, [selectedCourseId, setSearchParams]);

  useEffect(() => {
    if (!selectedCourseId) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCourseBuilderApi(selectedCourseId);
        if (cancelled) return;
        setCourseInfo(data?.course || null);
        setModules(data?.module_structure || []);
      } catch (requestError) {
        if (cancelled) return;
        setError(requestError?.response?.data?.error || "Failed to load course builder");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [selectedCourseId]);

  const refreshBuilder = async () => {
    if (!selectedCourseId) return;
    const data = await getCourseBuilderApi(selectedCourseId);
    setCourseInfo(data?.course || null);
    setModules(data?.module_structure || []);
  };

  const handleAddModule = async () => {
    if (!newModuleName.trim() || !selectedCourseId) return;

    try {
      setSaving(true);
      await addModuleApi(selectedCourseId, { name: newModuleName.trim() });
      setNewModuleName("");
      await refreshBuilder();
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to add module");
    } finally {
      setSaving(false);
    }
  };

  const handleAddLesson = async (moduleId) => {
    const title = lessonNameByModule[moduleId] || "";
    if (!title.trim() || !selectedCourseId) return;

    try {
      setSaving(true);
      await addLessonApi(selectedCourseId, moduleId, { title: title.trim(), status: "draft" });
      setLessonNameByModule((previous) => ({ ...previous, [moduleId]: "" }));
      await refreshBuilder();
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to add lesson");
    } finally {
      setSaving(false);
    }
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read selected image"));
      reader.readAsDataURL(file);
    });

  const handleThumbnailSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCourseId) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file");
      event.target.value = "";
      return;
    }

    setUploadingImage(true);
    setError("");
    try {
      const image = await fileToDataUrl(file);
      const uploadData = await uploadCourseThumbnailApi({ image, folder: "courses" });
      const imageUrl = uploadData?.url;
      if (!imageUrl) {
        throw new Error("Upload did not return image URL");
      }

      await updateCourseApi(selectedCourseId, { thumbnail_url: imageUrl });
      setCourseInfo((previous) => (previous ? { ...previous, thumbnail_url: imageUrl } : previous));
      setCourseOptions((previous) =>
        previous.map((item) => (item._id === selectedCourseId ? { ...item, thumbnail_url: imageUrl } : item))
      );
    } catch (requestError) {
      setError(requestError?.response?.data?.error || requestError?.message || "Failed to update thumbnail");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  return (
    <InstructorLayout
      pageTitle="Course Builder Page"
      pageDescription="Structure modules, edit lessons, and preview your course before publishing."
    >
      <section className="mb-4 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <label className="mb-1 block text-xs text-(--text-secondary)">Select Course</label>
        <select
          value={selectedCourseId}
          onChange={(event) => setSearchParams({ courseId: event.target.value })}
          className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none"
        >
          {courseOptions.length === 0 ? <option value="">No courses found</option> : null}
          {courseOptions.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </section>

      {error ? <p className="mb-3 text-sm text-(--instructor-badge-bg)">{error}</p> : null}

      {loading ? (
        <div className="mb-4 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 text-sm text-(--text-secondary)">
          Loading builder...
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 2xl:grid-cols-[0.9fr_1.1fr_1.2fr_0.9fr]">
        <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
          <h3 className="mb-3 text-base font-semibold">Course Info Panel</h3>
          <div className="mb-3 rounded-xl border border-(--instructor-shell-border) p-3">
            <p className="mb-2 text-xs text-(--text-secondary)">Thumbnail</p>
            <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg border border-dashed border-(--instructor-shell-border) bg-(--dash-soft-surface)">
              {courseInfo?.thumbnail_url ? (
                <img src={courseInfo.thumbnail_url} alt={courseInfo?.title || "Course thumbnail"} className="absolute inset-0 h-full w-full object-cover" />
              ) : null}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!selectedCourseId || uploadingImage}
                className="relative z-10 inline-flex items-center gap-1 rounded-md border border-(--instructor-shell-border) bg-(--bg-secondary)/90 px-2 py-1 text-[11px] font-semibold disabled:opacity-60"
              >
                <Icon icon="solar:upload-outline" width={14} />
                {uploadingImage ? "Uploading..." : "Change Thumbnail"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleThumbnailSelect} className="hidden" />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="rounded-xl border border-(--instructor-shell-border) p-3">
              <p className="text-xs text-(--text-secondary)">Title</p>
              <p className="font-medium">{courseInfo?.title || "-"}</p>
            </div>
            <div className="rounded-xl border border-(--instructor-shell-border) p-3">
              <p className="text-xs text-(--text-secondary)">Category</p>
              <p className="font-medium">{courseInfo?.category || "-"}</p>
            </div>
            <div className="rounded-xl border border-(--instructor-shell-border) p-3">
              <p className="text-xs text-(--text-secondary)">Difficulty</p>
              <p className="font-medium">{courseInfo?.difficulty || "-"}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold">Module Structure Panel</h3>
            <div className="flex items-center gap-2">
              <input
                value={newModuleName}
                onChange={(event) => setNewModuleName(event.target.value)}
                className="w-40 rounded-md border border-(--instructor-shell-border) bg-(--bg-background) px-2 py-1 text-xs outline-none"
                placeholder="New module name"
              />
              <button
                onClick={handleAddModule}
                disabled={!newModuleName.trim() || saving}
                className="inline-flex items-center gap-1 rounded-lg bg-(--instructor-button-bg) px-2.5 py-1.5 text-xs font-semibold text-(--instructor-button-text) disabled:opacity-60"
              >
                <Icon icon="solar:add-circle-outline" width={14} />
                Add Module
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {modules.map((item) => (
              <div key={item._id} className="rounded-xl border border-(--instructor-shell-border) p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <Icon icon="solar:hamburger-menu-outline" width={15} className="text-(--text-secondary)" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <input
                    value={lessonNameByModule[item._id] || ""}
                    onChange={(event) =>
                      setLessonNameByModule((previous) => ({
                        ...previous,
                        [item._id]: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-(--instructor-shell-border) bg-(--bg-background) px-2 py-1 text-[11px] outline-none"
                    placeholder="New lesson title"
                  />
                  <button
                    onClick={() => handleAddLesson(item._id)}
                    disabled={!String(lessonNameByModule[item._id] || "").trim() || saving}
                    className="rounded-md border border-(--instructor-shell-border) px-2 py-1 text-[11px] disabled:opacity-60"
                  >
                    + Add Lesson
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(item.lessons || []).map((lesson) => (
                    <button
                      key={lesson._id}
                      onClick={() => navigate(`/instructor/lessons/builder?courseId=${selectedCourseId}&moduleId=${item._id}&lessonId=${lesson._id}`)}
                      className="flex w-full items-center justify-between rounded-lg bg-(--dash-soft-surface) px-2.5 py-1.5 text-left text-xs"
                    >
                      <span>• {lesson.title}</span>
                      <Icon icon="solar:menu-dots-outline" width={14} className="text-(--text-secondary)" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold">Lesson Editor Panel</h3>
            <button className="rounded-lg border border-(--instructor-shell-border) px-2.5 py-1.5 text-xs font-semibold">Save Lesson</button>
          </div>
          <div className="space-y-3">
            <input className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none" placeholder="Lesson title" />
            <textarea className="h-56 w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2 text-sm outline-none" placeholder="Write lesson content..." />
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                "Paragraph",
                "Heading",
                "Image",
                "Code Block",
                "Quote",
                "List",
                "Table",
                "Diagram",
                "Checklist",
              ].map((block) => (
                <button key={block} className="rounded-lg border border-(--instructor-shell-border) px-2 py-1.5 hover:bg-(--dash-soft-surface)">
                  {block}
                </button>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
          <h3 className="mb-3 text-base font-semibold">Preview Panel</h3>
          <div className="rounded-xl border border-(--instructor-shell-border) bg-(--dash-soft-surface) p-3">
            <p className="text-xs text-(--text-secondary)">Live Preview</p>
            <h4 className="mt-1 text-sm font-semibold">Introduction to HTML</h4>
            <p className="mt-2 text-xs text-(--text-secondary)">
              HTML is the standard markup language for creating web pages. In this lesson, we will cover structure,
              semantic elements, and forms.
            </p>
            <div className="mt-3 rounded-lg bg-(--bg-secondary) p-2 text-[11px]">
              {`<form>\n  <input type="email" />\n</form>`}
            </div>
          </div>
        </article>
      </section>
    </InstructorLayout>
  );
};

export default InstructorCourseBuilder;
