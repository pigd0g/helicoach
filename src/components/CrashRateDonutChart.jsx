import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  crashes: "#dc2626",
  safeLandings: "#16a34a",
};

const renderTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-slate-800">{item.name}</p>
      <p className="text-slate-600">{item.value} events</p>
    </div>
  );
};

export default function CrashRateDonutChart({ entry, size = 220, subtitle }) {
  const crashes = Math.max(entry?.crashes || 0, 0);
  const safeLandings = Math.max(entry?.safeLandings || 0, 0);
  const totalFlights = Math.max(entry?.flights || 0, 0);
  const crashRate = Number(entry?.crashRate || 0);
  const data = [
    { name: "Safe flights", value: safeLandings, color: COLORS.safeLandings },
    { name: "Crashes", value: crashes, color: COLORS.crashes },
  ];
  const hasData = totalFlights > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            {entry?.title || "Crash Rate"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {subtitle || "Crashes as a percentage of recorded flights"}
          </p>
        </div>
        <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          {crashRate.toFixed(1)}%
        </div>
      </div>

      <div className="relative mt-4" style={{ height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="80%"
              paddingAngle={hasData ? 2 : 0}
              stroke="none"
            >
              {data.map((item) => (
                <Cell
                  key={item.name}
                  fill={item.color}
                  fillOpacity={hasData ? 1 : 0.2}
                />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">
            {crashRate.toFixed(1)}%
          </span>
          <span className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
            crash rate
          </span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <p className="text-slate-500">Flights</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {totalFlights}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <p className="text-slate-500">Crashes</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{crashes}</p>
        </div>
      </div>
    </div>
  );
}
