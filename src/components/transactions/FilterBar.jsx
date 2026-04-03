import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setTypeFilter,
  setSortField,
  setSortDir,
} from "../../store/slices/filterSlice";
import { Search, ArrowUp, ArrowDown } from "lucide-react";

export default function FilterBar() {
  const dispatch = useDispatch();
  const { searchQuery, typeFilter, sortField, sortDir } = useSelector(
    (s) => s.filter,
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Type filter */}
      <select
        value={typeFilter}
        onChange={(e) => dispatch(setTypeFilter(e.target.value))}
        className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-900 dark:text-gray-300 focus:outline-none"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Sort Field */}
      <select
        value={sortField}
        onChange={(e) => dispatch(setSortField(e.target.value))}
        className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-900 dark:text-gray-300 focus:outline-none"
      >
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
      </select>

      {/* Sort Direction Button */}
      <button
        onClick={() => dispatch(setSortDir(sortDir === "asc" ? "desc" : "asc"))}
        className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {sortDir === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      </button>
    </div>
  );
}