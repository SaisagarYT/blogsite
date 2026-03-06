import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import TopNavbar from "./TopNavbar";
import { instructorSidebarNavigation } from "./instructorNavigation";

const InstructorLayout = ({ children, pageTitle, pageDescription }) => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    Articles: location.pathname.startsWith("/instructor/articles"),
  });

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
              <span className="text-lg font-semibold">{isSidebarCollapsed ? "K" : "Keenshot"}</span>
              {!isSidebarCollapsed ? (
                <span className="rounded-full bg-(--instructor-chip-bg) px-2 py-1 text-[10px] font-semibold text-(--instructor-chip-text)">
                  Pro Panel
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
            {instructorSidebarNavigation.map((item) => {
              const commonClasses = `flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                isSidebarCollapsed ? "justify-center" : "justify-start gap-2.5"
              }`;

              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isChildActive = hasChildren
                ? item.children.some((child) =>
                    child.path ? location.pathname === child.path || location.pathname.startsWith(`${child.path}/`) : false
                  )
                : false;

              if (hasChildren) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      title={item.label}
                      onClick={() => {
                        if (isSidebarCollapsed) return;
                        setOpenGroups((previous) => ({
                          ...previous,
                          [item.label]: !previous[item.label],
                        }));
                      }}
                      className={`${commonClasses} ${
                        isChildActive
                          ? "border border-(--instructor-highlight-border) bg-(--instructor-highlight-bg) text-(--text-main)"
                          : "text-(--text-main) hover:bg-(--dash-soft-surface-hover)"
                      }`}
                    >
                      <Icon icon={item.icon} width={18} />
                      {!isSidebarCollapsed ? (
                        <>
                          <span className="flex-1">{item.label}</span>
                          <Icon
                            icon={openGroups[item.label] ? "solar:alt-arrow-down-outline" : "solar:alt-arrow-right-outline"}
                            width={14}
                          />
                        </>
                      ) : null}
                    </button>

                    {!isSidebarCollapsed && openGroups[item.label] ? (
                      <div className="ml-4 space-y-1 border-l border-(--instructor-shell-border) pl-3">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.label}
                            to={child.path}
                            className={({ isActive }) =>
                              `flex items-center rounded-lg px-2.5 py-2 text-xs transition-colors ${
                                isActive
                                  ? "bg-(--instructor-highlight-bg) text-(--text-main)"
                                  : "text-(--text-secondary) hover:bg-(--dash-soft-surface-hover)"
                              }`
                            }
                            onClick={() => setMobileSidebarOpen(false)}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }

              if (item.path) {
                return (
                  <NavLink
                    key={item.label}
                    title={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                      `${commonClasses} ${
                        isActive
                          ? "border border-(--instructor-highlight-border) bg-(--instructor-highlight-bg) text-(--text-main)"
                          : "text-(--text-main) hover:bg-(--dash-soft-surface-hover)"
                      }`
                    }
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <Icon icon={item.icon} width={18} />
                    {!isSidebarCollapsed ? <span>{item.label}</span> : null}
                  </NavLink>
                );
              }

              return (
                <button
                  key={item.label}
                  title={item.label}
                  className={`${commonClasses} text-(--text-secondary) hover:bg-(--dash-soft-surface-hover)`}
                >
                  <Icon icon={item.icon} width={18} />
                  {!isSidebarCollapsed ? <span>{item.label}</span> : null}
                </button>
              );
            })}
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

          {(pageTitle || pageDescription) ? (
            <section className="mb-4 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-4 sm:p-5">
              {pageTitle ? <h1 className="text-xl font-semibold sm:text-2xl">{pageTitle}</h1> : null}
              {pageDescription ? <p className="mt-1 text-sm text-(--text-secondary)">{pageDescription}</p> : null}
            </section>
          ) : null}

          {children}
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;
