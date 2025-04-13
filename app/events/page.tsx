import React from "react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import EventTable from "@/components/organisms/EventTable";

const EventManagementPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Etkinlik Yönetimi</h1>
        <SearchBar />
        <FilterBar />
        <EventTable />
      </div>
    </DashboardLayout>
  );
};

export default EventManagementPage;
