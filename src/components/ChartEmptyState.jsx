import React from "react";

export default function ChartEmptyState({
  title = "No activity yet",
  message = "Charts will appear here once you start logging flights, crashes, or completions.",
  compact = false,
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 text-center ${
        compact ? "px-4 py-6" : "px-6 py-10"
      }`}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-400"
        >
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}
