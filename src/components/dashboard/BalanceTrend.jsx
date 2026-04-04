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
import { ChevronLeft, ChevronRight } from "lucide-react";

const ranges = ["7D", "30D", "3M", "6M", "1Y", "All"];

const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const formatXAxis = (date, range) => {
  const d = new Date(date);

  if (range === "7D") {
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  if (range === "30D") {
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  if (range === "3M" || range === "6M" || range === "1Y" || range === "All") {
    return d.toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
  }

  return "";
};

const filterByRange = (transactions, range, offset = 0) => {
  const daysMap = {
    "7D": 7,
    "30D": 30,
    "3M": 90,
    "6M": 180,
    "1Y": 365,
  };

  if (range === "All") return transactions;

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

  const latestDate = new Date(sorted[sorted.length - 1].timestamp);

  const days = daysMap[range];

  const windowEnd = new Date(latestDate);
  windowEnd.setDate(windowEnd.getDate() - offset * days);

  const cutoff = new Date(windowEnd);
  cutoff.setDate(windowEnd.getDate() - days);

  return sorted.filter((t) => {
    const date = new Date(t.timestamp);
    return date >= cutoff && date <= windowEnd;
  });
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

  const dailyMap = new Map();

  for (const t of sortedFiltered) {
    const dateObj = new Date(t.timestamp);

    if (isNaN(dateObj.getTime())) continue;

    const dateKey = dateObj.toLocaleDateString("en-CA");

    running += t.amount;

    dailyMap.set(dateKey, {
      timestamp: dateKey,
      balance: running,
    });
  }

  return Array.from(dailyMap.values());
};

const CustomTooltip = ({ active, payload, range }) => {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-400 mb-1">
        {formatXAxis(point.timestamp, range)}
      </p>
      <p className="text-sm text-white font-semibold">
        {formatCurrency(point.balance)}
      </p>
    </div>
  );
};

export default function BalanceTrend() {
  const [selectedRange, setSelectedRange] = useState("30D");
  const [windowOffset, setWindowOffset] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const chartRef = useRef(null);

  const transactions = useSelector((state) => state.transactions.transactions);

  const chartData = useMemo(() => {
    const filtered = filterByRange(transactions, selectedRange, windowOffset);

    const fullData = buildRunningBalance(filtered, transactions);

    const step = Math.max(1, Math.floor(zoomLevel));

    return fullData.filter((_, index) => index % step === 0);
  }, [transactions, selectedRange, windowOffset, zoomLevel]);

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

  const isRightDisabled = windowOffset === 0;

  const nextWindowData =
    selectedRange === "All"
      ? []
      : filterByRange(transactions, selectedRange, windowOffset + 1);

  const isLeftDisabled = selectedRange === "All" || nextWindowData.length === 0;

  const xTicks = useMemo(() => {
    if (!chartData.length) return [];

    if (selectedRange === "7D") {
      return chartData.map((d) => d.timestamp);
    }

    if (selectedRange === "30D") {
      return [
        chartData[0]?.timestamp,
        chartData[Math.floor(chartData.length * 0.25)]?.timestamp,
        chartData[Math.floor(chartData.length * 0.5)]?.timestamp,
        chartData[Math.floor(chartData.length * 0.75)]?.timestamp,
        chartData[chartData.length - 1]?.timestamp,
      ].filter(Boolean);
    }

    if (selectedRange === "3M") {
      const seenMonths = new Set();

      return chartData
        .filter((d) => {
          const dateObj = new Date(d.timestamp);
          const key = `${dateObj.getFullYear()}-${dateObj.getMonth()}`;

          if (seenMonths.has(key)) return false;

          seenMonths.add(key);
          return true;
        })
        .map((d) => d.timestamp);
    }

    if (selectedRange === "6M") {
      const seenMonths = new Set();

      return chartData
        .filter((d) => {
          const monthKey = new Date(d.timestamp).getMonth();

          if (seenMonths.has(monthKey)) return false;

          seenMonths.add(monthKey);
          return true;
        })
        .map((d) => d.timestamp);
    }

    if (selectedRange === "1Y" || selectedRange === "All") {
      const seenMonths = new Set();

      return chartData
        .filter((d) => {
          const dateObj = new Date(d.timestamp);
          const month = dateObj.getMonth();
          const year = dateObj.getFullYear();

          const key = `${year}-${month}`;

          if (seenMonths.has(key)) return false;

          seenMonths.add(key);
          return true;
        })
        .map((d) => d.timestamp);
    }

    return [];
  }, [chartData, selectedRange]);

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
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Balance Trend
          </p>
          <p className="text-xs text-gray-500 mt-1">Use mouse wheel to zoom</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => {
                  setSelectedRange(range);
                  setWindowOffset(0);
                }}
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWindowOffset((prev) => prev + 1)}
              disabled={isLeftDisabled}
              className={`flex items-center justify-center h-9 w-9 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 ${isLeftDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md active:scale-95"}`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => setWindowOffset((prev) => Math.max(0, prev - 1))}
              disabled={isRightDisabled}
              className={`flex items-center justify-center h-9 w-9 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-70 dark:text-gray-200 shadow-sm transition-all duration-200 ${isRightDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md active:scale-95"} `}
            >
              <ChevronRight size={18} />
            </button>
          </div>
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
          <AreaChart data={chartData} syncMethod="value">
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={selectedRange !== "7D"}
              stroke="#374151"
            />

            <XAxis
              dataKey="timestamp"
              ticks={xTicks}
              tickFormatter={(v) => formatXAxis(v, selectedRange)}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              angle={-30}
              textAnchor="end"
            />

            <YAxis
              domain={yDomain}
              tickFormatter={(v) => formatCurrency(v)}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />

            <Tooltip
              content={<CustomTooltip range={selectedRange} />}
              cursor={{ stroke: "#9ca3af", strokeWidth: 1 }}
              trigger="axis"
              isAnimationActive={false}
            />
            <Area
              type={curveType[selectedRange]}
              isAnimationActive={false}
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#balanceGrad)"
              dot={
                selectedRange === "7D"
                  ? {
                      r: 4,
                      fill: "#3b82f6",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }
                  : false
              }
              activeDot={{
                r: 6,
                fill: "#3b82f6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              animationDuration={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
