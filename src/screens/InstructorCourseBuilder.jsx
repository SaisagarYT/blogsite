import { Icon } from "@iconify/react";
import InstructorLayout from "../components/instructor/InstructorLayout";

const moduleStructure = [
  {
    module: "HTML Fundamentals",
    lessons: ["Introduction to HTML", "HTML Elements", "HTML Forms"],
  },
  {
    module: "CSS Basics",
    lessons: ["CSS Selectors", "Flexbox", "Grid"],
  },
];

const InstructorCourseBuilder = () => {
  return (
    <InstructorLayout
      pageTitle="Course Builder Page"
      pageDescription="Structure modules, edit lessons, and preview your course before publishing."
    >
      <section className="grid grid-cols-1 gap-4 2xl:grid-cols-[0.9fr_1.1fr_1.2fr_0.9fr]">
        <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
          <h3 className="mb-3 text-base font-semibold">Course Info Panel</h3>
          <div className="space-y-2 text-sm">
            <div className="rounded-xl border border-(--instructor-shell-border) p-3">
              <p className="text-xs text-(--text-secondary)">Title</p>
              <p className="font-medium">Mastering Modern React</p>
            </div>
            <div className="rounded-xl border border-(--instructor-shell-border) p-3">
              <p className="text-xs text-(--text-secondary)">Category</p>
              <p className="font-medium">Web Development</p>
            </div>
            <div className="rounded-xl border border-(--instructor-shell-border) p-3">
              <p className="text-xs text-(--text-secondary)">Difficulty</p>
              <p className="font-medium">Intermediate</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold">Module Structure Panel</h3>
            <button className="inline-flex items-center gap-1 rounded-lg bg-(--instructor-button-bg) px-2.5 py-1.5 text-xs font-semibold text-(--instructor-button-text)">
              <Icon icon="solar:add-circle-outline" width={14} />
              Add Module
            </button>
          </div>

          <div className="space-y-3">
            {moduleStructure.map((item) => (
              <div key={item.module} className="rounded-xl border border-(--instructor-shell-border) p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold">{item.module}</p>
                  <Icon icon="solar:hamburger-menu-outline" width={15} className="text-(--text-secondary)" />
                </div>
                <div className="space-y-1.5">
                  {item.lessons.map((lesson) => (
                    <div key={lesson} className="flex items-center justify-between rounded-lg bg-(--dash-soft-surface) px-2.5 py-1.5 text-xs">
                      <span>• {lesson}</span>
                      <Icon icon="solar:menu-dots-outline" width={14} className="text-(--text-secondary)" />
                    </div>
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
