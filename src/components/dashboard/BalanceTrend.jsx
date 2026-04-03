import { useMemo, useState, useRef, useEffect } from "react";
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

const ranges = ["7D", "30D", "3M", "6M", "1Y", "All"];

const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const formatXAxis = (date, range) => {
  const d = new Date(date);

  if (range === "1Y" || range === "All" || range === "6M") {
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
    "7D": 7,
    "30D": 30,
    "3M": 90,
    "6M": 180,
    "1Y": 365,
  };

  if (range === "All") return transactions;

  const days = daysMap[range];
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);

  return transactions.filter((t) => new Date(t.timestamp) >= cutoff);
};

const buildRunningBalance = (transactions, allTransactions) => {
  const sortedAll = [...allTransactions].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

  const sortedFiltered = [...transactions].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

  if (!sortedFiltered.length) return [];

  const firstFilteredDate = new Date(sortedFiltered[0].timestamp);

  let running = 50000;

  for (const t of sortedAll) {
    if (new Date(t.timestamp) < firstFilteredDate) {
      running += t.amount;
    }
  }

  return sortedFiltered.map((t) => {
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
  const [selectedRange, setSelectedRange] = useState("30D");
  const [zoomLevel, setZoomLevel] = useState(1);
  const chartRef = useRef(null);

  useEffect(() => {
    const chartElement = chartRef.current;

    if (!chartElement) return;

    const wheelHandler = (e) => {
      e.preventDefault();

      const delta = e.deltaY < 0 ? 1.2 : 0.8;

      setZoomLevel((prev) => {
        const next = prev * delta;
        return Math.max(0.5, Math.min(next, 5));
      });
    };

    chartElement.addEventListener("wheel", wheelHandler, {
      passive: false,
    });

    return () => {
      chartElement.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  const transactions = useSelector((state) => state.transactions.transactions);

  const chartData = useMemo(() => {
    const filtered = filterByRange(transactions, selectedRange);

    const fullData = buildRunningBalance(filtered, transactions);

    const visiblePoints = Math.max(10, Math.floor(fullData.length / zoomLevel));

    return fullData.slice(-visiblePoints);
  }, [transactions, selectedRange, zoomLevel]);

  const curveType = {
    "7D": "monotone",
    "30D": "monotone",
    "3M": "natural",
    "6M": "natural",
    "1Y": "natural",
    All: "natural",
  };

  const yDomain = useMemo(() => {
    if (!chartData.length) return ["auto", "auto"];

    const balances = chartData.map((d) => d.balance);

    const min = Math.min(...balances);
    const max = Math.max(...balances);

    const padding = (max - min) * 0.15 || 1000;

    return [min - padding, max + padding];
  }, [chartData]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Balance Trend
          </p>
          <p className="text-xs text-gray-500 mt-1">Use mouse wheel to zoom</p>
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
      <div
        ref={chartRef}
        className="w-full h-64 overflow-hidden"
        style={{ overscrollBehavior: "contain" }}
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();

          const delta = e.deltaY < 0 ? 1.2 : 0.8;

          setZoomLevel((prev) => {
            const next = prev * delta;
            return Math.max(0.5, Math.min(next, 5));
          });
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
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
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={yDomain}
              tickFormatter={(v) => formatCurrency(v)}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={90}
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
    </div>
  );
}
