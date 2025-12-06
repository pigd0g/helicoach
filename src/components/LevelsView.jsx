import React from "react";
import Tips from "./Tips";
import LevelCard from "./LevelCard";

export default function LevelsView({
  levels,
  getLevelProgress,
  handleCopyPrompt,
  tips,
  currentTipIndex,
  nextTip,
  prevTip,
  handleLevelClick,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-lg font-bold text-blue-100 mb-2">
          AI Coach Assistant
        </h2>
        <p className="text-blue-100 text-sm mb-4">
          Generate a prompt with your progress to get personalized coaching from
          your favourite AI assistant.
        </p>
        <button
          onClick={handleCopyPrompt}
          className="bg-white text-blue-700 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-50 active:bg-blue-100 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
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

      <Tips
        tips={tips}
        currentIndex={currentTipIndex}
        onPrev={prevTip}
        onNext={nextTip}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {levels.map((level) => {
          const progress = getLevelProgress(level);
          return (
            <LevelCard
              key={level.id}
              level={level}
              progress={progress}
              onClick={handleLevelClick}
            />
          );
        })}
      </div>
    </div>
  );
}
