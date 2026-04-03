import { useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { selectSpendingByCategory } from "../../store/selectors";
import { formatCurrency } from "../../utils/formatCurrency";

function CenterLabel({ total, active }) {
  const label = active ? active.name : "Total Spent";
  const amount = active ? active.value : total;
  const percentage =
    active && total > 0 ? ((active.value / total) * 100).toFixed(1) : null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2 text-center">
      <span
        className={`text-xs font-semibold uppercase tracking-wide truncate max-w-24 ${
          active ? "" : "text-slate-500 dark:text-slate-400"
        }`}
        style={active ? { color: active.fill } : {}}
      >
        {label}
      </span>

      <span
        className={`text-xs font-bold font-mono truncate max-w-24 ${
          active ? "" : "text-slate-900 dark:text-slate-100"
        }`}
        style={active ? { color: active.fill } : {}}
      >
        {formatCurrency(amount)}
      </span>

      {percentage && (
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {percentage}%
        </span>
      )}
    </div>
  );
}

export default function SpendingDonut() {
  const data = useSelector(selectSpendingByCategory);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const [activeEntry, setActiveEntry] = useState(null);

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-300">
      {/* Header */}
      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
        Spending by Category
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
        All-time breakdown
      </p>

      <div className="flex items-center gap-5 flex-wrap">
        {/* Donut Chart */}
        <div className="relative w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={62}
                dataKey="value"
                paddingAngle={2}
                strokeWidth={0}
                onMouseEnter={(_, i) => setActiveEntry(data[i])}
                onMouseLeave={() => setActiveEntry(null)}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.fill}
                    opacity={
                      activeEntry && activeEntry.name !== entry.name ? 0.35 : 1
                    }
                    className="cursor-pointer transition-all duration-200"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <CenterLabel total={total} active={activeEntry} />
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-44 flex flex-col gap-3">
          {data.map((d) => {
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(0) : 0;
            const isActive = activeEntry?.name === d.name;

            return (
              <div
                key={d.name}
                onMouseEnter={() => setActiveEntry(d)}
                onMouseLeave={() => setActiveEntry(null)}
                className={`flex items-center justify-between gap-2 transition-all duration-200 ${
                  activeEntry && !isActive ? "opacity-40" : "opacity-100"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: d.fill,
                      boxShadow: isActive ? `0 0 6px ${d.fill}` : "none",
                    }}
                  />

                  <span
                    className={`text-xs truncate ${
                      isActive
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {d.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-12 h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: d.fill,
                      }}
                    />
                  </div>

                  <span
                    className="text-xs font-mono min-w-7 text-right"
                    style={{
                      color: isActive ? d.fill : "rgb(148 163 184)",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}