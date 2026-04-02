import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/shared/Sidebar";


export default function App() {
  const mode = useSelector((s) => s.theme.mode);

  // Apply dark class to <html> so Tailwind dark: variants work
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex-1 min-w-0 overflow-hidden">
          <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */}
            {/* <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
