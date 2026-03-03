import React from 'react';
import { Icon } from '@iconify/react';

const NewsListItem = ({ avatar, author, role, date, title, description, featured, likes, comments }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-5 py-6 md:py-8 border-b border-(--text-border) last:border-b-0 hover:bg-(--bg-background) hover:rounded-2xl transition-all duration-300 px-2 md:px-4 cursor-pointer">
      {/* Author Avatar */}
      <div className="flex-shrink-0">
        <img src={avatar} alt={author} className="w-12 md:w-14 h-12 md:h-14 rounded-full object-cover" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <span className="text-sm md:text-base font-bold text-(--text-main)">{author}</span>
          <span className="text-xs md:text-sm text-(--text-secondary) hidden md:inline">{role}</span>
          <span className="text-xs md:text-sm text-(--text-secondary) hidden md:inline">•</span>
          <span className="text-xs md:text-sm text-(--text-secondary)">{date}</span>
        </div>
        
        <h3 className="text-lg md:text-xl font-bold text-(--text-main) mb-2 md:mb-3 leading-snug">
          {title}
        </h3>
        
        <p className="text-sm md:text-base text-(--text-secondary) leading-relaxed mb-3 md:mb-4">
          {description}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          {featured && (
            <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 bg-(--text-accent) text-(--text-button) rounded-full text-xs md:text-sm font-semibold">
              <Icon icon="mdi:star" className="text-sm md:text-base" />
              Featured
            </span>
          )}
          <div className="flex items-center gap-2 text-(--text-secondary)">
            <Icon icon="mdi:heart-outline" className="text-base md:text-lg" />
            <span className="text-xs md:text-sm font-medium">{likes}k</span>
          </div>
          <div className="flex items-center gap-2 text-(--text-secondary)">
            <Icon icon="mdi:comment-outline" className="text-base md:text-lg" />
            <span className="text-xs md:text-sm font-medium">{comments}</span>
          </div>
          <button className="text-(--text-accent) text-xs md:text-sm font-semibold hover:text-(--bg-yellow) transition-colors flex items-center gap-2 md:ml-auto">
            Read More
            <Icon icon="mdi:arrow-right" className="text-base md:text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsListItem;
