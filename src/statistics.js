const STORAGE_KEYS = {
  flightEvents: "flightEvents",
  crashEvents: "crashEvents",
  maneuverCompletionEvents: "maneuverCompletionEvents",
};

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

const SHORT_MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: "short",
});

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
});

const TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
});

const sortByOccurredAt = (left, right) => {
  const leftTime = new Date(left.occurredAt).getTime() || 0;
  const rightTime = new Date(right.occurredAt).getTime() || 0;
  return leftTime - rightTime;
};

const clampNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : 0;
};

const isObject = (value) => Boolean(value) && typeof value === "object";

const safeDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const getMonthKey = (value) => {
  const date = value instanceof Date ? value : safeDate(value);
  if (!date) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthStart = (value = new Date()) => {
  const date =
    value instanceof Date ? new Date(value) : safeDate(value) || new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const shiftMonth = (monthDate, delta) =>
  new Date(monthDate.getFullYear(), monthDate.getMonth() + delta, 1);

const getDaysInMonth = (monthDate) =>
  new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

const formatMonthYear = (value) => MONTH_LABEL_FORMATTER.format(value);

const formatShortMonth = (value) => SHORT_MONTH_LABEL_FORMATTER.format(value);

const sanitizeHelicopter = (value) => {
  if (!isObject(value) || !value.id || typeof value.title !== "string") {
    return null;
  }

  return {
    ...value,
    photo: typeof value.photo === "string" ? value.photo : null,
    flights: clampNumber(value.flights),
    avgFlightTime: clampNumber(value.avgFlightTime),
    crashes: clampNumber(value.crashes),
    lastPreflightDate:
      typeof value.lastPreflightDate === "string"
        ? value.lastPreflightDate
        : null,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : null,
  };
};

const sanitizeEventArray = (value, validator) =>
  safeArray(value).map(validator).filter(Boolean).sort(sortByOccurredAt);

const sanitizeFlightEvent = (value) => {
  if (!isObject(value) || !value.helicopterId || !safeDate(value.occurredAt)) {
    return null;
  }

  return {
    id:
      typeof value.id === "string"
        ? value.id
        : `${value.helicopterId}-${value.occurredAt}`,
    helicopterId: String(value.helicopterId),
    helicopterTitleSnapshot:
      typeof value.helicopterTitleSnapshot === "string"
        ? value.helicopterTitleSnapshot
        : "Helicopter",
    occurredAt: new Date(value.occurredAt).toISOString(),
  };
};

const sanitizeCrashEvent = (value) => {
  if (!isObject(value) || !value.helicopterId || !safeDate(value.occurredAt)) {
    return null;
  }

  return {
    id:
      typeof value.id === "string"
        ? value.id
        : `${value.helicopterId}-${value.occurredAt}`,
    helicopterId: String(value.helicopterId),
    helicopterTitleSnapshot:
      typeof value.helicopterTitleSnapshot === "string"
        ? value.helicopterTitleSnapshot
        : "Helicopter",
    occurredAt: new Date(value.occurredAt).toISOString(),
  };
};

const sanitizeManeuverCompletionEvent = (value) => {
  if (
    !isObject(value) ||
    !value.maneuverId ||
    !value.levelId ||
    !safeDate(value.occurredAt)
  ) {
    return null;
  }

  return {
    id:
      typeof value.id === "string"
        ? value.id
        : `${value.maneuverId}-${value.occurredAt}`,
    maneuverId: String(value.maneuverId),
    maneuverTitleSnapshot:
      typeof value.maneuverTitleSnapshot === "string"
        ? value.maneuverTitleSnapshot
        : "Maneuver",
    levelId: String(value.levelId),
    levelTitleSnapshot:
      typeof value.levelTitleSnapshot === "string"
        ? value.levelTitleSnapshot
        : `Level ${value.levelId}`,
    occurredAt: new Date(value.occurredAt).toISOString(),
  };
};

const sanitizeCompletedManeuvers = (value, validIds) => {
  if (!isObject(value)) {
    return {};
  }

  const next = {};
  Object.entries(value).forEach(([maneuverId, completed]) => {
    if (completed === true && (!validIds || validIds.has(maneuverId))) {
      next[maneuverId] = true;
    }
  });
  return next;
};

const readStorageJson = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const createEventId = (prefix, primaryId, occurredAt) => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${prefix}-${primaryId}-${occurredAt}-${Math.random().toString(36).slice(2, 10)}`;
};

const createFlightEvent = (helicopter) => {
  const occurredAt = new Date().toISOString();
  return {
    id: createEventId("flight", helicopter.id, occurredAt),
    helicopterId: helicopter.id,
    helicopterTitleSnapshot: helicopter.title,
    occurredAt,
  };
};

const createCrashEvent = (helicopter) => {
  const occurredAt = new Date().toISOString();
  return {
    id: createEventId("crash", helicopter.id, occurredAt),
    helicopterId: helicopter.id,
    helicopterTitleSnapshot: helicopter.title,
    occurredAt,
  };
};

const createManeuverCompletionEvent = ({ maneuver, level }) => {
  const occurredAt = new Date().toISOString();
  return {
    id: createEventId("maneuver", maneuver.id, occurredAt),
    maneuverId: String(maneuver.id),
    maneuverTitleSnapshot: maneuver.title,
    levelId: String(level.id),
    levelTitleSnapshot: level.title,
    occurredAt,
  };
};

const getEventMonthRange = (...eventCollections) => {
  const events = eventCollections.flat().filter(Boolean);
  if (!events.length) {
    const now = getMonthStart();
    return { earliestMonth: now, latestMonth: now };
  }

  const sorted = [...events].sort(sortByOccurredAt);
  return {
    earliestMonth: getMonthStart(sorted[0].occurredAt),
    latestMonth: getMonthStart(sorted[sorted.length - 1].occurredAt),
  };
};

const buildMonthlyCumulativeSeries = ({
  monthDate,
  flightEvents,
  crashEvents,
  helicopterId,
}) => {
  const normalizedMonth = getMonthStart(monthDate);
  const targetMonthKey = getMonthKey(normalizedMonth);
  const daysInMonth = getDaysInMonth(normalizedMonth);
  const filteredFlights = sanitizeFlightEvents(flightEvents).filter((event) => {
    if (helicopterId && event.helicopterId !== helicopterId) {
      return false;
    }
    return getMonthKey(event.occurredAt) === targetMonthKey;
  });
  const filteredCrashes = sanitizeCrashEvents(crashEvents).filter((event) => {
    if (helicopterId && event.helicopterId !== helicopterId) {
      return false;
    }
    return getMonthKey(event.occurredAt) === targetMonthKey;
  });

  const flightsByDay = new Map();
  const crashesByDay = new Map();

  filteredFlights.forEach((event) => {
    const day = new Date(event.occurredAt).getDate();
    flightsByDay.set(day, (flightsByDay.get(day) || 0) + 1);
  });

  filteredCrashes.forEach((event) => {
    const day = new Date(event.occurredAt).getDate();
    crashesByDay.set(day, (crashesByDay.get(day) || 0) + 1);
  });

  let cumulativeFlights = 0;
  let cumulativeCrashes = 0;

  const series = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    cumulativeFlights += flightsByDay.get(day) || 0;
    cumulativeCrashes += crashesByDay.get(day) || 0;

    const date = new Date(
      normalizedMonth.getFullYear(),
      normalizedMonth.getMonth(),
      day,
    );

    return {
      day,
      label: `${day}`,
      fullLabel: `${WEEKDAY_FORMATTER.format(date)} ${day}`,
      flights: cumulativeFlights,
      crashes: cumulativeCrashes,
      dailyFlights: flightsByDay.get(day) || 0,
      dailyCrashes: crashesByDay.get(day) || 0,
    };
  });

  return {
    monthDate: normalizedMonth,
    monthLabel: formatMonthYear(normalizedMonth),
    monthKey: targetMonthKey,
    daysInMonth,
    series,
    hasEvents: filteredFlights.length > 0 || filteredCrashes.length > 0,
    totals: {
      flights: filteredFlights.length,
      crashes: filteredCrashes.length,
    },
  };
};

const buildMonthlyCompletionSeries = ({
  monthDate,
  maneuverCompletionEvents,
}) => {
  const normalizedMonth = getMonthStart(monthDate);
  const targetMonthKey = getMonthKey(normalizedMonth);
  const daysInMonth = getDaysInMonth(normalizedMonth);
  const filteredEvents = sanitizeManeuverCompletionEvents(
    maneuverCompletionEvents,
  ).filter((event) => getMonthKey(event.occurredAt) === targetMonthKey);

  const completionsByDay = new Map();
  filteredEvents.forEach((event) => {
    const day = new Date(event.occurredAt).getDate();
    completionsByDay.set(day, (completionsByDay.get(day) || 0) + 1);
  });

  let cumulative = 0;
  const series = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    cumulative += completionsByDay.get(day) || 0;
    return {
      day,
      label: `${day}`,
      completions: cumulative,
      dailyCompletions: completionsByDay.get(day) || 0,
    };
  });

  return {
    monthDate: normalizedMonth,
    monthLabel: formatMonthYear(normalizedMonth),
    monthKey: targetMonthKey,
    series,
    hasEvents: filteredEvents.length > 0,
    totals: {
      completions: filteredEvents.length,
    },
  };
};

const getCrashRate = (flights, crashes) => {
  const safeFlights = clampNumber(flights);
  const safeCrashes = clampNumber(crashes);
  if (safeFlights === 0) {
    return 0;
  }
  return (safeCrashes / safeFlights) * 100;
};

const buildCrashRateBreakdown = (helicopters) => {
  const normalizedHelicopters = sanitizeHelicopters(helicopters);
  const perHelicopter = normalizedHelicopters.map((helicopter) => {
    const flights = clampNumber(helicopter.flights);
    const crashes = clampNumber(helicopter.crashes);
    const safeLandings = Math.max(flights - crashes, 0);
    return {
      id: helicopter.id,
      title: helicopter.title,
      flights,
      crashes,
      safeLandings,
      crashRate: getCrashRate(flights, crashes),
    };
  });

  const totalFlights = perHelicopter.reduce(
    (sum, entry) => sum + entry.flights,
    0,
  );
  const totalCrashes = perHelicopter.reduce(
    (sum, entry) => sum + entry.crashes,
    0,
  );

  return {
    overall: {
      id: "all-helicopters",
      title: "All Helicopters",
      flights: totalFlights,
      crashes: totalCrashes,
      safeLandings: Math.max(totalFlights - totalCrashes, 0),
      crashRate: getCrashRate(totalFlights, totalCrashes),
    },
    perHelicopter,
  };
};

const buildHelicopterTotals = (helicopters) => {
  const normalizedHelicopters = sanitizeHelicopters(helicopters);
  return normalizedHelicopters
    .map((helicopter) => ({
      id: helicopter.id,
      title: helicopter.title,
      flights: clampNumber(helicopter.flights),
      crashes: clampNumber(helicopter.crashes),
      avgFlightTime: clampNumber(helicopter.avgFlightTime),
      estimatedHours:
        clampNumber(helicopter.flights) * clampNumber(helicopter.avgFlightTime),
    }))
    .sort(
      (left, right) =>
        right.flights - left.flights || right.crashes - left.crashes,
    );
};

const buildManeuverCompletionLevelData = (levels, completedManeuvers) =>
  safeArray(levels).map((level) => {
    const maneuvers = safeArray(level.maneuvers);
    const completed = maneuvers.filter(
      (maneuver) => completedManeuvers?.[maneuver.id],
    ).length;
    const total = maneuvers.length;
    return {
      id: String(level.id),
      title: level.title,
      total,
      completed,
      remaining: Math.max(total - completed, 0),
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

const buildRecentActivity = ({
  flightEvents,
  crashEvents,
  maneuverCompletionEvents,
  helicoptersById,
  maneuversById,
}) => {
  const items = [
    ...sanitizeFlightEvents(flightEvents).map((event) => ({
      id: event.id,
      type: "flight",
      title:
        helicoptersById.get(event.helicopterId)?.title ||
        event.helicopterTitleSnapshot,
      subtitle: "Flight logged",
      occurredAt: event.occurredAt,
    })),
    ...sanitizeCrashEvents(crashEvents).map((event) => ({
      id: event.id,
      type: "crash",
      title:
        helicoptersById.get(event.helicopterId)?.title ||
        event.helicopterTitleSnapshot,
      subtitle: "Crash logged",
      occurredAt: event.occurredAt,
    })),
    ...sanitizeManeuverCompletionEvents(maneuverCompletionEvents).map(
      (event) => ({
        id: event.id,
        type: "maneuver",
        title:
          maneuversById.get(event.maneuverId)?.title ||
          event.maneuverTitleSnapshot,
        subtitle: event.levelTitleSnapshot,
        occurredAt: event.occurredAt,
      }),
    ),
  ];

  return items
    .sort(sortByOccurredAt)
    .reverse()
    .slice(0, 12)
    .map((item) => ({
      ...item,
      occurredDateLabel: DAY_FORMATTER.format(new Date(item.occurredAt)),
      occurredTimeLabel: TIME_FORMATTER.format(new Date(item.occurredAt)),
    }));
};

const buildMonthlyTotalSeries = (events, formatter) => {
  const countsByMonth = new Map();
  events.forEach((event) => {
    const monthKey = getMonthKey(event.occurredAt);
    if (!monthKey) {
      return;
    }
    countsByMonth.set(monthKey, (countsByMonth.get(monthKey) || 0) + 1);
  });

  return Array.from(countsByMonth.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([monthKey, total]) => {
      const [year, month] = monthKey.split("-").map(Number);
      const date = new Date(year, month - 1, 1);
      return {
        monthKey,
        monthLabel: `${formatShortMonth(date)} ${String(year).slice(-2)}`,
        total,
        title: formatter ? formatter(monthKey, total) : formatMonthYear(date),
      };
    });
};

const buildSummaryMetrics = ({
  helicopters,
  completedManeuvers,
  levels,
  flightEvents,
  crashEvents,
  maneuverCompletionEvents,
}) => {
  const helicopterTotals = buildHelicopterTotals(helicopters);
  const totalFlights = helicopterTotals.reduce(
    (sum, helicopter) => sum + helicopter.flights,
    0,
  );
  const totalCrashes = helicopterTotals.reduce(
    (sum, helicopter) => sum + helicopter.crashes,
    0,
  );
  const totalManeuvers = safeArray(levels).reduce(
    (sum, level) => sum + safeArray(level.maneuvers).length,
    0,
  );
  const completedCount = Object.keys(completedManeuvers || {}).length;

  return {
    totalHelicopters: helicopterTotals.length,
    totalFlights,
    totalCrashes,
    crashRate: getCrashRate(totalFlights, totalCrashes),
    totalManeuvers,
    completedManeuvers: completedCount,
    completionRate:
      totalManeuvers > 0 ? (completedCount / totalManeuvers) * 100 : 0,
    loggedFlightEvents: sanitizeFlightEvents(flightEvents).length,
    loggedCrashEvents: sanitizeCrashEvents(crashEvents).length,
    loggedManeuverCompletionEvents: sanitizeManeuverCompletionEvents(
      maneuverCompletionEvents,
    ).length,
  };
};

const sanitizeHelicopters = (value) =>
  safeArray(value).map(sanitizeHelicopter).filter(Boolean);
const sanitizeFlightEvents = (value) =>
  sanitizeEventArray(value, sanitizeFlightEvent);
const sanitizeCrashEvents = (value) =>
  sanitizeEventArray(value, sanitizeCrashEvent);
const sanitizeManeuverCompletionEvents = (value) =>
  sanitizeEventArray(value, sanitizeManeuverCompletionEvent);

export {
  STORAGE_KEYS,
  buildCrashRateBreakdown,
  buildHelicopterTotals,
  buildManeuverCompletionLevelData,
  buildMonthlyCompletionSeries,
  buildMonthlyCumulativeSeries,
  buildMonthlyTotalSeries,
  buildRecentActivity,
  buildSummaryMetrics,
  clampNumber,
  createCrashEvent,
  createFlightEvent,
  createManeuverCompletionEvent,
  formatMonthYear,
  getCrashRate,
  getEventMonthRange,
  getMonthKey,
  getMonthStart,
  readStorageJson,
  sanitizeCompletedManeuvers,
  sanitizeCrashEvents,
  sanitizeFlightEvents,
  sanitizeHelicopters,
  sanitizeManeuverCompletionEvents,
  shiftMonth,
};
