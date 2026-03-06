import { useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const PlatformLogo = () => (
  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--instructor-button-bg) text-(--instructor-button-text)">
      <Icon icon="solar:document-text-outline" width={16} />
    </div>
    <span className="text-sm font-semibold sm:text-base">Keenshot</span>
  </div>
);

const GlobalSearchBar = () => (
  <div className="hidden h-10 flex-1 items-center gap-2 rounded-xl border border-(--instructor-shell-border) bg-(--bg-background) px-3 lg:flex">
    <Icon icon="solar:magnifer-outline" width={18} className="text-(--text-secondary)" />
    <input
      type="text"
      placeholder="Search courses, lessons, and articles"
      className="w-full bg-transparent text-sm outline-none"
    />
  </div>
);

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-(--instructor-shell-border)"
        aria-label="Notifications"
      >
        <Icon icon="solar:bell-outline" width={18} />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-(--instructor-badge-bg)" />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-2 shadow-sm">
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-(--text-secondary)">Notifications</p>
          {[
            "Your course draft is ready for review",
            "New comment on \"React Fundamentals\"",
            "Reminder: publish this week's lesson",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setOpen(false)}
              className="w-full rounded-lg px-2 py-2 text-left text-xs hover:bg-(--dash-soft-surface)"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const MessagesIcon = () => (
  <button
    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-(--instructor-shell-border)"
    aria-label="Messages"
  >
    <Icon icon="solar:chat-round-outline" width={18} />
    <span className="absolute right-1 top-1 rounded-full bg-(--instructor-highlight-bg) px-1 text-[9px] font-semibold text-(--text-main)">
      3
    </span>
  </button>
);

const CreateButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const createMenuItems = [
    { label: "Course", path: "/instructor/courses/create" },
    { label: "Lesson", path: "/instructor/lessons/builder" },
    { label: "Article", path: "/instructor/articles/create" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-lg bg-(--instructor-button-bg) px-3 py-2 text-xs font-semibold text-(--instructor-button-text)"
      >
        <Icon icon="solar:add-circle-outline" width={16} />
        Create
        <Icon icon="solar:alt-arrow-down-outline" width={14} />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-40 rounded-xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-1 shadow-sm">
          {createMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setOpen(false);
                navigate(item.path);
              }}
              className="w-full rounded-lg px-2 py-2 text-left text-xs hover:bg-(--dash-soft-surface)"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const UserProfileMenu = ({ name }) => {
  const [open, setOpen] = useState(false);
  const initials = useMemo(() => (name?.slice(0, 1) || "I").toUpperCase(), [name]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-(--instructor-shell-border) px-1.5 py-1"
        aria-label="User profile"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--instructor-avatar-bg) text-[11px] font-semibold text-(--instructor-avatar-text)">
          {initials}
        </span>
        <span className="hidden text-xs font-medium sm:block">{name}</span>
        <Icon icon="solar:alt-arrow-down-outline" width={14} className="hidden sm:block" />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-44 rounded-xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-1 shadow-sm">
          {[
            "Profile",
            "Account Settings",
            "Instructor Settings",
            "Billing",
            "Logout",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setOpen(false)}
              className="w-full rounded-lg px-2 py-2 text-left text-xs hover:bg-(--dash-soft-surface)"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const TopNavbar = ({ greetingName, onOpenSidebar }) => {
  const wrapperRef = useRef(null);

  return (
    <header
      ref={wrapperRef}
      className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-(--instructor-shell-border) bg-(--bg-secondary) p-3 sm:gap-3 sm:p-4"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:flex-1">
        <button
          className="rounded-lg border border-(--instructor-shell-border) p-2 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Icon icon="solar:hamburger-menu-outline" width={18} />
        </button>
        <PlatformLogo />
        <GlobalSearchBar />
      </div>

      <div className="flex items-center gap-2">
        <NotificationsDropdown />
        <MessagesIcon />
        <CreateButton />
        <UserProfileMenu name={greetingName} />
      </div>
    </header>
  );
};

export default TopNavbar;
