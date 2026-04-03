import Topbar from "../components/shared/Topbar";
import InsightCards from "../components/insights/InsightCards";
import MonthlyCompare from "../components/insights/MonthlyCompare";
import SpendingDonut from "../components/dashboard/SpendingDonut";
import BalanceForecast from "../components/insights/BalanceForecast";
import BudgetVsActual from "../components/insights/BudgetVsActual";

export default function Insights() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar title="Analytics" subtitle="Spending patterns and savings" />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-5 space-y-4">
        <InsightCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MonthlyCompare />
          </div>
          <SpendingDonut />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BudgetVsActual />
          <BalanceForecast />
        </div>
      </main>
    </div>
  );
}
