import React, { useState } from "react";

export default function FlightRecordDetail({
  helicopter,
  onUpdate,
  onDelete,
  onPreflight,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [flights, setFlights] = useState(helicopter.flights || 0);
  const [avgFlightTime, setAvgFlightTime] = useState(
    helicopter.avgFlightTime || 0,
  );
  const [crashes, setCrashes] = useState(helicopter.crashes || 0);

  const handleSave = () => {
    onUpdate({
      flights,
      avgFlightTime,
      crashes,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFlights(helicopter.flights || 0);
    setAvgFlightTime(helicopter.avgFlightTime || 0);
    setCrashes(helicopter.crashes || 0);
    setIsEditing(false);
  };

  const calculateEstimatedHours = () => {
    const totalMinutes = flights * avgFlightTime;
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${days.toString().padStart(2, "0")}:${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const calculateCrashRate = () => {
    if (!flights || flights === 0) return "0.00";
    const rate = ((crashes || 0) / flights) * 100;
    return rate.toFixed(2);
  };

  const isPreflightOverdue = () => {
    if (!helicopter.lastPreflightDate) return false;
    const lastCheck = new Date(helicopter.lastPreflightDate);
    const daysSinceCheck = Math.floor(
      (Date.now() - lastCheck.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysSinceCheck > 7;
  };

  const getPreflightStatus = () => {
    if (!helicopter.lastPreflightDate) {
      return { text: "Never checked", color: "text-slate-500" };
    }
    const lastCheck = new Date(helicopter.lastPreflightDate);
    const daysSinceCheck = Math.floor(
      (Date.now() - lastCheck.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceCheck > 7) {
      return {
        text: `${daysSinceCheck} days ago - Overdue!`,
        color: "text-red-600",
      };
    }

    if (daysSinceCheck === 0) {
      return { text: "Today", color: "text-green-600" };
    }

    return {
      text: `${daysSinceCheck} day${daysSinceCheck !== 1 ? "s" : ""} ago`,
      color: "text-green-600",
    };
  };

  const preflightStatus = getPreflightStatus();

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${helicopter.title}"? This cannot be undone.`,
      )
    ) {
      onDelete();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold">{helicopter.title}</h2>
        <p className="text-blue-100 text-sm mt-2">
          Flight statistics and maintenance records
        </p>
      </div>

      {helicopter.photo && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <img
            src={helicopter.photo}
            alt={helicopter.title}
            className="w-full aspect-video object-cover"
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            Flight Statistics
          </h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
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
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Flights
              </p>
              {isEditing ? (
                <input
                  type="number"
                  value={flights}
                  onChange={(e) =>
                    setFlights(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="mt-1 px-3 py-1 border border-slate-200 rounded text-xl font-bold text-slate-900 w-24"
                  min="0"
                />
              ) : (
                <p className="text-2xl font-bold text-slate-900">{flights}</p>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={() => {
                  const newFlights = flights + 1;
                  setFlights(newFlights);
                  onUpdate({ flights: newFlights });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
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
                  <path d="M12 5v14M5 12h14" />
                </svg>
                +1
              </button>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-sm font-medium text-slate-600 mb-1">
              Average Flight Time (minutes)
            </p>
            {isEditing ? (
              <input
                type="number"
                value={avgFlightTime}
                onChange={(e) =>
                  setAvgFlightTime(Math.max(0, parseFloat(e.target.value) || 0))
                }
                step="0.1"
                className="px-3 py-1 border border-slate-200 rounded text-xl font-bold text-slate-900 w-32"
                min="0"
              />
            ) : (
              <p className="text-2xl font-bold text-slate-900">
                {avgFlightTime.toFixed(1)} min
              </p>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-sm font-medium text-slate-600 mb-1">
              Estimated Flight Hours
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {calculateEstimatedHours()}
            </p>
            <p className="text-xs text-slate-500 mt-1">Format: dd:hh:mm</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-600">Crashes</p>
              {isEditing ? (
                <input
                  type="number"
                  value={crashes}
                  onChange={(e) =>
                    setCrashes(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="mt-1 px-3 py-1 border border-slate-200 rounded text-xl font-bold text-slate-900 w-24"
                  min="0"
                />
              ) : (
                <p className="text-2xl font-bold text-slate-900">{crashes}</p>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={() => {
                  const newCrashes = crashes + 1;
                  setCrashes(newCrashes);
                  onUpdate({ crashes: newCrashes });
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center gap-2"
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
                  <path d="M12 5v14M5 12h14" />
                </svg>
                +1
              </button>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-sm font-medium text-slate-600 mb-1">
              Crash Rate
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {calculateCrashRate()}%
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="flex-1 py-2 px-4 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Preflight Check</h3>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-600">Last Check</p>
            <p className={`text-lg font-bold ${preflightStatus.color}`}>
              {preflightStatus.text}
            </p>
            {helicopter.lastPreflightDate && (
              <p className="text-xs text-slate-500 mt-1">
                {new Date(helicopter.lastPreflightDate).toLocaleDateString()}
              </p>
            )}
          </div>
          {isPreflightOverdue() && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          )}
        </div>

        <button
          onClick={onPreflight}
          className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
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
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          Conduct Preflight Check
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <button
          onClick={handleDelete}
          className="w-full py-3 px-6 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
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
          Delete Helicopter
        </button>
      </div>
    </div>
  );
}
