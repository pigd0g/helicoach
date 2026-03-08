import React, { useState, useEffect } from "react";
import { slugify, trackEvent } from "../analytics";
import ConfettiCelebration from "./ConfettiCelebration";
import TrainingModeTabs from "./TrainingModeTabs";

export default function ManeuversView({
  selectedLevel,
  getLevelProgress,
  showVideo,
  setShowVideo,
  completedManeuvers,
  maneuverProgress,
  maneuverLastPracticedAt,
  trainingRecommendations,
  handleManeuverClick,
  toggleLevelCompletion,
  selectedTrainingMode,
  onTrainingModeChange,
}) {
  const formatLabel = (value = "") =>
    value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());

  const getModeStatus = (progress) => {
    if (!progress) {
      return "not_started";
    }

    if (selectedTrainingMode === "sim") {
      return progress.simStatus || "not_started";
    }

    if (selectedTrainingMode === "real") {
      return progress.realStatus || "not_started";
    }

    return progress.status || "not_started";
  };

  const [showConfetti, setShowConfetti] = useState(false);
  const recommendedIds = new Set(
    trainingRecommendations.map((entry) => entry.id),
  );

  useEffect(() => {
    if (!showConfetti) return;
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [showConfetti]);

  const handleToggleLevelCompletion = (e) => {
    e.stopPropagation();
    const wasComplete = getLevelProgress(selectedLevel).percentage === 100;
    toggleLevelCompletion(selectedLevel);

    // Show confetti when marking level as completed (not when unmarking)
    if (!wasComplete) {
      setShowConfetti(true);
    }

    const nextStatus = wasComplete ? "incomplete" : "complete";
    trackEvent(
      `level_${nextStatus}_${selectedLevel.id}_${slugify(selectedLevel.title)}`,
      {
        type: "level",
        id: selectedLevel.id,
        title: selectedLevel.title,
        status: nextStatus,
      },
    );
  };

  return (
    <div className="space-y-6">
      {showConfetti && <ConfettiCelebration />}
      <div
        className={`${
          getLevelProgress(selectedLevel).percentage === 100
            ? "bg-green-600"
            : "bg-blue-600"
        } text-white rounded-xl p-6 shadow-md`}
      >
        <h2 className="text-2xl font-bold">{selectedLevel.title}</h2>
        <div
          className={`flex items-center gap-2 mt-2 ${
            getLevelProgress(selectedLevel).percentage === 100
              ? "text-green-100"
              : "text-blue-100"
          }`}
        >
          <div
            className={`flex-1 h-2 rounded-full overflow-hidden ${
              getLevelProgress(selectedLevel).percentage === 100
                ? "bg-green-800/50"
                : "bg-blue-800/50"
            }`}
          >
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-500"
              style={{
                width: `${getLevelProgress(selectedLevel).percentage}%`,
              }}
            />
          </div>
          <span className="text-sm font-medium">
            {getLevelProgress(selectedLevel).percentage}% Complete
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Training View</p>
            <p className="text-sm text-slate-500 mt-1">
              Switch between overall, simulator, and real-flight readiness
              without changing syllabus order.
            </p>
          </div>
          <TrainingModeTabs
            selectedMode={selectedTrainingMode}
            onChange={onTrainingModeChange}
          />
        </div>
        {trainingRecommendations.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Recommended in this level:{" "}
            {trainingRecommendations.map((entry) => entry.title).join(", ")}
          </div>
        )}
      </div>

      {selectedLevel.video && (
        <div className="space-y-4">
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
              <path d="m10 15 5-3-5-3z" />
            </svg>
            {showVideo
              ? "Hide Video Guide"
              : "RC Helicopter Richard's Video Guide"}
          </button>
          {showVideo && (
            <div className="rounded-xl overflow-hidden shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
              <iframe
                width="100%"
                height="300"
                src={`https://www.youtube.com/embed/${selectedLevel.video
                  .split("/")
                  .pop()}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {selectedLevel.maneuvers.map((maneuver) => {
          const isCompleted = completedManeuvers[maneuver.id];
          const progress = maneuverProgress[maneuver.id];
          const lastPracticedAt = maneuverLastPracticedAt[maneuver.id];
          const modeStatus = getModeStatus(progress);
          const isRecommended = recommendedIds.has(maneuver.id);
          return (
            <div
              key={maneuver.id}
              className={`bg-white rounded-lg p-4 shadow-sm border flex items-center gap-4 cursor-pointer active:bg-slate-50 transition-all ${
                isCompleted
                  ? "border-green-200 bg-green-50/30"
                  : "border-slate-200 hover:border-blue-200"
              }`}
              onClick={() => handleManeuverClick(maneuver)}
            >
              <div
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border transition-colors ${
                  isCompleted
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  maneuver.id
                )}
              </div>
              <div className="grow">
                <div
                  className={`font-semibold ${
                    isCompleted ? "text-green-900" : "text-slate-800"
                  }`}
                >
                  {maneuver.title}
                </div>
                {(progress || lastPracticedAt || isRecommended) && (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    {isRecommended && (
                      <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                        Recommended
                      </span>
                    )}
                    {progress && (
                      <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                        {formatLabel(modeStatus)}
                      </span>
                    )}
                    {lastPracticedAt && (
                      <span className="text-slate-500">
                        Last practiced{" "}
                        {new Date(lastPracticedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40">
        <button
          onClick={handleToggleLevelCompletion}
          className={`max-w-md w-full shadow-xl rounded-full py-4 px-6 font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 cursor-pointer ${
            getLevelProgress(selectedLevel).percentage === 100
              ? "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {getLevelProgress(selectedLevel).percentage === 100 ? (
            <>
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Mark Level Incomplete
            </>
          ) : (
            <>
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Mark Level Complete
            </>
          )}
        </button>
      </div>
    </div>
  );
}
