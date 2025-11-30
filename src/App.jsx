import { useState, useEffect } from "react";
import { levels, tips } from "./data";

function App() {
  const [view, setView] = useState("levels");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedManeuver, setSelectedManeuver] = useState(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(() =>
    Math.floor(Math.random() * tips.length)
  );
  const [completedManeuvers, setCompletedManeuver] = useState(() => {
    const saved = localStorage.getItem("completedManeuvers");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(
      "completedManeuvers",
      JSON.stringify(completedManeuvers)
    );
  }, [completedManeuvers]);

  const toggleCompletion = (maneuverId) => {
    setCompletedManeuver((prev) => {
      const newState = { ...prev };
      if (newState[maneuverId]) {
        delete newState[maneuverId];
      } else {
        newState[maneuverId] = true;
      }
      return newState;
    });
  };

  const toggleLevelCompletion = (level) => {
    const allComplete = level.maneuvers.every((m) => completedManeuvers[m.id]);
    setCompletedManeuver((prev) => {
      const newState = { ...prev };
      level.maneuvers.forEach((m) => {
        if (allComplete) {
          delete newState[m.id];
        } else {
          newState[m.id] = true;
        }
      });
      return newState;
    });
  };

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setShowVideo(false);
    setView("maneuvers");
    window.scrollTo(0, 0);
  };

  const handleManeuverClick = (maneuver) => {
    setSelectedManeuver(maneuver);
    setView("detail");
    window.scrollTo(0, 0);
  };

  const handleRandomManeuver = () => {
    const allManeuvers = levels.flatMap((l) => l.maneuvers);
    const incompleteManeuvers = allManeuvers.filter(
      (m) => !completedManeuvers[m.id]
    );

    if (incompleteManeuvers.length > 0) {
      const randomManeuver =
        incompleteManeuvers[
          Math.floor(Math.random() * incompleteManeuvers.length)
        ];
      // Find the level for this maneuver to set context correctly if needed,
      // though for just viewing detail we might not strictly need selectedLevel if we adjust goBack logic
      // But let's try to find the level to keep state consistent
      const level = levels.find((l) =>
        l.maneuvers.some((m) => m.id === randomManeuver.id)
      );

      setSelectedLevel(level);
      setShowVideo(false);
      setSelectedManeuver(randomManeuver);
      setView("detail");
      window.scrollTo(0, 0);
    } else {
      alert("Congratulations! You've completed all maneuvers!");
    }
  };

  const handleCopyPrompt = () => {
    const allManeuvers = levels.flatMap((l) =>
      l.maneuvers.map(
        (m) =>
          `Level ${l.id}: ${m.title}${
            m.variations === "N/A" ? "" : " - " + m.variations
          }`
      )
    );
    const progress = Object.keys(completedManeuvers).join(", ");
    const allTips = tips.join("\n");

    const prompt = `You are a helpful RC Helicopter Pilot Proficiency Coach.

Here are the maneuvers in the program:
${allManeuvers.join("\n")}

Here is my current progress (list of completed maneuver IDs):
${progress}

Here are some helpful tips for pilots:
${allTips}

Please analyze my progress and suggest a training plan for today. Do Not Include Current Progress Summary`;

    navigator.clipboard.writeText(prompt).then(() => {
      alert("Prompt copied to clipboard! Paste it into your AI assistant.");
    });
  };

  const goBack = () => {
    if (view === "detail") {
      setView("maneuvers");
      setSelectedManeuver(null);
    } else if (view === "maneuvers") {
      setView("levels");
      setSelectedLevel(null);
    } else if (view === "about") {
      setView("levels");
    }
  };

  const handleExportData = () => {
    const data = {
      completedManeuvers,
      exportedAt: new Date().toISOString(),
      version: 1,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `helicoach-progress-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);
        if (
          data.completedManeuvers &&
          typeof data.completedManeuvers === "object"
        ) {
          // Validate and sanitize: only keep entries with valid maneuver ID format and boolean values
          const validManeuverIds = new Set(
            levels.flatMap((l) => l.maneuvers.map((m) => m.id))
          );
          const sanitized = {};
          for (const [key, value] of Object.entries(data.completedManeuvers)) {
            if (validManeuverIds.has(key) && value === true) {
              sanitized[key] = true;
            }
          }
          setCompletedManeuver(sanitized);
          alert("Progress imported successfully!");
        } else {
          alert(
            "Invalid file format. Please select a valid HeliCoach export file."
          );
        }
      } catch {
        alert("Error reading file. Please select a valid JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be selected again
    event.target.value = "";
  };

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const getLevelProgress = (level) => {
    const total = level.maneuvers.length;
    const completed = level.maneuvers.filter(
      (m) => completedManeuvers[m.id]
    ).length;
    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg backdrop-blur-sm bg-opacity-95">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-center relative">
          {view !== "levels" && (
            <button
              className="absolute left-4 p-2 -ml-2 text-slate-300 hover:text-white active:text-white transition-colors rounded-full hover:bg-white/10 active:bg-white/20"
              onClick={goBack}
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
          <h1 className="text-lg font-bold tracking-wide">HeliCoach</h1>
          {view !== "about" && (
            <button
              className="absolute right-4 p-2 -mr-2 text-slate-300 hover:text-white active:text-white transition-colors rounded-full hover:bg-white/10 active:bg-white/20"
              onClick={() => {
                setView("about");
                window.scrollTo(0, 0);
              }}
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
      </header>

      <main className="max-w-3xl mx-auto p-4 pb-20">
        {view === "about" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  <strong>HeliCoach</strong> provides a structured training
                  guide based on the RC Heli Nation Pilot Proficiency Program,
                  designed to help RC helicopter pilots of all skill levels
                  improve their flying.
                </p>
                <p>
                  Starting from basic hovering orientations in Level 1, the
                  program progresses through forward flight, aerobatics, and
                  advanced 3D maneuvers.
                </p>
                <p>
                  Use this app to track your progress, and master each level at
                  your own pace.
                </p>
                <p>
                  All data is stored locally in your browser's local storage.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                How to use
              </h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Select a Level to view its maneuvers.</li>
                <li>Tap a maneuver to see details and variations.</li>
                <li>Mark maneuvers as complete to track your progress.</li>
                <li>
                  Use the <strong>AI Coach Assistant</strong> prompt in your
                  favourite AI assistant to generate a custom training plan
                  based on your progress.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Transfer Progress
              </h3>
              <p className="text-slate-700 mb-4">
                Export your progress to transfer to another device, or import a
                previously exported file.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExportData}
                  className="flex-1 py-2 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium flex items-center justify-center gap-2 transition-colors"
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export Progress
                </button>
                <label className="flex-1 py-2 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer">
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Import Progress
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                PR's Welcome
              </h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  Source available on{" "}
                  <a
                    className="link underline"
                    href="https://github.com/pigd0g/helicoach"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>{" "}
                </li>
              </ul>
            </div>

            <div className="text-center text-slate-400 text-sm pt-4">
              <p>Happy Flying!</p>
              <p className="mt-1">HeliCoach</p>
            </div>
          </div>
        )}

        {view === "levels" && (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
              <h2 className="text-lg font-bold text-blue-100 mb-2">
                AI Coach Assistant
              </h2>
              <p className="text-blue-100 text-sm mb-4">
                Generate a prompt with your progress to get personalized
                coaching from your favourite AI assistant.
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

            {/* Tips Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
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
                    className="text-yellow-500"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3.3.9.8 1.6 1.9 2.8z" />
                  </svg>
                  Pro Tips
                </h3>
              </div>

              <p className="text-slate-600 text-lg mb-6 min-h-16">
                {tips[currentTipIndex]}
              </p>

              <div className="flex justify-between gap-4">
                <button
                  onClick={prevTip}
                  className="flex-1 py-2 px-4 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={nextTip}
                  className="flex-1 py-2 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {levels.map((level) => {
                const progress = getLevelProgress(level);
                const isLevelComplete = progress.percentage === 100;
                return (
                  <div
                    key={level.id}
                    className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] duration-200 group relative overflow-hidden ${"border-slate-200 hover:border-blue-200"}`}
                    onClick={() => handleLevelClick(level)}
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

                    {/* Progress bar background */}
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
              })}
            </div>
          </div>
        )}

        {view === "maneuvers" && selectedLevel && (
          <div className="space-y-6">
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

            {/* Floating Action Button for Level Completion */}
            <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLevelCompletion(selectedLevel);
                }}
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
        )}

        {view === "detail" && selectedManeuver && (
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    Description
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {selectedManeuver.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20" />
                      <path d="m17 5-5-3-5 3" />
                      <path d="m17 19-5 3-5-3" />
                    </svg>
                    Variations
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <p className="text-slate-700 font-medium font-mono text-sm">
                      {selectedManeuver.variations}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Action Button for Completion */}
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
        )}
      </main>
    </div>
  );
}

export default App;
