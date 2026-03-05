import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const tocItems = [
  {
    id: "introduction",
    title: "Introduction",
    children: [
      { id: "chapter-1", title: "Chapter 1" },
      { id: "viral-explosion", title: "Viral Explosion" },
      { id: "future-of-pop", title: "Future of Pop" },
    ],
  },
  {
    id: "chapter-2",
    title: "Chapter 2",
    children: [
      { id: "underground-roots", title: "Underground Roots" },
      { id: "digital-aesthetics", title: "Digital Aesthetics" },
    ],
  },
  {
    id: "chapter-3",
    title: "Chapter 3",
    children: [
      { id: "global-impact", title: "Global Impact" },
      { id: "whats-next", title: "What’s Next" },
    ],
  },
];

const flatTocIds = tocItems.flatMap((item) => [item.id, ...item.children.map((child) => child.id)]);

const BlogDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const post = location.state?.post;
  const [activeSection, setActiveSection] = useState("introduction");
  const [expandedFolders, setExpandedFolders] = useState(() =>
    tocItems.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {}),
  );
  const headerRef = useRef(null);

  const blogMeta = useMemo(
    () => ({
      title: post?.title || "The Rise of Hyperpop",
      date: post?.date || "Wed, 17 Aug 2025",
      category: post?.category || "Technology",
      subCategory: "Society",
      author: post?.author || "Editorial Team",
      readTime: post?.readTime || "2 min read",
      slug,
    }),
    [post, slug],
  );

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const headerHeight = headerRef.current?.offsetHeight || 0;
    const targetY = element.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
    window.scrollTo({ top: Math.max(targetY, 0), behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveSection(id);
  };

  const toggleFolder = (id) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getFolderActiveRow = (item) => {
    if (activeSection === item.id) return 0;
    const childIndex = item.children.findIndex((child) => child.id === activeSection);
    if (childIndex >= 0) return childIndex + 1;
    return -1;
  };

  useEffect(() => {
    if (!flatTocIds.length) return;

    const observers = [];
    flatTocIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0.15 },
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <div className="min-h-screen w-full bg-(--bg-background) text-(--text-main)">
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-(--bg-primary) bg-(--bg-secondary)">
        <div className="mx-auto w-full max-w-[1500px] px-3 md:px-5 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="h-9 w-9 rounded-lg border border-(--bg-primary) flex items-center justify-center"
            >
              <Icon icon="mdi:arrow-left" width="18" height="18" />
            </button>
          </div>

          <div className="hidden md:flex rounded-lg border border-(--bg-primary) px-4 py-2 text-xs md:text-sm text-(--text-secondary)">
            {blogMeta.date}
          </div>

          <button className="rounded-lg bg-(--text-accent) text-(--text-button) px-3 md:px-4 py-2 text-xs md:text-sm font-semibold flex items-center gap-2">
            <Icon icon="mdi:share-variant" width="16" height="16" />
            Share
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1500px] px-3 md:px-5 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 md:gap-6">
        <aside className="hidden lg:block sticky top-24 h-[calc(100vh-130px)] rounded-2xl border border-(--bg-primary) bg-(--bg-secondary) p-4 overflow-y-auto">
          <h2 className="text-xs tracking-wide text-(--text-secondary) uppercase">Tab of contents</h2>
          <div className="mt-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-(--text-main)">
              <Icon icon="mdi:folder-open-outline" width="18" height="18" />
              Content Tree
            </div>

            <ul className="mt-3 ml-1 border-l border-(--bg-primary) pl-2 space-y-2">
              {tocItems.map((item) => {
                const activeRow = getFolderActiveRow(item);

                return (
                  <li key={item.id} className="relative pl-3">
                    <span className="absolute left-0 top-4 h-px w-2 bg-(--bg-primary)" />
                    <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-(--bg-primary)" />
                    {activeRow >= 0 && (
                      <span
                        className="absolute left-[-1px] top-1 w-[4px] h-8 rounded-full bg-(--text-accent) transition-transform duration-300"
                        style={{ transform: `translateY(${activeRow * 32}px)` }}
                      />
                    )}

                    <div className="rounded-md px-1.5 py-1 transition-colors">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFolder(item.id)}
                          aria-label={`Toggle ${item.title}`}
                          className="w-6 h-6 rounded-md hover:bg-(--bg-background) flex items-center justify-center"
                        >
                          <Icon
                            icon={expandedFolders[item.id] ? "mdi:chevron-down" : "mdi:chevron-right"}
                            width="16"
                            height="16"
                          />
                        </button>

                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`h-8 flex items-center gap-2 text-sm text-left flex-1 rounded-md px-1.5 ${
                            activeSection === item.id
                              ? "text-(--text-main) font-semibold"
                              : "text-(--text-secondary) hover:text-(--text-main)"
                          }`}
                        >
                          <Icon
                            icon={expandedFolders[item.id] ? "mdi:folder-open-outline" : "mdi:folder-outline"}
                            width="16"
                            height="16"
                          />
                          {item.title}
                        </button>
                      </div>

                      {expandedFolders[item.id] && (
                        <ul className="mt-1 ml-6 border-l border-(--bg-primary) pl-2 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.id} className="relative pl-3">
                              <span className="absolute left-0 top-3.5 h-px w-2 bg-(--bg-primary)" />
                              <button
                                onClick={() => scrollToSection(child.id)}
                                className={`h-8 w-full text-left text-sm px-1.5 rounded-md transition-colors flex items-center gap-2 ${
                                  activeSection === child.id
                                    ? "text-(--text-main) font-semibold"
                                    : "text-(--text-secondary) hover:text-(--text-main)"
                                }`}
                              >
                                <Icon icon="mdi:file-document-outline" width="15" height="15" />
                                {child.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="md:hidden mb-4 overflow-x-auto pb-1">
            <div className="flex gap-2 min-w-max">
              {flatTocIds.map((id) => {
                const label = id.replaceAll("-", " ");
                return (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`px-3 py-1.5 text-xs rounded-full border border-(--bg-primary) whitespace-nowrap ${
                      activeSection === id ? "bg-(--text-accent) text-(--text-button)" : "bg-(--bg-secondary)"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <article className="rounded-2xl bg-(--bg-secondary) p-4 md:p-8 lg:p-10">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{blogMeta.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs md:text-sm">
              <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700">{blogMeta.category}</span>
              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700">{blogMeta.subCategory}</span>
              <span className="text-(--text-secondary)">{blogMeta.author}</span>
              <span className="text-(--text-secondary)">•</span>
              <span className="text-(--text-secondary)">{blogMeta.readTime}</span>
            </div>

            <section id="introduction" className="scroll-mt-28 mt-7">
              <p className="text-base md:text-lg leading-8 text-(--text-main)">
                Hyperpop is more than just a genre—it&apos;s a digital-native movement that blends internet culture,
                experimental sound, and shifting youth identity.
                <span className="bg-(--text-accent) text-(--text-button) px-1.5 rounded-sm mx-1">
                  Emerging in the late 2010s, it&apos;s marked by
                </span>
                distorted vocals, glitchy beats, and hyper-stylized aesthetics that feel at home on TikTok as much as
                in underground clubs.
              </p>
            </section>

            <section id="chapter-1" className="scroll-mt-28 mt-10">
              <h2 className="text-3xl font-bold">Chapter 1</h2>
            </section>

            <section id="viral-explosion" className="scroll-mt-28 mt-4">
              <h3 className="text-2xl font-semibold">Viral Explosion</h3>
              <p className="mt-3 text-(--text-secondary) leading-8">
                The rise of platforms like TikTok accelerated hyperpop&apos;s visibility. Short, high-energy clips allowed
                songs to spread faster than traditional radio ever could. Tracks by artists like 100 gecs, Charli XCX,
                and glaive became viral soundtracks, giving the genre mainstream exposure.
              </p>
              <blockquote className="mt-4 border-l-4 border-(--text-accent) bg-(--bg-background) px-4 py-3 rounded-r-md text-base md:text-lg">
                “Hyperpop feels like the soundtrack of the internet—fragmented, but endlessly creative.”
              </blockquote>
            </section>

            <section id="future-of-pop" className="scroll-mt-28 mt-7">
              <h3 className="text-2xl font-semibold">Future of Pop</h3>
              <p className="mt-3 text-(--text-secondary) leading-8">
                As mainstream pop absorbs hyperpop&apos;s textures, the boundary between underground and popular music keeps
                blurring. Producers now borrow maximalist synth stacks, pitched vocals, and genre-switching song
                structures to create next-gen anthems for digital audiences.
              </p>
            </section>

            <section id="chapter-2" className="scroll-mt-28 mt-10">
              <h2 className="text-3xl font-bold">Chapter 2</h2>
            </section>

            <section id="underground-roots" className="scroll-mt-28 mt-4">
              <h3 className="text-2xl font-semibold">Underground Roots</h3>
              <p className="mt-3 text-(--text-secondary) leading-8">
                Before global attention, hyperpop grew inside online communities where artists traded unfinished demos,
                remix stems, and production experiments. This open-source creative process shaped its chaotic,
                boundary-pushing sound.
              </p>
            </section>

            <section id="digital-aesthetics" className="scroll-mt-28 mt-7">
              <h3 className="text-2xl font-semibold">Digital Aesthetics</h3>
              <p className="mt-3 text-(--text-secondary) leading-8">
                The visual identity of hyperpop mirrors its sound: neon palettes, glitch edits, maximal typography, and
                playful internet irony. Music and visuals co-evolve, making the listening experience fully immersive.
              </p>
            </section>

            <section id="chapter-3" className="scroll-mt-28 mt-10">
              <h2 className="text-3xl font-bold">Chapter 3</h2>
            </section>

            <section id="global-impact" className="scroll-mt-28 mt-4">
              <h3 className="text-2xl font-semibold">Global Impact</h3>
              <p className="mt-3 text-(--text-secondary) leading-8">
                Hyperpop&apos;s influence now appears in K-pop, Latin pop, and electronic scenes worldwide. The genre has
                become a creative toolkit rather than a strict label.
              </p>
            </section>

            <section id="whats-next" className="scroll-mt-28 mt-7">
              <h3 className="text-2xl font-semibold">What&apos;s Next</h3>
              <p className="mt-3 text-(--text-secondary) leading-8">
                With AI-powered music workflows and cross-platform fan communities, the next wave of hyperpop may feel
                even more collaborative and global—less about a single scene, more about a constantly evolving digital
                language.
              </p>
            </section>
          </article>
        </main>

      </div>
    </div>
  );
};

export default BlogDetail;