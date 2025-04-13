import React from "react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import SearchBar from "@/components/molecules/SearchBar";
import ReportTable from "@/components/organisms/ReportTable";

const ModerationPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Güvenlik ve Moderasyon</h1>
        <SearchBar />
        <ReportTable />
      </div>
    </DashboardLayout>
  );
};

export default ModerationPage;
