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

export default function BalanceForecast() {
  const transactions = useSelector((state) => state.transactions.transactions);

  const data = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );

    let running = 50000;

    const monthly = {};

    sorted.forEach((txn) => {
      const date = new Date(txn.timestamp);

      const month = date.toLocaleDateString("en-IN", {
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

    const futureMonths = ["Next 1", "Next 2", "Next 3"];

    futureMonths.forEach((label) => {
      lastBalance += growth;

      entries.push({
        month: label,
        balance: null,
        forecast: lastBalance,
      });
    });

    if (entries.length > 0) {
      entries[entries.length - 4].forecast =
        entries[entries.length - 4].balance;
    }

    return entries;
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
      <p className="text-sm font-semibold mb-4">Balance Forecast</p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />

            <Tooltip formatter={(value) => formatCurrency(value)} />

            <Line
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#22c55e"
              strokeWidth={3}
              strokeDasharray="6 6"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}