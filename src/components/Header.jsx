import React from "react";

export default function Header({ view, onBack, onAbout }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-center relative">
        {view !== "levels" && (
          <button
            className="absolute left-4 p-2 -ml-2 text-slate-300 hover:text-white active:text-white transition-colors rounded-full hover:bg-white/10 active:bg-white/20"
            onClick={onBack}
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <img src="/logow.png" alt="HeliCoach Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-lg font-bold tracking-wide">HeliCoach</h1>
        {view !== "about" && (
          <button
            className="absolute right-4 p-2 -mr-2 text-slate-300 hover:text-white active:text-white transition-colors rounded-full hover:bg-white/10 active:bg-white/20"
            onClick={onAbout}
            aria-label="About"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
