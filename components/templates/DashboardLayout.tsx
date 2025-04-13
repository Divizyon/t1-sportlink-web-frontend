import React from "react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">SportLink Admin</h2>
          <nav className="mt-4">
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-700"
                >
                  📊 Panel
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="flex items-center gap-2 text-gray-700"
                >
                  🏃‍♂️ Etkinlikler
                </a>
              </li>
              <li>
                <a
                  href="/users"
                  className="flex items-center gap-2 text-gray-700"
                >
                  👤 Kullanıcılar
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  className="flex items-center gap-2 text-gray-700"
                >
                  📰 Haberler
                </a>
              </li>
              <li>
                <a
                  href="/reports"
                  className="flex items-center gap-2 text-gray-700"
                >
                  🛡️ Raporlar
                </a>
              </li>
              <li>
                <a
                  href="/analyzes"
                  className="flex items-center gap-2 text-gray-700"
                >
                  📈 Analizler
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Yeni Etkinlik Ekle
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded ml-2">
                Haber Yayınla
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
