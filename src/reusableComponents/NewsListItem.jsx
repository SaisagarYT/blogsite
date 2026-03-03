import React from 'react';
import { Icon } from '@iconify/react';

const NewsListItem = ({ avatar, author, role, date, title, description, featured, likes, comments }) => {
  return (
    <div className="flex items-start gap-5 py-8 border-b border-(--text-border) last:border-b-0 hover:bg-(--bg-background) hover:rounded-2xl transition-all duration-300 px-4 cursor-pointer">
      {/* Author Avatar */}
      <div className="flex-shrink-0">
        <img src={avatar} alt={author} className="w-14 h-14 rounded-full object-cover" />
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-base font-bold text-(--text-main)">{author}</span>
          <span className="text-sm text-(--text-secondary)">{role}</span>
          <span className="text-sm text-(--text-secondary)">•</span>
          <span className="text-sm text-(--text-secondary)">{date}</span>
        </div>
        
        <h3 className="text-xl font-bold text-(--text-main) mb-3 leading-snug">
          {title}
        </h3>
        
        <p className="text-base text-(--text-secondary) leading-relaxed mb-4">
          {description}
        </p>
        
        <div className="flex items-center gap-6">
          {featured && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-(--text-accent) text-(--text-button) rounded-full text-sm font-semibold">
              <Icon icon="mdi:star" className="text-base" />
              Featured
            </span>
          )}
          <div className="flex items-center gap-2 text-(--text-secondary)">
            <Icon icon="mdi:heart-outline" className="text-lg" />
            <span className="text-sm font-medium">{likes}k</span>
          </div>
          <div className="flex items-center gap-2 text-(--text-secondary)">
            <Icon icon="mdi:comment-outline" className="text-lg" />
            <span className="text-sm font-medium">{comments}</span>
          </div>
          <button className="text-(--text-accent) text-sm font-semibold hover:text-(--bg-yellow) transition-colors flex items-center gap-2 ml-auto">
            Read More
            <Icon icon="mdi:arrow-right" className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsListItem;
