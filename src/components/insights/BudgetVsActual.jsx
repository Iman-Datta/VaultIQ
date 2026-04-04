import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const budget = payload.find((p) => p.dataKey === "budget")?.value || 0;
  const actual = payload.find((p) => p.dataKey === "actual")?.value || 0;
  const diff = actual - budget;
  const overBudget = diff > 0;

  return (
    <div className="bg-gray-900 border border-gray-700/60 rounded-xl px-4 py-3 shadow-xl shadow-black/30 text-xs backdrop-blur-sm min-w-40">
      <p className="text-gray-400 font-medium mb-2 tracking-wide uppercase text-[10px]">
        {label}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-slate-400 shrink-0" />
            <span className="text-gray-400">Budget</span>
          </div>
          <span className="text-white font-semibold">
            {formatCurrency(budget)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-blue-500 shrink-0" />
            <span className="text-gray-400">Actual</span>
          </div>
          <span className="text-white font-semibold">
            {formatCurrency(actual)}
          </span>
        </div>
        <div className="border-t border-gray-700/50 pt-1.5 flex items-center justify-between gap-6">
          <span className="text-gray-500">Diff</span>
          <span
            className={
              overBudget
                ? "text-red-400 font-semibold"
                : "text-emerald-400 font-semibold"
            }
          >
            {overBudget ? "+" : ""}
            {formatCurrency(diff)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function BudgetVsActual() {
  const transactions = useSelector((state) => state.transactions.transactions);
  const [monthOffset, setMonthOffset] = useState(0);
  const visibleMonths = 4;

  const fullData = useMemo(() => {
    const expenses = transactions.filter((t) => t.amount < 0);
    const grouped = {};

    expenses.forEach((txn) => {
      const date = new Date(txn.timestamp);

      if (isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!grouped[key]) {
        grouped[key] = {
          date,
          month: date.toLocaleDateString("en-IN", {
            month: "short",
            year: "2-digit",
          }),
          actual: 0,
        };
      }

      grouped[key].actual += Math.abs(txn.amount);
    });

    const months = Object.values(grouped).sort((a, b) => a.date - b.date);

    const avgBudget =
      months.reduce((sum, m) => sum + m.actual, 0) / months.length;

    return months.map((m) => ({
      ...m,
      budget: +avgBudget.toFixed(0),
    }));
  }, [transactions]);

  const data = useMemo(() => {
    const start = Math.max(0, fullData.length - visibleMonths - monthOffset);

    const end = fullData.length - monthOffset;

    return fullData.slice(start, end);
  }, [fullData, monthOffset]);

  const themeMode = useSelector((state) => state.theme.mode);
  const isDarkMode = themeMode === "dark";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        {/* Left Title */}
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Budget vs Actual
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Monthly spending against average budget
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 dark:bg-slate-500 inline-block" />
              <span className="text-gray-600 dark:text-gray-300">Budget</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
              <span className="text-gray-600 dark:text-gray-300">Actual</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMonthOffset((prev) => prev + visibleMonths)}
              disabled={monthOffset + visibleMonths >= fullData.length}
              className={`flex items-center justify-center h-9 w-9 rounded-xl border 
          border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 ${monthOffset + visibleMonths >= fullData.length ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md active:scale-95"}`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() =>
                setMonthOffset((prev) => Math.max(0, prev - visibleMonths))
              }
              disabled={monthOffset === 0}
              className={`flex items-center justify-center h-9 w-9 rounded-xl border  border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 ${monthOffset === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md active:scale-95"}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={4}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDarkMode ? "#374151" : "#e5e7eb"}
            />
            <XAxis
              dataKey="month"
              tick={{
                fill: isDarkMode ? "#f3f4f6" : "#4b5563",
                fontSize: 11,
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{
                fill: isDarkMode ? "#f3f4f6" : "#4b5563",
                fontSize: 11,
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "currentColor",
                className: "text-gray-100/60 dark:text-gray-800/60",
              }}
            />
            <Bar dataKey="budget" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((_, i) => (
                <Cell key={i} fill="#94a3b8" fillOpacity={0.5} />
              ))}
            </Bar>
            <Bar dataKey="actual" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.actual > entry.budget ? "#ef4444" : "#3b82f6"}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
