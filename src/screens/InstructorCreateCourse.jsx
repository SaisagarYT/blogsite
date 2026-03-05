import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import InstructorLayout from "../components/instructor/InstructorLayout";
import { createCourseApi } from "../services/courseApi";

const categoryOptions = ["Web Development", "Design", "Marketing", "Business"];
const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
const tagOptions = ["React", "JavaScript", "UI/UX", "Productivity", "AI"];

const InstructorCreateCourse = () => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState(["React", "UI/UX"]);
  const [publishNow, setPublishNow] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: categoryOptions[0],
    difficulty: difficultyOptions[0],
    estimated_duration: "",
    thumbnail_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleTag = (tag) => {
    setSelectedTags((previous) =>
      previous.includes(tag) ? previous.filter((item) => item !== tag) : [...previous, tag]
    );
  };

  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return user?._id || user?.id || null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (event, mode = "published") => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Course title is required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        category: form.category,
        difficulty: String(form.difficulty || "beginner").toLowerCase(),
        tags: selectedTags,
        thumbnail_url: form.thumbnail_url,
        estimated_duration: form.estimated_duration,
        publish_now: mode === "published",
        status: mode === "published" ? "published" : "draft",
        instructor_id: getCurrentUserId(),
      };

      const data = await createCourseApi(payload);
      const courseId = data?.course?._id || data?.builder?._id;
      if (courseId) {
        navigate(`/instructor/courses/builder?courseId=${courseId}`);
        return;
      }
      navigate("/instructor/courses");
    } catch (requestError) {
      setError(requestError?.response?.data?.error || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <InstructorLayout
      pageTitle="Create Course Page"
      pageDescription="Configure your new course details, taxonomy, media, and publishing options."
    >
      <form className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]" onSubmit={(event) => handleSubmit(event, "published")}>
        <section className="space-y-4">
          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Course Basics</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Course Title</label>
                <input
                  value={form.title}
                  onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                  className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none"
                  placeholder="Mastering Modern React"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Slug</label>
                <input
                  value={form.slug}
                  onChange={(event) => setForm((previous) => ({ ...previous, slug: event.target.value }))}
                  className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none"
                  placeholder="mastering-modern-react"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Description</label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
                  className="h-36 w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none"
                  placeholder="Write a compelling course description..."
                />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Course Metadata</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Category</label>
                <select
                  value={form.category}
                  onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
                  className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none"
                >
                  {categoryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(event) => setForm((previous) => ({ ...previous, difficulty: event.target.value }))}
                  className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none"
                >
                  {difficultyOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Estimated Duration</label>
                <input
                  value={form.estimated_duration}
                  onChange={(event) => setForm((previous) => ({ ...previous, estimated_duration: event.target.value }))}
                  className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none"
                  placeholder="e.g. 12 hours"
                />
              </div>
            </div>
          </article>
        </section>

        <section className="space-y-4">
          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      selected
                        ? "bg-(--instructor-button-bg) text-(--instructor-button-text)"
                        : "border border-(--instructor-shell-border) text-(--text-secondary)"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Course Thumbnail Upload</h3>
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-(--instructor-shell-border) bg-(--dash-soft-surface)">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-(--instructor-shell-border) px-3 py-2 text-xs font-semibold">
                <Icon icon="solar:upload-outline" width={15} />
                Upload Image
              </button>
            </div>
            <input
              value={form.thumbnail_url}
              onChange={(event) => setForm((previous) => ({ ...previous, thumbnail_url: event.target.value }))}
              className="mt-3 w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none"
              placeholder="Paste thumbnail image URL"
            />
          </article>

          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Publish Toggle</h3>
                <p className="text-xs text-(--text-secondary)">Enable to publish immediately after creation.</p>
              </div>
              <button
                type="button"
                onClick={() => setPublishNow((previous) => !previous)}
                className={`flex h-7 w-12 items-center rounded-full p-1 transition-all ${
                  publishNow ? "bg-(--instructor-button-bg)" : "bg-(--dash-soft-surface)"
                }`}
              >
                <span className={`h-5 w-5 rounded-full bg-white transition-transform ${publishNow ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </article>

          {error ? <p className="text-xs text-(--instructor-badge-bg)">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={(event) => handleSubmit(event, "draft")}
              disabled={saving}
              className="rounded-lg border border-(--instructor-shell-border) px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              Save Draft
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-(--instructor-button-bg) px-4 py-2 text-sm font-semibold text-(--instructor-button-text) disabled:opacity-60">
              {saving ? "Saving..." : "Create Course"}
            </button>
          </div>
        </section>
      </form>
    </InstructorLayout>
  );
};

export default InstructorCreateCourse;
