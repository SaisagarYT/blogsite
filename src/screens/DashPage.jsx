import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import bgImg1 from "../assets/alps-snow-mountains-3840x2160-25451.jpg";
import bgImg2 from "../assets/os-x-lion-twilight-3840x2160-24060.jpg";
import bgImg3 from "../assets/katerina-kerdi--YiJvbfNDqk-unsplash.jpg";
import Webassets from "../assets/Assets";

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


  return (
    <div className="min-h-screen w-screen bg-(--bg-background) text-(--text-main) overflow-x-hidden">
      <div className="w-full bg-(--bg-secondary) border border-(--bg-primary) p-3 md:p-5 shadow-xl">
        <div className="relative w-full h-[88vh] rounded-xl overflow-hidden border border-white/40">
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

        <section className="mt-6 md:mt-8 rounded-xl border border-(--bg-primary) bg-(--bg-secondary) p-3 md:p-5">
          <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
            <h2 className="text-2xl md:text-5xl font-bold italic tracking-tight">Best blog of the week ...</h2>
            <button
              style={{
                backgroundColor: "var(--dash-soft-surface)",
                color: "var(--dash-soft-text)",
              }}
              className="px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-sm md:text-base font-medium flex items-center gap-2 transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--dash-soft-surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--dash-soft-surface)";
              }}>
              See all post
              <Icon icon="mdi:arrow-right" width="18" height="18" />
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-4">
            <article
              className="xl:col-span-2 relative min-h-[360px] md:min-h-[560px] rounded-3xl overflow-hidden border border-black/10"
              style={{
                backgroundImage: `url(${bgImg1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/65" />

              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <span
                  style={{
                    backgroundColor: "var(--dash-overlay-card-bg)",
                    color: "var(--dash-overlay-card-text)",
                  }}
                  className="text-xs px-3 py-1 rounded-full">
                  Jan 06,2024
                </span>
                <span className="text-xs bg-black/70 text-white px-3 py-1 rounded-full border border-white/20">Travel</span>
              </div>

              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 flex items-end justify-between gap-3 z-10">
                <div
                  style={{ backgroundColor: "var(--dash-overlay-card-bg)" }}
                  className="rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 max-w-[80%]">
                  <span style={{ color: "var(--dash-overlay-card-subtext)" }} className="text-xs block mb-1">• Travel</span>
                  <h3 style={{ color: "var(--dash-overlay-card-text)" }} className="text-3xl md:text-6xl leading-tight font-black italic">
                    Get to your dream
                    <br />
                    now destinations with
                    <br />
                    TravelPro
                  </h3>
                </div>
                <button
                  style={{
                    backgroundColor: "var(--dash-accent-circle-bg)",
                    color: "var(--dash-overlay-card-text)",
                  }}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0">
                  <Icon icon="mdi:arrow-top-right" width="28" height="28" />
                </button>
              </div>
            </article>

            <div className="grid grid-rows-[1fr_1fr] gap-3 md:gap-4">
              <article
                style={{ backgroundColor: "var(--dash-ad-bg)" }}
                className="rounded-3xl border border-black/10 p-4 md:p-5 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url(${Webassets.lightSphere})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      style={{
                        backgroundColor: "var(--dash-ad-chip-bg)",
                        color: "var(--dash-ad-chip-text)",
                      }}
                      className="text-xs border border-black/20 rounded-full px-2.5 py-1">
                      • ADS
                    </span>
                    <button
                      style={{
                        backgroundColor: "var(--dash-ad-chip-bg)",
                        color: "var(--dash-ad-chip-text)",
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center">
                      <Icon icon="mdi:arrow-top-right" width="24" height="24" />
                    </button>
                  </div>
                  <p style={{ color: "var(--dash-soft-text)" }} className="mt-3 text-sm italic">Become A Broadcast Member</p>
                  <h3 style={{ color: "var(--dash-soft-text)" }} className="mt-2 text-3xl md:text-5xl font-black italic leading-tight">Real talk in a corporate world</h3>
                  <div style={{ borderColor: "var(--dash-ad-divider)" }} className="mt-3 border-t" />
                  <div style={{ borderColor: "var(--dash-ad-divider)" }} className="py-2.5 border-b flex justify-between items-center gap-2">
                    <p className="text-base md:text-2xl font-semibold italic">How to work out in a limited space</p>
                    <Icon icon="mdi:arrow-top-right" width="20" height="20" />
                  </div>
                  <div className="py-2.5 flex justify-between items-center gap-2">
                    <p className="text-base md:text-2xl font-semibold italic">How to read golf green gran like a pro</p>
                    <Icon icon="mdi:arrow-top-right" width="20" height="20" />
                  </div>
                </div>
              </article>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <article
                  className="rounded-3xl border border-black/10 overflow-hidden relative min-h-[190px]"
                  style={{
                    backgroundImage: `url(${Webassets.image1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/75" />
                  <div className="absolute top-3 left-3 text-xs bg-black/45 text-white border border-white/30 rounded-full px-2.5 py-1">• Gym</div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-white/90 mb-1">5 mins, 22 Jan 2024</p>
                    <h4 className="text-base md:text-xl font-bold italic leading-tight">Athletic Training i soft and hard styles of training</h4>
                  </div>
                </article>

                <article
                  style={{ backgroundColor: "var(--dash-tag-panel-bg)" }}
                  className="rounded-3xl border border-black/10 p-3 md:p-4 flex flex-col justify-between">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Medical Knowledge",
                      "Bodybuilding",
                      "Life Style",
                      "Diet",
                      "Health Food",
                      "Sickness",
                      "Diseases",
                    ].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: "var(--dash-tag-bg)",
                          color: "var(--dash-tag-text)",
                        }}
                        className="text-xs px-3 py-1 rounded-full border border-black/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    style={{
                      backgroundColor: "var(--dash-btn-bg)",
                      color: "var(--dash-btn-text)",
                    }}
                    className="mt-3 w-full rounded-xl text-sm md:text-base py-2.5 font-medium flex items-center justify-center gap-2">
                    View All Categories
                    <Icon icon="mdi:arrow-right" width="18" height="18" />
                  </button>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{ backgroundColor: "var(--dash-popular-bg)" }}
          className="mt-6 md:mt-8 rounded-2xl border border-(--bg-primary) p-4 md:p-7 lg:p-9">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-8">
            <div className="max-w-2xl">
              <h2
                style={{ color: "var(--dash-popular-title)" }}
                className="text-4xl sm:text-5xl lg:text-7xl leading-[1.02] font-black tracking-tight">
                Our most
                <br />
                popular articles
              </h2>
              <p
                style={{ color: "var(--dash-popular-subtitle)" }}
                className="mt-3 md:mt-4 text-base md:text-2xl leading-relaxed max-w-xl">
                The latest news, tips and advice to help you run your business with less fuss
              </p>
            </div>

            <button
              style={{
                backgroundColor: "var(--dash-popular-cta-bg)",
                color: "var(--dash-popular-cta-text)",
              }}
              className="self-start md:self-center rounded-full px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-base font-medium">
              Read All Article
            </button>
          </div>

          <div className="mt-5 md:mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {[
              { image: bgImg1, title: "Everything you need to know about VAT for your business" },
              { image: bgImg2, title: "Everything you need to know about VAT for your business" },
              { image: bgImg3, title: "Everything you need to know about VAT for your business" },
            ].map((article, index) => (
              <article
                key={index}
                className="relative rounded-2xl overflow-hidden min-h-[340px] md:min-h-[420px] border"
                style={{
                  borderColor: "var(--dash-popular-card-border)",
                  backgroundImage: `url(${article.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                <div
                  className="absolute inset-0"
                  style={{
                    background: "var(--dash-popular-card-overlay)",
                  }}
                />
                <div className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5 z-10">
                  <span
                    style={{
                      backgroundColor: "var(--dash-popular-card-chip)",
                      color: "var(--dash-popular-card-chip-text)",
                    }}
                    className="inline-flex px-2.5 py-1 rounded-full text-[10px] md:text-sm font-medium mb-2 md:mb-3">
                    CREATORS
                  </span>
                  <h3
                    style={{ color: "var(--dash-popular-card-text)" }}
                    className="text-2xl md:text-3xl leading-tight font-semibold">
                    {article.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{ backgroundColor: "var(--dash-tips-bg)" }}
          className="mt-6 md:mt-8 rounded-2xl border border-(--bg-primary) px-4 py-6 md:px-8 md:py-10 lg:px-10 lg:py-12 overflow-hidden">
          <div className="text-center">
            <h2
              style={{ color: "var(--dash-tips-title)" }}
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              Useful tips
              <br />
              for your <span style={{ color: "var(--dash-tips-title-accent)" }}>business</span>
            </h2>
          </div>

          <div className="mt-6 md:mt-8 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 xl:grid-cols-4 md:overflow-visible md:pb-0">
            {[
              {
                icon: Webassets.icon1,
                title: "Business Creators",
                desc: "Everything you need to know to launch your own company.",
              },
              {
                icon: Webassets.icon2,
                title: "Freelancers",
                desc: "Focus on what's important - here are the essentials to help you drive.",
              },
              {
                icon: Webassets.icon3,
                title: "Trends and News",
                desc: "What's happening in the world of entrepreneurship.",
              },
              {
                icon: Webassets.icon4,
                title: "Operations",
                desc: "Practical systems to keep your team running efficiently every day.",
              },
            ].map((item, index) => (
              <article
                key={index}
                style={{
                  backgroundColor: "var(--dash-tips-card-bg)",
                  borderColor: "var(--dash-tips-card-border)",
                }}
                className="min-w-[280px] md:min-w-0 rounded-2xl border p-5 md:p-6 flex flex-col items-center text-center">
                <img src={item.icon} alt={item.title} className="w-16 h-16 md:w-20 md:h-20 object-contain mb-4 md:mb-5 opacity-90" />
                <h3 style={{ color: "var(--dash-tips-card-title)" }} className="text-2xl md:text-4xl font-semibold">
                  {item.title}
                </h3>
                <p style={{ color: "var(--dash-tips-card-text)" }} className="mt-2 md:mt-3 text-sm md:text-xl leading-relaxed max-w-xs">
                  {item.desc}
                </p>
                <button
                  style={{
                    backgroundColor: "var(--dash-tips-discover-bg)",
                    color: "var(--dash-tips-discover-text)",
                    borderColor: "var(--dash-tips-discover-border)",
                  }}
                  className="mt-5 md:mt-6 rounded-full border px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-base">
                  Discover
                </button>
              </article>
            ))}
          </div>

          <div className="mt-7 md:mt-9 flex items-center justify-center gap-3 md:gap-4">
            <button
              style={{
                backgroundColor: "var(--dash-tips-arrow-outline-bg)",
                color: "var(--dash-tips-arrow-outline-text)",
                borderColor: "var(--dash-tips-arrow-outline-border)",
              }}
              className="w-11 h-11 md:w-14 md:h-14 rounded-full border flex items-center justify-center"
              aria-label="Previous tips">
              <Icon icon="mdi:arrow-left" width="22" height="22" />
            </button>
            <button
              style={{
                backgroundColor: "var(--dash-tips-arrow-solid-bg)",
                color: "var(--dash-tips-arrow-solid-text)",
              }}
              className="w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center"
              aria-label="Next tips">
              <Icon icon="mdi:arrow-right" width="22" height="22" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashPage;
