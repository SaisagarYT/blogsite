import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import bgImg1 from "../assets/alps-snow-mountains-3840x2160-25451.jpg";
import bgImg2 from "../assets/os-x-lion-twilight-3840x2160-24060.jpg";
import bgImg3 from "../assets/katerina-kerdi--YiJvbfNDqk-unsplash.jpg";

const DashPage = () => {
  const navigate = useNavigate();
  const localUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const [currentUser, setCurrentUser] = useState(localUser);
  const [profileImageError, setProfileImageError] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const profileImage = currentUser?.picture || "";
  const effectiveProfileImage = profileImageError ? "" : profileImage;
  const slides = [bgImg1, bgImg2, bgImg3];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [slides.length]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localUser?._id && !localUser?.email) return;

      try {
        const params = localUser?._id
          ? { userId: localUser._id }
          : { email: localUser.email };

        const res = await axios.get(`${API_BASE_URL}/api/user/me`, {
          params,
          withCredentials: true,
        });

        if (res.data?.success && res.data?.user) {
          setCurrentUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setProfileImageError(false);
        }
      } catch (error) {
        console.error("Fetch current user failed:", error);
      }
    };

    fetchCurrentUser();
  }, [localUser?._id, localUser?.email]);


  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/user/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen bg-(--bg-background) text-(--text-main)">
      <div className="w-full h-full bg-(--bg-secondary) border border-(--bg-primary) p-3 md:p-5 shadow-xl">
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/40">
          {slides.map((slide, index) => (
            <div
              key={slide}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${slide})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/60" />

          <div className="relative z-10 p-3 md:p-5 h-full flex flex-col justify-between">
            <div className="w-full flex items-center justify-between gap-3 rounded-md bg-transparent px-3 py-3 md:px-5 md:py-4 text-white">
              <button
                className="font-semibold tracking-wide text-sm md:text-base"
                onClick={() => navigate("/")}>
                BLOGSITE
              </button>

              <div className="hidden md:flex items-center gap-8">
                <ul className="flex items-center gap-7 text-sm font-medium">
                  <li className="cursor-pointer hover:text-(--text-accent)" onClick={() => navigate("/")}>HOME</li>
                  <li className="cursor-pointer hover:text-(--text-accent)" onClick={() => navigate("/news")}>TECHNEWS</li>
                  <li className="cursor-default">Explore</li>
                  <li className="cursor-default">Resources</li>
                </ul>

                <div className="w-102 h-10 rounded-lg border border-white/35 bg-white/15 backdrop-blur-sm flex items-center px-3">
                  <input
                    type="text"
                    placeholder="Search destination..."
                    className="w-full bg-transparent text-sm text-white placeholder-white/70 outline-none"
                  />
                  <Icon icon="mdi:magnify" width="20" height="20" className="text-white/90" />
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/60 hover:bg-white/10 flex items-center justify-center"
                  onClick={() => navigate("/")}>
                  {effectiveProfileImage ? (
                    <img
                      src={effectiveProfileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                      onError={() => setProfileImageError(true)}
                    />
                  ) : (
                    <Icon icon="mdi:account-outline" width="20" height="20" />
                  )}
                </button>
                <button
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-(--text-accent) text-(--text-button) text-xs md:text-sm font-semibold"
                  onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            <div className="max-w-2xl text-white pb-2 md:pb-4">
              <span className="inline-block text-xs px-3 py-1 rounded-full border border-white/50 bg-black/20 mb-3">
                Dashboard
              </span>
              <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                Welcome back{currentUser?.username ? `, ${currentUser.username}` : ""}
              </h1>
              <p className="mt-2 text-sm md:text-base text-white/90">
                Explore your latest updates and continue your reading journey.
              </p>
              <div className="flex items-center gap-2 mt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`w-3 h-3 rounded-full border border-white/70 transition-all ${
                      index === activeSlide ? "bg-white" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashPage;
