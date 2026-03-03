import React, { useEffect } from "react";
import { Icon } from "@iconify/react";

const TOSTER_ICONS = {
  success: "mdi:check-circle",
  error: "mdi:alert-circle",
  info: "mdi:information",
};

const Toster = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-[99999] bg-white rounded-lg transition-all animate-slide-in"
      style={{ 
        minWidth: 300,
        maxWidth: 400,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        animation: "slideIn 0.3s ease-out"
      }}>
      <div className="flex items-start gap-3 px-5 py-4">
        <Icon 
          icon={TOSTER_ICONS[type]} 
          className="text-2xl flex-shrink-0 mt-0.5"
          style={{ color: "#000" }}
        />
        <p className="text-black text-sm font-medium leading-relaxed flex-1">
          {message}
        </p>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-black transition-colors flex-shrink-0"
          style={{ fontSize: 18 }}>
          <Icon icon="mdi:close" />
        </button>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toster;
