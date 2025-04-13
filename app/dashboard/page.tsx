import React from "react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import StatCard from "@/components/molecules/StatCard";
import TrendChart from "@/components/organisms/TrendChart";
import RecentEventList from "@/components/organisms/RecentEventList";

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard title="Total Users" value={2134} />
        <StatCard title="Total Events" value={1024} />
        <StatCard title="Today's Participation" value={453} />
      </div>
      <div className="mb-4">
        <TrendChart />
      </div>
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg shadow bg-white p-4 hover:shadow-lg">
            📂 Kullanıcıları Yönet
          </div>
          <div className="rounded-lg shadow bg-white p-4 hover:shadow-lg">
            📅 Haftalık Raporları Gör
          </div>
        </div>
      </section>
      <h2 className="text-xl font-semibold mt-8 mb-4">Son Etkinlikler</h2>
      <RecentEventList />
    </DashboardLayout>
  );
};

export default DashboardPage;
