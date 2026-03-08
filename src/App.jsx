import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { levels, tips } from "./data";

import Header from "./components/Header";
import About from "./components/About";
import LevelsView from "./components/LevelsView";
import ManeuversView from "./components/ManeuversView";
import ManeuverDetail from "./components/ManeuverDetail";
import FlightRecordsView from "./components/FlightRecordsView";
import FlightRecordNew from "./components/FlightRecordNew";
import FlightRecordDetail from "./components/FlightRecordDetail";
import FlightSessionsView from "./components/FlightSessionsView";
import FlightSessionForm from "./components/FlightSessionForm";
import FlightSessionDetail from "./components/FlightSessionDetail";
import PreflightChecklist from "./components/PreflightChecklist";
import TermsOfService from "./components/TermsOfService";
import PrivacyNotice from "./components/PrivacyNotice";
import {
  buildExportData,
  CONSISTENCY_OPTIONS,
  createEntityId,
  loadStoredAppData,
  normalizeFlightSession,
  normalizeImportData,
  normalizeManeuverProgressEntry,
  PROFICIENCY_STATUSES,
  READINESS_OPTIONS,
  STORAGE_KEYS,
} from "./dataModel";
import {
  buildTrainingIntelligence,
  getTrainingModeLabel,
} from "./trainingInsights";

function getRouteState(pathname, helicopters, flightSessions) {
  const baseState = {
    view: "levels",
    selectedLevel: null,
    selectedManeuver: null,
    selectedHelicopter: null,
    selectedSession: null,
  };

  try {
    const raw = pathname || "/";
    const path = raw.replace(/\/+$/g, "") || "/";
    const parts = path === "/" ? [] : path.split("/").filter(Boolean);

    if (path === "/" || parts.length === 0) {
      return baseState;
    }

    if (parts[0] === "about") {
      return { ...baseState, view: "about" };
    }

    if (parts[0] === "terms") {
      return { ...baseState, view: "terms" };
    }

    if (parts[0] === "privacy") {
      return { ...baseState, view: "privacy" };
    }

    if (parts[0] === "flightrecords") {
      if (parts.length === 1) {
        return { ...baseState, view: "flightrecords" };
      }

      if (parts.length === 2 && parts[1] === "new") {
        return { ...baseState, view: "flightrecordnew" };
      }

      if (parts.length === 3 && parts[1] === "helicopter") {
        const helicopter = helicopters.find((entry) => entry.id === parts[2]);
        if (helicopter) {
          return {
            ...baseState,
            view: "flightrecorddetail",
            selectedHelicopter: helicopter,
          };
        }

        return { ...baseState, view: "flightrecords" };
      }

      if (
        parts.length === 4 &&
        parts[1] === "helicopter" &&
        parts[3] === "preflight"
      ) {
        const helicopter = helicopters.find((entry) => entry.id === parts[2]);
        if (helicopter) {
          return {
            ...baseState,
            view: "preflight",
            selectedHelicopter: helicopter,
          };
        }

        return { ...baseState, view: "flightrecords" };
      }

      return { ...baseState, view: "flightrecords" };
    }

    if (parts[0] === "sessions") {
      if (parts.length === 1) {
        return { ...baseState, view: "sessions" };
      }

      if (parts.length === 2 && parts[1] === "new") {
        return { ...baseState, view: "sessionnew" };
      }

      if (parts.length === 3 && parts[2] === "edit") {
        const session = flightSessions.find((entry) => entry.id === parts[1]);
        if (session) {
          return {
            ...baseState,
            view: "sessionedit",
            selectedSession: session,
          };
        }
      }

      if (parts.length === 2) {
        const session = flightSessions.find((entry) => entry.id === parts[1]);
        if (session) {
          return {
            ...baseState,
            view: "sessiondetail",
            selectedSession: session,
          };
        }
      }

      return { ...baseState, view: "sessions" };
    }

    if (parts[0] === "level") {
      const level = levels.find(
        (entry) => String(entry.id) === String(parts[1]),
      );
      if (!level) {
        return baseState;
      }

      if (parts.length === 2) {
        return {
          ...baseState,
          view: "maneuvers",
          selectedLevel: level,
        };
      }

      if (parts.length === 4 && parts[2] === "maneuver") {
        const maneuver = level.maneuvers.find(
          (entry) => String(entry.id) === String(parts[3]),
        );
        if (maneuver) {
          return {
            ...baseState,
            view: "detail",
            selectedLevel: level,
            selectedManeuver: maneuver,
          };
        }
      }

      return {
        ...baseState,
        view: "maneuvers",
        selectedLevel: level,
      };
    }

    return baseState;
  } catch {
    return baseState;
  }
}

function App() {
  const [storedData] = useState(() => loadStoredAppData(levels));
  const [showVideo, setShowVideo] = useState(false);
  const [showVideoMove, setShowVideoMove] = useState(false);
  const [selectedTrainingMode, setSelectedTrainingMode] = useState("all");
  const [currentTipIndex, setCurrentTipIndex] = useState(() =>
    Math.floor(Math.random() * tips.length),
  );
  const [completedManeuvers, setCompletedManeuver] = useState(
    storedData.completedManeuvers,
  );

  const [helicopters, setHelicopters] = useState(storedData.helicopters);
  const [flightSessions, setFlightSessions] = useState(
    storedData.flightSessions,
  );
  const [maneuverProgress, setManeuverProgress] = useState(
    storedData.maneuverProgress,
  );

  const validManeuverIds = useMemo(
    () =>
      new Set(
        levels.flatMap((level) =>
          level.maneuvers.map((maneuver) => String(maneuver.id)),
        ),
      ),
    [],
  );
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.completedManeuvers,
      JSON.stringify(completedManeuvers),
    );
  }, [completedManeuvers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.helicopters, JSON.stringify(helicopters));
  }, [helicopters]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.flightSessions,
      JSON.stringify(flightSessions),
    );
  }, [flightSessions]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.maneuverProgress,
      JSON.stringify(maneuverProgress),
    );
  }, [maneuverProgress]);

  const navigate = useNavigate();
  const location = useLocation();
  const {
    view,
    selectedLevel,
    selectedManeuver,
    selectedHelicopter,
    selectedSession,
  } = useMemo(
    () => getRouteState(location.pathname, helicopters, flightSessions),
    [location.pathname, helicopters, flightSessions],
  );
  const requestedHelicopterId = useMemo(
    () => new URLSearchParams(location.search).get("helicopter") || "",
    [location.search],
  );

  const toggleCompletion = (maneuverId) => {
    setCompletedManeuver((prev) => {
      const newState = { ...prev };
      if (newState[maneuverId]) {
        delete newState[maneuverId];
      } else {
        newState[maneuverId] = true;
      }
      return newState;
    });
  };

  const toggleLevelCompletion = (level) => {
    const allComplete = level.maneuvers.every((m) => completedManeuvers[m.id]);
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
  };

  const addHelicopter = (helicopter) => {
    const newHelicopter = {
      ...helicopter,
      id: createEntityId("helicopter"),
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

  const deleteHelicopter = (id) => {
    setHelicopters((prev) => prev.filter((h) => h.id !== id));
  };

  const completePreflightCheck = (helicopterId) => {
    updateHelicopter(helicopterId, {
      lastPreflightDate: new Date().toISOString(),
    });
  };

  const addFlightSession = (session) => {
    const now = new Date().toISOString();
    const newSession = normalizeFlightSession(
      {
        ...session,
        id: createEntityId("session"),
        createdAt: now,
        updatedAt: now,
      },
      validManeuverIds,
    );

    if (!newSession) {
      return null;
    }

    setFlightSessions((prev) => [newSession, ...prev]);
    return newSession;
  };

  const deleteFlightSession = (id) => {
    setFlightSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const updateFlightSession = (id, session) => {
    const existingSession = flightSessions.find((entry) => entry.id === id);
    const now = new Date().toISOString();
    const normalizedSession = normalizeFlightSession(
      {
        ...session,
        id,
        createdAt: existingSession?.createdAt || now,
        updatedAt: now,
      },
      validManeuverIds,
    );

    if (!normalizedSession) {
      return null;
    }

    setFlightSessions((prev) =>
      prev.map((entry) => (entry.id === id ? normalizedSession : entry)),
    );
    return normalizedSession;
  };

  const saveManeuverProgress = (maneuverId, updates) => {
    const normalizedEntry = normalizeManeuverProgressEntry({
      ...updates,
      status: PROFICIENCY_STATUSES.includes(updates.status)
        ? updates.status
        : "not_started",
      confidence: Number.isFinite(Number(updates.confidence))
        ? Number(updates.confidence)
        : 0,
      consistency: CONSISTENCY_OPTIONS.includes(updates.consistency)
        ? updates.consistency
        : "unknown",
      simStatus: READINESS_OPTIONS.includes(updates.simStatus)
        ? updates.simStatus
        : "not_started",
      realStatus: READINESS_OPTIONS.includes(updates.realStatus)
        ? updates.realStatus
        : "not_started",
      notes: updates.notes || "",
      updatedAt: new Date().toISOString(),
    });

    if (!normalizedEntry) {
      return;
    }

    setManeuverProgress((prev) => ({
      ...prev,
      [maneuverId]: normalizedEntry,
    }));
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

  const trainingIntelligence = useMemo(
    () =>
      buildTrainingIntelligence({
        levels,
        completedManeuvers,
        maneuverProgress,
        flightSessions,
      }),
    [completedManeuvers, flightSessions, maneuverProgress],
  );

  const currentSessionInsights =
    trainingIntelligence.sessionInsightsByMode[selectedTrainingMode];
  const currentTrainingRecommendations =
    trainingIntelligence.recommendationsByMode[selectedTrainingMode];
  const currentTrainingPlan =
    trainingIntelligence.plansByMode[selectedTrainingMode];

  const handleCopyPrompt = (
    trainingMode = selectedTrainingMode,
    trainingRecommendations = currentTrainingRecommendations,
    trainingPlan = currentTrainingPlan,
  ) => {
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
    const recommendationLines = trainingRecommendations.length
      ? trainingRecommendations
          .map(
            (recommendation, index) =>
              `${index + 1}. ${recommendation.title} (${recommendation.levelTitle}) - ${recommendation.reason}`,
          )
          .join("\n")
      : "(no recommendation signals yet)";
    const plannerLines = trainingPlan?.units?.length
      ? trainingPlan.units
          .map(
            (unit) =>
              `${unit.title}: ${unit.emphasis} | ${unit.maneuvers
                .map((maneuver) => maneuver.title)
                .join(", ")}`,
          )
          .join("\n")
      : "(no session plan generated)";

    const prompt = `You are a helpful RC Helicopter Pilot Proficiency Coach.

Here are the maneuvers in the program:
${allManeuvers.join("\n")}

Here is my current progress (completed maneuvers):
${progress.length ? progress.join("\n") : "(none)"}

Here are some helpful tips for pilots:
${allTips}

Training mode for this request:
${getTrainingModeLabel(trainingMode)}

Current recommendation signals:
${recommendationLines}

Current in-app session plan:
${plannerLines}

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
    } else if (view === "flightrecorddetail" || view === "preflight") {
      navigate(`/flightrecords`);
    } else if (view === "flightrecordnew") {
      navigate(`/flightrecords`);
    } else if (view === "sessionedit" && selectedSession) {
      navigate(`/sessions/${selectedSession.id}`);
    } else if (view === "sessiondetail" || view === "sessionnew") {
      navigate(`/sessions`);
    } else {
      navigate(`/`);
    }
  };

  const handleExportData = () => {
    const data = buildExportData({
      completedManeuvers,
      helicopters,
      flightSessions,
      maneuverProgress,
      validManeuverIds,
    });
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
        const normalizedImport = normalizeImportData(data, levels);

        if (normalizedImport.hasValidData) {
          setCompletedManeuver(normalizedImport.completedManeuvers);
          setHelicopters(normalizedImport.helicopters);
          setFlightSessions(normalizedImport.flightSessions);
          setManeuverProgress(normalizedImport.maneuverProgress);
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

  const maneuverLastPracticedAt = useMemo(() => {
    return flightSessions.reduce((accumulator, session) => {
      const practicedAt = new Date(session.date).toISOString();

      for (const maneuverId of Object.keys(session.maneuverResults)) {
        if (!accumulator[maneuverId] || accumulator[maneuverId] < practicedAt) {
          accumulator[maneuverId] = practicedAt;
        }
      }

      return accumulator;
    }, {});
  }, [flightSessions]);

  const helicopterSessionSummaries = useMemo(() => {
    return helicopters.reduce((accumulator, helicopter) => {
      const helicopterSessions = flightSessions.filter(
        (session) => session.helicopterId === helicopter.id,
      );
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);

      accumulator[helicopter.id] = {
        totalSessions: helicopterSessions.length,
        recentSessions: helicopterSessions.filter(
          (session) => new Date(session.date) >= cutoff,
        ).length,
        totalMinutes: helicopterSessions.reduce(
          (sum, session) => sum + session.totalFlightMinutes,
          0,
        ),
        totalPacks: helicopterSessions.reduce(
          (sum, session) => sum + session.packCount,
          0,
        ),
      };

      return accumulator;
    }, {});
  }, [flightSessions, helicopters]);

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
    if (view === "about") {
      return "Helicoach | About";
    } else if (view === "terms") {
      return "Helicoach | Terms of Service";
    } else if (view === "privacy") {
      return "Helicoach | Privacy Notice";
    } else if (view === "sessions") {
      return "Helicoach | Flight Sessions";
    } else if (view === "sessionnew") {
      return "Helicoach | Log Flight Session";
    } else if (view === "sessionedit" && selectedSession) {
      return `Helicoach | Edit Session ${selectedSession.date}`;
    } else if (view === "sessiondetail" && selectedSession) {
      return `Helicoach | Session ${selectedSession.date}`;
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
    } else {
      return "Helicoach - RC Helicopter Pilot Proficiency Training";
    }
  }, [
    view,
    selectedLevel,
    selectedManeuver,
    selectedHelicopter,
    selectedSession,
  ]);

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
        onSessions={() => {
          navigate("/sessions");
          window.scrollTo(0, 0);
        }}
        onFlightRecords={() => {
          navigate("/flightrecords");
          window.scrollTo(0, 0);
        }}
      />

      <main className="max-w-3xl mx-auto p-4 pb-20">
        {view === "about" && (
          <About
            handleExportData={handleExportData}
            handleImportData={handleImportData}
          />
        )}

        {view === "terms" && <TermsOfService />}

        {view === "privacy" && <PrivacyNotice />}

        {view === "levels" && (
          <LevelsView
            levels={levels}
            getLevelProgress={getLevelProgress}
            handleCopyPrompt={handleCopyPrompt}
            selectedTrainingMode={selectedTrainingMode}
            onTrainingModeChange={setSelectedTrainingMode}
            sessionInsights={currentSessionInsights}
            trainingRecommendations={currentTrainingRecommendations}
            trainingPlan={currentTrainingPlan}
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
            selectedTrainingMode={selectedTrainingMode}
            onTrainingModeChange={setSelectedTrainingMode}
            completedManeuvers={completedManeuvers}
            maneuverProgress={maneuverProgress}
            maneuverLastPracticedAt={maneuverLastPracticedAt}
            trainingRecommendations={currentTrainingRecommendations.filter(
              (recommendation) => recommendation.levelId === selectedLevel.id,
            )}
            handleManeuverClick={handleManeuverClick}
            toggleLevelCompletion={toggleLevelCompletion}
          />
        )}

        {view === "detail" && selectedManeuver && (
          <ManeuverDetail
            key={selectedManeuver.id}
            selectedManeuver={selectedManeuver}
            completedManeuvers={completedManeuvers}
            selectedManeuverProgress={maneuverProgress[selectedManeuver.id]}
            selectedManeuverLastPracticedAt={
              maneuverLastPracticedAt[selectedManeuver.id]
            }
            saveManeuverProgress={saveManeuverProgress}
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
            onViewSessions={() => navigate("/sessions")}
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
            onDelete={() => {
              deleteHelicopter(selectedHelicopter.id);
              navigate("/flightrecords");
            }}
            onPreflight={() =>
              navigate(
                `/flightrecords/helicopter/${selectedHelicopter.id}/preflight`,
              )
            }
            onLogSession={() =>
              navigate(`/sessions/new?helicopter=${selectedHelicopter.id}`)
            }
            recentSessions={flightSessions
              .filter(
                (session) => session.helicopterId === selectedHelicopter.id,
              )
              .sort((left, right) => right.date.localeCompare(left.date))
              .slice(0, 3)}
            sessionSummary={
              helicopterSessionSummaries[selectedHelicopter.id] || {
                totalSessions: 0,
                recentSessions: 0,
                totalMinutes: 0,
                totalPacks: 0,
              }
            }
          />
        )}

        {view === "sessions" && (
          <FlightSessionsView
            flightSessions={flightSessions}
            helicopters={helicopters}
            onAddNew={() => navigate("/sessions/new")}
            onSelectSession={(session) => navigate(`/sessions/${session.id}`)}
          />
        )}

        {view === "sessionnew" && (
          <FlightSessionForm
            helicopters={helicopters}
            levels={levels}
            defaultHelicopterId={requestedHelicopterId}
            onSave={(session) => {
              const newSession = addFlightSession(session);
              if (newSession) {
                navigate(`/sessions/${newSession.id}`);
              }
            }}
            onCancel={() => navigate("/sessions")}
          />
        )}

        {view === "sessionedit" && selectedSession && (
          <FlightSessionForm
            helicopters={helicopters}
            levels={levels}
            initialSession={selectedSession}
            onSave={(session) => {
              const updatedSession = updateFlightSession(
                selectedSession.id,
                session,
              );
              if (updatedSession) {
                navigate(`/sessions/${updatedSession.id}`);
              }
            }}
            onCancel={() => navigate(`/sessions/${selectedSession.id}`)}
          />
        )}

        {view === "sessiondetail" && selectedSession && (
          <FlightSessionDetail
            session={selectedSession}
            helicopters={helicopters}
            levels={levels}
            onEdit={() => navigate(`/sessions/${selectedSession.id}/edit`)}
            onDelete={() => {
              deleteFlightSession(selectedSession.id);
              navigate("/sessions");
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
