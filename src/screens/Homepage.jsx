import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import HomepageCategories from '../JSON/HomepageCategories.jsx'
import Webassets from '../assets/Assets'
import HomepageBlog from '../components/HomepageBlog.jsx'
import Navbar from '../components/Navbar'
import HomepageBooks from '../reusableComponents/HomepageBooks.jsx'
import HomepageButton from '../reusableComponents/HomepageButton.jsx'
import HomepageCard from '../reusableComponents/HomepageCard'
import HomepageFeatureCard from '../reusableComponents/HomepageFeatureCard'
import HomepagePersons from '../reusableComponents/HomepagePersons.jsx'
import HomepageTestimonials from '../reusableComponents/HomepageTestimonials.jsx'
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
      gsap.fromTo(heroRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    }
    if (statsRef.current) {
      gsap.fromTo(statsRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    }
    if (featuresRef.current) {
      gsap.fromTo(featuresRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    }
    if (categoriesRef.current) {
      gsap.fromTo(categoriesRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" });
    }
    if (blogsRef.current) {
      gsap.fromTo(blogsRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" });
    }
    if (testimonialsRef.current) {
      gsap.fromTo(testimonialsRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, delay: 1, ease: "power3.out" });
    }
  }, []);

  return (
    <section className='w-full'>
      <Navbar/>
      <div ref={heroRef} className='w-full bg-(--bg-background) h-screen flex'>
        <div className='flex justify-between items-center flex-col flex-1/2 border-t border-l border-(--bg-primary)'>
          <div className='flex flex-col gap-8 w-3/4 justify-center h-full'>
            <h1 className='text-(--text-secondary) text-3xl'>Your Journey to Tomorrow Begins Here</h1>
            <h1 className='text-7xl'>Explore the Frontiers of Artificial Intelligence</h1>
            <p className='text-lg text-(--text-secondary)'>Welcome to the epicenter of AI innovation. FutureTech AI News is your passport to a world where machines think, learn, and reshape the future. Join us on this visionary expedition into the heart of AI.</p>
          </div>
          <ul ref={statsRef} className='flex w-full'>
            <li className='flex border-t justify-center items-center py-14 border-(--bg-primary) flex-col flex-1/2'>
              <p className='text-4xl'>300+</p>
              <p className='text-(--text-secondary)'>Resource available</p>
            </li>
            <li className='flex py-14 items-center border-t border-r border-l border-(--bg-primary) flex-col flex-1/2'>
              <p className='text-4xl'>12k+</p>
              <p className='text-(--text-secondary)' >Total Downloads</p>
            </li>
            <li className='flex justify-center items-center py-14 border-t border-(--bg-primary) flex-col flex-1/2'>
              <p className='text-4xl'>10k+</p>
              <p className='text-(--text-secondary)' >Active Users</p>
            </li>
          </ul>
        </div>
        <div className='flex flex-1/2 border-l border-r border-(--bg-primary)'>
          <div className='w-full relative overflow-hidden bg-black'>
            <img className='opacity-50' src={Webassets.lightSphere} alt="" />
            <div className='absolute bottom-1/8 left-1/5 bg-(--bg-background) shadow-xl px-10 py-5 rounded-2xl'>
              <HomepagePersons type="BTN"/>
            </div>
          </div>
        </div>
      </div>
      <div ref={featuresRef} className='w-screen border-b border-b-(--bg-primary) border-t border-t-(--bg-primary) flex justify-center'>
        <HomepageCard icon={Webassets.icon1} title="Latest New Updates" subTitle="Stay Current" text="Over 1,000 articles published monthly" icon2={Webassets.arrowBackground}/>
        <HomepageCard icon={Webassets.icon1} title="Latest New Updates" subTitle="Stay Current" text="Over 1,000 articles published monthly" icon2={Webassets.arrowBackground}/>
        <HomepageCard icon={Webassets.icon1} title="Latest New Updates" subTitle="Stay Current" text="Over 1,000 articles published monthly" icon2={Webassets.arrowBackground}/>
      </div>
      <div ref={categoriesRef} className='w-full bg-(--bg-primary) py-20 px-30 flex items-start gap-4 justify-center flex-col'>
        <p className='bg-(--text-button) py-2 px-4 rounded-sm text-(--text-secondary)'>Unlock the Power of</p>
        <h1 className='text-6xl'>FutureTech Features</h1>
      </div>
      <div ref={blogsRef}>
        <HomepageFeatureCard title="Future Technology Blog" para="Stay informed with our blog section dedicated to future technology." icon={Webassets.icon4}/>
        <HomepageFeatureCard title="Research Insights Blogs" para="Dive deep into future technology concepts with our research section." icon={Webassets.icon5}/>
      </div>
      <div ref={testimonialsRef} className='w-full py-10 flex justify-center gap-5'>
        {
          HomepageCategories.map((item,index) =>{
            return <button onClick={() => setTab(item.head)} className='py-5 rounded-md border-(--bg-primary) border px-8 bg-(--bg-secondary)' key={index}>
              {item.head}
            </button>
          })
        }
      </div>
      <div>
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
      <div className='w-full bg-(--bg-primary) py-20 px-30 flex items-center gap-10 justify-start'>
        <div className='flex flex-col items-start w-4/5'>
          <p className='bg-(--text-button) text-(--text-secondary) py-2 px-4 rounded-sm'>Your Gateway to In-Depth Information</p>
          <h1 className='text-6xl'>Unlock Valuable Knowledge with FutureTech's Resources</h1>
        </div>
        <HomepageButton text="View All Resources" icon={Webassets.arrowMark}/>
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
      <div className='w-full bg-(--bg-primary) py-20 px-30 flex items-center gap-4 justify-between'>
        <div className='flex flex-col gap-4 items-start'>
          <p className='bg-(--text-button) text-(--text-secondary) py-2 px-4 rounded-sm'>What Our Readers Say</p>
          <h1 className='text-6xl'>Real Words from Real Readers</h1>
        </div>
        <HomepageButton text="Testimonials" icon={Webassets.arrowMark}/>
      </div>
      <div className='w-full py-4 px-4 justify-between grid grid-cols-3'>
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
      <div className='w-full bg-(--bg-secondary) py-10 grid px-20 grid-cols-5'>
        <ul className='text-(--text-secondary) flex flex-col gap-2'>
          <h1 className='font-bold text-xl mb-3 text-(--text-main)'>Home</h1>
          <li className='cursor-pointer'>Features</li>
          <li className='cursor-pointer'>Blogs</li>
          <li className='cursor-pointer'>Resources</li>
          <li className='cursor-pointer'>Testimonials</li>
          <li className='cursor-pointer'>Contact Us</li>
          <li className='cursor-pointer'>Newsletter</li>
        </ul>
        <ul className='text-(--text-secondary) flex flex-col gap-2'>
          <h1 className='font-bold text-xl mb-3 text-(--text-main)'>Home</h1>
          <li className='cursor-pointer'>Features</li>
          <li className='cursor-pointer'>Blogs</li>
          <li className='cursor-pointer'>Resources</li>
          <li className='cursor-pointer'>Testimonials</li>
          <li className='cursor-pointer'>Contact Us</li>
          <li className='cursor-pointer'>Newsletter</li>
        </ul>
        <ul className='text-(--text-secondary) flex flex-col gap-2'>
          <h1 className='font-bold text-xl mb-3 text-(--text-main)'>Home</h1>
          <li className='cursor-pointer'>Features</li>
          <li className='cursor-pointer'>Blogs</li>
          <li className='cursor-pointer'>Resources</li>
          <li className='cursor-pointer'>Testimonials</li>
          <li className='cursor-pointer'>Contact Us</li>
          <li className='cursor-pointer'>Newsletter</li>
        </ul>
        <ul className='text-(--text-secondary) flex flex-col gap-2'>
          <h1 className='font-bold text-xl mb-3 text-(--text-main)'>Home</h1>
          <li className='cursor-pointer'>Features</li>
          <li className='cursor-pointer'>Blogs</li>
          <li className='cursor-pointer'>Resources</li>
          <li className='cursor-pointer'>Testimonials</li>
          <li className='cursor-pointer'>Contact Us</li>
          <li className='cursor-pointer'>Newsletter</li>
        </ul>
        <ul className='text-(--text-secondary) flex flex-col gap-2'>
          <h1 className='font-bold text-xl mb-3 text-(--text-main)'>Home</h1>
          <li className='cursor-pointer'>Features</li>
          <li className='cursor-pointer'>Blogs</li>
          <li className='cursor-pointer'>Resources</li>
          <li className='cursor-pointer'>Testimonials</li>
          <li className='cursor-pointer'>Contact Us</li>
          <li className='cursor-pointer'>Newsletter</li>
        </ul>
      </div>
      <div className=''>

      </div>
    </section>
  )
}

export default Homepage
