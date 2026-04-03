import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { selectSpendingByCategory } from "../../store/selectors";
import { formatCurrency } from "../../utils/formatCurrency";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{d.name}</p>
      <p className="text-white font-medium">{formatCurrency(d.value)}</p>
    </div>
  );
};

export default function SpendingDonut() {
  const data = useSelector(selectSpendingByCategory);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
        Spending by Category
      </p>
      <p className="text-xs text-gray-400 mb-4">Monthly breakdown</p>

      <div className="flex items-center gap-4">
        {/* Chart */}
        <div className="w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={60}
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 min-w-0">
          {data.map((d) => (
            <div
              key={d.name}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: d.fill }}
                />
                <span className="text-xs text-gray-400 truncate">{d.name}</span>
              </div>
              <span className="text-xs text-gray-300 shrink-0">
                {total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}