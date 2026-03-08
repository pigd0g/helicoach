import React, { useMemo } from "react";

const outcomeStyles = {
  great: "bg-green-50 text-green-700 border-green-200",
  solid: "bg-blue-50 text-blue-700 border-blue-200",
  mixed: "bg-amber-50 text-amber-700 border-amber-200",
  rough: "bg-red-50 text-red-700 border-red-200",
};

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default function FlightSessionsView({
  flightSessions,
  helicopters,
  onAddNew,
  onSelectSession,
}) {
  const helicopterTitles = useMemo(
    () =>
      helicopters.reduce((accumulator, helicopter) => {
        accumulator[helicopter.id] = helicopter.title;
        return accumulator;
      }, {}),
    [helicopters],
  );

  const sortedSessions = useMemo(
    () =>
      [...flightSessions].sort((left, right) => {
        const leftKey = `${left.date}-${left.createdAt}`;
        const rightKey = `${right.date}-${right.createdAt}`;
        return rightKey.localeCompare(leftKey);
      }),
    [flightSessions],
  );

  const totalMinutes = useMemo(
    () =>
      flightSessions.reduce(
        (sum, session) => sum + session.totalFlightMinutes,
        0,
      ),
    [flightSessions],
  );
  const totalPacks = useMemo(
    () => flightSessions.reduce((sum, session) => sum + session.packCount, 0),
    [flightSessions],
  );
  const thisWeekSessions = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return flightSessions.filter((session) => new Date(session.date) >= cutoff)
      .length;
  }, [flightSessions]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold">Flight Sessions</h2>
        <p className="text-blue-100 text-sm mt-2">
          Log each flying session so you can review what you practiced and how
          it felt.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Sessions</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {flightSessions.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Last 7 Days</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {thisWeekSessions}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Minutes / Packs</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalMinutes} / {totalPacks}
          </p>
        </div>
      </div>

      <button
        onClick={onAddNew}
        className="w-full py-4 px-6 bg-green-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
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
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
        Log New Session
      </button>

      {sortedSessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-500 text-lg mb-2">No sessions logged yet</p>
          <p className="text-slate-400 text-sm">
            Start tracking real flights and simulator practice to build a useful
            debrief history.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSessions.map((session) => {
            const helicopterTitle = session.helicopterId
              ? helicopterTitles[session.helicopterId] || "Archived helicopter"
              : "No helicopter selected";
            const practicedCount = Object.keys(session.maneuverResults).length;

            return (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelectSession(session)}
                className="w-full text-left bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      {new Date(session.date).toLocaleDateString()} ·{" "}
                      {capitalize(session.mode)}
                    </p>
                    <h3 className="text-lg font-bold text-slate-800 mt-1">
                      {helicopterTitle}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {session.location || "No location"}
                      {session.wind ? ` · ${session.wind}` : ""}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${
                      outcomeStyles[session.overallOutcome] ||
                      outcomeStyles.solid
                    }`}
                  >
                    {capitalize(session.overallOutcome)}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 mt-4 text-sm text-slate-600">
                  <div>{session.packCount} packs</div>
                  <div>{session.totalFlightMinutes} minutes</div>
                  <div>{practicedCount} maneuvers</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
