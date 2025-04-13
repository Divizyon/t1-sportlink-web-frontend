import React from "react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import SearchBar from "@/components/molecules/SearchBar";
import NewsTable from "@/components/organisms/NewsTable";

const NewsManagementPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Spor Haberleri</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            + Yeni Haber Ekle
          </button>
        </div>
        <SearchBar />
        <NewsTable />
      </div>
    </DashboardLayout>
  );
};

export default NewsManagementPage;
