import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../../store/slices/roleSlice";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react";

import VaultLogo from "../VaultLogo";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/insights", label: "Analytics", icon: BarChart2 },
];

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const dispatch = useDispatch();
  const role = useSelector((s) => s.role.role);

  return (
    <aside
      className={`h-screen flex flex-col shrink-0 transition-all duration-300
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        ${isSidebarOpen ? "w-56" : "w-16"}
      `}
    >
      <div
        className={`border-b border-gray-200 dark:border-gray-800 ${
          isSidebarOpen
            ? "flex items-center justify-between px-4 py-4"
            : "flex flex-col items-center gap-3 px-2 py-3"
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3">
          <VaultLogo size={32} />

          {isSidebarOpen && (
            <h1 className="text-lg font-bold tracking-tight whitespace-nowrap">
              <span className="text-gray-900 dark:text-white">Vault</span>
              <span className="text-cyan-500 dark:text-cyan-400">IQ</span>
            </h1>
          )}
        </div>
      </div>

      {/* ── NAV LINKS ── */}
      <nav
        className={`flex-1 px-2 space-y-1 ${
          isSidebarOpen ? "py-4" : "pt-2 pb-4"
        }`}
      >
        {/* "Menu" label — only visible when sidebar is expanded */}
        {isSidebarOpen && (
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2 mb-3 uppercase tracking-wider">
            Menu
          </p>
        )}

        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                isActive
                  ? // Active state — works in both light and dark
                    "bg-gray-900 dark:bg-gray-700 text-white"
                  : // Inactive state
                    "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            <Icon size={16} className="shrink-0" />
            {/* Label only shown when sidebar is open */}
            {isSidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── BOTTOM SECTION: Role switcher + Settings + Help ── */}
      <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
        {/* Role switcher — only shown when sidebar is expanded */}
        {isSidebarOpen && (
          <div className="px-2 mb-3">
            <label className="text-xs font-medium text-gray-400 dark:text-gray-500 block mb-1.5 uppercase tracking-wider">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => dispatch(setRole(e.target.value))}
              className="
                w-full text-xs rounded-lg px-2 py-1.5
                bg-gray-100 dark:bg-gray-800
                text-gray-700 dark:text-gray-300
                border border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-1 focus:ring-cyan-500
                transition-colors
              "
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        {/* Settings link */}
        <NavLink
          to="/"
          className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-gray-800
            hover:text-gray-900 dark:hover:text-white
            transition-colors"
        >
          <Settings size={16} className="shrink-0" />
          {isSidebarOpen && <span>Settings</span>}
        </NavLink>

        {/* Help button — fires custom event to replay the guided tour */}
        <button
          onClick={() =>
            window.dispatchEvent(new CustomEvent("vaultiq:replay-tour"))
          }
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-gray-800
            hover:text-gray-900 dark:hover:text-white
            transition-colors"
        >
          <HelpCircle size={16} className="shrink-0" />
          {isSidebarOpen && <span>Help</span>}
        </button>
      </div>
    </aside>
  );
}
