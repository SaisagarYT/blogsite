import React from 'react';
import { Icon } from '@iconify/react';

const VideoCard = ({ image, title, description, duration }) => {
  return (
    <div className="bg-(--bg-secondary) rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Video Thumbnail */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-20 h-20 flex items-center justify-center bg-white/95 rounded-full group-hover:scale-110 group-hover:bg-(--text-accent) transition-all duration-300 shadow-lg">
            <Icon icon="mdi:play" className="text-4xl text-black ml-1" />
          </div>
        </div>
        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/80 rounded-lg text-white text-sm font-semibold">
            {duration}
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-7">
        <h3 className="text-lg font-bold text-(--text-main) mb-3 leading-tight">
          {title}
        </h3>
        <p className="text-base text-(--text-secondary) leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
