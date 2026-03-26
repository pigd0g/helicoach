import React from "react";

const BATTERY_STYLES = {
  "Warm-up": {
    badge: "bg-blue-100 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
    buttonDisabled: "bg-slate-200 text-slate-400 cursor-not-allowed",
  },
  "New Skill": {
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-600 hover:bg-purple-700",
    buttonDisabled: "bg-slate-200 text-slate-400 cursor-not-allowed",
  },
  "Cool-down": {
    badge: "bg-green-100 text-green-700",
    button: "bg-green-600 hover:bg-green-700",
    buttonDisabled: "bg-slate-200 text-slate-400 cursor-not-allowed",
  },
};

export default function SessionBatteryCard({
  battery,
  onComplete,
  onSkip,
  onToggle,
}) {
  const { label, maneuvers } = battery;
  const allDone =
    maneuvers.length > 0 && maneuvers.every((m) => m.completed || m.skipped);
  const styles = BATTERY_STYLES[label] || BATTERY_STYLES["Warm-up"];

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${
        allDone
          ? "border-green-200 bg-green-50 opacity-75"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          {allDone && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles.badge}`}
          >
            {label}
          </span>
          <span className="text-xs text-slate-400">
            {maneuvers.filter((m) => m.completed).length}/{maneuvers.length}
          </span>
        </div>
      </div>

      {/* Maneuver list */}
      <ul className="divide-y divide-slate-100">
        {maneuvers.map((maneuver) => (
          <li
            key={maneuver.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              maneuver.completed || maneuver.skipped
                ? "opacity-60"
                : ""
            }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => onToggle(maneuver.id)}
              className="shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer"
              style={{
                borderColor:
                  maneuver.completed || maneuver.skipped ? "#10b981" : "#cbd5e1",
                backgroundColor:
                  maneuver.completed
                    ? "#10b981"
                    : maneuver.skipped
                      ? "#f1f5f9"
                      : "transparent",
              }}
              aria-label={`Mark ${maneuver.title} as ${maneuver.completed ? "incomplete" : "complete"}`}
            >
              {maneuver.completed && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              {maneuver.skipped && !maneuver.completed && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                </svg>
              )}
            </button>

            {/* Title */}
            <span
              className={`flex-1 text-sm font-medium ${
                maneuver.completed
                  ? "text-slate-500 line-through"
                  : maneuver.skipped
                    ? "text-slate-400"
                    : "text-slate-800"
              }`}
            >
              {maneuver.title}
            </span>

            {/* YouTube link */}
            {maneuver.url && (
              <a
                href={maneuver.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-red-500 hover:text-red-600 transition-colors"
                aria-label={`Watch ${maneuver.title} on YouTube`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}

            {/* Skip button */}
            {!maneuver.completed && !maneuver.skipped && (
              <button
                onClick={() => onSkip(maneuver.id)}
                className="shrink-0 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
              >
                Skip
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Complete Battery button */}
      <div className="px-4 py-3 border-t border-slate-100">
        <button
          onClick={onComplete}
          disabled={allDone}
          className={`w-full py-2.5 rounded-lg text-sm font-bold text-white transition-colors ${
            allDone ? styles.buttonDisabled : styles.button
          }`}
        >
          {allDone ? "Battery Complete ✓" : "Complete Battery"}
        </button>
      </div>
    </div>
  );
}
