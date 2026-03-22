import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { levels, tips } from "./data";

import Header from "./components/Header";
import About from "./components/About";
import HomeView from "./components/HomeView";
import LevelsView from "./components/LevelsView";
import ManeuversView from "./components/ManeuversView";
import ManeuverDetail from "./components/ManeuverDetail";
import FlightRecordsView from "./components/FlightRecordsView";
import FlightRecordNew from "./components/FlightRecordNew";
import FlightRecordDetail from "./components/FlightRecordDetail";
import PreflightChecklist from "./components/PreflightChecklist";
import TermsOfService from "./components/TermsOfService";
import PrivacyNotice from "./components/PrivacyNotice";
import StatisticsView from "./components/StatisticsView";
import {
  STORAGE_KEYS,
  clampNumber,
  createCrashEvent,
  createFlightEvent,
  createManeuverCompletionEvent,
  readStorageJson,
  sanitizeCompletedManeuvers,
  sanitizeCrashEvents,
  sanitizeFlightEvents,
  sanitizeHelicopters,
  sanitizeManeuverCompletionEvents,
} from "./statistics";

const THEME_STORAGE_KEY = "themePreference";
const VALID_THEME_PREFERENCES = new Set(["light", "dark", "system"]);
const VALID_MANEUVER_IDS = new Set(
  levels.flatMap((level) =>
    level.maneuvers.map((maneuver) => String(maneuver.id)),
  ),
);

const findLevelForManeuver = (maneuverId) =>
  levels.find((level) =>
    level.maneuvers.some(
      (maneuver) => String(maneuver.id) === String(maneuverId),
    ),
  );

const sanitizeThemePreference = (value) =>
  VALID_THEME_PREFERENCES.has(value) ? value : "system";

const getSystemThemeMediaQuery = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

const getSystemPrefersDark = () => getSystemThemeMediaQuery()?.matches ?? false;

function App() {
  const [showVideo, setShowVideo] = useState(false);
  const [showVideoMove, setShowVideoMove] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(() =>
    Math.floor(Math.random() * tips.length),
  );
  const [completedManeuvers, setCompletedManeuver] = useState(() => {
    return sanitizeCompletedManeuvers(
      readStorageJson("completedManeuvers", {}),
      VALID_MANEUVER_IDS,
    );
  });

  const [helicopters, setHelicopters] = useState(() => {
    return sanitizeHelicopters(readStorageJson("helicopters", []));
  });
  const [flightEvents, setFlightEvents] = useState(() =>
    sanitizeFlightEvents(readStorageJson(STORAGE_KEYS.flightEvents, [])),
  );
  const [crashEvents, setCrashEvents] = useState(() =>
    sanitizeCrashEvents(readStorageJson(STORAGE_KEYS.crashEvents, [])),
  );
  const [maneuverCompletionEvents, setManeuverCompletionEvents] = useState(() =>
    sanitizeManeuverCompletionEvents(
      readStorageJson(STORAGE_KEYS.maneuverCompletionEvents, []),
    ),
  );
  const [themePreference, setThemePreference] = useState(() =>
    sanitizeThemePreference(localStorage.getItem(THEME_STORAGE_KEY)),
  );
  const [systemPrefersDark, setSystemPrefersDark] =
    useState(getSystemPrefersDark);
  const effectiveTheme =
    themePreference === "system"
      ? systemPrefersDark
        ? "dark"
        : "light"
      : themePreference;

  useEffect(() => {
    localStorage.setItem(
      "completedManeuvers",
      JSON.stringify(completedManeuvers),
    );
  }, [completedManeuvers]);

  useEffect(() => {
    localStorage.setItem("helicopters", JSON.stringify(helicopters));
  }, [helicopters]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.flightEvents,
      JSON.stringify(flightEvents),
    );
  }, [flightEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.crashEvents, JSON.stringify(crashEvents));
  }, [crashEvents]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.maneuverCompletionEvents,
      JSON.stringify(maneuverCompletionEvents),
    );
  }, [maneuverCompletionEvents]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  }, [themePreference]);

  useEffect(() => {
    const mediaQuery = getSystemThemeMediaQuery();
    if (!mediaQuery) {
      return undefined;
    }
    const handleChange = (event) => setSystemPrefersDark(event.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = effectiveTheme === "dark";

    root.classList.toggle("dark", isDark);
    root.dataset.theme = effectiveTheme;
    root.style.colorScheme = effectiveTheme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", isDark ? "#0f172a" : "#f8fafc");
    }
  }, [effectiveTheme]);

  const navigate = useNavigate();
  const location = useLocation();
  const { view, selectedLevel, selectedManeuver, selectedHelicopter } =
    useMemo(() => {
      try {
        const raw = location.pathname || "/";
        const path = raw.replace(/\/+$/g, "") || "/";
        const parts = path === "/" ? [] : path.split("/").filter(Boolean);
        const defaultState = {
          view: "home",
          selectedLevel: null,
          selectedManeuver: null,
          selectedHelicopter: null,
        };

        if (path === "/" || parts.length === 0) {
          return defaultState;
        }

        if (parts[0] === "levels") {
          return { ...defaultState, view: "levels" };
        }

        if (parts[0] === "about") {
          return { ...defaultState, view: "about" };
        }

        if (parts[0] === "terms") {
          return { ...defaultState, view: "terms" };
        }

        if (parts[0] === "privacy") {
          return { ...defaultState, view: "privacy" };
        }

        if (parts[0] === "flightrecords") {
          if (parts.length === 1) {
            return { ...defaultState, view: "flightrecords" };
          }

          if (parts.length === 2 && parts[1] === "new") {
            return { ...defaultState, view: "flightrecordnew" };
          }

          if (parts.length === 3 && parts[1] === "helicopter") {
            const helicopter = helicopters.find((item) => item.id === parts[2]);
            return helicopter
              ? {
                  ...defaultState,
                  view: "flightrecorddetail",
                  selectedHelicopter: helicopter,
                }
              : { ...defaultState, view: "flightrecords" };
          }

          if (
            parts.length === 4 &&
            parts[1] === "helicopter" &&
            parts[3] === "preflight"
          ) {
            const helicopter = helicopters.find((item) => item.id === parts[2]);
            return helicopter
              ? {
                  ...defaultState,
                  view: "preflight",
                  selectedHelicopter: helicopter,
                }
              : { ...defaultState, view: "flightrecords" };
          }

          return { ...defaultState, view: "flightrecords" };
        }

        if (parts[0] === "statistics") {
          return { ...defaultState, view: "statistics" };
        }

        if (parts[0] === "level") {
          const level = levels.find(
            (item) => String(item.id) === String(parts[1]),
          );
          if (!level) {
            return { ...defaultState, view: "levels" };
          }

          if (parts.length === 2) {
            return {
              ...defaultState,
              view: "maneuvers",
              selectedLevel: level,
            };
          }

          if (parts.length === 4 && parts[2] === "maneuver") {
            const maneuver = level.maneuvers.find(
              (item) => String(item.id) === String(parts[3]),
            );

            if (maneuver) {
              return {
                ...defaultState,
                view: "detail",
                selectedLevel: level,
                selectedManeuver: maneuver,
              };
            }
          }

          return {
            ...defaultState,
            view: "maneuvers",
            selectedLevel: level,
          };
        }

        return defaultState;
      } catch {
        return {
          view: "home",
          selectedLevel: null,
          selectedManeuver: null,
          selectedHelicopter: null,
        };
      }
    }, [helicopters, location.pathname]);

  const toggleCompletion = (maneuverId) => {
    const level = findLevelForManeuver(maneuverId);
    const maneuver = level?.maneuvers.find(
      (item) => String(item.id) === String(maneuverId),
    );
    const wasCompleted = Boolean(completedManeuvers[maneuverId]);

    setCompletedManeuver((prev) => {
      const newState = { ...prev };
      if (newState[maneuverId]) {
        delete newState[maneuverId];
      } else {
        newState[maneuverId] = true;
      }
      return newState;
    });

    if (!wasCompleted && level && maneuver) {
      setManeuverCompletionEvents((prev) => [
        ...prev,
        createManeuverCompletionEvent({ maneuver, level }),
      ]);
    }
  };

  const toggleLevelCompletion = (level) => {
    const allComplete = level.maneuvers.every((m) => completedManeuvers[m.id]);
    const newlyCompletedManeuvers = allComplete
      ? []
      : level.maneuvers.filter((maneuver) => !completedManeuvers[maneuver.id]);

    setCompletedManeuver((prev) => {
      const newState = { ...prev };
      level.maneuvers.forEach((m) => {
        if (allComplete) {
          delete newState[m.id];
        } else {
          newState[m.id] = true;
        }
      });
      return newState;
    });

    if (newlyCompletedManeuvers.length > 0) {
      setManeuverCompletionEvents((prev) => [
        ...prev,
        ...newlyCompletedManeuvers.map((maneuver) =>
          createManeuverCompletionEvent({ maneuver, level }),
        ),
      ]);
    }
  };

  const addHelicopter = (helicopter) => {
    const newHelicopter = {
      ...helicopter,
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
      flights: 0,
      avgFlightTime: 0,
      crashes: 0,
      lastPreflightDate: null,
      createdAt: new Date().toISOString(),
    };
    setHelicopters((prev) => [...prev, newHelicopter]);
    return newHelicopter;
  };

  const updateHelicopter = (id, updates) => {
    setHelicopters((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    );
  };

  const incrementHelicopterFlights = (helicopter) => {
    if (!helicopter?.id) {
      return;
    }

    setHelicopters((prev) =>
      prev.map((item) =>
        item.id === helicopter.id
          ? { ...item, flights: clampNumber(item.flights) + 1 }
          : item,
      ),
    );
    setFlightEvents((prev) => [...prev, createFlightEvent(helicopter)]);
  };

  const incrementHelicopterCrashes = (helicopter) => {
    if (!helicopter?.id) {
      return;
    }

    setHelicopters((prev) =>
      prev.map((item) =>
        item.id === helicopter.id
          ? { ...item, crashes: clampNumber(item.crashes) + 1 }
          : item,
      ),
    );
    setCrashEvents((prev) => [...prev, createCrashEvent(helicopter)]);
  };

  const deleteHelicopter = (id) => {
    setHelicopters((prev) => prev.filter((h) => h.id !== id));
  };

  const completePreflightCheck = (helicopterId) => {
    updateHelicopter(helicopterId, {
      lastPreflightDate: new Date().toISOString(),
    });
  };

  const handleLevelClick = (level) => {
    navigate(`/level/${level.id}`);
    window.scrollTo(0, 0);
  };

  const handleManeuverClick = (maneuver) => {
    const level =
      selectedLevel ||
      levels.find((l) => l.maneuvers.some((m) => m.id === maneuver.id));
    if (level) {
      navigate(`/level/${level.id}/maneuver/${maneuver.id}`);
    } else {
      navigate(`/`);
    }
    window.scrollTo(0, 0);
  };

  const handleCopyPrompt = () => {
    const allManeuvers = levels.flatMap((l) =>
      l.maneuvers.map(
        (m) =>
          `Level ${l.id}: ${m.title}${
            m.variations === "N/A" ? "" : " - " + m.variations
          }`,
      ),
    );

    const completedIds = Object.keys(completedManeuvers || {});
    const progress = levels.flatMap((l) =>
      l.maneuvers
        .filter((m) => completedIds.includes(String(m.id)))
        .map((m) => `Level ${l.id}: ${m.title}`),
    );

    console.log(`${progress.length ? progress.join("\n") : "(none)"}`);

    const allTips = tips.join("\n");

    const prompt = `You are a helpful RC Helicopter Pilot Proficiency Coach.

Here are the maneuvers in the program:
${allManeuvers.join("\n")}

Here is my current progress (completed maneuvers):
${progress.length ? progress.join("\n") : "(none)"}

Here are some helpful tips for pilots:
${allTips}

Please analyze my progress and suggest a training plan for today.

Training should start with a warm up that focuses on consolidating previously learned maneuvers, followed by introducing one new maneuver that builds on my existing skills.

After the warm-up focus a plan around learning 1-2 new maneuvers, ensuring that they are appropriate for my current skill level.

Assume that a flight battery lasts approx 5 minutes and that a typical training session consists of 3 flight batteries, so design the plan accordingly.  

You can ask the user if they would like a plan for more batteries in this session or if they are training on a simulator.  If on a simulator, they may be able to do more flights in one session.

Do Not Include Current Progress Summary`;

    navigator.clipboard.writeText(prompt).then(() => {
      alert("Prompt copied to clipboard! Paste it into your AI assistant.");
    });
  };

  const goBack = () => {
    if (view === "detail" && selectedLevel) {
      navigate(`/level/${selectedLevel.id}`);
    } else if (view === "maneuvers") {
      navigate(`/levels`);
    } else if (view === "flightrecorddetail" || view === "preflight") {
      navigate(`/flightrecords`);
    } else if (view === "flightrecordnew") {
      navigate(`/flightrecords`);
    } else {
      navigate(`/`);
    }
  };

  const handleExportData = () => {
    const data = {
      completedManeuvers,
      helicopters,
      flightEvents,
      crashEvents,
      maneuverCompletionEvents,
      themePreference,
      exportedAt: new Date().toISOString(),
      version: 2,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `helicoach-progress-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);
        let hasValidData = false;

        // Import completed maneuvers
        if (
          data.completedManeuvers &&
          typeof data.completedManeuvers === "object"
        ) {
          const validManeuverIds = new Set(
            levels.flatMap((l) => l.maneuvers.map((m) => m.id)),
          );
          const sanitized = sanitizeCompletedManeuvers(
            data.completedManeuvers,
            validManeuverIds,
          );
          setCompletedManeuver(sanitized);
          hasValidData = true;
        }

        // Import helicopters
        if (data.helicopters && Array.isArray(data.helicopters)) {
          const sanitizedHelicopters = sanitizeHelicopters(data.helicopters);
          setHelicopters(sanitizedHelicopters);
          hasValidData = true;
        }

        if (Array.isArray(data.flightEvents)) {
          setFlightEvents(sanitizeFlightEvents(data.flightEvents));
          hasValidData = true;
        } else if (data.version >= 2) {
          setFlightEvents([]);
        }

        if (Array.isArray(data.crashEvents)) {
          setCrashEvents(sanitizeCrashEvents(data.crashEvents));
          hasValidData = true;
        } else if (data.version >= 2) {
          setCrashEvents([]);
        }

        if (Array.isArray(data.maneuverCompletionEvents)) {
          setManeuverCompletionEvents(
            sanitizeManeuverCompletionEvents(data.maneuverCompletionEvents),
          );
          hasValidData = true;
        } else if (data.version >= 2) {
          setManeuverCompletionEvents([]);
        }

        if (typeof data.themePreference === "string") {
          const sanitizedTheme = sanitizeThemePreference(data.themePreference);
          setThemePreference(sanitizedTheme);
          hasValidData = true;
        }

        if (hasValidData) {
          alert("Progress imported successfully!");
        } else {
          alert(
            "Invalid file format. Please select a valid HeliCoach export file.",
          );
        }
      } catch {
        alert("Error reading file. Please select a valid JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const nextTip = () => setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);

  const getLevelProgress = (level) => {
    const total = level.maneuvers.length;
    const completed = level.maneuvers.filter(
      (m) => completedManeuvers[m.id],
    ).length;
    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
    };
  };

  const pageTitle = useMemo(() => {
    if (view === "home") {
      return "Helicoach - RC Helicopter Pilot Proficiency Training";
    } else if (view === "about") {
      return "Helicoach | About";
    } else if (view === "terms") {
      return "Helicoach | Terms of Service";
    } else if (view === "privacy") {
      return "Helicoach | Privacy Notice";
    } else if (view === "detail" && selectedManeuver) {
      return `Helicoach | ${selectedManeuver.id} - ${selectedManeuver.title}`;
    } else if (view === "maneuvers" && selectedLevel) {
      return `Helicoach | ${selectedLevel.title}`;
    } else if (view === "flightrecords") {
      return "Helicoach | Flight Records";
    } else if (view === "flightrecordnew") {
      return "Helicoach | Add New Helicopter";
    } else if (view === "flightrecorddetail" && selectedHelicopter) {
      return `Helicoach | ${selectedHelicopter.title}`;
    } else if (view === "preflight" && selectedHelicopter) {
      return `Helicoach | Preflight Check - ${selectedHelicopter.title}`;
    } else if (view === "statistics") {
      return "Helicoach | Statistics";
    } else {
      return "Helicoach - RC Helicopter Pilot Proficiency Training";
    }
  }, [view, selectedLevel, selectedManeuver, selectedHelicopter]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <Header
        view={view}
        onBack={goBack}
        onAbout={() => {
          navigate("/about");
          window.scrollTo(0, 0);
        }}
      />

      <main className="max-w-3xl mx-auto p-4 pb-20">
        {view === "about" && (
          <About
            handleExportData={handleExportData}
            handleImportData={handleImportData}
            themePreference={themePreference}
            effectiveTheme={effectiveTheme}
            onThemeChange={setThemePreference}
          />
        )}

        {view === "terms" && <TermsOfService />}

        {view === "privacy" && <PrivacyNotice />}

        {view === "home" && (
          <HomeView
            completedManeuvers={completedManeuvers}
            helicopters={helicopters}
            handleCopyPrompt={handleCopyPrompt}
            onLevels={() => {
              navigate("/levels");
              window.scrollTo(0, 0);
            }}
            onFlightRecords={() => {
              navigate("/flightrecords");
              window.scrollTo(0, 0);
            }}
            onStatistics={() => {
              navigate("/statistics");
              window.scrollTo(0, 0);
            }}
            onManeuverClick={handleManeuverClick}
            onHelicopterClick={(helicopter) => {
              navigate(`/flightrecords/helicopter/${helicopter.id}`);
              window.scrollTo(0, 0);
            }}
            onHelicopterAdd={() => {
              navigate("/flightrecords/new");
              window.scrollTo(0, 0);
            }}
            onHelicopterIncrementFlights={incrementHelicopterFlights}
            flightEvents={flightEvents}
            crashEvents={crashEvents}
          />
        )}

        {view === "levels" && (
          <LevelsView
            levels={levels}
            getLevelProgress={getLevelProgress}
            handleCopyPrompt={handleCopyPrompt}
            tips={tips}
            currentTipIndex={currentTipIndex}
            nextTip={nextTip}
            prevTip={prevTip}
            handleLevelClick={handleLevelClick}
          />
        )}

        {view === "maneuvers" && selectedLevel && (
          <ManeuversView
            selectedLevel={selectedLevel}
            getLevelProgress={getLevelProgress}
            showVideo={showVideoMove}
            setShowVideo={setShowVideoMove}
            completedManeuvers={completedManeuvers}
            handleManeuverClick={handleManeuverClick}
            toggleLevelCompletion={toggleLevelCompletion}
          />
        )}

        {view === "detail" && selectedManeuver && (
          <ManeuverDetail
            selectedManeuver={selectedManeuver}
            completedManeuvers={completedManeuvers}
            toggleCompletion={toggleCompletion}
            showVideo={showVideo}
            setShowVideo={setShowVideo}
          />
        )}

        {view === "flightrecords" && (
          <FlightRecordsView
            helicopters={helicopters}
            onAddNew={() => navigate("/flightrecords/new")}
            onSelectHelicopter={(helicopter) =>
              navigate(`/flightrecords/helicopter/${helicopter.id}`)
            }
            onStatistics={() => {
              navigate("/statistics");
              window.scrollTo(0, 0);
            }}
          />
        )}

        {view === "flightrecordnew" && (
          <FlightRecordNew
            onSave={(helicopter) => {
              addHelicopter(helicopter);
              navigate("/flightrecords");
            }}
            onCancel={() => navigate("/flightrecords")}
          />
        )}

        {view === "flightrecorddetail" && selectedHelicopter && (
          <FlightRecordDetail
            helicopter={selectedHelicopter}
            onUpdate={(updates) =>
              updateHelicopter(selectedHelicopter.id, updates)
            }
            onIncrementFlights={incrementHelicopterFlights}
            onIncrementCrashes={incrementHelicopterCrashes}
            onDelete={() => {
              deleteHelicopter(selectedHelicopter.id);
              navigate("/flightrecords");
            }}
            onPreflight={() =>
              navigate(
                `/flightrecords/helicopter/${selectedHelicopter.id}/preflight`,
              )
            }
            flightEvents={flightEvents}
            crashEvents={crashEvents}
          />
        )}

        {view === "statistics" && (
          <StatisticsView
            levels={levels}
            completedManeuvers={completedManeuvers}
            helicopters={helicopters}
            flightEvents={flightEvents}
            crashEvents={crashEvents}
            maneuverCompletionEvents={maneuverCompletionEvents}
            onHelicopterSelect={(helicopter) => {
              navigate(`/flightrecords/helicopter/${helicopter.id}`);
              window.scrollTo(0, 0);
            }}
          />
        )}

        {view === "preflight" && selectedHelicopter && (
          <PreflightChecklist
            helicopter={selectedHelicopter}
            onComplete={() => {
              completePreflightCheck(selectedHelicopter.id);
              navigate(`/flightrecords/helicopter/${selectedHelicopter.id}`);
            }}
            onCancel={() =>
              navigate(`/flightrecords/helicopter/${selectedHelicopter.id}`)
            }
          />
        )}
      </main>
    </div>
  );
}

export default App;
