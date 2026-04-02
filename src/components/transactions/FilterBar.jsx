import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setTypeFilter,
  setSortField,
  setSortDir,
} from "../../store/slices/filterSlice";
import { Search } from "lucide-react";

export default function FilterBar() {
  const dispatch = useDispatch();
  const { searchQuery, typeFilter, sortField, sortDir } = useSelector(
    (s) => s.filter,
  );

  const handleSortField = (e) => {
    const val = e.target.value;
    // val is e.g. 'date_desc' or 'amount_asc'
    const [field, dir] = val.split("_");
    dispatch(setSortField(field));
    dispatch(setSortDir(dir));
  };

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

      {/* Sort */}
      <select
        value={`${sortField}_${sortDir}`}
        onChange={handleSortField}
        className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-900 dark:text-gray-300 focus:outline-none"
      >
        <option value="date_desc">Sort Date ↓</option>
        <option value="date_asc">Sort Date ↑</option>
        <option value="amount_desc">Sort Amount ↓</option>
        <option value="amount_asc">Sort Amount ↑</option>
      </select>
    </div>
  );
}