import React from 'react';
import { Icon } from '@iconify/react';

const NewsCard = ({ image, title, category, likes, comments }) => {
  return (
    <div className="bg-(--bg-secondary) rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-(--text-main) mb-6 leading-tight min-h-[3.5rem]">
          {title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--text-secondary) font-medium">{category}</span>
          
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-(--text-secondary)">
              <Icon icon="mdi:heart-outline" className="text-lg" />
              <span className="text-sm font-medium">{likes}k</span>
            </div>
            <div className="flex items-center gap-2 text-(--text-secondary)">
              <Icon icon="mdi:comment-outline" className="text-lg" />
              <span className="text-sm font-medium">{comments}</span>
            </div>
            <button className="text-(--text-accent) hover:text-(--bg-yellow) transition-colors">
              <Icon icon="mdi:arrow-right" className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
