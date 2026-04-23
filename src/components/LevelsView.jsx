import React from "react";
import Tips from "./Tips";
import LevelCard from "./LevelCard";

export default function LevelsView({
  levels,
  getLevelProgress,
  handlePromptAction,
  tips,
  currentTipIndex,
  nextTip,
  prevTip,
  handleLevelClick,
}) {
  const [promptAction, setPromptAction] = React.useState("");

  const onPromptActionChange = async (event) => {
    const action = event.target.value;
    setPromptAction(action);
    if (!action) {
      return;
    }
    await handlePromptAction(action);
    setPromptAction("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-lg font-bold text-white mb-2">
          AI Coach Assistant
        </h2>
        <p className="text-blue-100 text-sm mb-4">
          Generate a prompt with your progress to get personalized coaching from
          your favourite AI assistant.
        </p>
        <select
          value={promptAction}
          onChange={onPromptActionChange}
          className="bg-white text-blue-700 font-bold py-2 px-4 rounded-lg shadow-sm transition-colors w-full sm:w-auto cursor-pointer"
        >
          <option value="">Copy/Open Coach Prompt…</option>
          <option value="copy">Copy and Paste</option>
          <option value="chatgpt">Open in ChatGPT</option>
          <option value="gemini">Open in Gemini</option>
          <option value="grok">Open in Grok</option>
        </select>
      </div>

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

      <Tips
        tips={tips}
        currentIndex={currentTipIndex}
        onPrev={prevTip}
        onNext={nextTip}
      />

      <p className="text-center text-xs text-gray-400 mt-4">
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
