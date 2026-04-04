import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { deleteTransaction } from "../../store/slices/transactionSlice";

import { selectFilteredTransactions } from "../../store/selectors";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import { CATEGORY_COLORS } from "../../data/mockData";
import { exportAsCSV, exportAsJSON } from "../../utils/exportTransactions";

import RoleGuard from "../shared/RoleGuard";
import TransactionModal from "./TransactionModal";
import { Pencil, Trash2, Plus } from "lucide-react";

const PAGE_SIZE = 12;

export default function TransactionTable() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectFilteredTransactions);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paged = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditing(null);
    setModal(true);
  };
  const openEdit = (txn) => {
    setEditing(txn);
    setModal(true);
  };
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?"))
      dispatch(deleteTransaction(id));
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        {/* Table header row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Transactions
            </p>
            <p className="text-xs text-gray-400">
              {transactions.length} records
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => exportAsCSV(transactions)}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800"
              >
                CSV
              </button>

              <button
                onClick={() => exportAsJSON(transactions)}
                className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800"
              >
                JSON
              </button>
            </div>
          </div>
          <RoleGuard>
            <button
              onClick={openAdd}
              className="group inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110">
                <Plus size={12} />
              </span>
              <span className="tracking-wide">Add</span>
            </button>
          </RoleGuard>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {[
                  "timestamp",
                  "Description",
                  "Category",
                  "Amount",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-gray-400 font-medium px-4 py-2.5"
                  >
                    {h}
                  </th>
                ))}
                <RoleGuard>
                  <th className="text-left text-xs text-gray-400 font-medium px-4 py-2.5">
                    Actions
                  </th>
                </RoleGuard>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gray-400 text-sm py-10"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
              {paged.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(txn.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                    {txn.description}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background:
                          (CATEGORY_COLORS[txn.category] || "#6b7280") + "22",
                        color: CATEGORY_COLORS[txn.category] || "#6b7280",
                      }}
                    >
                      {txn.category}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${txn.type === "income" ? "text-green-400" : "text-red-400"}`}
                  >
                    {txn.type === "income" ? "+" : ""}
                    {formatCurrency(txn.amount, false)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
                      Completed
                    </span>
                  </td>
                  <RoleGuard>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(txn)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(txn.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </RoleGuard>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <TransactionModal
        open={modal}
        onClose={() => setModal(false)}
        existing={editing}
      />
    </>
  );
}
