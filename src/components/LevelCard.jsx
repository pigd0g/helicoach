import React from "react";

export default function LevelCard({ level, progress, onClick }) {
  const isLevelComplete = progress.percentage === 100;
  return (
    <div
      onClick={() => onClick(level)}
      className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] duration-200 group relative overflow-hidden ${"border-slate-200 hover:border-blue-200"}`}
    >
      <div className="flex justify-between items-start mb-2 relative z-10">
        <span
          className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
            isLevelComplete
              ? "text-green-600 bg-green-50"
              : "text-blue-600 bg-blue-50"
          }`}
        >
          Level {level.id}
        </span>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            isLevelComplete
              ? "text-green-600 bg-green-50"
              : "text-slate-500 bg-slate-100"
          }`}
        >
          {progress.percentage}%
        </span>
      </div>
      <h2
        className={`text-xl font-bold text-slate-800 mb-1 transition-colors relative z-10 ${
          isLevelComplete
            ? "group-hover:text-green-700"
            : "group-hover:text-blue-700"
        }`}
      >
        {level.title.replace(/Level \d+: /, "")}
      </h2>
      <div
        className={`flex items-center gap-2 text-sm font-medium relative z-10 ${
          isLevelComplete ? "text-green-600" : "text-slate-500"
        }`}
      >
        <span>
          {progress.completed}/{progress.total} Completed
        </span>
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
        <div
          className={`h-full transition-all duration-500 ${
            isLevelComplete ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
}
