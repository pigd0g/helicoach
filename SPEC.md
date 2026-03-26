# Training Session Planner — Specification

## 1. Feature Overview

A native 3-battery training session planner replaces the clipboard AI-prompt workflow. It analyses the pilot's completion history to generate a personalised warm-up / new skill / cool-down structure, presented as interactive battery cards with YouTube links, checkboxes, and session timing. Confetti fires on session completion.

---

## 2. Data Model

### Storage

**Key:** `sessionHistory` (localStorage)

**Shape:**
```ts
type SessionHistory = SessionRecord[];

type SessionRecord = {
  id: string;               // UUID
  startedAt: string;       // ISO timestamp
  completedAt: string;     // ISO timestamp
  durationSeconds: number; // elapsed session time
  batteries: [
    { label: "Warm-up",     maneuvers: ManeuverRecord[] },
    { label: "New Skill",   maneuvers: ManeuverRecord[] },
    { label: "Cool-down",   maneuvers: ManeuverRecord[] },
  ];
};

type ManeuverRecord = {
  id: string;          // e.g. "1.1"
  title: string;
  url: string;
  completed: boolean;
  skipped: boolean;
};
```

### Session State (in-memory, not persisted until completion)

```ts
type Session = {
  batteries: [
    { label, maneuvers: [{ id, title, url, completed, skipped }] }
  ]
};
```

---

## 3. Session Generation Algorithm — `buildTrainingSession`

```
Input: completedManeuvers, levels, maneuverCompletionEvents

1. EDGE LEVEL
   - Walk levels in ascending id order
   - Find highest level where ≥1 maneuver is completed AND <all maneuvers completed
   - If no such level found → edgeLevel = null

2. WARM-UP (2–3 maneuvers)
   - Take all maneuverCompletionEvents sorted newest-first
   - Deduplicate by maneuverId (keep first/most-recent)
   - Take up to 3 from any level
   - If < 2 found → pad with random Level-1 maneuvers

3. NEW SKILL (1–2 maneuvers)
   - If edgeLevel exists → pick uncompleted maneuvers from edgeLevel (random)
   - If no edgeLevel → pick 1–2 random Level-1 uncompleted maneuvers

4. COOL-DOWN (1–2 maneuvers)
   - Pick 1–2 random Level-1 maneuvers (completed or not, prefer incomplete)

5. FALLBACK (no completion history at all)
   - All three batteries draw from Level-1 maneuvers

Output:
{
  batteries: [
    { label: "Warm-up",     maneuvers: [...] },
    { label: "New Skill",   maneuvers: [...] },
    { label: "Cool-down",   maneuvers: [...] },
  ]
}
```

---

## 4. Component Inventory

### `SessionPlannerView` (new)
- Full-page view at `/session`
- Shows page title + elapsed session timer (setInterval, formatted MM:SS)
- Renders 3 × `SessionBatteryCard`
- "Generate New Session" button → re-runs generator, resets timer
- "Plan Session" nav button on HomeView links here
- Shows `ConfettiCelebration` when all 3 batteries complete
- Receives: `completedManeuvers`, `maneuverCompletionEvents`, `levels`, `sessionHistory`, `setSessionHistory`, `onSessionComplete`

### `SessionBatteryCard` (new)
- Props: `battery`, `onComplete`, `onSkip`, `onToggle`
- Battery label (badge coloured: blue=warm-up, purple=new-skill, green=cool-down)
- List of maneuver items:
  - Checkbox (completed)
  - Title text
  - External YouTube link icon (opens in new tab)
  - Skip button (skips this maneuver)
- "Complete Battery" button — disabled after completion
- Completed state: card opacity reduced, checkmark overlay

---

## 5. Routing Changes

- Add `parts[0] === "session"` branch in the `useMemo` that parses `location.pathname` in `App.jsx`
- `view === "session"` renders `<SessionPlannerView … />`
- SessionPlannerView receives its own `navigate` / `goBack` for back navigation

---

## 6. Design Conventions

- Tailwind utility classes throughout (mobile-first)
- Battery badges: `bg-blue-100 text-blue-700` (warm-up), `bg-purple-100 text-purple-700` (new-skill), `bg-green-100 text-green-700` (cool-down)
- Completed battery card: `opacity-50`, `bg-slate-50`
- Session timer: monospace font, right-aligned in the page header area
- YouTube icon: inline SVG `▶` with `target="_blank" rel="noopener noreferrer"`
- Skip button: small `text-slate-400 hover:text-slate-600` text button
- "Complete Battery" button: full-width, `bg-blue-600 hover:bg-blue-700` when active, `bg-slate-200 text-slate-400` when disabled
- "Generate New Session" button: outlined style, `border-blue-600 text-blue-600`
- "Plan Session" button in HomeView: `bg-blue-600` matching other quick-action buttons

---

## 7. Persistence

- `sessionHistory` array is persisted to localStorage via `useEffect` in App.jsx, keyed by `STORAGE_KEYS.sessionHistory`
- Only completed sessions are persisted (on "Complete Battery" for the last battery, the full session is saved)
