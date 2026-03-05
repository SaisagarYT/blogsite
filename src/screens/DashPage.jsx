import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dashboardRef = useRef(null);
  const cursorRef = useRef(null);
  const profileImage = currentUser?.picture || "";
  const effectiveProfileImage = profileImageError ? "" : profileImage;
  const slides = [bgImg1, bgImg2, bgImg3];
  const blogCategories = ["All", "Destination", "Culinary", "Lifestyle", "Tips & Hacks"];
  const blogPosts = [
    {
      image: bgImg1,
      category: "Destination",
      date: "30 Jan 2024",
      readTime: "10 mins read",
      title: "Unveiling the Secrets Beyond the Tourist Trails",
      description: "Dive into the local culture, discover hidden spots, and experience authentic destination charm.",
      author: "Seraphina Isabella",
    },
    {
      image: Webassets.image1,
      category: "Lifestyle",
      date: "29 Jan 2024",
      readTime: "5 mins read",
      title: "A Fashionista's Guide to Wanderlust",
      description: "Explore the intersection of fashion and travel as we delve into effortless style for globe-trotters.",
      author: "Maximilian Bartholomew",
    },
    {
      image: Webassets.image2,
      category: "Tips & Hacks",
      date: "26 Jan 2024",
      readTime: "15 mins read",
      title: "Top 5 Apps and Gadgets That Will Transform Your Journeys",
      description: "Uncover must-have tools and apps to make every trip smoother, safer, and more productive.",
      author: "Anastasia Evangeline",
    },
    {
      image: bgImg2,
      category: "Culinary",
      date: "24 Jan 2024",
      readTime: "10 mins read",
      title: "Savoring Mosaic Resto Gastronomic Delights",
      description: "From street food to fine dining, uncover remarkable culinary gems and local specialties.",
      author: "Nathaniel Reginald",
    },
    {
      image: bgImg3,
      category: "Destination",
      date: "20 Jan 2024",
      readTime: "8 mins read",
      title: "Journey Through Time",
      description: "Wander through ancient streets and iconic landmarks while immersing yourself in timeless culture.",
      author: "Percival Thaddeus",
    },
    {
      image: bgImg1,
      category: "Culinary",
      date: "18 Jan 2024",
      readTime: "6 mins read",
      title: "Experiencing Sustainable Culinary Tourism",
      description: "Join us on a sustainable culinary voyage spotlighting farm-to-table destinations.",
      author: "Sebastian Montgomery",
    },
    {
      image: bgImg2,
      category: "Lifestyle",
      date: "17 Jan 2024",
      readTime: "5 mins read",
      title: "Navigating the Traveler's Lifestyle",
      description: "Embrace a balanced travel life and keep your goals moving while exploring the world.",
      author: "Arabella Serenity",
    },
    {
      image: Webassets.image2,
      category: "Tips & Hacks",
      date: "12 Jan 2024",
      readTime: "8 mins read",
      title: "10 Essential Packing Hacks for Stress-Free Travel",
      description: "Discover packing methods that reduce stress and save space while staying organized.",
      author: "Benjamin Augustus",
    },
    {
      image: bgImg3,
      category: "Destination",
      date: "10 Jan 2024",
      readTime: "10 mins read",
      title: "Adrenaline-Pumping Adventures",
      description: "Explore awe-inspiring experiences and thrilling routes for adventure-seeking travelers.",
      author: "Catalista Gwendolyn",
    },
  ];

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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    const ctx = gsap.context(() => {
      gsap.from(".dash-hero-animate", {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.utils.toArray(".dash-reveal").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      gsap.utils.toArray(".dash-stagger").forEach((group) => {
        const items = group.querySelectorAll(".dash-stagger-item");
        if (!items.length) return;

        gsap.fromTo(
          items,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: group,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      const hoverTargets = gsap.utils.toArray(".dash-gsap-hover");
      const cleanups = [];

      hoverTargets.forEach((target) => {
        const enter = () => {
          gsap.to(target, {
            y: -6,
            scale: 1.015,
            boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
            duration: 0.25,
            ease: "power2.out",
          });
        };

        const leave = () => {
          gsap.to(target, {
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        target.addEventListener("mouseenter", enter);
        target.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          target.removeEventListener("mouseenter", enter);
          target.removeEventListener("mouseleave", leave);
        });
      });

      media.add("(min-width: 1024px)", () => {
        if (!cursorRef.current || !dashboardRef.current) return;

        const quickX = gsap.quickTo(cursorRef.current, "x", { duration: 0.25, ease: "power3" });
        const quickY = gsap.quickTo(cursorRef.current, "y", { duration: 0.25, ease: "power3" });

        const handleMove = (event) => {
          quickX(event.clientX - 18);
          quickY(event.clientY - 18);
          gsap.to(cursorRef.current, { autoAlpha: 1, duration: 0.2, ease: "power2.out" });
        };

        const handleLeave = () => {
          gsap.to(cursorRef.current, { autoAlpha: 0, duration: 0.25, ease: "power2.out" });
        };

        dashboardRef.current.addEventListener("mousemove", handleMove);
        dashboardRef.current.addEventListener("mouseleave", handleLeave);

        cleanups.push(() => {
          dashboardRef.current?.removeEventListener("mousemove", handleMove);
          dashboardRef.current?.removeEventListener("mouseleave", handleLeave);
        });
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    }, dashboardRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);


  return (
    <div ref={dashboardRef} className="min-h-screen w-screen bg-(--bg-background) text-(--text-main) overflow-x-hidden">
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-9 w-9 rounded-full border border-white/80 opacity-0 mix-blend-difference lg:block"
      />
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
            <div className="dash-hero-animate w-full flex items-center justify-between gap-3 rounded-md bg-transparent px-3 py-3 md:px-5 md:py-4 text-white">
              <button
                className="dash-gsap-hover font-semibold tracking-wide text-sm md:text-base"
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
                  className="dash-gsap-hover w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/60 hover:bg-white/10 flex items-center justify-center"
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
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden dash-gsap-hover w-9 h-9 rounded-full border border-white/60 hover:bg-white/10 flex items-center justify-center"
                  aria-label="Open mobile menu">
                  <Icon icon="mdi:menu" width="20" height="20" />
                </button>
              </div>
            </div>

            <div
              className={`md:hidden fixed inset-0 z-[70] transition-opacity duration-300 ${
                mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}>
              <button
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile menu overlay"
              />

              <aside
                className={`absolute top-3 right-3 h-[calc(100%-24px)] w-64 rounded-2xl border border-white/25 bg-black/85 backdrop-blur-md p-4 transition-transform duration-300 ${
                  mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Menu</h3>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full border border-white/40 text-white flex items-center justify-center"
                    aria-label="Close mobile menu">
                    <Icon icon="mdi:close" width="18" height="18" />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-white px-3 py-2 rounded-lg hover:bg-white/10">
                    HOME
                  </button>
                  <button
                    onClick={() => {
                      navigate("/news");
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-white px-3 py-2 rounded-lg hover:bg-white/10">
                    TECHNEWS
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-left text-white px-3 py-2 rounded-lg hover:bg-white/10">
                    Explore
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-left text-white px-3 py-2 rounded-lg hover:bg-white/10">
                    Resources
                  </button>
                </nav>
              </aside>
            </div>

            <div className="dash-hero-animate max-w-2xl text-white pb-2 md:pb-4">
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
              className="dash-gsap-hover px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-sm md:text-base font-medium flex items-center gap-2 transition-colors"
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

          <div className="dash-stagger grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-4">
            <article
              className="dash-stagger-item dash-gsap-hover xl:col-span-2 relative min-h-[360px] md:min-h-[560px] rounded-3xl overflow-hidden border border-black/10"
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
                  className="dash-gsap-hover w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0">
                  <Icon icon="mdi:arrow-top-right" width="28" height="28" />
                </button>
              </div>
            </article>

            <div className="grid grid-rows-[1fr_1fr] gap-3 md:gap-4">
              <article
                style={{ backgroundColor: "var(--dash-ad-bg)" }}
                className="dash-stagger-item dash-gsap-hover rounded-3xl border border-black/10 p-4 md:p-5 relative overflow-hidden">
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
                      className="dash-gsap-hover w-12 h-12 rounded-full flex items-center justify-center">
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
                  className="dash-stagger-item dash-gsap-hover rounded-3xl border border-black/10 overflow-hidden relative min-h-[190px]"
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
                  className="dash-stagger-item dash-gsap-hover rounded-3xl border border-black/10 p-3 md:p-4 flex flex-col justify-between">
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
                    className="dash-gsap-hover mt-3 w-full rounded-xl text-sm md:text-base py-2.5 font-medium flex items-center justify-center gap-2">
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
          className="dash-reveal mt-6 md:mt-8 rounded-2xl border border-(--bg-primary) p-4 md:p-7 lg:p-9">
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
              className="dash-gsap-hover self-start md:self-center rounded-full px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-base font-medium">
              Read All Article
            </button>
          </div>

          <div className="dash-stagger mt-5 md:mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {[
              { image: bgImg1, title: "Everything you need to know about VAT for your business" },
              { image: bgImg2, title: "Everything you need to know about VAT for your business" },
              { image: bgImg3, title: "Everything you need to know about VAT for your business" },
            ].map((article, index) => (
              <article
                key={index}
                className="dash-stagger-item dash-gsap-hover group relative rounded-2xl overflow-hidden min-h-[340px] md:min-h-[420px] border"
                style={{
                  borderColor: "var(--dash-popular-card-border)",
                }}>
                <div
                  className="absolute inset-0 transition-all duration-1000 ease-out grayscale blur-[2px] brightness-75 group-hover:grayscale-0 group-hover:blur-none group-hover:brightness-100"
                  style={{
                    backgroundImage: `url(${article.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
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
          className="dash-reveal mt-6 md:mt-8 rounded-2xl border border-(--bg-primary) px-4 py-6 md:px-8 md:py-10 lg:px-10 lg:py-12 overflow-hidden">
          <div className="text-center">
            <h2
              style={{ color: "var(--dash-tips-title)" }}
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              Useful tips
              <br />
              for your <span style={{ color: "var(--dash-tips-title-accent)" }}>business</span>
            </h2>
          </div>

          <div className="dash-stagger mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pb-0">
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
                className="dash-stagger-item dash-gsap-hover rounded-2xl border p-5 md:p-6 flex flex-col items-center text-center">
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
                  className="dash-gsap-hover mt-5 md:mt-6 rounded-full border px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-base">
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
              className="dash-gsap-hover w-11 h-11 md:w-14 md:h-14 rounded-full border flex items-center justify-center"
              aria-label="Previous tips">
              <Icon icon="mdi:arrow-left" width="22" height="22" />
            </button>
            <button
              style={{
                backgroundColor: "var(--dash-tips-arrow-solid-bg)",
                color: "var(--dash-tips-arrow-solid-text)",
              }}
              className="dash-gsap-hover w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center"
              aria-label="Next tips">
              <Icon icon="mdi:arrow-right" width="22" height="22" />
            </button>
          </div>
        </section>

        <section
          style={{ backgroundColor: "var(--dash-blog-surface)" }}
          className="dash-reveal mt-6 md:mt-8 rounded-2xl border border-(--bg-primary) p-4 md:p-6"
        >
          <div className="flex flex-col gap-2">
            <h2 style={{ color: "var(--dash-blog-title)" }} className="text-2xl md:text-3xl font-bold">Blog</h2>
            <p style={{ color: "var(--dash-blog-subtitle)" }} className="text-xs md:text-sm">
              Here, we share travel tips, destination guides, and stories that inspire your next adventure.
            </p>
          </div>

          <div className="mt-4 md:mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((category, index) => (
                <button
                  key={category}
                  style={{
                    backgroundColor: index === 0 ? "var(--dash-blog-pill-active-bg)" : "var(--dash-blog-pill-bg)",
                    color: index === 0 ? "var(--dash-blog-pill-active-text)" : "var(--dash-blog-pill-text)",
                  }}
                  className="dash-gsap-hover px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium"
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              style={{ backgroundColor: "var(--dash-blog-sort-bg)", color: "var(--dash-blog-pill-text)" }}
              className="dash-gsap-hover self-start lg:self-auto px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 border border-(--bg-primary)"
            >
              Sort by
              <span style={{ color: "var(--dash-blog-title)" }} className="font-semibold">Newest</span>
              <Icon icon="mdi:chevron-down" width="16" height="16" />
            </button>
          </div>

          <div className="dash-stagger mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {blogPosts.map((post, index) => (
              <article
                key={`${post.title}-${index}`}
                onClick={() => navigate(`/blog/${encodeURIComponent(post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))}`, {
                  state: { post },
                })}
                style={{
                  backgroundColor: "var(--dash-blog-card-bg)",
                  borderColor: "var(--dash-blog-card-border)",
                }}
                className="dash-stagger-item dash-gsap-hover rounded-xl border p-2.5 md:p-3 cursor-pointer"
              >
                <div className="relative rounded-lg overflow-hidden h-40 md:h-44">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  <span
                    style={{
                      backgroundColor: "var(--dash-blog-chip-bg)",
                      color: "var(--dash-blog-chip-text)",
                    }}
                    className="absolute top-2 left-2 text-[10px] md:text-xs px-2 py-0.5 rounded-full"
                  >
                    {post.category}
                  </span>
                </div>

                <p style={{ color: "var(--dash-blog-meta)" }} className="mt-2 text-[10px] md:text-xs">
                  {post.date} • {post.readTime}
                </p>
                <h3 style={{ color: "var(--dash-blog-card-title)" }} className="mt-1 text-base md:text-lg font-semibold leading-snug">
                  {post.title}
                </h3>
                <p style={{ color: "var(--dash-blog-desc)" }} className="mt-1 text-xs md:text-sm leading-relaxed">
                  {post.description}
                </p>

                <div className="mt-3 pt-2 border-t border-(--bg-primary) flex items-center gap-2">
                  <img src={Webassets.person1} alt={post.author} className="w-6 h-6 rounded-full object-cover" />
                  <p style={{ color: "var(--dash-blog-author)" }} className="text-xs md:text-sm font-medium">
                    {post.author}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 md:mt-6 flex items-center justify-center gap-2">
            {["chevron-left", "1", "2", "3", "4", "5", "chevron-right"].map((item, index) => {
              const isNumber = !item.includes("chevron");
              const isActive = item === "1";

              return (
                <button
                  key={`${item}-${index}`}
                  style={{
                    backgroundColor: isActive ? "var(--dash-blog-pagination-active-bg)" : "var(--dash-blog-pagination-bg)",
                    color: isActive ? "var(--dash-blog-pagination-active-text)" : "var(--dash-blog-pagination-text)",
                  }}
                  className="dash-gsap-hover w-8 h-8 md:w-9 md:h-9 rounded-md border border-(--bg-primary) text-xs md:text-sm flex items-center justify-center"
                >
                  {isNumber ? item : <Icon icon={`mdi:${item}`} width="16" height="16" />}
                </button>
              );
            })}
          </div>
        </section>

        <section
          style={{ backgroundColor: "var(--dash-explore-bg)" }}
          className="dash-reveal mt-6 md:mt-8 rounded-2xl border border-(--bg-primary) p-2 md:p-3 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3">
            <div className="lg:col-span-1 grid grid-rows-2 gap-2 md:gap-3">
              <article
                style={{ backgroundColor: "var(--dash-explore-card-dark)" }}
                className="rounded-xl p-4 md:p-6 relative overflow-hidden min-h-[220px] md:min-h-[270px]"
              >
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${bgImg2})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div className="absolute inset-0" style={{ backgroundColor: "var(--dash-explore-overlay)" }} />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <span
                      style={{ backgroundColor: "var(--dash-explore-chip-bg)", color: "var(--dash-explore-chip-text)" }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                    >
                      <Icon icon="mdi:web" width="20" height="20" />
                    </span>
                    <h3 style={{ color: "var(--dash-explore-text)" }} className="mt-4 text-3xl md:text-4xl font-semibold leading-tight">
                      Explore more to get your comfort zone
                    </h3>
                    <p style={{ color: "var(--dash-explore-subtext)" }} className="mt-2 text-sm md:text-base">
                      Book your perfect stay with us.
                    </p>
                  </div>
                  <button
                    style={{ backgroundColor: "var(--dash-explore-btn-bg)", color: "var(--dash-explore-btn-text)" }}
                    className="dash-gsap-hover mt-4 w-max px-4 py-2 rounded-lg text-sm md:text-base font-medium flex items-center gap-2"
                  >
                    Booking Now
                    <Icon icon="mdi:arrow-right" width="16" height="16" />
                  </button>
                </div>
              </article>

              <article className="rounded-xl overflow-hidden relative min-h-[180px] md:min-h-[210px]">
                <img src={bgImg2} alt="Article available" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/65" />
                <div className="absolute left-4 bottom-4 z-10 text-white">
                  <p className="text-lg md:text-2xl font-medium">Article Available</p>
                  <p className="text-4xl md:text-5xl font-bold">78</p>
                </div>
              </article>
            </div>

            <article className="lg:col-span-2 rounded-xl overflow-hidden relative min-h-[280px] md:min-h-[500px]">
              <img src={bgImg1} alt="Beyond accommodation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center px-5">
                <h3 className="text-white text-4xl md:text-6xl text-center leading-tight font-medium max-w-3xl">
                  Beyond accommodation, creating memories of a lifetime
                </h3>
              </div>
            </article>
          </div>

          <footer
            style={{ backgroundColor: "var(--dash-explore-footer-bg)", color: "var(--dash-explore-footer-text)" }}
            className="mt-2 md:mt-3 rounded-xl p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div>
                <h4 className="text-2xl md:text-3xl font-bold">Horizone</h4>
                <p style={{ color: "var(--dash-explore-footer-muted)" }} className="mt-3 text-sm md:text-base leading-relaxed">
                  Our mission is to equip modern explorers with cutting-edge, functional, and stylish bags that elevate every adventure.
                </p>
              </div>

              <div>
                <h5 className="text-xl md:text-2xl font-semibold mb-2">About</h5>
                <ul style={{ color: "var(--dash-explore-footer-muted)" }} className="space-y-2 text-sm md:text-base">
                  <li>About Us</li>
                  <li>Blog</li>
                  <li>Career</li>
                </ul>
              </div>

              <div>
                <h5 className="text-xl md:text-2xl font-semibold mb-2">Support</h5>
                <ul style={{ color: "var(--dash-explore-footer-muted)" }} className="space-y-2 text-sm md:text-base">
                  <li>Contact Us</li>
                  <li>Return</li>
                  <li>FAQ</li>
                </ul>
              </div>

              <div>
                <h5 className="text-xl md:text-2xl font-semibold mb-3">Get Updates</h5>
                <div className="flex items-center gap-2 rounded-lg p-1" style={{ backgroundColor: "var(--dash-explore-input-bg)" }}>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    style={{ color: "var(--dash-explore-input-text)" }}
                    className="flex-1 bg-transparent px-3 py-2 text-sm md:text-base outline-none"
                  />
                  <button className="dash-gsap-hover px-4 py-2 rounded-md bg-white text-black text-sm font-semibold">
                    Subscribe
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {["mdi:instagram", "mdi:twitter", "mdi:facebook", "mdi:discord", "mdi:music-note"].map((icon) => (
                    <button
                      key={icon}
                      className="dash-gsap-hover w-9 h-9 rounded-full border border-white/20 flex items-center justify-center"
                    >
                      <Icon icon={icon} width="18" height="18" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm">
              <p style={{ color: "var(--dash-explore-footer-muted)" }}>©2024 Horizone. All rights reserved.</p>
              <div className="flex items-center gap-4" style={{ color: "var(--dash-explore-footer-muted)" }}>
                <button className="hover:text-white transition-colors">Privacy Policy</button>
                <button className="hover:text-white transition-colors">Terms of Service</button>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default DashPage;
