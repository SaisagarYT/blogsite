import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import NewsHeroCard from '../reusableComponents/NewsHeroCard';
import NewsCard from '../reusableComponents/NewsCard';
import NewsListItem from '../reusableComponents/NewsListItem';
import VideoCard from '../reusableComponents/VideoCard';

const TechNews = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Refs for animated sections
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const cardsRef = useRef(null);
  const discoverRef = useRef(null);
  const videosRef = useRef(null);
  const ctaRef = useRef(null);

  const categories = ['All', 'Technology', 'Politics', 'Health', 'Economics', 'Sports'];

  const heroArticle = {
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop',
    category: 'Environment',
    title: 'Global Climate Summit Addresses Urgent Climate Action',
    description: 'World leaders gathered at the Global Climate Summit to discuss urgent actions needed to combat climate change and reduce carbon emissions worldwide, with new measures being introduced.',
    author: 'Jane Smith',
    date: 'October 15, 2025',
    likes: 1.2,
    comments: 234
  };

  const newsCards = [
    {
      image: 'https://images.unsplash.com/photo-1495954222046-2c427ecb546d?w=800&h=600&fit=crop',
      title: 'A Decisive Victory for Progressive Politics',
      category: 'Politics',
      likes: 9.8,
      comments: 81
    },
    {
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
      title: 'Tech Giants Unveil Cutting-Edge AI Innovation',
      category: 'Technology',
      likes: 9.8,
      comments: 57
    },
    {
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=600&fit=crop',
      title: 'COVID-19 Vaccines',
      category: 'Health',
      likes: 7.8,
      comments: 874
    }
  ];

  const newsListItems = [
    {
      avatar: 'https://i.pravatar.cc/150?img=1',
      author: 'John Techson',
      role: 'Technology',
      date: 'October 15, 2023',
      title: 'Tech Giants Announce New Product Line',
      description: 'In a major development for the tech industry, several leading companies unveiled their latest innovations and products that are expected to revolutionize the digital landscape.',
      featured: true,
      likes: 1.2,
      comments: 95
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=33',
      author: 'Sarah Dillard',
      role: 'Technology',
      date: 'October 15, 2023',
      title: 'The Future of Autonomous Vehicles',
      description: 'A complete analysis of how self-driving cars and autonomous technology is transforming transportation and what it means for the future of urban mobility and the auto industry.',
      featured: false,
      likes: 3.3,
      comments: 142
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=12',
      author: 'Anonymous X',
      role: 'Technology',
      date: 'October 15, 2023',
      title: 'Tech Startups Secure Record Funding',
      description: 'In a rare of events for the world, new U.S tech startups managed to secure impressive seed funding from top investors, signaling growing confidence in the technology sector.',
      featured: false,
      likes: 5.4,
      comments: 200
    }
  ];

  const videoCards = [
    {
      image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&h=600&fit=crop',
      title: 'Mars Exploration: Unveiling Alien Landscapes',
      description: 'Witness breathtaking footage from NASA\'s latest Mars mission, showcasing the red planet\'s diverse terrain and what it means for future colonization efforts.',
      duration: '7:52 min'
    },
    {
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      title: 'Blockchain Explained: A Revolution in Finance',
      description: 'Dive deep into the world of blockchain technology, understanding how decentralized systems are transforming financial transactions and investment strategies.',
      duration: '5:30 min'
    },
    {
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop',
      title: 'Breaking the Silence: Mental Health Awareness in the Workplace',
      description: 'An important conversation about mental health challenges in professional environments and why companies need to prioritize employee wellbeing and support.',
      duration: '8:15 min'
    },
    {
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
      title: 'Revolutionizing Investment Strategies',
      description: 'Explore cutting-edge investment approaches and how technology is enabling smarter financial decisions for retail and institutional investors alike.',
      duration: '6:42 min'
    }
  ];

  const featureCards = [
    {
      icon: 'mdi:browser',
      title: 'Broaden Access',
      description: 'Our platform ensures that news and information are easily accessible to all, breaking down barriers and fostering inclusivity.'
    },
    {
      icon: 'mdi:account-group',
      title: 'Community Forum',
      description: 'Join our vibrant community forum where you can discuss, debate, and share your perspectives on the latest news and topics.'
    },
    {
      icon: 'mdi:trophy',
      title: 'Tech Events',
      description: 'Stay updated on upcoming tech conferences, webinars, and events where you can network and learn from industry leaders and experts.'
    }
  ];

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      );
    }
    if (featuredRef.current) {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" },
      );
    }
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" },
      );
    }
    if (discoverRef.current) {
      gsap.fromTo(
        discoverRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" },
      );
    }
    if (videosRef.current) {
      gsap.fromTo(
        videosRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" },
      );
    }
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 1, ease: "power3.out" },
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-(--bg-background) text-(--text-main)">
      <Navbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="pt-36 pb-20 px-4">
        <div className="max-w-screen px-40 mx-auto">
          <div className="mb-20 flex items-end justify-between gap-16">
            <div className="flex-1">
              <h1 className="text-7xl font-bold text-(--text-main) leading-tight">
                Today's Headlines: Stay <br />Informed
              </h1>
            </div>
            <div className="flex-1">
              <p className="text-(--text-secondary) text-base leading-relaxed">
                Explore the latest news from around the world. We bring you up-to-the-minute updates on the most significant events, trends, and stories. Discover the world through our news coverage.
              </p>
            </div>
          </div>

          {/* Featured Article */}
          <div ref={featuredRef}>
            <NewsHeroCard {...heroArticle} />
          </div>

          {/* Three Column Cards */}
          <div ref={cardsRef} className="grid grid-cols-3 gap-8 mt-10">
            {newsCards.map((card, index) => (
              <NewsCard key={index} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Discover Headlines Section */}
      <section ref={discoverRef} className="py-20 px-4 bg-(--bg-secondary)">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-sm text-(--text-secondary) mb-3 tracking-wide">
                Welcome to Our NewsHub
              </p>
              <h2 className="text-5xl font-bold text-(--text-main)">
                Discover the World of Headlines
              </h2>
            </div>
            <button className="flex items-center gap-3 text-(--text-accent) hover:text-(--bg-yellow) transition-colors font-semibold text-lg">
              View All News
              <Icon icon="mdi:arrow-right" className="text-2xl" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-5 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-3 rounded-full transition-all duration-300 text-sm font-semibold ${
                  activeCategory === category
                    ? 'bg-(--text-accent) text-(--text-button)'
                    : 'bg-(--bg-background) text-(--text-secondary) hover:text-(--text-main)'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* News List */}
          <div className="bg-(--bg-secondary)">
            {newsListItems.map((item, index) => (
              <NewsListItem key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Visual Insights Section */}
      <section ref={videosRef} className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <p className="text-sm text-(--text-secondary) mb-3 tracking-wide">
                Random Videos
              </p>
              <h2 className="text-5xl font-bold text-(--text-main)">
                Visual Insights for the Modern Viewer
              </h2>
            </div>
            <button className="flex items-center gap-3 text-(--text-accent) hover:text-(--bg-yellow) transition-colors font-semibold text-lg">
              View All
              <Icon icon="mdi:arrow-right" className="text-2xl" />
            </button>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-2 gap-16">
            {videoCards.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section ref={ctaRef} className="py-24 px-4 bg-(--bg-secondary)">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-16 items-start mb-24">
            {/* Left Icon */}
            <div className="flex-shrink-0">
              <Icon icon="mdi:atom" className="text-9xl text-(--text-accent)" />
            </div>
            
            {/* Right Content */}
            <div className="flex-1">
              <p className="text-sm text-(--text-secondary) mb-4 tracking-widest uppercase">
                Learn, Connect, and Innovate
              </p>
              <h2 className="text-6xl font-bold text-(--text-main) mb-6 leading-tight">
                Be Part of the Future Tech Revolution
              </h2>
              <p className="text-(--text-secondary) text-base leading-relaxed">
                Immerse yourself in the world of future technology. Explore our comprehensive resources, connect with fellow tech enthusiasts, and drive innovation in the industry. Join a dynamic community of forward-thinkers.
              </p>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-3 gap-6">
            {featureCards.map((feature, index) => (
              <div
                key={index}
                className="bg-transparent border border-gray-700 rounded-3xl p-8 hover:border-gray-600 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-(--text-main) mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-(--text-secondary) text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-(--text-accent) rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                    <Icon icon="mdi:arrow-top-right" className="text-xl text-(--text-button)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-(--text-border)">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-lg font-bold text-(--text-main) mb-6">Home</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Features</a></li>
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Blogs</a></li>
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Resources</a></li>
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Testimonials</a></li>
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-(--text-main) mb-6">News</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Trending Stories</a></li>
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Featured Articles</a></li>
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Latest News</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-(--text-main) mb-6">Blogs</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Technology</a></li>
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Product Reviews</a></li>
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-(--text-main) mb-6">Podcasts</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Latest Episodes</a></li>
                <li><a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">Subscribe</a></li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-between pt-10 border-t border-(--text-border)">
            <p className="text-(--text-secondary) text-sm">
              © 2024 TechTech. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">
                <Icon icon="mdi:twitter" className="text-2xl" />
              </a>
              <a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">
                <Icon icon="mdi:linkedin" className="text-2xl" />
              </a>
              <a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">
                <Icon icon="mdi:youtube" className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TechNews;
