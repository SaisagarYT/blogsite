import { useState } from "react";
import { Icon } from "@iconify/react";
import InstructorLayout from "../components/instructor/InstructorLayout";

const categoryOptions = ["Web Development", "Design", "Marketing", "Business"];
const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
const tagOptions = ["React", "JavaScript", "UI/UX", "Productivity", "AI"];

const InstructorCreateCourse = () => {
  const [selectedTags, setSelectedTags] = useState(["React", "UI/UX"]);
  const [publishNow, setPublishNow] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((previous) =>
      previous.includes(tag) ? previous.filter((item) => item !== tag) : [...previous, tag]
    );
  };

  return (
    <InstructorLayout
      pageTitle="Create Course Page"
      pageDescription="Configure your new course details, taxonomy, media, and publishing options."
    >
      <form className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="space-y-4">
          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Course Basics</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Course Title</label>
                <input className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none" placeholder="Mastering Modern React" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Slug</label>
                <input className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none" placeholder="mastering-modern-react" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Description</label>
                <textarea className="h-36 w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none" placeholder="Write a compelling course description..." />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <h3 className="mb-3 text-base font-semibold">Course Metadata</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Category</label>
                <select className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none">
                  {categoryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Difficulty</label>
                <select className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none">
                  {difficultyOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-(--text-secondary)">Estimated Duration</label>
                <input className="w-full rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 py-2.5 text-sm outline-none" placeholder="e.g. 12 hours" />
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

          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-lg border border-(--instructor-shell-border) px-4 py-2 text-sm font-semibold">
              Save Draft
            </button>
            <button type="submit" className="rounded-lg bg-(--instructor-button-bg) px-4 py-2 text-sm font-semibold text-(--instructor-button-text)">
              Create Course
            </button>
          </div>
        </section>
      </form>
    </InstructorLayout>
  );
};

export default InstructorCreateCourse;
