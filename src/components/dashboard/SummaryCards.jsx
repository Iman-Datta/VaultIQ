import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { useSelector } from "react-redux";
import { selectTotals } from "../../store/selectors";

const cards = [
  {
    key: "totalBalance",
    label: "Total Balance",
    icon: Wallet,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    change: "+10.5%",
    up: true,
  },
  {
    key: "totalIncome",
    label: "Total Income",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-500/10",
    change: "+3.2%",
    up: true,
  },
  {
    key: "totalExpenses",
    label: "Total Expenses",
    icon: TrendingDown,
    color: "text-red-400",
    bg: "bg-red-500/10",
    change: "-3.8%",
    up: false,
  },
  {
    key: "netSavings",
    label: "Net Savings",
    icon: PiggyBank,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    change: "+0.5%",
    up: true,
  },
];

export default function SummaryCards() {
  const totals = useSelector(selectTotals);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, bg, change, up }) => (
        <div
          key={key}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <div
              className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}
            >
              <Icon size={15} className={color} />
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(totals[key])}
          </p>
          <p
            className={`text-xs mt-1 ${up ? "text-green-400" : "text-red-400"}`}
          >
            {change} <span className="text-gray-400">vs last month</span>
          </p>
        </div>
      ))}
    </div>
  );
}