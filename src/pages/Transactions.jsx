import Topbar from "../components/shared/Topbar";
import FilterBar from "../components/transactions/FilterBar";
import TransactionTable from "../components/transactions/TransactionTable";

export default function Transactions() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar title="Transactions" subtitle="All your income and expenses" />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-5 space-y-3">
        <FilterBar />
        <TransactionTable />
      </main>
    </div>
  );
}
