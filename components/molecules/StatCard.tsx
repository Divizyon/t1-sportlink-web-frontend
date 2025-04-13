import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center">
      <span className="text-2xl mr-2">{icon}</span>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
