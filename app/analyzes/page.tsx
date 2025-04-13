"use client";

import dynamic from "next/dynamic";
import DashboardLayout from "@/components/templates/DashboardLayout";
import StatCard from "@/components/molecules/StatCard";

const AnalysisCharts = dynamic(
  () => import("@/components/organisms/AnalysisCharts"),
  {
    ssr: false,
  }
);

const AnalyzesPage = () => {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Analiz ve Raporlar</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <StatCard title="Aktif Kullanıcılar" value={453} icon="👤" />
          <StatCard title="Haftalık Etkinlikler" value={34} icon="📅" />
          <StatCard title="Yeni Kayıtlar" value={92} icon="🆕" />
        </div>
        <AnalysisCharts />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Özet Tablosu</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Başlık</th>
                <th className="py-2 px-4 border-b">Tarih</th>
                <th className="py-2 px-4 border-b">Tür</th>
                <th className="py-2 px-4 border-b">Katılım Sayısı</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Etkinlik A</td>
                <td className="py-2 px-4 border-b">2024-04-01</td>
                <td className="py-2 px-4 border-b">Spor</td>
                <td className="py-2 px-4 border-b">120</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Etkinlik B</td>
                <td className="py-2 px-4 border-b">2024-04-02</td>
                <td className="py-2 px-4 border-b">Eğitim</td>
                <td className="py-2 px-4 border-b">85</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Etkinlik C</td>
                <td className="py-2 px-4 border-b">2024-04-03</td>
                <td className="py-2 px-4 border-b">Kültür</td>
                <td className="py-2 px-4 border-b">60</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyzesPage;
