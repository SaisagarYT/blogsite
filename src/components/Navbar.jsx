import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("color") || "dark");
  const [podcastsOpen, setPodcastsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("color", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const [resourcesOpen, setResourcesOpen] = useState(false);
  let resourcesTimeout;

  // Podcasts dropdown hover logic
  let podcastsTimeout;
  const handlePodcastsEnter = () => {
    clearTimeout(podcastsTimeout);
    setPodcastsOpen(true);
  };
  const handlePodcastsLeave = () => {
    podcastsTimeout = setTimeout(() => setPodcastsOpen(false), 120);
  };

  // Handlers to control dropdown visibility
  const handleResourcesEnter = () => {
    clearTimeout(resourcesTimeout);
    setResourcesOpen(true);
  };
  const handleResourcesLeave = () => {
    resourcesTimeout = setTimeout(() => setResourcesOpen(false), 120);
  };

  return (
    <nav className="w-full fixed top-6 left-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div
          className="flex justify-between items-center h-20 rounded-2xl px-8 py-4 backdrop-blur-lg bg-white/30 border border-white/40 shadow-lg"
          style={{
            boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
            borderRadius: "2rem",
          }}>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center font-bold text-lg text-black shadow-md">
              TM
            </div>
            <span className="font-extrabold text-xl tracking-wide text-(--text-main)">
              TECHMESTORY
            </span>
          </div>
          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 items-center font-medium text-(--text-main)">
            <li className="hover:text-(--text-accent) transition cursor-pointer">
              HOME
            </li>
            <li className="hover:text-(--text-accent) transition cursor-pointer">
              NEWS
            </li>
            <li
              className="relative"
              onMouseEnter={handlePodcastsEnter}
              onMouseLeave={handlePodcastsLeave}
            >
              <div className="flex items-center gap-1 hover:text-(--text-accent) transition cursor-pointer select-none">
                <span>Podcasts</span>
                <Icon icon="mdi:chevron-down" width="20" height="20" />
              </div>
              {/* Podcasts Dropdown */}
              {podcastsOpen && (
                <div className="fixed left-0 top-22 w-full bg-white/30 backdrop-blur-lg dark:bg-(--bg-primary) border border-white/40 dark:border-(--bg-secondary) shadow-lg px-32 py-10 flex flex-row gap-10 text-sm text-black dark:text-white z-50 rounded-b-2xl animate-fade-in-down transition-all duration-200"
                  onMouseEnter={handlePodcastsEnter}
                  onMouseLeave={handlePodcastsLeave}
                >
                  {/* All Episodes & By Topic */}
                  <div className="min-w-[180px] flex flex-col gap-2 border-r border-gray-100 dark:border-gray-800 pr-8">
                    <div className="font-bold text-xs text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Icon icon="mdi:playlist-play" width="18" className="text-(--text-accent)" />
                      All Episodes
                    </div>
                    <ul className="flex flex-col gap-2">
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-white/40 hover:backdrop-blur-md dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon icon="mdi:tag-multiple-outline" width="16" className="opacity-60 group-hover/item:text-yellow-500" /> By Topic
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-white/50 hover:backdrop-blur-md dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon icon="mdi:robot-outline" width="16" className="opacity-60 group-hover/item:text-yellow-500" /> AI Talks
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-white/50 hover:backdrop-blur-md dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon icon="mdi:code-braces" width="16" className="opacity-60 group-hover/item:text-yellow-500" /> Dev Talks
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-white/50 hover:backdrop-blur-md dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon icon="mdi:account-tie-outline" width="16" className="opacity-60 group-hover/item:text-yellow-500" /> Founder Stories
                      </li>
                    </ul>
                  </div>
                  {/* Featured & Latest */}
                  <div className="min-w-[180px] flex flex-col gap-2 border-r border-gray-100 dark:border-gray-800 pr-8">
                    <div className="font-bold text-xs text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Icon icon="mdi:star-outline" width="18" className="text-(--text-accent)" />
                      Featured Episodes
                    </div>
                    <ul className="flex flex-col gap-2">
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon icon="mdi:fire" width="16" className="opacity-60 group-hover/item:text-yellow-500" /> Latest Episode
                      </li>
                    </ul>
                  </div>
                  {/* Submit a Podcast */}
                  <div className="min-w-[180px] flex flex-col gap-2">
                    <div className="font-bold text-xs text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Icon icon="mdi:microphone-plus" width="18" className="text-(--text-accent)" />
                      Community
                    </div>
                    <ul className="flex flex-col gap-2">
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon icon="mdi:upload" width="16" className="opacity-60 group-hover/item:text-yellow-500" /> Submit a Podcast
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>
            <li
              className="relative"
              onMouseEnter={handleResourcesEnter}
              onMouseLeave={handleResourcesLeave}
            >
              <div className="flex items-center gap-1 hover:text-(--text-accent) transition cursor-pointer select-none">
                <span>Resources</span>
                <Icon icon="mdi:chevron-down" width="20" height="20" />
              </div>
              {/* Mega Dropdown */}
              {resourcesOpen && (
                <div className="fixed left-0 top-22 w-full bg-white/30 backdrop-blur-lg dark:bg-(--bg-primary) border border-white/40 dark:border-(--bg-secondary) shadow-lg px-32 py-10 flex flex-row gap-10 text-sm text-black dark:text-white z-50 rounded-b-2xl animate-fade-in-down transition-all duration-200">
                  {/* Learning Paths */}
                  <div className="min-w-[220px] border-r border-gray-100 dark:border-gray-800 pr-8 flex flex-col gap-2">
                    <div className="font-bold text-xs text-gray-500 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Icon
                        icon="mdi:map-marker-path"
                        width="18"
                        className="text-(--text-accent)"
                      />{" "}
                      Learning Paths
                    </div>
                    <ul className="flex flex-col gap-2">
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-white/40 hover:backdrop-blur-md dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:star-outline"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        Beginner Roadmap
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:trending-up"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        Intermediate Roadmap
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:rocket-launch-outline"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        Advanced Roadmap
                      </li>
                    </ul>
                  </div>
                  {/* Cheat Sheets */}
                  <div className="min-w-[220px] border-r border-gray-100 dark:border-gray-800 pr-8 flex flex-col gap-2">
                    <div className="font-bold text-xs text-gray-500 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Icon
                        icon="mdi:file-document-outline"
                        width="18"
                        className="text-(--text-accent)"
                      />{" "}
                      Cheat Sheets
                    </div>
                    <ul className="flex flex-col gap-2">
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:language-javascript"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        JavaScript
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:react"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        React
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:language-python"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        Python
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:git"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        Git
                      </li>
                    </ul>
                  </div>
                  {/* Tools */}
                  <div className="min-w-[220px] border-r border-gray-100 dark:border-gray-800 pr-8 flex flex-col gap-2">
                    <div className="font-bold text-xs text-gray-500 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Icon
                        icon="mdi:tools"
                        width="18"
                        className="text-(--text-accent)"
                      />{" "}
                      Tools
                    </div>
                    <ul className="flex flex-col gap-2">
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:gift-outline"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        Free Tools
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:code-braces"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        Developer Tools
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:robot-outline"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        AI Tools
                      </li>
                    </ul>
                  </div>
                  {/* Downloads */}
                  <div className="min-w-[220px] flex flex-col gap-2">
                    <div className="font-bold text-xs text-gray-500 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Icon
                        icon="mdi:download-outline"
                        width="18"
                        className="text-(--text-accent)"
                      />{" "}
                      Downloads
                    </div>
                    <ul className="flex flex-col gap-2">
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:file-pdf-box"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        PDFs
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:note-multiple-outline"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        Templates
                      </li>
                      <li className="group/item flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:bg-yellow-50 dark:hover:bg-(--bg-secondary) hover:shadow-md">
                        <Icon
                          icon="mdi:book-open-page-variant-outline"
                          width="16"
                          className="opacity-60 group-hover/item:text-yellow-500"
                        />{" "}
                        Ebooks
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>
          </ul>
          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button className="hidden md:block bg-(--text-accent) text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-yellow-300 transition">
              Contact Us
            </button>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-(--text-border) transition-all duration-200
                ${theme === "dark" ? "bg-black" : "bg-yellow-300"}`}
              aria-label="Toggle theme">
              {theme === "dark" ? (
                <Icon
                  icon="mdi:weather-night"
                  width="24"
                  height="24"
                  className="text-yellow-300"
                />
              ) : (
                <Icon
                  icon="mdi:weather-sunny"
                  width="24"
                  height="24"
                  className="text-black"
                />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-(--bg-primary) px-4 pb-4 pt-2 shadow-lg animate-fade-in-down">
          <ul className="flex flex-col gap-4 font-medium text-(--text-main)">
            <li className="hover:text-(--text-accent) transition cursor-pointer">
              HOME
            </li>
            <li className="hover:text-(--text-accent) transition cursor-pointer">
              NEWS
            </li>
            <li className="hover:text-(--text-accent) transition cursor-pointer">
              PODCASTS
            </li>
            <li className="hover:text-(--text-accent) transition cursor-pointer">
              RESOURCES
            </li>
            <li>
              <button className="w-full bg-(--text-accent) text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-yellow-300 transition">
                Contact Us
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
