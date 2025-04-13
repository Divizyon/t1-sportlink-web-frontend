import React from "react";

const dummyUsers = [
  {
    name: "Mehmet Yılmaz",
    events: 5,
    participatedEvents: 4,
    lastActive: "2023-10-10",
    status: "Aktif",
  },
  {
    name: "Ayşe Demir",
    events: 3,
    participatedEvents: 7,
    lastActive: "2023-09-25",
    status: "Uyarı Almış",
  },
  {
    name: "Ali Koç",
    events: 0,
    participatedEvents: 2,
    lastActive: "2023-08-01",
    status: "Engelli",
  },
];

const UserTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
          <tr>
            <th className="py-2 px-4 border-b text-left">Ad</th>
            <th className="py-2 px-4 border-b text-left">Etkinlik Sayısı</th>
            <th className="py-2 px-4 border-b text-left">
              Katıldığı Etkinlik Sayısı
            </th>
            <th className="py-2 px-4 border-b text-left">Son Aktivite</th>
            <th className="py-2 px-4 border-b text-left">Durum</th>
            <th className="py-2 px-4 border-b text-left">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {dummyUsers.map((user, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.events}</td>
              <td className="py-2 px-4 border-b">{user.participatedEvents}</td>
              <td className="py-2 px-4 border-b">{user.lastActive}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    user.status === "Aktif"
                      ? "bg-green-100 text-green-800"
                      : user.status === "Uyarı Almış"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Uyarı Gönder
                </button>
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Düzenle
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
                  Engelle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
