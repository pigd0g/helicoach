import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { levels, tips } from "./data";

import Header from "./components/Header";
import About from "./components/About";
import LevelsView from "./components/LevelsView";
import ManeuversView from "./components/ManeuversView";
import ManeuverDetail from "./components/ManeuverDetail";

function App() {
  const [view, setView] = useState("levels");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedManeuver, setSelectedManeuver] = useState(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(() =>
    Math.floor(Math.random() * tips.length)
  );
  const [completedManeuvers, setCompletedManeuver] = useState(() => {
    const saved = localStorage.getItem("completedManeuvers");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(
      "completedManeuvers",
      JSON.stringify(completedManeuvers)
    );
  }, [completedManeuvers]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const raw = location.pathname || "/";
      const path = raw.replace(/\/+$/g, "") || "/";
      const parts = path === "/" ? [] : path.split("/").filter(Boolean);

      if (path === "/" || parts.length === 0) {
        setView("levels");
        setSelectedLevel(null);
        setSelectedManeuver(null);
        return;
      }

      if (parts[0] === "about") {
        setView("about");
        return;
      }

      if (parts[0] === "level") {
        const levelIdParam = parts[1];
        const level = levels.find((l) => String(l.id) === String(levelIdParam));
        if (!level) {
          setView("levels");
          setSelectedLevel(null);
          setSelectedManeuver(null);
          return;
        }
        setSelectedLevel(level);

        if (parts.length === 2) {
          setView("maneuvers");
          setSelectedManeuver(null);
          return;
        }

        if (parts.length === 4 && parts[2] === "maneuver") {
          const maneuverIdParam = parts[3];
          const maneuver = level.maneuvers.find(
            (m) => String(m.id) === String(maneuverIdParam)
          );
          if (maneuver) {
            setSelectedManeuver(maneuver);
            setView("detail");
            return;
          }
        }

        setView("maneuvers");
        setSelectedManeuver(null);
        return;
      }

      setView("levels");
      setSelectedLevel(null);
      setSelectedManeuver(null);
    } catch (e) {
      setView("levels");
      setSelectedLevel(null);
      setSelectedManeuver(null);
    }
  }, [location.pathname]);

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

  const handleRandomManeuver = () => {
    const allManeuvers = levels.flatMap((l) => l.maneuvers);
    const incompleteManeuvers = allManeuvers.filter(
      (m) => !completedManeuvers[m.id]
    );

    if (incompleteManeuvers.length > 0) {
      const randomManeuver =
        incompleteManeuvers[
          Math.floor(Math.random() * incompleteManeuvers.length)
        ];
      const level = levels.find((l) =>
        l.maneuvers.some((m) => m.id === randomManeuver.id)
      );
      setSelectedLevel(level);
      setShowVideo(false);
      setSelectedManeuver(randomManeuver);
      setView("detail");
      window.scrollTo(0, 0);
    } else {
      alert("Congratulations! You've completed all maneuvers!");
    }
  };

  const handleCopyPrompt = () => {
    const allManeuvers = levels.flatMap((l) =>
      l.maneuvers.map(
        (m) =>
          `Level ${l.id}: ${m.title}${
            m.variations === "N/A" ? "" : " - " + m.variations
          }`
      )
    );
    const progress = Object.keys(completedManeuvers).join(", ");
    const allTips = tips.join("\n");

    const prompt = `You are a helpful RC Helicopter Pilot Proficiency Coach.

Here are the maneuvers in the program:
${allManeuvers.join("\n")}

Here is my current progress (list of completed maneuver IDs):
${progress}

Here are some helpful tips for pilots:
${allTips}

Please analyze my progress and suggest a training plan for today. Do Not Include Current Progress Summary`;

    navigator.clipboard.writeText(prompt).then(() => {
      alert("Prompt copied to clipboard! Paste it into your AI assistant.");
    });
  };

  const goBack = () => {
    if (view === "detail" && selectedLevel) {
      navigate(`/level/${selectedLevel.id}`);
    } else {
      navigate(`/`);
    }
  };

  const handleExportData = () => {
    const data = {
      completedManeuvers,
      exportedAt: new Date().toISOString(),
      version: 1,
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
        if (
          data.completedManeuvers &&
          typeof data.completedManeuvers === "object"
        ) {
          const validManeuverIds = new Set(
            levels.flatMap((l) => l.maneuvers.map((m) => m.id))
          );
          const sanitized = {};
          for (const [key, value] of Object.entries(data.completedManeuvers)) {
            if (validManeuverIds.has(key) && value === true) {
              sanitized[key] = true;
            }
          }
          setCompletedManeuver(sanitized);
          alert("Progress imported successfully!");
        } else {
          alert(
            "Invalid file format. Please select a valid HeliCoach export file."
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
      (m) => completedManeuvers[m.id]
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
    } else if (view === "detail" && selectedManeuver) {
      return `Helicoach | ${selectedManeuver.id} - ${selectedManeuver.title}`;
    } else if (view === "maneuvers" && selectedLevel) {
      return `Helicoach | ${selectedLevel.title}`;
    } else {
      return "Helicoach - RC Helicopter Pilot Proficiency Training";
    }
  }, [view, selectedLevel, selectedManeuver]);

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
            showVideo={showVideo}
            setShowVideo={setShowVideo}
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
      </main>
    </div>
  );
}

export default App;
