import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import InstructorLayout from "../components/instructor/InstructorLayout";
import { listCoursesApi } from "../services/courseApi";

const courseFilters = ["All", "Published", "Draft", "Archived"];

const accentGradients = [
  "from-emerald-500/25 to-teal-500/25",
  "from-sky-500/25 to-indigo-500/25",
  "from-violet-500/25 to-fuchsia-500/25",
  "from-amber-500/25 to-orange-500/25",
  "from-cyan-500/25 to-blue-500/25",
  "from-rose-500/25 to-pink-500/25",
];

const statusClassMap = {
  published: "bg-(--instructor-status-approved) text-(--instructor-status-text)",
  draft: "bg-(--instructor-status-editing) text-(--instructor-status-text)",
  review: "bg-(--instructor-status-review) text-(--instructor-status-text)",
  archived: "bg-(--instructor-status-revision) text-(--instructor-status-text)",
};

const InstructorCourses = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 6 });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const status = activeFilter.toLowerCase() === "all" ? "all" : activeFilter.toLowerCase();
        const data = await listCoursesApi({
          page,
          limit: 6,
          status,
          search,
        });
        if (cancelled) return;
        setCourses(data?.courses || []);
        setPagination(data?.pagination || { total: 0, page: 1, pages: 1, limit: 6 });
      } catch (requestError) {
        if (cancelled) return;
        setError(requestError?.response?.data?.error || "Failed to load courses");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [activeFilter, search, page]);

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
              onClick={() => {
                setActiveFilter(filter);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                filter === activeFilter
                  ? "bg-(--instructor-button-bg) text-(--instructor-button-text)"
                  : "border border-(--instructor-shell-border) text-(--text-secondary)"
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="flex h-9 items-center gap-2 rounded-lg border border-(--instructor-shell-border) bg-(--bg-background) px-2.5">
            <Icon icon="solar:magnifer-outline" width={16} className="text-(--text-secondary)" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search courses..."
              className="w-40 bg-transparent text-xs outline-none sm:w-56"
            />
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

      {error ? <p className="mb-4 text-sm text-(--instructor-badge-bg)">{error}</p> : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-6 text-center text-sm text-(--text-secondary)">
            Loading courses...
          </div>
        ) : null}

        {!loading && courses.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-6 text-center text-sm text-(--text-secondary)">
            No courses found.
          </div>
        ) : null}

        {courses.map((course, index) => (
          <article key={course._id} className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 sm:p-4">
            <div className={`mb-3 h-36 rounded-xl border border-(--instructor-shell-border) bg-gradient-to-br ${accentGradients[index % accentGradients.length]}`} />

            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">{course.title}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClassMap[course.status] || statusClassMap.draft}`}>
                {course.status_label || course.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl border border-(--instructor-shell-border) bg-(--dash-soft-surface) p-2 text-center">
              <div>
                <p className="text-[10px] text-(--text-secondary)">Modules</p>
                <p className="text-xs font-semibold">{course.modules_count}</p>
              </div>
              <div>
                <p className="text-[10px] text-(--text-secondary)">Lessons</p>
                <p className="text-xs font-semibold">{course.lessons_count}</p>
              </div>
              <div>
                <p className="text-[10px] text-(--text-secondary)">Students</p>
                <p className="text-xs font-semibold">{course.students_count}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => navigate(`/instructor/courses/builder?courseId=${course._id}`)}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-(--instructor-shell-border) px-2.5 py-2 text-xs font-semibold"
              >
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
        <p className="text-xs text-(--text-secondary)">
          Showing {(pagination.page - 1) * pagination.limit + (courses.length ? 1 : 0)}-{(pagination.page - 1) * pagination.limit + courses.length} of {pagination.total} courses
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            disabled={pagination.page <= 1}
            className="rounded-lg border border-(--instructor-shell-border) px-2.5 py-1.5 text-xs disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: pagination.pages }, (_, idx) => idx + 1).slice(0, 5).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`rounded-lg px-2.5 py-1.5 text-xs ${
                pageNumber === pagination.page
                  ? "bg-(--instructor-button-bg) text-(--instructor-button-text)"
                  : "border border-(--instructor-shell-border)"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => setPage((previous) => Math.min(pagination.pages, previous + 1))}
            disabled={pagination.page >= pagination.pages}
            className="rounded-lg border border-(--instructor-shell-border) px-2.5 py-1.5 text-xs disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </InstructorLayout>
  );
};

export default InstructorCourses;
