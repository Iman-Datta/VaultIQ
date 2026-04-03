import { useMemo } from "react";
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

  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.amount < 0);
    const grouped = {};
    expenses.forEach((txn) => {
      const month = new Date(txn.timestamp).toLocaleDateString("en-IN", {
        month: "short",
      });
      grouped[month] = (grouped[month] || 0) + Math.abs(txn.amount);
    });
    const months = Object.entries(grouped);
    const avgBudget = months.reduce((sum, [, v]) => sum + v, 0) / months.length;
    return months.map(([month, spent]) => ({
      month,
      budget: +avgBudget.toFixed(0),
      actual: +spent.toFixed(0),
    }));
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Budget vs Actual
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Monthly spending against average budget
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 dark:bg-slate-500 inline-block" />
            <span className="text-gray-400">Budget</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
            <span className="text-gray-400">Actual</span>
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
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-800"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "currentColor", fontSize: 11 }}
              className="text-gray-400"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "currentColor", fontSize: 11 }}
              className="text-gray-400"
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
