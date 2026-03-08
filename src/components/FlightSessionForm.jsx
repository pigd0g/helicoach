import React, { useMemo, useState } from "react";
import {
  MANEUVER_RESULT_OPTIONS,
  OVERALL_OUTCOME_OPTIONS,
  SESSION_MODES,
} from "../dataModel";

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default function FlightSessionForm({
  helicopters,
  levels,
  onSave,
  onCancel,
  initialSession,
  defaultHelicopterId = "",
}) {
  const [date, setDate] = useState(
    initialSession?.date || new Date().toISOString().split("T")[0],
  );
  const [helicopterId, setHelicopterId] = useState(
    initialSession?.helicopterId || defaultHelicopterId,
  );
  const [mode, setMode] = useState(initialSession?.mode || "real");
  const [location, setLocation] = useState(initialSession?.location || "");
  const [conditions, setConditions] = useState(
    initialSession?.conditions || "",
  );
  const [wind, setWind] = useState(initialSession?.wind || "");
  const [packCount, setPackCount] = useState(initialSession?.packCount || 0);
  const [totalFlightMinutes, setTotalFlightMinutes] = useState(
    initialSession?.totalFlightMinutes || 0,
  );
  const [overallOutcome, setOverallOutcome] = useState(
    initialSession?.overallOutcome || "solid",
  );
  const [notes, setNotes] = useState(initialSession?.notes || "");
  const [maneuverResults, setManeuverResults] = useState(
    initialSession?.maneuverResults || {},
  );

  const selectedManeuverCount = useMemo(
    () => Object.keys(maneuverResults).length,
    [maneuverResults],
  );

  const toggleManeuverSelection = (maneuverId) => {
    setManeuverResults((prev) => {
      if (prev[maneuverId]) {
        const nextState = { ...prev };
        delete nextState[maneuverId];
        return nextState;
      }

      return {
        ...prev,
        [maneuverId]: "inconsistent",
      };
    });
  };

  const updateManeuverResult = (maneuverId, nextValue) => {
    setManeuverResults((prev) => ({
      ...prev,
      [maneuverId]: nextValue,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      date,
      helicopterId,
      mode,
      location,
      conditions,
      wind,
      packCount,
      totalFlightMinutes,
      overallOutcome,
      notes,
      maneuverResults,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold">
          {initialSession ? "Edit Flight Session" : "Log Flight Session"}
        </h2>
        <p className="text-blue-100 text-sm mt-2">
          Capture what you flew, what you practiced, and how it went.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Session Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Mode</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {SESSION_MODES.map((sessionMode) => (
                <option key={sessionMode} value={sessionMode}>
                  {capitalize(sessionMode)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-slate-700 block">
          <span>Helicopter</span>
          <select
            value={helicopterId}
            onChange={(event) => setHelicopterId(event.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">No helicopter selected</option>
            {helicopters.map((helicopter) => (
              <option key={helicopter.id} value={helicopter.id}>
                {helicopter.title}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Location</span>
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Club field, park, simulator desk"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Conditions</span>
            <input
              type="text"
              value={conditions}
              onChange={(event) => setConditions(event.target.value)}
              placeholder="Sunny, overcast, low light"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Wind</span>
            <input
              type="text"
              value={wind}
              onChange={(event) => setWind(event.target.value)}
              placeholder="5-10 mph, calm"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Packs</span>
            <input
              type="number"
              min="0"
              value={packCount}
              onChange={(event) =>
                setPackCount(Math.max(0, parseInt(event.target.value, 10) || 0))
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Total Minutes</span>
            <input
              type="number"
              min="0"
              step="1"
              value={totalFlightMinutes}
              onChange={(event) =>
                setTotalFlightMinutes(
                  Math.max(0, parseInt(event.target.value, 10) || 0),
                )
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-slate-700 block">
          <span>Overall Outcome</span>
          <select
            value={overallOutcome}
            onChange={(event) => setOverallOutcome(event.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            {OVERALL_OUTCOME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {capitalize(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700 block">
          <span>Debrief Notes</span>
          <textarea
            rows="4"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="What felt good, what drifted, what needs work next time"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
          />
        </label>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Practiced Maneuvers
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Select only the maneuvers you actually worked on this session.
            </p>
          </div>
          <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            {selectedManeuverCount} selected
          </span>
        </div>

        <div className="space-y-3">
          {levels.map((level) => {
            const levelSelectedCount = level.maneuvers.filter(
              (maneuver) => maneuverResults[maneuver.id],
            ).length;

            return (
              <details
                key={level.id}
                className="border border-slate-200 rounded-lg overflow-hidden"
                open={levelSelectedCount > 0}
              >
                <summary className="list-none cursor-pointer bg-slate-50 px-4 py-3 flex items-center justify-between font-medium text-slate-800">
                  <span>{level.title}</span>
                  <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-full px-2 py-1">
                    {levelSelectedCount}/{level.maneuvers.length}
                  </span>
                </summary>
                <div className="p-4 space-y-3">
                  {level.maneuvers.map((maneuver) => {
                    const isSelected = Boolean(maneuverResults[maneuver.id]);

                    return (
                      <div
                        key={maneuver.id}
                        className={`rounded-lg border p-3 transition-colors ${
                          isSelected
                            ? "border-blue-200 bg-blue-50/50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              toggleManeuverSelection(maneuver.id)
                            }
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800">
                              {maneuver.id} · {maneuver.title}
                            </div>
                            {maneuver.variations !== "N/A" && (
                              <p className="text-xs text-slate-500 mt-1">
                                {maneuver.variations}
                              </p>
                            )}
                          </div>
                        </label>

                        {isSelected && (
                          <div className="mt-3 pl-7">
                            <label className="space-y-2 text-sm font-medium text-slate-700 block">
                              <span>Result</span>
                              <select
                                value={maneuverResults[maneuver.id]}
                                onChange={(event) =>
                                  updateManeuverResult(
                                    maneuver.id,
                                    event.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                              >
                                {MANEUVER_RESULT_OPTIONS.map((option) => (
                                  <option key={option} value={option}>
                                    {capitalize(option)}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40">
        <div className="max-w-3xl w-full flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-6 rounded-full font-bold shadow-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {initialSession ? "Save Session" : "Log Session"}
          </button>
        </div>
      </div>
    </form>
  );
}
