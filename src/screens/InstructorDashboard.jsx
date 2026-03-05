import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import TopNavbar from "../components/instructor/TopNavbar";

const instructorSidebarNavigation = [
  { label: "Dashboard", icon: "solar:home-2-outline" },
  { label: "My Courses", icon: "solar:folder-with-files-outline" },
  { label: "Course Builder", icon: "solar:pen-new-square-outline" },
  { label: "Lessons", icon: "solar:notebook-outline" },
  { label: "Students", icon: "solar:users-group-rounded-outline" },
  { label: "Assignments", icon: "solar:checklist-minimalistic-outline" },
  { label: "Articles", icon: "solar:document-text-outline" },
  { label: "Community", icon: "solar:chat-round-dots-outline" },
  { label: "Messages", icon: "solar:chat-round-outline" },
  { label: "Analytics", icon: "solar:graph-up-outline" },
  { label: "Revenue", icon: "solar:dollar-minimalistic-outline" },
  { label: "Media Library", icon: "solar:gallery-wide-outline" },
  { label: "Settings", icon: "solar:settings-outline" },
];

const statsCards = [
  { title: "Total Students", value: "12,480", trend: "+8.4%", icon: "solar:users-group-rounded-outline" },
  { title: "Published Courses", value: "36", trend: "+2", icon: "solar:folder-with-files-outline" },
  { title: "Published Articles", value: "118", trend: "+12", icon: "solar:document-text-outline" },
  { title: "Total Lessons", value: "284", trend: "+9", icon: "solar:notebook-outline" },
];

const recentEnrollments = [
  { student: "Aarav Mehta", course: "React Mastery", time: "2 min ago" },
  { student: "Nisha Rao", course: "Content Strategy 101", time: "18 min ago" },
  { student: "Ethan Cruz", course: "Figma for Educators", time: "43 min ago" },
  { student: "Mia Kim", course: "AI Writing Workflow", time: "1 hr ago" },
];

const recentComments = [
  { author: "Lena", comment: "Loved the examples in lesson 3!", on: "React Mastery" },
  { author: "Victor", comment: "Can you add a downloadable checklist?", on: "Content Strategy 101" },
  { author: "Ravi", comment: "Please explain hooks dependencies once more.", on: "React Mastery" },
];

const recentQuestions = [
  { student: "Noah", question: "Will the hooks module include live coding sessions?", time: "11 min ago" },
  { student: "Sara", question: "Can we submit one capstone project for both tracks?", time: "26 min ago" },
  { student: "Ibrahim", question: "Any update on advanced lesson release date?", time: "1 hr ago" },
];

const draftContent = [
  { title: "React Routing Patterns", type: "Course", updated: "Edited 30 min ago" },
  { title: "Building Reusable Lesson Templates", type: "Lesson", updated: "Edited 2 hrs ago" },
  { title: "Teaching with AI Assistants", type: "Article", updated: "Edited yesterday" },
];

const engagementChartData = [
  { label: "Mon", value: 58 },
  { label: "Tue", value: 72 },
  { label: "Wed", value: 64 },
  { label: "Thu", value: 86 },
  { label: "Fri", value: 79 },
  { label: "Sat", value: 52 },
  { label: "Sun", value: 61 },
];

const InstructorDashboard = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const greetingName = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return user?.name || user?.displayName || user?.username || "Instructor";
    } catch {
      return "Instructor";
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-(--bg-background) text-(--text-main)">
      <div className="mx-auto flex min-h-screen max-w-full rounded-2xl border border-(--instructor-shell-border) bg-(--instructor-shell-bg)">
        <aside
          className={`fixed inset-y-0 left-0 z-40 border-r border-(--instructor-shell-border) bg-(--instructor-sidebar-bg) p-4 transition-all duration-300 lg:static lg:translate-x-0 ${
            isSidebarCollapsed ? "lg:w-[88px]" : "lg:w-[260px]"
          } ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-lg font-semibold">{isSidebarCollapsed ? "B" : "Bloggo"}</span>
              {!isSidebarCollapsed ? (
                <span className="rounded-full bg-(--instructor-chip-bg) px-2 py-1 text-[10px] font-semibold text-(--instructor-chip-text)">
                  Free plans
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                className="hidden rounded-lg border border-(--instructor-shell-border) p-1.5 lg:block"
                onClick={() => setIsSidebarCollapsed((previous) => !previous)}
                aria-label="Toggle sidebar"
              >
                <Icon icon={isSidebarCollapsed ? "solar:alt-arrow-right-outline" : "solar:alt-arrow-left-outline"} width={16} />
              </button>
              <button
                className="rounded-lg border border-(--instructor-shell-border) p-1.5 lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <Icon icon="solar:close-circle-outline" width={18} />
              </button>
            </div>
          </div>

          <nav className="space-y-1">
            {instructorSidebarNavigation.map((item) => (
              <button
                key={item.label}
                title={item.label}
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm text-(--text-main) transition-colors hover:bg-(--dash-soft-surface-hover) ${
                  isSidebarCollapsed ? "justify-center" : "justify-start gap-2.5"
                }`}
              >
                <Icon icon={item.icon} width={18} />
                {!isSidebarCollapsed ? <span>{item.label}</span> : null}
              </button>
            ))}
          </nav>
        </aside>

        {mobileSidebarOpen ? (
          <button
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close menu"
          />
        ) : null}

        <main className="w-full p-3 sm:p-4 md:p-5 lg:p-6">
          <TopNavbar greetingName={greetingName} onOpenSidebar={() => setMobileSidebarOpen(true)} />

          <section className="mb-4 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">Hi {greetingName}, welcome back 👋</h2>
                <p className="mt-1 text-sm text-(--text-secondary)">Here&apos;s your real-time teaching and content activity overview.</p>
              </div>
              <button className="rounded-lg bg-(--instructor-button-bg) px-4 py-2 text-sm font-semibold text-(--instructor-button-text)">
                View Full Report
              </button>
            </div>
          </section>

          <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statsCards.map((item) => (
              <article key={item.title} className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-(--text-secondary)">{item.title}</p>
                    <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-xs text-(--text-secondary)">{item.trend} vs last month</p>
                  </div>
                  <div className="rounded-xl border border-(--instructor-shell-border) bg-(--dash-soft-surface) p-2.5">
                    <Icon icon={item.icon} width={18} />
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_1fr]">
            <div className="space-y-4">
              <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Recent Enrollments</h3>
                  <button className="text-xs text-(--text-secondary)">View all</button>
                </div>
                <div className="space-y-2">
                  {recentEnrollments.map((item) => (
                    <div key={`${item.student}-${item.course}`} className="flex items-center justify-between rounded-xl border border-(--instructor-shell-border) p-3">
                      <div>
                        <p className="text-sm font-medium">{item.student}</p>
                        <p className="text-xs text-(--text-secondary)">{item.course}</p>
                      </div>
                      <span className="text-xs text-(--text-secondary)">{item.time}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Recent Comments</h3>
                  <button className="text-xs text-(--text-secondary)">Manage</button>
                </div>
                <div className="space-y-2">
                  {recentComments.map((item) => (
                    <div key={`${item.author}-${item.on}`} className="rounded-xl border border-(--instructor-shell-border) p-3">
                      <p className="text-sm">“{item.comment}”</p>
                      <p className="mt-1 text-xs text-(--text-secondary)">— {item.author} on {item.on}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Recent Questions</h3>
                  <button className="text-xs text-(--text-secondary)">Answer queue</button>
                </div>
                <div className="space-y-2">
                  {recentQuestions.map((item) => (
                    <div key={`${item.student}-${item.time}`} className="rounded-xl border border-(--instructor-shell-border) p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{item.student}</p>
                        <span className="text-[11px] text-(--text-secondary)">{item.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-(--text-secondary)">{item.question}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="space-y-4">
              <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Draft Content</h3>
                  <button className="text-xs text-(--text-secondary)">Open drafts</button>
                </div>
                <div className="space-y-2">
                  {draftContent.map((item) => (
                    <div key={item.title} className="rounded-xl border border-(--instructor-shell-border) p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{item.title}</p>
                        <span className="rounded-full bg-(--dash-soft-surface) px-2 py-0.5 text-[10px] font-semibold">{item.type}</span>
                      </div>
                      <p className="mt-1 text-xs text-(--text-secondary)">{item.updated}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Engagement Chart</h3>
                  <button className="text-xs text-(--text-secondary)">Weekly</button>
                </div>
                <div className="space-y-3">
                  {engagementChartData.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span>{item.label}</span>
                        <span className="text-(--text-secondary)">{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-(--dash-soft-surface)">
                        <div className="h-2 rounded-full bg-(--instructor-button-bg)" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;