import React from 'react';
import { Icon } from '@iconify/react';

const NewsHeroCard = ({ image, category, title, description, author, date, likes, comments }) => {
  return (
    <div className="flex flex-col md:flex-row gap-0 bg-(--bg-secondary) rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Image Section */}
      <div className="w-full md:w-[35%] h-48 md:h-auto relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      
      {/* Content Section */}
      <div className="w-full md:w-[65%] p-6 md:p-10 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-(--text-main) mb-4 md:mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-(--text-secondary) text-sm md:text-base mb-6 md:mb-8 leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <p className="text-xs text-(--text-secondary) uppercase mb-2 tracking-wide">Category</p>
              <p className="text-sm font-semibold text-(--text-main)">{category}</p>
            </div>
            <div>
              <p className="text-xs text-(--text-secondary) uppercase mb-2 tracking-wide">Author</p>
              <p className="text-sm font-semibold text-(--text-main)">{author}</p>
            </div>
            <div>
              <p className="text-xs text-(--text-secondary) uppercase mb-2 tracking-wide">Published</p>
              <p className="text-sm font-semibold text-(--text-main)">{date}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <button className="flex items-center gap-2 text-(--text-secondary) hover:text-(--text-accent) transition-colors">
              <Icon icon="mdi:heart-outline" className="text-lg md:text-xl" />
              <span className="text-xs md:text-sm font-medium">{likes}k</span>
            </button>
            <button className="flex items-center gap-2 text-(--text-secondary) hover:text-(--text-accent) transition-colors">
              <Icon icon="mdi:comment-outline" className="text-lg md:text-xl" />
              <span className="text-xs md:text-sm font-medium">{comments}</span>
            </button>
            <button className="px-6 py-3 bg-(--text-accent) text-(--text-button) rounded-xl font-semibold hover:bg-(--bg-yellow) transition-colors flex items-center gap-2">
              Read More
              <Icon icon="mdi:arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsHeroCard;
