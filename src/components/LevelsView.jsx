import React from "react";
import Tips from "./Tips";
import LevelCard from "./LevelCard";
import TrainingModeTabs from "./TrainingModeTabs";

export default function LevelsView({
  levels,
  getLevelProgress,
  handleCopyPrompt,
  selectedTrainingMode,
  onTrainingModeChange,
  sessionInsights,
  trainingRecommendations,
  trainingPlan,
  tips,
  currentTipIndex,
  nextTip,
  prevTip,
  handleLevelClick,
}) {
  return (
    <div className="space-y-6">
      <p className="text-center text-xs text-gray-500">
        HeliCoach provides structured RC Helicopter Training as a Pilot
        Proficiency Program for RC Heli pilots of all levels.
      </p>
      <p className="text-center text-xs text-gray-500">
        Start with the basics, progress to aerobatics and learn 3d moves like
        piroflips and tic-tocs. Track progress, level up at your pace, and get
        AI coaching from your AI assistant.
      </p>
      <p className="text-center text-xs text-gray-500">
        🎁 Checkout the new flight records and preflight checklist{" "}
        <a
          className="text-blue-600 underline cursor-pointer"
          href="/flightrecords"
        >
          here
        </a>
        .
      </p>
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">
              AI Coach Assistant
            </h2>
            <p className="text-blue-100 text-sm">
              Generate a prompt with your progress, active training mode, and
              today&apos;s in-app recommendations for your favourite AI
              assistant.
            </p>
          </div>
          <TrainingModeTabs
            selectedMode={selectedTrainingMode}
            onChange={onTrainingModeChange}
          />
        </div>
        <button
          onClick={() =>
            handleCopyPrompt(
              selectedTrainingMode,
              trainingRecommendations,
              trainingPlan,
            )
          }
          className="mt-4 bg-white text-blue-700 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-50 active:bg-blue-100 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Training Pulse</h2>
            <p className="text-sm text-slate-500 mt-1">
              Recent activity and practice momentum for the selected mode.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {sessionInsights.totalSessions} sessions
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-slate-500">Last 7 Days</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {sessionInsights.thisWeekSessions}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-slate-500">Minutes Logged</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {sessionInsights.totalMinutes}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-slate-500">Packs Logged</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {sessionInsights.totalPacks}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-4 bg-linear-to-r from-slate-50 to-white">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Most Practiced Recently
          </p>
          <p className="text-lg font-bold text-slate-900 mt-2">
            {sessionInsights.topManeuverTitle || "No maneuver history yet"}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {sessionInsights.topManeuverCount > 0
              ? `${sessionInsights.topManeuverCount} logged attempts across saved sessions`
              : "Log a few sessions to surface recurring practice patterns."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recommended Next Focus
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Ranked from completion, proficiency, and recent session history.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {trainingRecommendations.length} suggestions
          </span>
        </div>

        {trainingRecommendations.length > 0 ? (
          <div className="grid gap-3">
            {trainingRecommendations.map((recommendation, index) => (
              <div
                key={recommendation.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Focus {index + 1}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {recommendation.title}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {recommendation.levelTitle}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {recommendation.modeStatus.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-3">
                  {recommendation.reason}
                </p>
                {recommendation.supportingText && (
                  <p className="text-xs text-slate-500 mt-2">
                    {recommendation.supportingText}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
            Complete a few maneuvers or log a few sessions to unlock targeted
            recommendations.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Session Planner</h2>
          <p className="text-sm text-slate-500 mt-1">
            A generated practice block you can fly immediately without leaving
            the app.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-linear-to-r from-slate-50 to-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {trainingPlan.title}
          </p>
          <p className="text-sm text-slate-600 mt-2">{trainingPlan.summary}</p>
        </div>

        <div className="grid gap-3">
          {trainingPlan.units.map((unit) => (
            <div
              key={unit.title}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {unit.title}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{unit.emphasis}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {unit.maneuvers.length} maneuvers
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {unit.maneuvers.map((maneuver) => (
                  <span
                    key={maneuver.id}
                    className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold"
                  >
                    {maneuver.id} {maneuver.title}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
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
