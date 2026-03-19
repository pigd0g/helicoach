import React, { useState } from "react";

export default function About({
  handleExportData,
  handleImportData,
  driveSyncState,
  onEnableDriveSync,
  onDisableDriveSync,
  onReconnectDriveSync,
  onSyncDriveNow,
}) {
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveMessage, setDriveMessage] = useState("");
  const isConfigured = driveSyncState?.configured;
  const isEnabled = driveSyncState?.enabled;
  const authRequired = driveSyncState?.authRequired;

  const runDriveAction = async (action, successMessage) => {
    setDriveLoading(true);
    setDriveMessage("");

    try {
      await action();
      setDriveMessage("✓ " + successMessage);
      setTimeout(() => setDriveMessage(""), 3000);
    } catch (error) {
      setDriveMessage("✗ " + (error.message || "Google Drive sync failed"));
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
            Google Drive Sync
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
          Enable background sync to keep progress in Google Drive updated while
          you train.
        </p>

        <div className="mb-4 p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm">
          <p className="font-medium text-slate-700">
            Status:{" "}
            {isConfigured
              ? isEnabled
                ? "Enabled"
                : "Disabled"
              : "Not configured"}
          </p>
          <p className="text-slate-600 mt-1">
            Last sync:{" "}
            {driveSyncState?.lastSyncAt
              ? new Date(driveSyncState.lastSyncAt).toLocaleString()
              : "Never"}
          </p>
          {driveSyncState?.lastAction && (
            <p className="text-slate-600 mt-1">
              Last action: {driveSyncState.lastAction}
            </p>
          )}
          {authRequired && (
            <p className="text-amber-700 mt-1">
              Authentication expired. Reconnect to continue background sync.
            </p>
          )}
          {driveSyncState?.lastError && (
            <p className="text-red-600 mt-1">{driveSyncState.lastError}</p>
          )}
        </div>

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
          {!isConfigured && (
            <p className="text-sm text-amber-700">
              Google Drive integration is not configured. Add environment
              variables to enable sync.
            </p>
          )}

          {isConfigured && !isEnabled && (
            <button
              onClick={() =>
                runDriveAction(onEnableDriveSync, "Google Drive sync enabled")
              }
              disabled={driveLoading}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
            >
              {driveLoading ? "Enabling..." : "Enable Google Drive Sync"}
            </button>
          )}

          {isConfigured && isEnabled && (
            <>
              <button
                onClick={() =>
                  runDriveAction(onSyncDriveNow, "Drive sync complete")
                }
                disabled={driveLoading}
                className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
              >
                {driveLoading ? "Syncing..." : "Sync Now"}
              </button>
              {authRequired && (
                <button
                  onClick={() =>
                    runDriveAction(
                      onReconnectDriveSync,
                      "Reconnected to Google Drive",
                    )
                  }
                  disabled={driveLoading}
                  className="flex-1 py-2 px-4 rounded-lg border-2 border-amber-600 text-amber-700 hover:bg-amber-50 disabled:border-slate-300 disabled:text-slate-300 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
                >
                  {driveLoading ? "Reconnecting..." : "Reconnect"}
                </button>
              )}
              <button
                onClick={onDisableDriveSync}
                disabled={driveLoading}
                className="flex-1 py-2 px-4 rounded-lg border-2 border-slate-400 text-slate-700 hover:bg-slate-50 disabled:border-slate-300 disabled:text-slate-300 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
              >
                Disable Sync
              </button>
            </>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Background sync runs silently after local progress updates.
          Interactive sign-in is only needed when enabling or reconnecting.
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
