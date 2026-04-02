import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../../store/slices/roleSlice";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/insights", label: "Analytics", icon: BarChart2 },
  { to: "/cards", label: "Cards", icon: CreditCard },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const role = useSelector((s) => s.role.role);

  return (
    <aside className="w-16 md:w-56 h-screen bg-gray-900 flex flex-col shrink-0 border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-800">
        <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">V</span>
        </div>
        <span className="hidden md:block text-white font-semibold text-sm">
          VaultIQ
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <p className="hidden md:block text-gray-500 text-xs px-2 mb-2">Menu</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => {
              // isActive is coming from NavLink
              if (isActive) {
                return "flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors bg-gray-700 text-white";
              } else {
                return "flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors text-gray-400 hover:text-white hover:bg-gray-800";
              }
            }}
          >
            <Icon size={16} className="shrink-0" />
            <span className="hidden md:block">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Role switcher */}
      <div className="px-2 py-4 border-t border-gray-800 space-y-1">
        <div className="hidden md:block px-2 mb-3">
          <label className="text-gray-500 text-xs block mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => dispatch(setRole(e.target.value))}
            className="w-full bg-gray-800 text-gray-300 text-xs rounded px-2 py-1 border border-gray-700 focus:outline-none"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <NavLink
          to="/"
          className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Settings size={16} />
          <span className="hidden md:block">Settings</span>
        </NavLink>
        <NavLink
          to="/"
          className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <HelpCircle size={16} />
          <span className="hidden md:block">Help</span>
        </NavLink>
      </div>
    </aside>
  );
}
