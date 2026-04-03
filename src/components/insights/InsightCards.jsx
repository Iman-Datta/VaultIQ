import { useSelector } from "react-redux";
import { selectInsights } from "../../store/selectors";
import { TrendingDown, TrendingUp, Target, Lightbulb } from "lucide-react";

export default function InsightCards() {
  const { topCategory, topPct, savingsRate, momChange, currExp } =
    useSelector(selectInsights);

  const cards = [
    {
      icon: TrendingDown,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      label: "Highest Spending",
      title: `${topCategory.name}: ₹${topCategory.value?.toFixed(0)}`,
      sub: `${topPct}% of total expenses`,
    },
    {
      icon: momChange >= 0 ? TrendingUp : TrendingDown,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      label: "vs Last Month",
      title: `Spending ${momChange >= 0 ? "up" : "down"} ${Math.abs(momChange)}%`,
      sub: `₹${currExp.toFixed(0)} spent this month`,
    },
    {
      icon: Target,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      label: "Savings Rate",
      title: `${savingsRate}%`,
      sub:
        savingsRate >= 20
          ? "Well above the 20% target"
          : "Below the 20% target",
    },
    { // hardcoded
      icon: Lightbulb,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      label: "Smart Tip",
      title: `Reduce dining out`,
      sub: `Food spending is 29% of expenses`,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={14} className="text-blue-400" />
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Financial Insights
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg p-3 flex items-start gap-3"
          >
            <div
              className={`w-7 h-7 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
            >
              <c.icon size={13} className={c.iconColor} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 mb-0.5">{c.label}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight truncate">
                {c.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                {c.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}