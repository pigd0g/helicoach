import React from "react";

export default function Header({
  view,
  onBack,
  onAbout,
  onFlightRecords,
  onSessions,
}) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-center relative">
        {view !== "levels" && (
          <button
            className="absolute left-4 p-2 -ml-2 text-slate-300 hover:text-white active:text-white transition-colors rounded-full hover:bg-white/10 active:bg-white/20 cursor-pointer"
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
        <a
          className="flex items-center justify-center1 cursor-pointer"
          href="/"
        >
          <img src="/logow.png" alt="HeliCoach Logo" className="h-8 w-8 mr-2" />
          <h1 className="text-lg font-bold tracking-wide">HeliCoach</h1>
        </a>
        <div className="absolute right-4 flex items-center gap-1">
          {view !== "sessions" &&
            view !== "sessionnew" &&
            view !== "sessionedit" &&
            view !== "sessiondetail" && (
              <button
                className="p-2 text-slate-300 hover:text-white active:text-white transition-colors rounded-full hover:bg-white/10 active:bg-white/20 cursor-pointer"
                onClick={onSessions}
                aria-label="Flight Sessions"
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
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                  <path d="M8 14h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 18h.01" />
                  <path d="M12 18h.01" />
                  <path d="M16 18h.01" />
                </svg>
              </button>
            )}
          {view !== "flightrecords" &&
            view !== "flightrecordnew" &&
            view !== "flightrecorddetail" &&
            view !== "preflight" && (
              <button
                className="p-2 text-slate-300 hover:text-white active:text-white transition-colors rounded-full hover:bg-white/10 active:bg-white/20 cursor-pointer"
                onClick={onFlightRecords}
                aria-label="Flight Records"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22,21a1,1,0,0,1-1,1H12a1,1,0,0,1,0-2h9A1,1,0,0,1,22,21Zm1-8a6,6,0,0,1-6,6c-4.531,0-6.208-2.09-7.345-4.349A2.981,2.981,0,0,0,6.983,13H4a1,1,0,0,1-.894-.553l-2-4A1,1,0,0,1,1,8V4a1,1,0,0,1,1.707-.707L6.413,7H13V4H10a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2H15V7h1.786a6.163,6.163,0,0,1,6.187,5.414C22.985,12.54,23,12.762,23,13Zm-2.142,1H16a1,1,0,0,1-1-1V9H6a1,1,0,0,1-.707-.293L3,6.414v1.35L4.617,11H6.983a4.972,4.972,0,0,1,4.46,2.752C12.337,15.529,13.373,17,17,17a4.009,4.009,0,0,0,2.96-1.311A3.928,3.928,0,0,0,20.857,14Zm0-2A4.177,4.177,0,0,0,17,9.02V12Z" />
                </svg>
              </button>
            )}
          {view !== "about" && (
            <button
              className="p-2 text-slate-300 hover:text-white active:text-white transition-colors rounded-full hover:bg-white/10 active:bg-white/20 cursor-pointer"
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
      </div>
    </header>
  );
}
