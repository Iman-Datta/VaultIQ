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
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs space-y-1">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }}>
          {p.name}: ₹{p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function MonthlyCompare() {
  const data = useSelector(selectMonthlyComparison);

  const sortedData = [...data].sort((a, b) =>
    a.dateKey.localeCompare(b.dateKey),
  );

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
        Monthly Comparison
      </p>
      <p className="text-xs text-gray-400 mb-4">
        Income vs expenses over 6 months
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={sortedData}
          barSize={14}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2937"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            width={40}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontSize: "11px",
              color: "#9ca3af",
              paddingTop: "8px",
            }}
            formatter={(v) => <span style={{ color: "#9ca3af" }}>{v}</span>}
          />
          <Bar
            yAxisId="left"
            dataKey="income"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            name="income"
          />
          <Bar
            yAxisId="left"
            dataKey="expenses"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            name="expenses"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="balance"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
