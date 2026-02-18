import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("color") || "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("color", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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
            <li className="hover:text-(--text-accent) transition cursor-pointer">
              PODCASTS
            </li>
            <li className="hover:text-(--text-accent) transition cursor-pointer">
              RESOURCES
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
  // GSAP fade-in and bottom-to-up animation for navbar and menu items
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
      );
    }
    menuItemRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3 + i * 0.12,
          ease: "power3.out",
        },
      );
      el.onmouseenter = () => {
        gsap.to(el, {
          scale: 1.15,
          color: "#FFD11A",
          duration: 0.3,
          boxShadow: "0 4px 24px #FFD11A33",
        });
      };
      el.onmouseleave = () => {
        gsap.to(el, { scale: 1, color: "", duration: 0.3, boxShadow: "none" });
      };
    });
    // Cleanup
    return () => {
      menuItemRefs.current.forEach((el) => {
        if (!el) return;
        el.onmouseenter = null;
        el.onmouseleave = null;
      });
    };
  }, []);
};

export default Navbar;
