import React, { useMemo } from "react";

const outcomeStyles = {
  great: "bg-green-50 text-green-700 border-green-200",
  solid: "bg-blue-50 text-blue-700 border-blue-200",
  mixed: "bg-amber-50 text-amber-700 border-amber-200",
  rough: "bg-red-50 text-red-700 border-red-200",
};

const resultStyles = {
  clean: "bg-green-50 text-green-700 border-green-200",
  inconsistent: "bg-amber-50 text-amber-700 border-amber-200",
  "needs-work": "bg-red-50 text-red-700 border-red-200",
};

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default function FlightSessionDetail({
  session,
  helicopters,
  levels,
  onEdit,
  onDelete,
}) {
  const helicopterTitle = useMemo(() => {
    if (!session?.helicopterId) {
      return "No helicopter selected";
    }

    return (
      helicopters.find((helicopter) => helicopter.id === session.helicopterId)
        ?.title || "Archived helicopter"
    );
  }, [helicopters, session]);

  const maneuverTitles = useMemo(() => {
    return levels
      .flatMap((level) => level.maneuvers)
      .reduce((accumulator, maneuver) => {
        accumulator[maneuver.id] = maneuver.title;
        return accumulator;
      }, {});
  }, [levels]);

  if (!session) {
    return null;
  }

  const practicedManeuvers = Object.entries(session.maneuverResults);

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete the session from ${new Date(session.date).toLocaleDateString()}?`,
      )
    ) {
      onDelete();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm">
              {new Date(session.date).toLocaleDateString()} ·{" "}
              {capitalize(session.mode)}
            </p>
            <h2 className="text-2xl font-bold mt-1">{helicopterTitle}</h2>
            <p className="text-blue-100 text-sm mt-2">
              {session.location || "No location recorded"}
            </p>
          </div>
          <span
            className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${
              outcomeStyles[session.overallOutcome] || outcomeStyles.solid
            }`}
          >
            {capitalize(session.overallOutcome)}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Packs</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {session.packCount}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Minutes</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {session.totalFlightMinutes}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Practiced Maneuvers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {practicedManeuvers.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-3">
        <h3 className="text-lg font-bold text-slate-800">Conditions</h3>
        <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
          <div>
            <span className="font-medium text-slate-500">Weather:</span>{" "}
            {session.conditions || "Not recorded"}
          </div>
          <div>
            <span className="font-medium text-slate-500">Wind:</span>{" "}
            {session.wind || "Not recorded"}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">Debrief</p>
          <p className="text-slate-700 leading-relaxed">
            {session.notes || "No notes recorded for this session."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Maneuver Results</h3>
        {practicedManeuvers.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No maneuver-specific results were recorded for this session.
          </p>
        ) : (
          <div className="space-y-3">
            {practicedManeuvers.map(([maneuverId, result]) => (
              <div
                key={maneuverId}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-200 bg-slate-50"
              >
                <div>
                  <div className="font-semibold text-slate-800">
                    {maneuverId}
                  </div>
                  <div className="text-sm text-slate-500">
                    {maneuverTitles[maneuverId] || "Unknown maneuver"}
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    resultStyles[result] || resultStyles.inconsistent
                  }`}
                >
                  {capitalize(result)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <button
          onClick={onEdit}
          className="w-full mb-3 py-3 px-6 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Edit Session
        </button>

        <button
          onClick={handleDelete}
          className="w-full py-3 px-6 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          Delete Session
        </button>
      </div>
    </div>
  );
}
