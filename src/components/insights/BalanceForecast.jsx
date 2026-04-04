import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const actual = payload.find((p) => p.dataKey === "balance");
  const forecast = payload.find((p) => p.dataKey === "forecast");
  const entry = actual || forecast;
  if (!entry || entry.value == null) return null;

  return (
    <div className="bg-gray-900 border border-gray-700/60 rounded-xl px-4 py-3 shadow-xl shadow-black/30 text-xs backdrop-blur-sm">
      <p className="text-gray-400 font-medium mb-2 tracking-wide uppercase text-[10px]">
        {label}
      </p>
      {actual?.value != null && (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <span className="text-gray-400">Balance</span>
          <span className="text-white font-semibold ml-auto pl-4">
            {formatCurrency(actual.value)}
          </span>
        </div>
      )}
      {forecast?.value != null && (
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-gray-400">Forecast</span>
          <span className="text-white font-semibold ml-auto pl-4">
            {formatCurrency(forecast.value)}
          </span>
        </div>
      )}
    </div>
  );
};

export default function BalanceForecast() {
  const transactions = useSelector((state) => state.transactions.transactions);

  const data = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
    let running = 50000;
    const monthly = {};
    sorted.forEach((txn) => {
      const month = new Date(txn.timestamp).toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      });
      running += txn.amount;
      monthly[month] = running;
    });
    const entries = Object.entries(monthly).map(([month, balance]) => ({
      month,
      balance,
      forecast: null,
    }));
    const lastTwo = entries.slice(-2);
    const growth =
      lastTwo.length === 2 ? lastTwo[1].balance - lastTwo[0].balance : 0;
    let lastBalance = entries[entries.length - 1]?.balance || 50000;
    ["Next 1", "Next 2", "Next 3"].forEach((label) => {
      lastBalance += growth;
      entries.push({ month: label, balance: null, forecast: lastBalance });
    });
    if (entries.length > 0) {
      entries[entries.length - 4].forecast =
        entries[entries.length - 4].balance;
    }
    return entries;
  }, [transactions]);

  const themeMode = useSelector((state) => state.theme.mode);
  const isDarkMode = themeMode === "dark";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Balance Forecast
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Projected trend for next 3 months
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" />
            <span className="text-gray-400">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 rounded-full inline-block border-dashed" />
            <span className="text-gray-400">Forecast</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="balanceGradForecast"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDarkMode ? "#374151" : "#d1d5db"}
            />
            <XAxis
              dataKey="month"
              tick={{
                fill: isDarkMode ? "#e5e7eb" : "#4b5563",
                fontSize: 11,
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{
                fill: isDarkMode ? "#e5e7eb" : "#4b5563",
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
                stroke: "#6b7280",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Line
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#3b82f6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#34d399"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#34d399",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
