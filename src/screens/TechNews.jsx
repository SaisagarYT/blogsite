import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import bgImg1 from "../assets/alps-snow-mountains-3840x2160-25451.jpg";
import bgImg2 from "../assets/os-x-lion-twilight-3840x2160-24060.jpg";
import bgImg3 from "../assets/katerina-kerdi--YiJvbfNDqk-unsplash.jpg";
import Webassets from "../assets/Assets";

const TechNews = () => {
  const navigate = useNavigate();

  const sidebarStories = [
    {
      date: "OCT 21, 2022",
      title: "Celebrities claim that opera gloves are becoming casual",
    },
    {
      date: "JAN 01, 2022",
      title: 'In support of the "naked dress," Ciara attended Paris Fashion Week',
    },
    {
      date: "DEC 28, 2021",
      title: "The historical attire worn by these women of color is a form of contemporary art",
    },
  ];

  const bottomCards = [
    {
      image: bgImg2,
      title: "Tailored minimalism the street style way",
      author: "Bambieta Basterbine",
    },
    {
      image: bgImg3,
      title: "All the cool kids are wearing balaclavas",
      author: "Gerard Valkyrie",
    },
  ];

  return (
    <div className="min-h-screen bg-(--bg-background) text-(--text-main) p-3 md:p-5">
      <div className="w-full mb-3 md:mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          aria-label="Back to dashboard"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-(--bg-primary) bg-(--bg-secondary) text-(--text-main) flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Icon icon="mdi:arrow-left" width="20" height="20" />
        </button>
      </div>

      <section
        style={{
          backgroundColor: "var(--tech-fashion-bg)",
          color: "var(--tech-fashion-text)",
        }}
        className="w-full rounded-2xl border border-(--bg-primary) px-4 py-5 md:px-8 md:py-8 lg:px-10 lg:py-10 overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3">
          <h1
            style={{ color: "var(--tech-fashion-heading)" }}
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight uppercase"
          >
            Fashion
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ color: "var(--tech-fashion-heading)" }}
            className="uppercase text-sm md:text-base font-medium flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
          >
            View all
            <Icon icon="mdi:arrow-top-right" width="18" height="18" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-7">
          <div className="lg:col-span-3 rounded-xl overflow-hidden min-h-[260px] md:min-h-[420px]">
            <img src={bgImg1} alt="Fashion lead" className="w-full h-full object-cover" />
          </div>

          <article className="lg:col-span-2 rounded-xl border border-(--tech-fashion-divider) p-4 md:p-5 flex flex-col justify-start pt-1">
            <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-wide">
              <span
                style={{ borderColor: "var(--tech-fashion-chip-border)", color: "var(--tech-fashion-chip-text)" }}
                className="px-2 py-0.5 rounded-full border"
              >
                Fashion
              </span>
              <span style={{ color: "var(--tech-fashion-subtle)" }}>Aug 09, 2022</span>
            </div>
            <h2 style={{ color: "var(--tech-fashion-heading)" }} className="mt-4 text-3xl md:text-5xl leading-tight uppercase max-w-md">
              Short suits: the must-have fashion investment for spring
            </h2>
            <p style={{ color: "var(--tech-fashion-subtle)" }} className="mt-4 text-sm md:text-base flex items-center gap-2">
              <span>✦</span>
              Written by <span className="font-semibold" style={{ color: "var(--tech-fashion-text)" }}>Jonathan Lopez</span>
            </p>
          </article>
        </div>

        <div className="mt-5 grid grid-cols-1 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-7">
          <div className="xl:col-span-2 space-y-3 md:space-y-4">
            {sidebarStories.map((story) => (
              <article key={story.title} className="rounded-xl border p-3 md:p-4" style={{ borderColor: "var(--tech-fashion-divider)" }}>
                <div className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-wide mb-2">
                  <span
                    style={{ borderColor: "var(--tech-fashion-chip-border)", color: "var(--tech-fashion-chip-text)" }}
                    className="px-2 py-0.5 rounded-full border"
                  >
                    Fashion
                  </span>
                  <span style={{ color: "var(--tech-fashion-subtle)" }}>{story.date}</span>
                </div>
                <h3 className="uppercase text-lg md:text-2xl leading-tight" style={{ color: "var(--tech-fashion-heading)" }}>
                  {story.title}
                </h3>
              </article>
            ))}
          </div>

          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {bottomCards.map((card) => (
              <article key={card.title} className="rounded-xl border border-(--tech-fashion-divider) p-3 md:p-4">
                <div className="rounded-xl overflow-hidden min-h-[220px] md:min-h-[260px]">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-wide mb-2">
                    <span
                      style={{ borderColor: "var(--tech-fashion-chip-border)", color: "var(--tech-fashion-chip-text)" }}
                      className="px-2 py-0.5 rounded-full border"
                    >
                      Fashion
                    </span>
                    <span style={{ color: "var(--tech-fashion-subtle)" }}>Aug 11, 2022</span>
                  </div>
                  <h3 className="uppercase text-2xl md:text-4xl leading-tight" style={{ color: "var(--tech-fashion-heading)" }}>
                    {card.title}
                  </h3>
                  <p style={{ color: "var(--tech-fashion-subtle)" }} className="mt-3 text-xs md:text-sm flex items-center gap-2">
                    <span>✦</span>
                    Written by <span className="font-semibold" style={{ color: "var(--tech-fashion-text)" }}>{card.author}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 md:mt-8 flex justify-center">
          <img src={Webassets.arrowMark} alt="decorative divider" className="opacity-60 w-16 md:w-20" />
        </div>
      </section>
    </div>
  );
};

export default TechNews;
