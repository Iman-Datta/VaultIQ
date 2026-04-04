import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setTypeFilter,
  setStartDate,
  setEndDate,
} from "../../store/slices/filterSlice";
import { Search, CalendarDays, X } from "lucide-react";

export default function FilterBar() {
  const dispatch = useDispatch();
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { searchQuery, typeFilter, startDate, endDate } = useSelector(
    (s) => s.filter,
  );

  // close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDateDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearDates = () => {
    dispatch(setStartDate(""));
    dispatch(setEndDate(""));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 relative">
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

      {/* Type Filter */}
      <select
        value={typeFilter}
        onChange={(e) => dispatch(setTypeFilter(e.target.value))}
        className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-900 dark:text-gray-300 focus:outline-none"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Date Filter Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDateDropdown(!showDateDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <CalendarDays size={16} />
          Date
        </button>

        {/* Dropdown */}
        {showDateDropdown && (
          <div className="absolute right-0 mt-2 w-72 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50">
            <div className="space-y-3">
              {/* Start Date */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => dispatch(setStartDate(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => dispatch(setEndDate(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm"
                />
              </div>

              {/* Clear Button */}
              <button
                onClick={clearDates}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition"
              >
                <X size={14} />
                Clear Dates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}