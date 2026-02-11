import { useEffect, useState } from "react";

const Navbar = () => {
  const [color, setColor] = useState(localStorage.getItem("color") || "dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("theme", color);
  }, [color]);

  const changeTheme = () => {
    const newColor = color === "dark" ? "light" : "dark";
    localStorage.setItem("color", newColor);
    setColor(newColor);
  };

  return (
    <nav className="w-full bg-[var(--bg-primary)] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center font-bold text-lg text-black shadow-md">
              TM
            </div>
            <span className="font-extrabold text-xl tracking-wide text-[var(--text-main)]">
              TECHMESTORY
            </span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 items-center font-medium text-[var(--text-main)]">
            <li className="hover:text-[var(--text-accent)] transition cursor-pointer">
              HOME
            </li>
            <li className="hover:text-[var(--text-accent)] transition cursor-pointer">
              NEWS
            </li>
            <li className="hover:text-[var(--text-accent)] transition cursor-pointer">
              PODCASTS
            </li>
            <li className="hover:text-[var(--text-accent)] transition cursor-pointer">
              RESOURCES
            </li>
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button className="hidden md:block bg-[var(--text-accent)] text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-yellow-300 transition">
              Contact Us
            </button>
            {/* Theme Toggle Button */}
            <button
              onClick={changeTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--text-border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] transition"
              aria-label="Toggle theme">
              {color === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-yellow-400">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1.5m0 15V21m8.485-8.485h-1.5m-15 0H3m15.364-6.364l-1.06 1.06m-10.607 10.607l-1.06 1.06m12.727 0l-1.06-1.06m-10.607-10.607l-1.06-1.06M12 7.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-800">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.664-7.64 6.438-9.049a.75.75 0 0 1 .908.325.75.75 0 0 1-.062.954A7.501 7.501 0 0 0 12 19.5a7.48 7.48 0 0 0 6.02-3.02.75.75 0 0 1 .954-.062.75.75 0 0 1 .325.908z"
                  />
                </svg>
              )}
            </button>
            {/* Hamburger Menu Button */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded border border-[var(--text-border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu">
              <span
                className={`block w-6 h-0.5 bg-[var(--text-main)] mb-1 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span
                className={`block w-6 h-0.5 bg-[var(--text-main)] mb-1 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
              <span
                className={`block w-6 h-0.5 bg-[var(--text-main)] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--bg-primary)] px-4 pb-4 pt-2 shadow-lg animate-fade-in-down">
          <ul className="flex flex-col gap-4 font-medium text-[var(--text-main)]">
            <li className="hover:text-[var(--text-accent)] transition cursor-pointer">
              HOME
            </li>
            <li className="hover:text-[var(--text-accent)] transition cursor-pointer">
              NEWS
            </li>
            <li className="hover:text-[var(--text-accent)] transition cursor-pointer">
              PODCASTS
            </li>
            <li className="hover:text-[var(--text-accent)] transition cursor-pointer">
              RESOURCES
            </li>
            <li>
              <button className="w-full bg-[var(--text-accent)] text-black font-semibold px-5 py-2 rounded-lg shadow hover:bg-yellow-300 transition">
                Contact Us
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
