import React from "react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import UserTable from "@/components/organisms/UserTable";

const UserManagementPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Kullanıcı Yönetimi</h1>
        <SearchBar />
        <FilterBar />
        <UserTable />
      </div>
    </DashboardLayout>
  );
};

export default UserManagementPage;
