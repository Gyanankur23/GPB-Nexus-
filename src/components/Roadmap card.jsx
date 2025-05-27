import React from "react";

const RoadmapCard = ({ title, description, link }) => (
  <div className="group relative bg-gradient-to-tr from-blue-900 via-blue-800 to-peach-100 dark:from-black dark:via-blue-900 dark:to-black rounded-xl shadow-2xl p-6 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40">
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-peach-100 dark:bg-blue-900 rounded-full opacity-60 blur-2xl group-hover:scale-110 transition-transform duration-300"></div>
    <div className="flex items-center gap-3 mb-2">
      <svg className="w-8 h-8 text-blue-500 group-hover:text-peach-200 transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <h2 className="font-bold text-2xl text-blue-900 dark:text-peach-100 drop-shadow-sm">{title}</h2>
    </div>
    <p className="text-blue-800 dark:text-peach-100/80 text-base mb-4">{description}</p>
    <a
      href={link}
      className="inline-block px-4 py-2 rounded-full bg-blue-700 hover:bg-peach-200 hover:text-blue-900 font-semibold text-peach-100 dark:text-peach-100 dark:hover:bg-blue-800 transition-all duration-300 shadow-lg"
    >
      View Roadmap
    </a>
    <div className="absolute bottom-2 right-2 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" stroke="#2563eb" strokeWidth="4" fill="none"/>
        <path d="M24 8v16l12 8" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

export default RoadmapCard;
