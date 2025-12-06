import React from "react";

export default function About({ handleExportData, handleImportData }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            <strong>HeliCoach</strong> provides a structured training guide
            based on the RC Heli Nation Pilot Proficiency Program, designed to
            help RC helicopter pilots of all skill levels improve their flying.
          </p>
          <p>
            Starting from basic hovering orientations in Level 1, the program
            progresses through forward flight, aerobatics, and advanced 3D
            maneuvers.
          </p>
          <p>
            Use this app to track your progress, and master each level at your
            own pace.
          </p>
          <p>All data is stored locally in your browser's local storage.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">How to use</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>Select a Level to view its maneuvers.</li>
          <li>Tap a maneuver to see details and variations.</li>
          <li>Mark maneuvers as complete to track your progress.</li>
          <li>
            Use the <strong>AI Coach Assistant</strong> prompt in your favourite
            AI assistant to generate a custom training plan based on your
            progress.
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
        <h3 className="text-lg font-bold text-slate-900 mb-3">PR's Welcome</h3>
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
            </a>
          </li>
        </ul>
      </div>

      <div className="text-center text-slate-400 text-sm pt-4">
        <p>Happy Flying!</p>
        <p className="mt-1">HeliCoach</p>
      </div>
    </div>
  );
}
