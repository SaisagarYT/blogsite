import { Icon } from "@iconify/react";

const AdminTopbar = ({ onOpenSidebar, onToggleSidebar, isSidebarCollapsed }) => {
  return (
    <header className="w-full border border-(--bg-primary) bg-(--bg-secondary) rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4 justify-between">
      <div className="flex items-center gap-2 w-full max-w-xl">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden w-9 h-9 rounded-lg border border-(--bg-primary) flex items-center justify-center"
          aria-label="Open sidebar"
        >
          <Icon icon="mdi:menu" width="18" height="18" />
        </button>
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex w-9 h-9 rounded-lg border border-(--bg-primary) items-center justify-center"
          aria-label="Collapse or expand sidebar"
        >
          <Icon icon={isSidebarCollapsed ? "mdi:chevron-right" : "mdi:chevron-left"} width="18" height="18" />
        </button>
        <div className="flex-1 h-10 rounded-lg border border-(--bg-primary) bg-(--bg-background) px-3 flex items-center gap-2">
          <Icon icon="mdi:magnify" width="18" height="18" className="text-(--text-secondary)" />
          <input
            className="w-full bg-transparent outline-none text-sm"
            placeholder="Search articles, authors, categories..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-lg border border-(--bg-primary) flex items-center justify-center">
          <Icon icon="mdi:bell-outline" width="18" height="18" />
        </button>
        <div className="w-9 h-9 rounded-lg bg-(--text-accent) text-(--text-button) font-bold text-sm flex items-center justify-center">
          BS
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
