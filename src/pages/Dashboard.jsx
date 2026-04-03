import SummaryCards from "../components/dashboard/SummaryCards";
import BalanceTrend from "../components/dashboard/BalanceTrend";
import SpendingDonut from "../components/dashboard/SpendingDonut";
import InsightCards from "../components/insights/InsightCards";
import FilterBar from "../components/transactions/FilterBar";
import TransactionTable from "../components/transactions/TransactionTable";
import Topbar from "../components/shared/Topbar";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar title="Dashboard" subtitle="Welcome back, Iman" />
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-5 space-y-4">
        <SummaryCards />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <BalanceTrend />
          </div>
          {/* <SpendingDonut /> */}
        </div>

        {/* <InsightCards /> */}

        {/* Mini transactions on dashboard */}
        <div>
          <FilterBar />
          <div className="mt-3">
            <TransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
}
