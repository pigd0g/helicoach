export const TRAINING_MODES = ["all", "real", "sim"];

const EMPTY_PRACTICE_STATS = {
  count: 0,
  cleanCount: 0,
  inconsistentCount: 0,
  needsWorkCount: 0,
  lastPracticedAt: "",
};

const cloneEmptyPracticeStats = () => ({ ...EMPTY_PRACTICE_STATS });

const createPracticeBucket = () => ({
  all: cloneEmptyPracticeStats(),
  real: cloneEmptyPracticeStats(),
  sim: cloneEmptyPracticeStats(),
});

const getModeKey = (mode) => (mode === "sim" ? "sim" : "real");

const updatePracticeStats = (stats, date, result) => {
  stats.count += 1;
  stats.lastPracticedAt =
    !stats.lastPracticedAt || stats.lastPracticedAt < date
      ? date
      : stats.lastPracticedAt;

  if (result === "clean") {
    stats.cleanCount += 1;
  } else if (result === "needs-work") {
    stats.needsWorkCount += 1;
  } else {
    stats.inconsistentCount += 1;
  }
};

const getDaysSince = (value) => {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const target = new Date(value);
  if (Number.isNaN(target.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.floor((Date.now() - target.getTime()) / (1000 * 60 * 60 * 24));
};

const getModeStatus = (progress, mode) => {
  if (!progress) {
    return "not_started";
  }

  if (mode === "sim") {
    return progress.simStatus || "not_started";
  }

  if (mode === "real") {
    return progress.realStatus || "not_started";
  }

  return progress.status || "not_started";
};

export const getTrainingModeLabel = (mode) => {
  if (mode === "real") {
    return "Real Flights";
  }

  if (mode === "sim") {
    return "Simulator";
  }

  return "All Training";
};

const buildReason = ({
  summary,
  previousSummary,
  mode,
  modeStats,
  daysSincePractice,
}) => {
  const modeLabel = getTrainingModeLabel(mode).toLowerCase();

  if (!summary.completed && previousSummary?.completed) {
    return `Natural next step after ${previousSummary.title}.`;
  }

  if (modeStats.needsWorkCount > 0) {
    return "Recent session logs show repeat breakdowns here.";
  }

  if (modeStats.inconsistentCount > modeStats.cleanCount) {
    return "Recent reps are still more inconsistent than clean.";
  }

  if (mode !== "all" && modeStats.count === 0) {
    return `No ${modeLabel} reps have been logged yet.`;
  }

  if ((summary.progress?.confidence || 0) <= 2) {
    return "Confidence is still low enough to benefit from deliberate reps.";
  }

  if (
    summary.completed &&
    Number.isFinite(daysSincePractice) &&
    daysSincePractice >= 21
  ) {
    return `This maneuver has been dormant for ${daysSincePractice} days.`;
  }

  if (!summary.completed) {
    return "Still unchecked in your progression path.";
  }

  return "Good candidate for a short consolidation block.";
};

const buildSupportingText = ({
  summary,
  modeStats,
  daysSincePractice,
  mode,
}) => {
  const details = [];

  if (modeStats.count > 0) {
    const repsLabel = mode === "all" ? "logged reps" : `${mode} reps`;
    details.push(`${modeStats.count} ${repsLabel}`);
  }

  if (Number.isFinite(daysSincePractice)) {
    details.push(`last practiced ${daysSincePractice}d ago`);
  }

  if ((summary.progress?.confidence || 0) > 0) {
    details.push(`confidence ${summary.progress.confidence}/5`);
  }

  return details.join(" • ");
};

const buildRecommendations = (summaries, mode) => {
  return summaries
    .map((summary, index) => {
      const previousSummary = index > 0 ? summaries[index - 1] : null;
      const modeStats =
        mode === "all" ? summary.practice.all : summary.practice[mode];
      const daysSincePractice = getDaysSince(
        modeStats.lastPracticedAt || summary.practice.all.lastPracticedAt,
      );
      const modeStatus = getModeStatus(summary.progress, mode);
      const confidence = summary.progress?.confidence || 0;

      let score = 0;

      if (!summary.completed && previousSummary?.completed) {
        score += 42;
      } else if (!summary.completed) {
        score += 24;
      }

      if (mode !== "all" && modeStats.count === 0) {
        score += 16;
      }

      if (modeStats.needsWorkCount > 0) {
        score += 18 + modeStats.needsWorkCount * 2;
      }

      if (modeStats.inconsistentCount > modeStats.cleanCount) {
        score += 12;
      }

      if (
        summary.completed &&
        Number.isFinite(daysSincePractice) &&
        daysSincePractice >= 21
      ) {
        score += Math.min(18, daysSincePractice - 14);
      }

      if (confidence <= 2) {
        score += (3 - confidence) * 6;
      }

      if (modeStatus === "not_started") {
        score += 12;
      } else if (modeStatus === "working") {
        score += 10;
      } else if (modeStatus === "consistent") {
        score += 4;
      }

      if (
        summary.completed &&
        confidence >= 4 &&
        modeStats.cleanCount >= modeStats.inconsistentCount &&
        daysSincePractice < 14
      ) {
        score -= 12;
      }

      if (summary.progress?.status === "competition_ready") {
        score -= 10;
      }

      if (!summary.completed && previousSummary && !previousSummary.completed) {
        score -= 8;
      }

      return {
        ...summary,
        mode,
        modeStatus,
        modePracticeCount: modeStats.count,
        lastPracticedAt:
          modeStats.lastPracticedAt || summary.practice.all.lastPracticedAt,
        score,
        reason: buildReason({
          summary,
          previousSummary,
          mode,
          modeStats,
          daysSincePractice,
        }),
        supportingText: buildSupportingText({
          summary,
          modeStats,
          daysSincePractice,
          mode,
        }),
      };
    })
    .filter((summary) => summary.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.sequence - right.sequence,
    )
    .slice(0, 4);
};

const pickWarmupCandidates = (summaries, anchorSequence) => {
  return summaries
    .filter(
      (summary) =>
        summary.completed &&
        summary.sequence < anchorSequence &&
        (summary.progress?.confidence || 0) >= 2,
    )
    .sort((left, right) => {
      const leftDays = getDaysSince(left.practice.all.lastPracticedAt);
      const rightDays = getDaysSince(right.practice.all.lastPracticedAt);
      return rightDays - leftDays || left.sequence - right.sequence;
    });
};

const dedupeManeuvers = (maneuvers) => {
  const seen = new Set();
  return maneuvers.filter((maneuver) => {
    if (!maneuver || seen.has(maneuver.id)) {
      return false;
    }

    seen.add(maneuver.id);
    return true;
  });
};

const buildPlanUnits = ({ mode, warmup, focus, stretch }) => {
  const units = [];

  if (mode === "sim") {
    units.push({
      title: "Flight 1",
      emphasis: "Warm-up and orientation reset",
      maneuvers: dedupeManeuvers([...warmup, focus[0]]).slice(0, 2),
    });
    units.push({
      title: "Flight 2",
      emphasis: "High-rep block on primary focus",
      maneuvers: dedupeManeuvers([focus[0], warmup[0]]).slice(0, 2),
    });
    units.push({
      title: "Flight 3",
      emphasis: "Secondary focus and clean exits",
      maneuvers: dedupeManeuvers([focus[1], focus[0]]).slice(0, 2),
    });
    units.push({
      title: "Flight 4",
      emphasis: "Recover weak spots before adding difficulty",
      maneuvers: dedupeManeuvers([focus[0], focus[1], warmup[1]]).slice(0, 2),
    });
    units.push({
      title: "Flight 5",
      emphasis: "Stretch goal only after clean reps",
      maneuvers: dedupeManeuvers([stretch, focus[0]]).slice(0, 2),
    });
    return units;
  }

  units.push({
    title: "Pack 1",
    emphasis: "Trim, orientation, and confidence reset",
    maneuvers: dedupeManeuvers([...warmup, focus[0]]).slice(0, 2),
  });
  units.push({
    title: "Pack 2",
    emphasis: "Primary work block with deliberate repetitions",
    maneuvers: dedupeManeuvers([focus[0], focus[1]]).slice(0, 2),
  });
  units.push({
    title: "Pack 3",
    emphasis: "Consolidate, then touch the stretch maneuver",
    maneuvers: dedupeManeuvers([focus[1], stretch, warmup[0]]).slice(0, 2),
  });
  return units;
};

const buildTrainingPlan = (summaries, recommendations, mode) => {
  const anchorSequence = recommendations[0]?.sequence || summaries.length;
  const warmup = pickWarmupCandidates(summaries, anchorSequence).slice(0, 2);
  const focus = recommendations.slice(0, 2);
  const stretch =
    summaries.find(
      (summary) =>
        !focus.some((focusItem) => focusItem.id === summary.id) &&
        !summary.completed &&
        summary.sequence >= anchorSequence,
    ) ||
    focus[1] ||
    focus[0] ||
    warmup[0] ||
    null;

  return {
    mode,
    title:
      mode === "sim"
        ? "Five-flight simulator block"
        : "Three-pack field session",
    summary:
      mode === "sim"
        ? "Use the extra simulator volume to repeat the same weak points before moving on."
        : "Keep the plan tight and disciplined so each pack has one clear objective.",
    warmup,
    focus,
    stretch,
    units: buildPlanUnits({ mode, warmup, focus, stretch }).filter(
      (unit) => unit.maneuvers.length > 0,
    ),
  };
};

const buildSessionInsights = (sessions, titleById) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  const maneuverCounts = {};

  for (const session of sessions) {
    for (const maneuverId of Object.keys(session.maneuverResults)) {
      maneuverCounts[maneuverId] = (maneuverCounts[maneuverId] || 0) + 1;
    }
  }

  const [topManeuverId, topManeuverCount] = Object.entries(maneuverCounts).sort(
    (left, right) => right[1] - left[1],
  )[0] || ["", 0];

  return {
    totalSessions: sessions.length,
    thisWeekSessions: sessions.filter(
      (session) => new Date(session.date) >= cutoff,
    ).length,
    totalMinutes: sessions.reduce(
      (sum, session) => sum + session.totalFlightMinutes,
      0,
    ),
    totalPacks: sessions.reduce((sum, session) => sum + session.packCount, 0),
    topManeuverTitle: topManeuverId ? titleById[topManeuverId] || "" : "",
    topManeuverCount,
  };
};

export const buildTrainingIntelligence = ({
  levels,
  completedManeuvers,
  maneuverProgress,
  flightSessions,
}) => {
  const flatManeuvers = [];
  const titleById = {};

  levels.forEach((level) => {
    level.maneuvers.forEach((maneuver) => {
      flatManeuvers.push({
        ...maneuver,
        levelId: level.id,
        levelTitle: level.title,
        completed: !!completedManeuvers[maneuver.id],
      });
      titleById[maneuver.id] = maneuver.title;
    });
  });

  const practiceByManeuverId = flatManeuvers.reduce((accumulator, maneuver) => {
    accumulator[maneuver.id] = createPracticeBucket();
    return accumulator;
  }, {});

  for (const session of flightSessions) {
    const modeKey = getModeKey(session.mode);
    for (const [maneuverId, result] of Object.entries(
      session.maneuverResults,
    )) {
      const bucket = practiceByManeuverId[maneuverId];
      if (!bucket) {
        continue;
      }

      updatePracticeStats(bucket.all, session.date, result);
      updatePracticeStats(bucket[modeKey], session.date, result);
    }
  }

  const summaries = flatManeuvers.map((maneuver, sequence) => ({
    ...maneuver,
    sequence,
    progress: maneuverProgress[maneuver.id] || null,
    practice: practiceByManeuverId[maneuver.id] || createPracticeBucket(),
  }));

  const recommendationsByMode = TRAINING_MODES.reduce((accumulator, mode) => {
    accumulator[mode] = buildRecommendations(summaries, mode);
    return accumulator;
  }, {});

  const plansByMode = TRAINING_MODES.reduce((accumulator, mode) => {
    accumulator[mode] = buildTrainingPlan(
      summaries,
      recommendationsByMode[mode],
      mode,
    );
    return accumulator;
  }, {});

  const sessionInsightsByMode = {
    all: buildSessionInsights(flightSessions, titleById),
    real: buildSessionInsights(
      flightSessions.filter((session) => getModeKey(session.mode) === "real"),
      titleById,
    ),
    sim: buildSessionInsights(
      flightSessions.filter((session) => getModeKey(session.mode) === "sim"),
      titleById,
    ),
  };

  return {
    recommendationsByMode,
    plansByMode,
    sessionInsightsByMode,
  };
};
