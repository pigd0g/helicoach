import React from "react";

export default function ManeuverDetail({
  selectedManeuver,
  completedManeuvers,
  toggleCompletion,
  showVideo,
  setShowVideo,
}) {
  if (!selectedManeuver) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-24">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="bg-slate-50 border-b border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
              {selectedManeuver.id}
            </span>
            {completedManeuvers[selectedManeuver.id] && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Completed
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            {selectedManeuver.title}
          </h2>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              Description
            </h3>
            <p className="text-slate-700 leading-relaxed text-lg">
              {selectedManeuver.description}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              Variations
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-slate-700 font-medium font-mono text-sm">
                {selectedManeuver.variations}
              </p>
            </div>
          </div>

          {selectedManeuver.url && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                Video Guide
              </h3>
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
                    src={`https://www.youtube.com/embed/${selectedManeuver.url
                      .split("?")[0]
                      .split("/")
                      .pop()}?start=${parseInt(
                      new URLSearchParams(
                        selectedManeuver.url.split("?")[1]
                      ).get("t") || 0
                    )}&autoplay=1`}
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
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40">
        <button
          onClick={() => toggleCompletion(selectedManeuver.id)}
          className={`max-w-md w-full shadow-xl rounded-full py-4 px-6 font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
            completedManeuvers[selectedManeuver.id]
              ? "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {completedManeuvers[selectedManeuver.id] ? (
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
              Mark Incomplete
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
              Mark Completed
            </>
          )}
        </button>
      </div>
    </div>
  );
}
