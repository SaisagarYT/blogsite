import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80">
      <div className="w-16 h-16 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="mt-6 text-xl text-gray-700 font-semibold">Loading...</div>
    </div>
  );
};

export default Loading;
