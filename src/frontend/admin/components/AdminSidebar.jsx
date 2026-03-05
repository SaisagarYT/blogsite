import { Icon } from "@iconify/react";
import { adminNavSections } from "../data/dashboardData";

const NavList = ({ onItemClick, collapsed = false }) => (
  <div className="space-y-6">
    {adminNavSections.map((section) => (
      <div key={section.title}>
        {!collapsed && <p className="text-[11px] uppercase tracking-wide text-(--text-secondary) px-2">{section.title}</p>}
        <div className="mt-2 space-y-1">
          {section.items.map((item) => (
            <button
              key={item.label}
              onClick={onItemClick}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5"} px-3 py-2 rounded-lg text-sm border transition-colors ${
                item.active
                  ? "bg-(--text-accent) text-(--text-button) border-(--text-accent)"
                  : "bg-transparent text-(--text-secondary) border-transparent hover:border-(--bg-primary) hover:text-(--text-main)"
              }`}
            >
              <Icon icon={item.icon} width="18" height="18" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const AdminSidebar = ({ mobileOpen, onClose, collapsed = false }) => {
  return (
    <>
      <aside
        className={`hidden lg:flex shrink-0 border-r border-(--bg-primary) bg-(--bg-secondary) min-h-screen flex-col transition-all duration-300 ease-in-out ${
          collapsed ? "w-20 p-3" : "w-64 xl:w-68 p-4 xl:p-5"
        }`}
      >
        <div className={`flex items-center px-2 ${collapsed ? "justify-center" : "gap-2"}`}>
          <div className="w-8 h-8 rounded-lg bg-(--text-accent) text-(--text-button) flex items-center justify-center font-bold">B</div>
          {!collapsed && <h1 className="font-semibold text-lg">BlogSite Admin</h1>}
        </div>
        <div className="mt-6 flex-1 overflow-y-auto pr-1">
          <NavList collapsed={collapsed} />
        </div>
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button onClick={onClose} className="absolute inset-0 bg-black/45" aria-label="Close sidebar overlay" />
        <aside
          className={`absolute left-0 top-0 h-full w-[82%] max-w-[300px] border-r border-(--bg-primary) bg-(--bg-secondary) p-4 transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-(--text-accent) text-(--text-button) flex items-center justify-center font-bold">B</div>
              <h1 className="font-semibold">BlogSite Admin</h1>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-(--bg-primary) flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <Icon icon="mdi:close" width="16" height="16" />
            </button>
          </div>

          <div className="mt-6 h-[calc(100%-64px)] overflow-y-auto pr-1">
            <NavList onItemClick={onClose} />
          </div>
        </aside>
      </div>
    </>
  );
};

export default AdminSidebar;
