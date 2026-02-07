import React, { useState } from "react";
import { slugify, trackEvent } from "../analytics";

const checklistSections = [
  {
    title: "Setup & Power",
    items: [
      "Batteries charged (flight & transmitter)",
      "Flight pack properly installed and secure",
      "Transmitter on & correct model selected",
      "Receiver bound and telemetry active",
    ],
  },
  {
    title: "Mechanical / Structural",
    items: [
      "Main blades secure, no cracks or chips",
      "Tail rotor secure and tension correct",
      "All screws, bolts & linkages tight",
      "Frame & boom free of damage",
      "Servo arms, horns, linkages secure and slop-free",
    ],
  },
  {
    title: "Control & Linkages",
    items: [
      "All cyclic/collective/throttle linkages smooth",
      "Swashplate movement correct & centered",
      "Tail pitch/servo smooth and responsive",
    ],
  },
  {
    title: "Electronics",
    items: [
      "ESC/BEC powering correctly",
      "Gyro powered, calibrated, correct direction",
      "Flybarless controller calibrated (if applicable)",
      "Radio failsafes set & tested",
    ],
  },
  {
    title: "Range & Signal",
    items: [
      "Range check successful (if your radio supports it)",
      "Antennas positioned correctly",
    ],
  },
  {
    title: "Environmental & Safety",
    items: [
      "Flying area clear of obstacles (people, trees, lines)",
      "Wind within acceptable limits for your skill/heli",
      "Safety gear available (gloves, eyewear, first aid)",
      'Remove any "remove before flight" tags',
    ],
  },
];

export default function PreflightChecklist({
  helicopter,
  onComplete,
  onCancel,
}) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (sectionIndex, itemIndex) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getTotalItems = () => {
    return checklistSections.reduce(
      (sum, section) => sum + section.items.length,
      0,
    );
  };

  const getCheckedCount = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const isComplete = () => {
    return getCheckedCount() === getTotalItems();
  };

  const getProgressPercentage = () => {
    return Math.round((getCheckedCount() / getTotalItems()) * 100);
  };

  const handleComplete = () => {
    if (!isComplete()) {
      alert(
        "Please complete all checklist items before finishing the preflight check.",
      );
      return;
    }

    trackEvent(`preflight_completed_${slugify(helicopter.title)}`, {
      type: "preflight",
      helicopterId: helicopter.id,
      helicopterTitle: helicopter.title,
      totalItems: getTotalItems(),
    });

    onComplete();
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-green-600 text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold">Preflight Check</h2>
        <p className="text-green-100 text-sm mt-2">{helicopter.title}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="font-bold">
              {getCheckedCount()} / {getTotalItems()}
            </span>
          </div>
          <div className="h-2 bg-green-800/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      {checklistSections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-slate-800">{section.title}</h3>
          <div className="space-y-3">
            {section.items.map((item, itemIndex) => {
              const key = `${sectionIndex}-${itemIndex}`;
              const isChecked = checkedItems[key] || false;
              return (
                <label
                  key={itemIndex}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isChecked
                      ? "bg-green-50 border-green-200"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(sectionIndex, itemIndex)}
                    className="sr-only"
                  />
                  <div
                    className={`shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? "bg-green-600 border-green-600"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    {isChecked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`flex-1 ${
                      isChecked
                        ? "text-green-900 font-medium"
                        : "text-slate-700"
                    }`}
                  >
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40">
        <div className="max-w-3xl w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={!isComplete()}
            className={`flex-1 py-3 px-6 rounded-full font-bold transition-all shadow-xl flex items-center justify-center gap-2 ${
              isComplete()
                ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Complete Check
          </button>
        </div>
      </div>
    </div>
  );
}
