import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import InstructorLayout from "../components/instructor/InstructorLayout";

const courseFilters = ["All", "Published", "Draft", "Archived"];

const courses = [
  {
    title: "React Mastery Bootcamp",
    modules: 8,
    lessons: 42,
    students: 1280,
    status: "Published",
    statusClass: "bg-(--instructor-status-approved) text-(--instructor-status-text)",
    accent: "from-emerald-500/25 to-teal-500/25",
  },
  {
    title: "CSS Systems for Modern UI",
    modules: 6,
    lessons: 29,
    students: 910,
    status: "Published",
    statusClass: "bg-(--instructor-status-approved) text-(--instructor-status-text)",
    accent: "from-sky-500/25 to-indigo-500/25",
  },
  {
    title: "AI Writing Workflow",
    modules: 5,
    lessons: 18,
    students: 612,
    status: "Draft",
    statusClass: "bg-(--instructor-status-editing) text-(--instructor-status-text)",
    accent: "from-violet-500/25 to-fuchsia-500/25",
  },
  {
    title: "Productive Lesson Design",
    modules: 4,
    lessons: 16,
    students: 334,
    status: "Review",
    statusClass: "bg-(--instructor-status-review) text-(--instructor-status-text)",
    accent: "from-amber-500/25 to-orange-500/25",
  },
  {
    title: "Frontend Performance Lab",
    modules: 7,
    lessons: 31,
    students: 540,
    status: "Published",
    statusClass: "bg-(--instructor-status-approved) text-(--instructor-status-text)",
    accent: "from-cyan-500/25 to-blue-500/25",
  },
  {
    title: "Accessible Design Systems",
    modules: 6,
    lessons: 24,
    students: 468,
    status: "Draft",
    statusClass: "bg-(--instructor-status-editing) text-(--instructor-status-text)",
    accent: "from-rose-500/25 to-pink-500/25",
  },
];

const InstructorCourses = () => {
  return (
    <InstructorLayout
      pageTitle="Courses Page"
      pageDescription="Manage, edit, and analyze all instructor courses from one place."
    >
      <section className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <div className="flex flex-wrap items-center gap-2">
          {courseFilters.map((filter) => (
            <button
              key={filter}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                filter === "All"
                  ? "bg-(--instructor-button-bg) text-(--instructor-button-text)"
                  : "border border-(--instructor-shell-border) text-(--text-secondary)"
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="flex h-9 items-center gap-2 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-2.5">
            <Icon icon="solar:magnifer-outline" width={16} className="text-(--text-secondary)" />
            <input placeholder="Search courses..." className="w-40 bg-transparent text-xs outline-none sm:w-56" />
          </div>
        </div>

        <Link
          to="/instructor/courses/create"
          className="inline-flex items-center gap-1.5 rounded-lg bg-(--instructor-button-bg) px-3.5 py-2 text-xs font-semibold text-(--instructor-button-text)"
        >
          <Icon icon="solar:add-circle-outline" width={16} />
          Create Course
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {courses.map((course) => (
          <article key={course.title} className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 sm:p-4">
            <div className={`mb-3 h-36 rounded-xl border border-(--instructor-shell-border) bg-gradient-to-br ${course.accent}`} />

            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">{course.title}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${course.statusClass}`}>{course.status}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl border border-(--instructor-shell-border) bg-(--dash-soft-surface) p-2 text-center">
              <div>
                <p className="text-[10px] text-(--text-secondary)">Modules</p>
                <p className="text-xs font-semibold">{course.modules}</p>
              </div>
              <div>
                <p className="text-[10px] text-(--text-secondary)">Lessons</p>
                <p className="text-xs font-semibold">{course.lessons}</p>
              </div>
              <div>
                <p className="text-[10px] text-(--text-secondary)">Students</p>
                <p className="text-xs font-semibold">{course.students}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-(--instructor-shell-border) px-2.5 py-2 text-xs font-semibold">
                <Icon icon="solar:pen-new-square-outline" width={14} />
                Edit
              </button>
              <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-(--instructor-shell-border) bg-(--instructor-highlight-bg) px-2.5 py-2 text-xs font-semibold">
                <Icon icon="solar:chart-outline" width={14} />
                Analytics
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
        <p className="text-xs text-(--text-secondary)">Showing 1-6 of 36 courses</p>
        <div className="flex items-center gap-1.5">
          <button className="rounded-lg border border-(--instructor-shell-border) px-2.5 py-1.5 text-xs">Previous</button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`rounded-lg px-2.5 py-1.5 text-xs ${
                page === 1
                  ? "bg-(--instructor-button-bg) text-(--instructor-button-text)"
                  : "border border-(--instructor-shell-border)"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="rounded-lg border border-(--instructor-shell-border) px-2.5 py-1.5 text-xs">Next</button>
        </div>
      </section>
    </InstructorLayout>
  );
};

export default InstructorCourses;
