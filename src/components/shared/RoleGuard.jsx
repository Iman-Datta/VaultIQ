import { useSelector } from "react-redux";

export default function RoleGuard({ children, fallback = null }) {
  const role = useSelector((s) => s.role.role);
  return role === "admin" ? children : fallback;
}
