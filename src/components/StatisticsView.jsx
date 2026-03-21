import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  buildCrashRateBreakdown,
  buildHelicopterTotals,
  buildManeuverCompletionLevelData,
  buildMonthlyCompletionSeries,
  buildMonthlyTotalSeries,
  buildRecentActivity,
  buildSummaryMetrics,
  formatMonthYear,
  getEventMonthRange,
  getMonthStart,
  shiftMonth,
} from "../statistics";
import ChartEmptyState from "./ChartEmptyState";
import CrashRateDonutChart from "./CrashRateDonutChart";
import MonthlyFlightChart from "./MonthlyFlightChart";

function StatCard({ label, value, detail, tone = "slate" }) {
  const toneClass = {
    slate: "bg-white",
    blue: "bg-blue-50",
    green: "bg-green-50",
    red: "bg-red-50",
  }[tone];

  return (
    <div
      className={`rounded-2xl border border-slate-200 ${toneClass} p-5 shadow-sm`}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function MonthlyCompletionChart({ maneuverCompletionEvents }) {
  const currentMonth = useMemo(() => getMonthStart(new Date()), []);
  const { earliestMonth } = useMemo(
    () => getEventMonthRange(maneuverCompletionEvents),
    [maneuverCompletionEvents],
  );
  const [rawMonth, setRawMonth] = useState(currentMonth);
  const selectedMonth = useMemo(() => {
    if (rawMonth < earliestMonth) {
      return earliestMonth;
    }
    if (rawMonth > currentMonth) {
      return currentMonth;
    }
    return rawMonth;
  }, [currentMonth, earliestMonth, rawMonth]);

  const monthData = useMemo(
    () =>
      buildMonthlyCompletionSeries({
        monthDate: selectedMonth,
        maneuverCompletionEvents,
      }),
    [maneuverCompletionEvents, selectedMonth],
  );

  const canGoBack = selectedMonth > earliestMonth;
  const canGoForward = selectedMonth < currentMonth;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Maneuver completions by month
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Cumulative completion history for the selected month.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
          <button
            type="button"
            onClick={() =>
              canGoBack && setRawMonth((month) => shiftMonth(month, -1))
            }
            disabled={!canGoBack}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span className="min-w-28 text-center text-sm font-semibold text-slate-700">
            {formatMonthYear(selectedMonth)}
          </span>
          <button
            type="button"
            onClick={() =>
              canGoForward && setRawMonth((month) => shiftMonth(month, 1))
            }
            disabled={!canGoForward}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-green-50 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.2em] text-green-700">
          Completions this month
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {monthData.totals.completions}
        </p>
      </div>

      <div className="mt-5 h-72">
        {monthData.hasEvents ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthData.series}
              margin={{ top: 8, right: 12, left: -16, bottom: 8 }}
            >
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                minTickGap={10}
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={34}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }
                  const point = payload[0]?.payload;
                  return (
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-xl">
                      <p className="font-semibold text-slate-800">
                        Day {label}
                      </p>
                      <p className="mt-2 text-green-700">
                        Completions: {point?.completions || 0}
                      </p>
                      <p className="text-slate-500">
                        Daily additions: {point?.dailyCompletions || 0}
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="completions"
                name="Completions"
                stroke="#16a34a"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmptyState
            title="No maneuver completions logged this month"
            message="Completion history starts when you mark maneuvers complete from the detail or level views."
            compact
          />
        )}
      </div>
    </div>
  );
}

export default function StatisticsView({
  levels,
  completedManeuvers,
  helicopters,
  flightEvents,
  crashEvents,
  maneuverCompletionEvents,
  onHelicopterSelect,
}) {
  const summary = useMemo(
    () =>
      buildSummaryMetrics({
        helicopters,
        completedManeuvers,
        levels,
        flightEvents,
        crashEvents,
        maneuverCompletionEvents,
      }),
    [
      crashEvents,
      completedManeuvers,
      flightEvents,
      helicopters,
      levels,
      maneuverCompletionEvents,
    ],
  );
  const crashRateBreakdown = useMemo(
    () => buildCrashRateBreakdown(helicopters),
    [helicopters],
  );
  const helicopterTotals = useMemo(
    () => buildHelicopterTotals(helicopters),
    [helicopters],
  );
  const levelProgress = useMemo(
    () => buildManeuverCompletionLevelData(levels, completedManeuvers),
    [completedManeuvers, levels],
  );
  const monthlyFlights = useMemo(
    () => buildMonthlyTotalSeries(flightEvents),
    [flightEvents],
  );
  const monthlyCrashes = useMemo(
    () => buildMonthlyTotalSeries(crashEvents),
    [crashEvents],
  );
  const monthlyCompletions = useMemo(
    () => buildMonthlyTotalSeries(maneuverCompletionEvents),
    [maneuverCompletionEvents],
  );
  const helicopterMap = useMemo(
    () => new Map(helicopters.map((helicopter) => [helicopter.id, helicopter])),
    [helicopters],
  );
  const maneuverMap = useMemo(
    () =>
      new Map(
        levels.flatMap((level) =>
          level.maneuvers.map((maneuver) => [maneuver.id, maneuver]),
        ),
      ),
    [levels],
  );
  const recentActivity = useMemo(
    () =>
      buildRecentActivity({
        flightEvents,
        crashEvents,
        maneuverCompletionEvents,
        helicoptersById: helicopterMap,
        maneuversById: maneuverMap,
      }),
    [
      crashEvents,
      flightEvents,
      helicopterMap,
      maneuverCompletionEvents,
      maneuverMap,
    ],
  );

  const monthlyTotalsSeries = useMemo(() => {
    const monthKeys = new Set([
      ...monthlyFlights.map((entry) => entry.monthKey),
      ...monthlyCrashes.map((entry) => entry.monthKey),
      ...monthlyCompletions.map((entry) => entry.monthKey),
    ]);

    return Array.from(monthKeys)
      .sort((left, right) => left.localeCompare(right))
      .map((monthKey) => ({
        monthKey,
        monthLabel:
          monthlyFlights.find((entry) => entry.monthKey === monthKey)
            ?.monthLabel ||
          monthlyCrashes.find((entry) => entry.monthKey === monthKey)
            ?.monthLabel ||
          monthlyCompletions.find((entry) => entry.monthKey === monthKey)
            ?.monthLabel ||
          monthKey,
        flights:
          monthlyFlights.find((entry) => entry.monthKey === monthKey)?.total ||
          0,
        crashes:
          monthlyCrashes.find((entry) => entry.monthKey === monthKey)?.total ||
          0,
        completions:
          monthlyCompletions.find((entry) => entry.monthKey === monthKey)
            ?.total || 0,
      }));
  }, [monthlyCompletions, monthlyCrashes, monthlyFlights]);

  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-blue-200">
          Statistics
        </p>
        <h1 className="mt-3 text-3xl font-bold">Flight and training trends</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Review helicopter usage, crash ratios, and maneuver completion
          activity across your entire training log.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Helicopters"
          value={summary.totalHelicopters}
          detail="Aircraft currently tracked in flight records"
        />
        <StatCard
          label="Total Flights"
          value={summary.totalFlights}
          detail={`${summary.loggedFlightEvents} timestamped flight events captured`}
          tone="blue"
        />
        <StatCard
          label="Crash Rate"
          value={`${summary.crashRate.toFixed(1)}%`}
          detail={`${summary.totalCrashes} crashes across all helicopters`}
          tone="red"
        />
        <StatCard
          label="Maneuver Progress"
          value={`${summary.completedManeuvers}/${summary.totalManeuvers}`}
          detail={`${summary.completionRate.toFixed(1)}% of the full syllabus completed`}
          tone="green"
        />
      </div>

      <MonthlyFlightChart
        title="Fleet activity timeline"
        description="Daily cumulative activity for flights and crashes across every helicopter in the selected month."
        flightEvents={flightEvents}
        crashEvents={crashEvents}
        emptyTitle="No fleet activity logged yet"
        emptyMessage="Use the +1 buttons on the home page or helicopter detail screens to start tracking monthly activity."
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <MonthlyCompletionChart
          maneuverCompletionEvents={maneuverCompletionEvents}
        />
        <CrashRateDonutChart entry={crashRateBreakdown.overall} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Monthly totals"
          description="Compare month-by-month totals for flights, crashes, and maneuver completions."
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-80">
            {monthlyTotalsSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyTotalsSeries}
                  margin={{ top: 8, right: 8, left: -8, bottom: 8 }}
                >
                  <CartesianGrid
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={34}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) {
                        return null;
                      }
                      const point = payload[0]?.payload;
                      return (
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-xl">
                          <p className="font-semibold text-slate-800">
                            {label}
                          </p>
                          <p className="mt-2 text-blue-700">
                            Flights: {point?.flights || 0}
                          </p>
                          <p className="text-red-600">
                            Crashes: {point?.crashes || 0}
                          </p>
                          <p className="text-green-700">
                            Completions: {point?.completions || 0}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Legend iconType="circle" />
                  <Bar
                    dataKey="flights"
                    name="Flights"
                    fill="#2563eb"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="crashes"
                    name="Crashes"
                    fill="#dc2626"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="completions"
                    name="Completions"
                    fill="#16a34a"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmptyState
                title="No monthly totals yet"
                message="As flights, crashes, and completions are logged, the monthly totals view will populate automatically."
                compact
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <SectionHeader
            title="Helicopter comparisons"
            description="Compare total flights and crashes for each helicopter. Tap a helicopter card to open its detail page."
          />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-80">
              {helicopterTotals.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={helicopterTotals}
                    margin={{ top: 8, right: 8, left: -8, bottom: 8 }}
                  >
                    <CartesianGrid
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="title"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      angle={-18}
                      textAnchor="end"
                      height={56}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={34}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) {
                          return null;
                        }
                        const point = payload[0]?.payload;
                        return (
                          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-xl">
                            <p className="font-semibold text-slate-800">
                              {label}
                            </p>
                            <p className="mt-2 text-blue-700">
                              Flights: {point?.flights || 0}
                            </p>
                            <p className="text-red-600">
                              Crashes: {point?.crashes || 0}
                            </p>
                            <p className="text-slate-500">
                              Average flight time:{" "}
                              {(point?.avgFlightTime || 0).toFixed(1)} min
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Legend iconType="circle" />
                    <Bar
                      dataKey="flights"
                      name="Flights"
                      fill="#2563eb"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="crashes"
                      name="Crashes"
                      fill="#dc2626"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartEmptyState
                  title="No helicopters to compare"
                  message="Add helicopters in Flight Records to unlock usage comparisons and crash-rate charts."
                  compact
                />
              )}
            </div>
          </div>

          {helicopterTotals.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {crashRateBreakdown.perHelicopter.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    const helicopter = helicopterMap.get(entry.id);
                    if (helicopter) {
                      onHelicopterSelect(helicopter);
                    }
                  }}
                  className="text-left cursor-pointer"
                >
                  <CrashRateDonutChart
                    entry={entry}
                    size={180}
                    subtitle="Open the helicopter detail page for its monthly history"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Level progress"
            description="Current completion status for every training level in the syllabus."
          />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              {levelProgress.map((level) => (
                <div key={level.id}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {level.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {level.completed}/{level.total} maneuvers completed
                      </p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {level.percentage}%
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${level.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SectionHeader
            title="Recent activity"
            description="Latest timestamped events recorded across flights, crashes, and maneuver completions."
          />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {recentActivity.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                            item.type === "flight"
                              ? "text-blue-700"
                              : item.type === "crash"
                                ? "text-red-600"
                                : "text-green-700"
                          }`}
                        >
                          {item.type}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.occurredDateLabel}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.occurredTimeLabel}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ChartEmptyState
                title="No recent activity yet"
                message="As you log flights and complete maneuvers, your latest activity will appear here."
                compact
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
