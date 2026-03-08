import React from "react";
import { TRAINING_MODES, getTrainingModeLabel } from "../trainingInsights";

export default function TrainingModeTabs({ selectedMode, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
      {TRAINING_MODES.map((mode) => {
        const isActive = selectedMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {getTrainingModeLabel(mode)}
          </button>
        );
      })}
    </div>
  );
}
