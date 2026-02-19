import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import HomepageCategories from "../JSON/HomepageCategories.jsx";
import Webassets from "../assets/Assets";
import HomepageBlog from "../components/HomepageBlog.jsx";
import Navbar from "../components/Navbar";
import HomepageBooks from "../reusableComponents/HomepageBooks.jsx";
import HomepageButton from "../reusableComponents/HomepageButton.jsx";
import HomepageCard from "../reusableComponents/HomepageCard";
import HomepageFeatureCard from "../reusableComponents/HomepageFeatureCard";
import HomepagePersons from "../reusableComponents/HomepagePersons.jsx";
import HomepageTestimonials from "../reusableComponents/HomepageTestimonials.jsx";
console.log(HomepageCategories);
const Homepage = () => {
  const [tab, setTab] = useState("All");
  // Refs for animated sections
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  const blogsRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      );
    }
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" },
      );
    }
    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" },
      );
    }
    if (categoriesRef.current) {
      gsap.fromTo(
        categoriesRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" },
      );
    }
    if (blogsRef.current) {
      gsap.fromTo(
        blogsRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" },
      );
    }
    if (testimonialsRef.current) {
      gsap.fromTo(
        testimonialsRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 1, ease: "power3.out" },
      );
    }
  }, []);

  return (
    <section className="w-full min-h-screen bg-(--bg-main) flex flex-col items-center justify-start overflow-x-hidden">
      <Navbar />
      <div
        ref={heroRef}
        className="w-full bg-(--bg-background) min-h-screen flex flex-col md:flex-row flex-wrap overflow-x-hidden">
        <div className="flex flex-col md:justify-between md:items-center md:flex-col md:flex-1/2 border-t border-l border-(--bg-primary) w-full md:w-1/2 p-4 md:p-0">
          <div className="flex flex-col gap-4 md:gap-8 w-full md:w-3/4 justify-center h-full ">
            {/* Decorative image at top right of hero section */}
            <img
              src={Webassets.lightSphere}
              alt="decorative rays"
              className="absolute left-0 top-0 w-32 h-32 md:w-56 md:h-56 pointer-events-none select-none opacity-80"
              style={{ zIndex: 1 }}
            />
            <h1 className="text-(--text-secondary) text-xl md:text-3xl">
              Your Journey to Tomorrow Begins Here
            </h1>
            <h1 className="text-3xl md:text-7xl">
              Explore the Frontiers of Artificial Intelligence
            </h1>
            <p className="text-base md:text-lg text-(--text-secondary)">
              Welcome to the epicenter of AI innovation. FutureTech AI News is
              your passport to a world where machines think, learn, and reshape
              the future. Join us on this visionary expedition into the heart of
              AI.
            </p>
            {/* Reference image section moved here for mobile */}
            <div className="block md:hidden mt-4">
              <HomepagePersons type="BTN" />
            </div>
          </div>
          <ul ref={statsRef} className="flex w-full flex-col md:flex-row">
            <li className="flex border-t justify-center items-center py-6 md:py-14 border-(--bg-primary) flex-col flex-1/2">
              <p className="text-4xl">300+</p>
              <p className="text-(--text-secondary)">Resource available</p>
            </li>
            <li className="flex py-6 md:py-14 items-center border-t border-r border-l border-(--bg-primary) flex-col flex-1/2">
              <p className="text-4xl">12k+</p>
              <p className="text-(--text-secondary)">Total Downloads</p>
            </li>
            <li className="flex justify-center items-center py-6 md:py-14 border-t border-(--bg-primary) flex-col flex-1/2">
              <p className="text-4xl">10k+</p>
              <p className="text-(--text-secondary)">Active Users</p>
            </li>
          </ul>
        </div>
        <div className="flex flex-1/2 border-l border-r border-(--bg-primary) w-full md:w-1/2">
          <div className="w-full relative overflow-hidden bg-black min-h-[200px] md:min-h-0 hidden md:block">
            <img className="opacity-50" src={Webassets.lightSphere} alt="" />
            <div className="absolute bottom-2 left-2 md:bottom-1/8 md:left-1/5 bg-(--bg-background) shadow-xl px-4 md:px-10 py-3 md:py-5 rounded-2xl">
              <HomepagePersons type="BTN" />
            </div>
          </div>
        </div>
      </div>
      <div
        ref={featuresRef}
        className="w-full border-b border-b-(--bg-primary) border-t border-t-(--bg-primary) flex flex-col md:flex-row justify-center items-center md:space-x-6 space-y-4 md:space-y-0 flex-nowrap md:flex-nowrap md:overflow-visible overflow-x-auto px-3 md:px-0">
        <HomepageCard
          icon={Webassets.icon1}
          title="Latest New Updates"
          subTitle="Stay Current"
          text="Over 1,000 articles published monthly"
          icon2={Webassets.arrowBackground}
        />
        <HomepageCard
          icon={Webassets.icon1}
          title="Latest New Updates"
          subTitle="Stay Current"
          text="Over 1,000 articles published monthly"
          icon2={Webassets.arrowBackground}
        />
        <HomepageCard
          icon={Webassets.icon1}
          title="Latest New Updates"
          subTitle="Stay Current"
          text="Over 1,000 articles published monthly"
          icon2={Webassets.arrowBackground}
        />
      </div>
      <div
        ref={categoriesRef}
        className="w-full bg-(--bg-primary) py-10 md:py-20 px-4 md:px-30 flex items-start gap-2 md:gap-4 justify-center flex-col">
        <p className="bg-(--text-button) py-2 px-4 rounded-sm text-(--text-secondary)">
          Unlock the Power of
        </p>
        <h1 className="text-6xl text-(--text-accent)">FutureTech Features</h1>
      </div>
      <div ref={blogsRef} className="px-2 md:px-0">
        <HomepageFeatureCard
          title="Future Technology Blog"
          para="Stay informed with our blog section dedicated to future technology."
          icon={Webassets.icon4}
        />
        <HomepageFeatureCard
          title="Research Insights Blogs"
          para="Dive deep into future technology concepts with our research section."
          icon={Webassets.icon5}
        />
      </div>
      <div
        ref={testimonialsRef}
        className="w-full py-6 md:py-10 flex flex-col md:flex-row justify-center items-center gap-3 md:gap-5 px-2 md:px-0">
        {HomepageCategories.map((item, index) => (
          <button
            onClick={() => setTab(item.head)}
            className="w-full md:w-auto py-3 md:py-5 rounded-md border-(--bg-primary) border px-4 md:px-8 bg-(--bg-secondary) text-base md:text-lg transition-colors duration-200 hover:bg-(--text-button) focus:outline-none"
            key={index}>
            {item.head}
          </button>
        ))}
      </div>
      <div className="w-full flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 md:px-4 overflow-x-hidden">
        <HomepageBlog
          image={Webassets.person1}
          name="Sagar Sylada"
          tag="@RocketScience"
          date="October 12,2025"
          title="The Perfect Technique to Launch Rocket"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit.Quo repudiandae odio magni, magnam eius officiis at quaerat suscipit nemo dignissimos voluptate hic recusandae ea vero tenetur nobis est, a in?"
        />
        <HomepageBlog
          image={Webassets.person1}
          name="Sagar Sylada"
          tag="@RocketScience"
          date="October 12,2025"
          title="The Perfect Technique to Launch Rocket"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit.Quo repudiandae odio magni, magnam eius officiis at quaerat suscipit nemo dignissimos voluptate hic recusandae ea vero tenetur nobis est, a in?"
        />
        <HomepageBlog
          image={Webassets.person1}
          name="Sagar Sylada"
          tag="@RocketScience"
          date="October 12,2025"
          title="The Perfect Technique to Launch Rocket"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit.Quo repudiandae odio magni, magnam eius officiis at quaerat suscipit nemo dignissimos voluptate hic recusandae ea vero tenetur nobis est, a in?"
        />
        <HomepageBlog
          image={Webassets.person1}
          name="Sagar Sylada"
          tag="@RocketScience"
          date="October 12,2025"
          title="The Perfect Technique to Launch Rocket"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit.Quo repudiandae odio magni, magnam eius officiis at quaerat suscipit nemo dignissimos voluptate hic recusandae ea vero tenetur nobis est, a in?"
        />
      </div>
      <div className="w-full bg-(--bg-primary) py-10 md:py-20 px-4 md:px-30 flex flex-col md:flex-row items-center gap-4 md:gap-10 justify-start">
        <div className="flex flex-col items-start w-full md:w-4/5">
          <p className="bg-(--text-button) text-(--text-secondary) py-2 px-4 rounded-sm">
            Your Gateway to In-Depth Information
          </p>
          <h1 className="text-6xl text-(--text-accent)">
            Unlock Valuable Knowledge with FutureTech's Resources
          </h1>
        </div>
        <HomepageButton text="View All Resources" icon={Webassets.arrowMark} />
      </div>
      <HomepageBooks
        title="Ebooks"
        image={Webassets.icon1}
        image2={Webassets.image1}
        desc="Explore our collection of ebooks covering a wide spectrum of future technology topics."
        text="Download Ebooks Now"
        icon={Webassets.arrowMark}
        title2="Variety of Topics"
        desc2="Topics include AI in education (25%), renewable energy (20%), healthcare (15%), space exploration (25%), and biotechnology (15%)."
      />
      <HomepageBooks
        title="Ebooks"
        image={Webassets.icon1}
        image2={Webassets.image2}
        desc="Explore our collection of ebooks covering a wide spectrum of future technology topics."
        text="Download Ebooks Now"
        icon={Webassets.arrowMark}
        title2="Variety of Topics"
        desc2="Topics include AI in education (25%), renewable energy (20%), healthcare (15%), space exploration (25%), and biotechnology (15%)."
      />
      <div className="w-full bg-(--bg-primary) py-10 md:py-20 px-4 md:px-30 flex flex-col md:flex-row items-center gap-4 md:gap-4 justify-between">
        <div className="flex flex-col gap-2 md:gap-4 items-start w-full md:w-auto">
          <p className="bg-(--text-button) text-(--text-secondary) py-2 px-4 rounded-sm">
            What Our Readers Say
          </p>
          <h1 className="text-6xl text-(--text-accent)">
            Real Words from Real Readers
          </h1>
        </div>
        <HomepageButton text="Testimonials" icon={Webassets.arrowMark} />
      </div>
      <div className="w-full py-4 px-2 md:px-4 grid grid-cols-1 md:grid-cols-3 gap-4 flex-wrap">
        <HomepageTestimonials
          image={Webassets.person1}
          userName="Saisagar"
          address="Tadepalligudem,India"
          review="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero maxime perspiciatis a natus modi aperiam quis."
        />
        <HomepageTestimonials
          image={Webassets.person1}
          userName="Saisagar"
          address="Tadepalligudem,India"
          review="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero maxime perspiciatis a natus modi aperiam quis."
        />
        <HomepageTestimonials
          image={Webassets.person1}
          userName="Saisagar"
          address="Tadepalligudem,India"
          review="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero maxime perspiciatis a natus modi aperiam quis."
        />
        <HomepageTestimonials
          image={Webassets.person1}
          userName="Saisagar"
          address="Tadepalligudem,India"
          review="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero maxime perspiciatis a natus modi aperiam quis."
        />
        <HomepageTestimonials
          image={Webassets.person1}
          userName="Saisagar"
          address="Tadepalligudem,India"
          review="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero maxime perspiciatis a natus modi aperiam quis."
        />
        <HomepageTestimonials
          image={Webassets.person1}
          userName="Saisagar"
          address="Tadepalligudem,India"
          review="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero maxime perspiciatis a natus modi aperiam quis."
        />
      </div>
      <div className="w-full bg-(--bg-secondary) py-6 md:py-10 grid px-2 md:px-4 grid-cols-2 md:grid-cols-5 gap-4 overflow-x-auto">
        <ul className="text-(--text-secondary) flex flex-col gap-2">
          <h1 className="font-bold text-xl mb-3 text-(--text-main)">Home</h1>
          <li className="cursor-pointer">Features</li>
          <li className="cursor-pointer">Blogs</li>
          <li className="cursor-pointer">Resources</li>
          <li className="cursor-pointer">Testimonials</li>
          <li className="cursor-pointer">Contact Us</li>
          <li className="cursor-pointer">Newsletter</li>
        </ul>
        <ul className="text-(--text-secondary) flex flex-col gap-2">
          <h1 className="font-bold text-xl mb-3 text-(--text-main)">Home</h1>
          <li className="cursor-pointer">Features</li>
          <li className="cursor-pointer">Blogs</li>
          <li className="cursor-pointer">Resources</li>
          <li className="cursor-pointer">Testimonials</li>
          <li className="cursor-pointer">Contact Us</li>
          <li className="cursor-pointer">Newsletter</li>
        </ul>
        <ul className="text-(--text-secondary) flex flex-col gap-2">
          <h1 className="font-bold text-xl mb-3 text-(--text-main)">Home</h1>
          <li className="cursor-pointer">Features</li>
          <li className="cursor-pointer">Blogs</li>
          <li className="cursor-pointer">Resources</li>
          <li className="cursor-pointer">Testimonials</li>
          <li className="cursor-pointer">Contact Us</li>
          <li className="cursor-pointer">Newsletter</li>
        </ul>
        <ul className="text-(--text-secondary) flex flex-col gap-2">
          <h1 className="font-bold text-xl mb-3 text-(--text-main)">Home</h1>
          <li className="cursor-pointer">Features</li>
          <li className="cursor-pointer">Blogs</li>
          <li className="cursor-pointer">Resources</li>
          <li className="cursor-pointer">Testimonials</li>
          <li className="cursor-pointer">Contact Us</li>
          <li className="cursor-pointer">Newsletter</li>
        </ul>
        <ul className="text-(--text-secondary) flex flex-col gap-2">
          <h1 className="font-bold text-xl mb-3 text-(--text-main)">Home</h1>
          <li className="cursor-pointer">Features</li>
          <li className="cursor-pointer">Blogs</li>
          <li className="cursor-pointer">Resources</li>
          <li className="cursor-pointer">Testimonials</li>
          <li className="cursor-pointer">Contact Us</li>
          <li className="cursor-pointer">Newsletter</li>
        </ul>
      </div>
      <div className=""></div>
    </section>
  );
};

export default Homepage;
