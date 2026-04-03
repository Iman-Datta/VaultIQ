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
} from "recharts";

const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

export default function BudgetVsActual() {
  const transactions = useSelector((state) => state.transactions.transactions);

  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.amount < 0);

    const grouped = {};

    expenses.forEach((txn) => {
      const date = new Date(txn.timestamp);
      const month = date.toLocaleDateString("en-IN", {
        month: "short",
      });

      grouped[month] = (grouped[month] || 0) + Math.abs(txn.amount);
    });

    const months = Object.entries(grouped);

    const avgBudget =
      months.reduce((sum, [, value]) => sum + value, 0) / months.length;

    return months.map(([month, spent]) => ({
      month,
      budget: avgBudget.toFixed(0),
      actual: spent.toFixed(0),
    }));
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
      <p className="text-sm font-semibold mb-4">Budget vs Actual</p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />

            <Tooltip formatter={(value) => formatCurrency(value)} />

            <Bar dataKey="budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
