import React, { useEffect, useRef, useState } from "react";
import { buildTrainingSession } from "../statistics";
import SessionBatteryCard from "./SessionBatteryCard";
import ConfettiCelebration from "./ConfettiCelebration";

const formatElapsed = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function SessionPlannerView({
  completedManeuvers,
  maneuverCompletionEvents,
  levels,
  setSessionHistory,
}) {
  const [session, setSession] = useState(() =>
    buildTrainingSession(completedManeuvers, levels, maneuverCompletionEvents),
  );
  const [elapsed, setElapsed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(null);

  // Start timer on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleToggle = (batteryIdx, maneuverId) => {
    setSession((prev) => ({
      ...prev,
      batteries: prev.batteries.map((b, i) =>
        i === batteryIdx
          ? {
              ...b,
              maneuvers: b.maneuvers.map((m) =>
                m.id === maneuverId
                  ? { ...m, completed: !m.completed, skipped: false }
                  : m,
              ),
            }
          : b,
      ),
    }));
  };

  const handleSkip = (batteryIdx, maneuverId) => {
    setSession((prev) => ({
      ...prev,
      batteries: prev.batteries.map((b, i) =>
        i === batteryIdx
          ? {
              ...b,
              maneuvers: b.maneuvers.map((m) =>
                m.id === maneuverId ? { ...m, skipped: true, completed: false } : m,
              ),
            }
          : b,
      ),
    }));
  };

  const handleCompleteBattery = (batteryIdx) => {
    const allBatteriesDone = session.batteries
      .map((b, i) => (i === batteryIdx ? true : b.maneuvers.every((m) => m.completed || m.skipped)))
      .every(Boolean);

    if (allBatteriesDone) {
      clearInterval(timerRef.current);
      setShowConfetti(true);

      // Capture time outside render — avoid impure Date.now in render
      const now = new Date();
      const record = {
        id:
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `session-${now.getTime()}`,
        startedAt: new Date(now.getTime() - elapsed * 1000).toISOString(),
        completedAt: now.toISOString(),
        durationSeconds: elapsed,
        batteries: session.batteries.map((b) => ({
          label: b.label,
          maneuvers: b.maneuvers.map((m) => ({
            id: m.id,
            title: m.title,
            url: m.url,
            completed: m.completed,
            skipped: m.skipped,
          })),
        })),
      };
      setSessionHistory((prev) => [record, ...prev]);
    }
  };

  const handleGenerateNew = () => {
    setShowConfetti(false);
    setElapsed(0);
    setSession(buildTrainingSession(completedManeuvers, levels, maneuverCompletionEvents));
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Training Session
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Complete all 3 batteries to log your session
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400 uppercase tracking-wide">Session Time</div>
          <div className="text-2xl font-mono font-bold text-slate-700 leading-none">
            {formatElapsed(elapsed)}
          </div>
        </div>
      </div>

      {/* Battery cards */}
      <div className="space-y-4">
        {session.batteries.map((battery, batteryIdx) => (
            <SessionBatteryCard
              key={battery.label}
              battery={battery}
              onComplete={() => handleCompleteBattery(batteryIdx)}
              onSkip={(maneuverId) => handleSkip(batteryIdx, maneuverId)}
              onToggle={(maneuverId) => handleToggle(batteryIdx, maneuverId)}
            />
          ))}
      </div>

      {/* Generate New Session */}
      <button
        onClick={handleGenerateNew}
        className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
      >
        Generate New Session
      </button>

      {/* Confetti */}
      {showConfetti && <ConfettiCelebration />}
    </div>
  );
}
