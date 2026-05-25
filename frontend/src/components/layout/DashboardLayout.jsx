import { useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

export default function DashboardLayout({
  children,
  user,
  activeView,
  onNavigate,
  analysisMeta,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavigate={onNavigate}
      />
      <div className="dashboard-main">
        <TopHeader
          onMenuToggle={() => setSidebarOpen(true)}
          user={user}
          analysisMeta={analysisMeta}
        />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
