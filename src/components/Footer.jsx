import React from 'react';
import { Icon } from '@iconify/react';

const Footer = () => {
  return (
    <footer className="w-full py-12 md:py-16 px-4 md:px-8 lg:px-30 border-t border-(--text-border)">
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-8 md:mb-12">
          <div>
            <h3 className="text-base md:text-lg font-bold text-(--text-main) mb-4 md:mb-6">Home</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Features</a></li>
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Blogs</a></li>
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Resources</a></li>
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Testimonials</a></li>
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-(--text-main) mb-4 md:mb-6">News</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Trending Stories</a></li>
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Featured Articles</a></li>
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Latest News</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-(--text-main) mb-4 md:mb-6">Blogs</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Technology</a></li>
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Product Reviews</a></li>
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Events</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-(--text-main) mb-4 md:mb-6">Podcasts</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Latest Episodes</a></li>
              <li><a href="#" className="text-sm md:text-base text-(--text-secondary) hover:text-(--text-accent) transition-colors">Subscribe</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-between pt-8 md:pt-10 border-t border-(--text-border) gap-4">
          <p className="text-(--text-secondary) text-xs md:text-sm text-center md:text-left">
            © 2024 TechTech. All rights reserved.
          </p>
          <div className="flex gap-4 md:gap-6">
            <a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">
              <Icon icon="mdi:twitter" className="text-lg md:text-2xl" />
            </a>
            <a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">
              <Icon icon="mdi:linkedin" className="text-lg md:text-2xl" />
            </a>
            <a href="#" className="text-(--text-secondary) hover:text-(--text-accent) transition-colors">
              <Icon icon="mdi:youtube" className="text-lg md:text-2xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
