import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import {
  AudienceOverview,
  EarningsReport,
  PopularProducts,
  RevenueStatus,
  StatGrid,
} from "../components/AdminWidgets";

const AdminDashboard = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen w-full bg-(--bg-background) text-(--text-main)">
      <div className="w-full lg:flex">
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          collapsed={sidebarCollapsed}
        />

        <main className="flex-1 p-3 md:p-5 lg:p-6 space-y-3 md:space-y-4">
          <AdminTopbar
            onOpenSidebar={() => setMobileSidebarOpen(true)}
            onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
            isSidebarCollapsed={sidebarCollapsed}
          />
          <StatGrid />

          <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-3 md:gap-4">
            <RevenueStatus />
            <AudienceOverview />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-3 md:gap-4 pb-2">
            <EarningsReport />
            <PopularProducts />
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
