import React, { useEffect } from "react";

const TOSTER_COLORS = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
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
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3 rounded shadow-lg font-semibold text-base transition-all ${TOSTER_COLORS[type]}`}
      style={{ minWidth: 220, textAlign: "center" }}>
      {message}
    </div>
  );
};

export default Toster;
