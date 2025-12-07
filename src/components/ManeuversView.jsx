import React, { useState, useEffect } from "react";
import ConfettiCelebration from "./ConfettiCelebration";

export default function ManeuversView({
  selectedLevel,
  getLevelProgress,
  showVideo,
  setShowVideo,
  completedManeuvers,
  handleManeuverClick,
  toggleLevelCompletion,
}) {
  const [showConfetti, setShowConfetti] = useState(false);

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

      {selectedLevel.video && (
        <div className="space-y-4">
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
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
          className={`max-w-md w-full shadow-xl rounded-full py-4 px-6 font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
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
