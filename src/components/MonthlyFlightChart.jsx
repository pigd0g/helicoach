import React, { useMemo, useState } from "react";
import {
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
  buildMonthlyCumulativeSeries,
  formatMonthYear,
  getEventMonthRange,
  getMonthStart,
  shiftMonth,
} from "../statistics";
import ChartEmptyState from "./ChartEmptyState";

const COLORS = {
  flights: "#2563eb",
  crashes: "#dc2626",
};

const areSameMonth = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth();

const renderTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-xl">
      <p className="font-semibold text-slate-800">
        {point?.fullLabel || `Day ${label}`}
      </p>
      <div className="mt-2 space-y-1">
        <p className="text-blue-700">Flights: {point?.flights || 0}</p>
        <p className="text-red-600">Crashes: {point?.crashes || 0}</p>
        <p className="text-slate-500">
          Daily activity: {point?.dailyFlights || 0} flights,{" "}
          {point?.dailyCrashes || 0} crashes
        </p>
      </div>
    </div>
  );
};

export default function MonthlyFlightChart({
  title,
  description,
  flightEvents,
  crashEvents,
  helicopterId,
  emptyTitle,
  emptyMessage,
}) {
  const currentMonth = useMemo(() => getMonthStart(new Date()), []);
  const { earliestMonth, latestMonth } = useMemo(
    () =>
      getEventMonthRange(
        (flightEvents || []).filter(
          (event) => !helicopterId || event.helicopterId === helicopterId,
        ),
        (crashEvents || []).filter(
          (event) => !helicopterId || event.helicopterId === helicopterId,
        ),
      ),
    [crashEvents, flightEvents, helicopterId],
  );
  const [rawMonth, setRawMonth] = useState(() =>
    areSameMonth(latestMonth, currentMonth) || latestMonth < currentMonth
      ? latestMonth
      : currentMonth,
  );

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
      buildMonthlyCumulativeSeries({
        monthDate: selectedMonth,
        flightEvents,
        crashEvents,
        helicopterId,
      }),
    [crashEvents, flightEvents, helicopterId, selectedMonth],
  );

  const canGoBack = selectedMonth > earliestMonth;
  const canGoForward = selectedMonth < currentMonth;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
          <button
            type="button"
            onClick={() =>
              canGoBack && setRawMonth((month) => shiftMonth(month, -1))
            }
            disabled={!canGoBack}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
            aria-label="Previous month"
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
            aria-label="Next month"
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

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-700">
            Flights this month
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {monthData.totals.flights}
          </p>
        </div>
        <div className="rounded-xl bg-red-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-red-600">
            Crashes this month
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {monthData.totals.crashes}
          </p>
        </div>
      </div>

      <div className="mt-5 h-72">
        {monthData.hasEvents ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthData.series}
              margin={{ top: 8, right: 12, left: -16, bottom: 8 }}
            >
              <defs>
                <linearGradient id="flightFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.05} />
                </linearGradient>
              </defs>
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
              <Tooltip content={renderTooltip} />
              <Legend verticalAlign="top" height={24} iconType="circle" />
              <Line
                type="monotone"
                dataKey="flights"
                name="Flights"
                stroke={COLORS.flights}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="crashes"
                name="Crashes"
                stroke={COLORS.crashes}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmptyState
            title={emptyTitle || "No logged flights for this month"}
            message={
              emptyMessage ||
              "Use the +1 flight and crash actions to start building a monthly history."
            }
            compact
          />
        )}
      </div>
    </div>
  );
}
