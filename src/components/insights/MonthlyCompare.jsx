import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { selectMonthlyComparison } from "../../store/selectors";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const income = payload.find((p) => p.dataKey === "income")?.value || 0;
  const expenses = payload.find((p) => p.dataKey === "expenses")?.value || 0;
  const balance = payload.find((p) => p.dataKey === "balance")?.value || 0;
  const net = income - expenses;

  return (
    <div className="bg-gray-900 border border-gray-700/60 rounded-xl px-4 py-3 shadow-xl shadow-black/30 text-xs backdrop-blur-sm min-w-44">
      <p className="text-gray-400 font-medium mb-2 tracking-wide uppercase text-[10px]">
        {label}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-emerald-500 shrink-0" />
            <span className="text-gray-400">Income</span>
          </div>
          <span className="text-emerald-400 font-semibold">
            ₹{income.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-red-500 shrink-0" />
            <span className="text-gray-400">Expenses</span>
          </div>
          <span className="text-red-400 font-semibold">
            ₹{expenses.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="border-t border-gray-700/50 pt-1.5 flex items-center justify-between gap-6">
          <span className="text-gray-500">Net</span>
          <span
            className={
              net >= 0
                ? "text-emerald-300 font-semibold"
                : "text-red-300 font-semibold"
            }
          >
            {net >= 0 ? "+" : ""}₹{net.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span className="text-gray-400">Balance</span>
          </div>
          <span className="text-blue-400 font-semibold">
            ₹{balance.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

const LegendFormatter = (value) => (
  <span className="text-gray-400 text-[11px] capitalize">{value}</span>
);

export default function MonthlyCompare() {
  const data = useSelector(selectMonthlyComparison);
  const sortedData = [...data].sort((a, b) =>
    a.dateKey.localeCompare(b.dateKey),
  );

  const themeMode = useSelector((state) => state.theme.mode);
  const isDarkMode = themeMode === "dark";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Monthly Comparison
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Income vs expenses with running balance
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={sortedData}
          barSize={12}
          margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDarkMode ? "#374151" : "#e5e7eb"}
          />
          <XAxis
            dataKey="label"
            tick={{
              fill: isDarkMode ? "#e5e7eb" : "#4b5563",
              fontSize: 11,
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="left"
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            tick={{
              fill: isDarkMode ? "#e5e7eb" : "#4b5563",
              fontSize: 11,
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            width={44}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            tick={{
              fill: isDarkMode ? "#e5e7eb" : "#4b5563",
              fontSize: 11,
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            width={44}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "currentColor",
              className: "text-gray-100/50 dark:text-gray-800/50",
            }}
          />

          <Legend
            formatter={LegendFormatter}
            iconType="square"
            iconSize={8}
            wrapperStyle={{ paddingTop: 12 }}
          />

          <Bar
            yAxisId="left"
            dataKey="income"
            fill="#22c55e"
            fillOpacity={0.85}
            radius={[3, 3, 0, 0]}
            name="income"
          />
          <Bar
            yAxisId="left"
            dataKey="expenses"
            fill="#ef4444"
            fillOpacity={0.85}
            radius={[3, 3, 0, 0]}
            name="expenses"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3, fill: "#3b82f6", stroke: "#fff", strokeWidth: 1.5 }}
            activeDot={{
              r: 5,
              fill: "#3b82f6",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            name="balance"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
