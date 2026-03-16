import React from "react";
import { levels } from "../data";

function getSuggestedManeuvers(completedManeuvers, count = 5) {
  const suggestions = [];
  for (const level of levels) {
    for (const maneuver of level.maneuvers) {
      if (!completedManeuvers[maneuver.id]) {
        suggestions.push({
          ...maneuver,
          levelId: level.id,
          levelTitle: level.title,
        });
        if (suggestions.length >= count) return suggestions;
      }
    }
  }
  return suggestions;
}

export default function HomeView({
  completedManeuvers,
  handleCopyPrompt,
  onLevels,
  onFlightRecords,
  onManeuverClick,
}) {
  const completed = completedManeuvers || {};
  const suggestions = getSuggestedManeuvers(completed);
  const totalManeuvers = levels.reduce(
    (sum, l) => sum + l.maneuvers.length,
    0,
  );
  const totalCompleted = Object.keys(completed).length;
  const progressPct = Math.round((totalCompleted / totalManeuvers) * 100);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-linear-to-br from-slate-900 to-slate-700 rounded-2xl p-8 text-white text-center shadow-xl">
        <div className="text-5xl mb-3">🚁</div>
        <h2 className="text-2xl font-bold mb-1">HeliCoach</h2>
        <p className="text-slate-300 text-sm">
          RC Helicopter Pilot Proficiency Training
        </p>
        {totalCompleted > 0 ? (
          <div className="mt-4 space-y-2">
            <div className="bg-white/10 rounded-xl px-4 py-2 inline-block">
              <span className="text-white font-semibold text-sm">
                {totalCompleted}/{totalManeuvers} maneuvers completed
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-2 inline-block">
            <span className="text-slate-300 text-sm">
              Start your journey — begin with Level 1
            </span>
          </div>
        )}
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onLevels}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl p-5 text-center font-semibold shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="text-2xl mb-2">📋</div>
          <div className="text-sm font-bold">Training Levels</div>
          <div className="text-xs text-blue-200 mt-1">View all levels</div>
        </button>
        <button
          onClick={onFlightRecords}
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl p-5 text-center font-semibold shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="text-2xl mb-2">🛩️</div>
          <div className="text-sm font-bold">Flight Records</div>
          <div className="text-xs text-emerald-200 mt-1">Log your flights</div>
        </button>
      </div>

      {/* Suggested Training */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500 flex-shrink-0"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Suggested Training
            </h2>
            <p className="text-xs text-slate-500">
              Next maneuvers to practice
            </p>
          </div>
        </div>
        {suggestions.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-slate-700 font-semibold">
              All maneuvers completed!
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Fantastic work. Keep practicing to maintain your skills.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {suggestions.map((m, i) => (
              <li key={m.id}>
                <button
                  onClick={() => onManeuverClick(m)}
                  className="w-full text-left px-5 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {m.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {m.levelTitle}
                      </div>
                    </div>
                    <svg
                      className="flex-shrink-0 text-slate-300"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* AI Coach */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-base font-bold text-white mb-1">
          AI Coach Assistant
        </h2>
        <p className="text-blue-100 text-sm mb-4">
          Generate a prompt with your progress to get personalized coaching
          from your favourite AI assistant.
        </p>
        <button
          onClick={handleCopyPrompt}
          className="bg-white text-blue-700 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-50 active:bg-blue-100 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Coach Prompt
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
