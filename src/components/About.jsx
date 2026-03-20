import React, { useState } from "react";
import googleDriveService from "../services/googleDrive";

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function About({
  handleExportData,
  handleImportData,
  themePreference,
  effectiveTheme,
  onThemeChange,
}) {
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveMessage, setDriveMessage] = useState("");

  const handleBackupToGoogleDrive = async () => {
    if (
      !import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      !import.meta.env.VITE_GOOGLE_API_KEY
    ) {
      alert(
        "Google Drive integration is not configured. Please set up environment variables.",
      );
      return;
    }

    setDriveLoading(true);
    setDriveMessage("");

    try {
      // Get data to backup (same format as export)
      const completedManeuvers = JSON.parse(
        localStorage.getItem("completedManeuvers") || "{}",
      );
      const helicopters = JSON.parse(
        localStorage.getItem("helicopters") || "[]",
      );
      const data = {
        completedManeuvers,
        helicopters,
        themePreference,
        exportedAt: new Date().toISOString(),
        version: 1,
      };

      await googleDriveService.saveToGoogleDrive(data);
      setDriveMessage("✓ Successfully backed up to Google Drive");
      setTimeout(() => setDriveMessage(""), 3000);
    } catch (error) {
      console.error("Google Drive backup error:", error);
      if (error.message === "Failed to save to Google Drive") {
        setDriveMessage("✗ Failed to backup. Please try again.");
      } else {
        setDriveMessage("✗ " + (error.message || "Backup failed"));
      }
    } finally {
      setDriveLoading(false);
    }
  };

  const handleRestoreFromGoogleDrive = async () => {
    if (
      !import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      !import.meta.env.VITE_GOOGLE_API_KEY
    ) {
      alert(
        "Google Drive integration is not configured. Please set up environment variables.",
      );
      return;
    }

    if (
      !confirm(
        "This will replace your current progress with the backup from Google Drive. Continue?",
      )
    ) {
      return;
    }

    setDriveLoading(true);
    setDriveMessage("");

    try {
      const data = await googleDriveService.restoreFromGoogleDrive();

      // Use the existing import handler to process the data
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      const file = new File([blob], "google-drive-backup.json", {
        type: "application/json",
      });
      const event = { target: { files: [file] } };

      handleImportData(event);
      setDriveMessage("✓ Successfully restored from Google Drive");
      setTimeout(() => setDriveMessage(""), 3000);
    } catch (error) {
      console.error("Google Drive restore error:", error);
      if (error.message === "No backup found in Google Drive") {
        setDriveMessage("✗ No backup found. Please backup first.");
      } else {
        setDriveMessage("✗ " + (error.message || "Restore failed"));
      }
    } finally {
      setDriveLoading(false);
    }
  };

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
        <h3 className="text-lg font-bold text-slate-900 mb-3">Appearance</h3>
        <p className="text-slate-700 mb-4">
          Choose a theme for the app. System follows your device preference and
          updates automatically.
        </p>
        <div
          className="grid grid-cols-3 gap-2"
          role="group"
          aria-label="Theme preference"
        >
          {themeOptions.map((option) => {
            const isSelected = themePreference === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onThemeChange(option.value)}
                aria-pressed={isSelected}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Current theme:{" "}
          <span className="font-semibold text-slate-700 capitalize">
            {themePreference === "system"
              ? `System (${effectiveTheme})`
              : effectiveTheme}
          </span>
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">
          Transfer Settings
        </h3>
        <p className="text-slate-700 mb-4">
          Export your progress and settings to transfer to another device, or
          import a previously exported file.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportData}
            className="flex-1 py-2 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
            Export Settings
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
            Import Settings
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
          <span className="inline-flex items-center gap-2">
            Google Drive Backup
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 3L3 9.5L8.5 19.5H15.5L21 9.5L16.5 3H7.5Z"
                fill="#4285F4"
              />
              <path d="M8.5 19.5L3 9.5L7.5 3L12 12L8.5 19.5Z" fill="#EA4335" />
              <path
                d="M15.5 19.5L12 12L16.5 3L21 9.5L15.5 19.5Z"
                fill="#34A853"
              />
              <path d="M8.5 19.5H15.5L12 12L8.5 19.5Z" fill="#FAB908" />
            </svg>
          </span>
        </h3>
        <p className="text-slate-700 mb-4">
          Automatically sync your progress to Google Drive for seamless backup
          and restore across devices.
        </p>
        {driveMessage && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              driveMessage.startsWith("✓")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {driveMessage}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleBackupToGoogleDrive}
            disabled={driveLoading}
            className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {driveLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Backing up...
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
                Backup to Drive
              </>
            )}
          </button>
          <button
            onClick={handleRestoreFromGoogleDrive}
            disabled={driveLoading}
            className="flex-1 py-2 px-4 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-slate-300 disabled:text-slate-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {driveLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Restoring...
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 21v-9" />
                  <path d="m8 13 4 4 4-4" />
                </svg>
                Restore from Drive
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Requires Google account sign-in. Your data is only accessible by you.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">PR's Welcome</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>
            Source available on{" "}
            <a
              className="link underline cursor-pointer"
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
        <div className="mt-3 flex justify-center gap-4">
          <a
            href="/terms"
            className="underline hover:text-slate-600 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            className="underline hover:text-slate-600 transition-colors"
          >
            Privacy Notice
          </a>
        </div>
      </div>
    </div>
  );
}
