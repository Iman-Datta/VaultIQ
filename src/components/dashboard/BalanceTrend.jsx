import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ranges = ["Today", "7D", "30D", "3M", "1Y", "All"];

const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const formatXAxis = (date, range) => {
  const d = new Date(date);

  if (range === "Today") {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (range === "1Y" || range === "All") {
    return d.toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
  }

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const filterByRange = (transactions, range) => {
  const now = new Date();
  const daysMap = {
    Today: 1,
    "7D": 7,
    "30D": 30,
    "3M": 90,
    "1Y": 365,
  };

  if (range === "All") return transactions;

  const days = daysMap[range];
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);

  return transactions.filter((t) => new Date(t.timestamp) >= cutoff);
};

const buildRunningBalance = (transactions) => {
  const openingBalance = 50000;
  let running = openingBalance;

  return [...transactions]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((t) => {
      running += t.amount;

      return {
        timestamp: t.timestamp,
        balance: running,
      };
    });
};

const CustomTooltip = ({ active, payload, label, range }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-400 mb-1">{formatXAxis(label, range)}</p>
      <p className="text-sm text-white font-semibold">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

export default function BalanceTrend() {
  const [selectedRange, setSelectedRange] = useState("7D");

  const transactions = useSelector((state) => state.transactions.transactions);

  const chartData = useMemo(() => {
    const filtered = filterByRange(transactions, selectedRange);

    return buildRunningBalance(filtered);
  }, [transactions, selectedRange]);

  const curveType = {
    Today: "linear",
    "7D": "monotone",
    "30D": "monotone",
    "3M": "natural",
    "1Y": "natural",
    All: "natural",
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Balance Trend
          </p>
          <p className="text-xs text-gray-400">Running account balance</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedRange === range
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#374151"
          />

          <XAxis
            dataKey="timestamp"
            tickFormatter={(v) => formatXAxis(v, selectedRange)}
            tick={{
              fill: "#6b7280",
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            tick={{
              fill: "#6b7280",
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
            width={80}
          />

          <Tooltip content={<CustomTooltip range={selectedRange} />} />

          <Area
            type={curveType[selectedRange]}
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#balanceGrad)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#3b82f6",
            }}
            animationDuration={400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
