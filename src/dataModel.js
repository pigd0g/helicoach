export const DATA_VERSION = 2;

export const STORAGE_KEYS = {
  completedManeuvers: "completedManeuvers",
  helicopters: "helicopters",
  flightSessions: "flightSessions",
  maneuverProgress: "maneuverProgress",
};

export const SESSION_MODES = ["real", "sim"];
export const OVERALL_OUTCOME_OPTIONS = ["great", "solid", "mixed", "rough"];
export const MANEUVER_RESULT_OPTIONS = ["clean", "inconsistent", "needs-work"];
export const PROFICIENCY_STATUSES = [
  "not_started",
  "working",
  "consistent_sim",
  "consistent_real",
  "competition_ready",
];
export const CONSISTENCY_OPTIONS = [
  "unknown",
  "emerging",
  "repeatable",
  "reliable",
];
export const READINESS_OPTIONS = [
  "not_started",
  "working",
  "consistent",
  "ready",
];

const DEFAULT_SESSION_MODE = "real";
const DEFAULT_OVERALL_OUTCOME = "solid";
const DEFAULT_MANEUVER_RESULT = "inconsistent";
const DEFAULT_PROFICIENCY_STATUS = "not_started";
const DEFAULT_CONSISTENCY = "unknown";
const DEFAULT_READINESS = "not_started";

const parseStoredJson = (rawValue, fallbackValue) => {
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
};

const toNonNegativeNumber = (value, fallbackValue = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallbackValue;
  }
  return parsed;
};

const toBoundedInteger = (value, fallbackValue, minimum, maximum) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallbackValue;
  }

  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
};

const toDateInputValue = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  return date.toISOString().split("T")[0];
};

const toIsoTimestamp = (value, fallbackValue = new Date().toISOString()) => {
  if (typeof value !== "string") {
    return fallbackValue;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallbackValue;
  }

  return date.toISOString();
};

const toOptionalString = (value) =>
  typeof value === "string" ? value.trim() : "";

const toOptionalPhoto = (value) =>
  typeof value === "string" && value ? value : null;

export const createEntityId = (prefix = "item") => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const normalizeCompletedManeuvers = (rawValue, validManeuverIds) => {
  if (!rawValue || typeof rawValue !== "object") {
    return {};
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(rawValue)) {
    if (validManeuverIds.has(String(key)) && value === true) {
      sanitized[String(key)] = true;
    }
  }

  return sanitized;
};

export const normalizeHelicopter = (rawValue) => {
  if (!rawValue || typeof rawValue !== "object") {
    return null;
  }

  const title = toOptionalString(rawValue.title);
  const id = toOptionalString(rawValue.id);

  if (!id || !title) {
    return null;
  }

  return {
    id,
    title,
    photo: toOptionalPhoto(rawValue.photo),
    flights: toNonNegativeNumber(rawValue.flights, 0),
    avgFlightTime: toNonNegativeNumber(rawValue.avgFlightTime, 0),
    crashes: toNonNegativeNumber(rawValue.crashes, 0),
    lastPreflightDate:
      typeof rawValue.lastPreflightDate === "string" &&
      rawValue.lastPreflightDate
        ? rawValue.lastPreflightDate
        : null,
    createdAt: toIsoTimestamp(rawValue.createdAt),
  };
};

export const normalizeHelicopters = (rawValue) => {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue.map(normalizeHelicopter).filter(Boolean);
};

export const normalizeFlightSession = (rawValue, validManeuverIds) => {
  if (!rawValue || typeof rawValue !== "object") {
    return null;
  }

  const id = toOptionalString(rawValue.id);
  if (!id) {
    return null;
  }

  const rawResults =
    rawValue.maneuverResults && typeof rawValue.maneuverResults === "object"
      ? rawValue.maneuverResults
      : {};
  const maneuverResults = {};

  for (const [maneuverId, result] of Object.entries(rawResults)) {
    if (!validManeuverIds.has(String(maneuverId))) {
      continue;
    }

    maneuverResults[String(maneuverId)] = MANEUVER_RESULT_OPTIONS.includes(
      result,
    )
      ? result
      : DEFAULT_MANEUVER_RESULT;
  }

  const mode = SESSION_MODES.includes(rawValue.mode)
    ? rawValue.mode
    : DEFAULT_SESSION_MODE;
  const overallOutcome = OVERALL_OUTCOME_OPTIONS.includes(
    rawValue.overallOutcome,
  )
    ? rawValue.overallOutcome
    : DEFAULT_OVERALL_OUTCOME;

  return {
    id,
    date: toDateInputValue(rawValue.date),
    helicopterId: toOptionalString(rawValue.helicopterId),
    mode,
    location: toOptionalString(rawValue.location),
    conditions: toOptionalString(rawValue.conditions),
    wind: toOptionalString(rawValue.wind),
    packCount: toNonNegativeNumber(rawValue.packCount, 0),
    totalFlightMinutes: toNonNegativeNumber(rawValue.totalFlightMinutes, 0),
    overallOutcome,
    notes: toOptionalString(rawValue.notes),
    maneuverResults,
    createdAt: toIsoTimestamp(rawValue.createdAt),
    updatedAt: toIsoTimestamp(rawValue.updatedAt || rawValue.createdAt),
  };
};

export const normalizeFlightSessions = (rawValue, validManeuverIds) => {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue
    .map((session) => normalizeFlightSession(session, validManeuverIds))
    .filter(Boolean);
};

export const normalizeManeuverProgressEntry = (rawValue) => {
  if (!rawValue || typeof rawValue !== "object") {
    return null;
  }

  return {
    status: PROFICIENCY_STATUSES.includes(rawValue.status)
      ? rawValue.status
      : DEFAULT_PROFICIENCY_STATUS,
    confidence: toBoundedInteger(rawValue.confidence, 0, 0, 5),
    consistency: CONSISTENCY_OPTIONS.includes(rawValue.consistency)
      ? rawValue.consistency
      : DEFAULT_CONSISTENCY,
    simStatus: READINESS_OPTIONS.includes(rawValue.simStatus)
      ? rawValue.simStatus
      : DEFAULT_READINESS,
    realStatus: READINESS_OPTIONS.includes(rawValue.realStatus)
      ? rawValue.realStatus
      : DEFAULT_READINESS,
    notes: toOptionalString(rawValue.notes),
    updatedAt: toIsoTimestamp(rawValue.updatedAt),
  };
};

export const normalizeManeuverProgress = (rawValue, validManeuverIds) => {
  if (!rawValue || typeof rawValue !== "object" || Array.isArray(rawValue)) {
    return {};
  }

  const normalized = {};

  for (const [maneuverId, progressEntry] of Object.entries(rawValue)) {
    const normalizedId = String(maneuverId);
    if (!validManeuverIds.has(normalizedId)) {
      continue;
    }

    const normalizedEntry = normalizeManeuverProgressEntry(progressEntry);
    if (normalizedEntry) {
      normalized[normalizedId] = normalizedEntry;
    }
  }

  return normalized;
};

export const loadStoredAppData = (allLevels) => {
  const validManeuverIds = new Set(
    allLevels.flatMap((level) =>
      level.maneuvers.map((maneuver) => String(maneuver.id)),
    ),
  );

  return {
    completedManeuvers: normalizeCompletedManeuvers(
      parseStoredJson(
        localStorage.getItem(STORAGE_KEYS.completedManeuvers),
        {},
      ),
      validManeuverIds,
    ),
    helicopters: normalizeHelicopters(
      parseStoredJson(localStorage.getItem(STORAGE_KEYS.helicopters), []),
    ),
    flightSessions: normalizeFlightSessions(
      parseStoredJson(localStorage.getItem(STORAGE_KEYS.flightSessions), []),
      validManeuverIds,
    ),
    maneuverProgress: normalizeManeuverProgress(
      parseStoredJson(localStorage.getItem(STORAGE_KEYS.maneuverProgress), {}),
      validManeuverIds,
    ),
  };
};

export const buildExportData = ({
  completedManeuvers,
  helicopters,
  flightSessions,
  maneuverProgress,
  validManeuverIds,
}) => ({
  completedManeuvers: normalizeCompletedManeuvers(
    completedManeuvers,
    validManeuverIds,
  ),
  helicopters: normalizeHelicopters(helicopters),
  flightSessions: normalizeFlightSessions(flightSessions, validManeuverIds),
  maneuverProgress: normalizeManeuverProgress(
    maneuverProgress,
    validManeuverIds,
  ),
  exportedAt: new Date().toISOString(),
  version: DATA_VERSION,
});

export const normalizeImportData = (rawValue, allLevels) => {
  const validManeuverIds = new Set(
    allLevels.flatMap((level) =>
      level.maneuvers.map((maneuver) => String(maneuver.id)),
    ),
  );

  const completedManeuvers = normalizeCompletedManeuvers(
    rawValue?.completedManeuvers,
    validManeuverIds,
  );
  const helicopters = normalizeHelicopters(rawValue?.helicopters);
  const flightSessions = normalizeFlightSessions(
    rawValue?.flightSessions,
    validManeuverIds,
  );
  const maneuverProgress = normalizeManeuverProgress(
    rawValue?.maneuverProgress,
    validManeuverIds,
  );

  const hasValidData =
    Object.keys(completedManeuvers).length > 0 ||
    helicopters.length > 0 ||
    Object.keys(maneuverProgress).length > 0 ||
    Array.isArray(rawValue?.flightSessions) ||
    Array.isArray(rawValue?.helicopters) ||
    (rawValue?.completedManeuvers &&
      typeof rawValue.completedManeuvers === "object");

  return {
    completedManeuvers,
    helicopters,
    flightSessions,
    maneuverProgress,
    hasValidData,
  };
};
