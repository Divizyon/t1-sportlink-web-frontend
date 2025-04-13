import React from "react";

const dummyReports = [
  {
    user: "Ayşe Demir",
    reason: "Spam",
    source: "Kullanıcı",
    date: "2024-04-12",
    status: "Açık",
  },
  {
    user: "Mehmet Yılmaz",
    reason: "Taciz",
    source: "Sistem",
    date: "2024-04-10",
    status: "Çözüldü",
  },
  {
    user: "Ali Koç",
    reason: "Uygunsuz içerik",
    source: "Kullanıcı",
    date: "2024-04-08",
    status: "Açık",
  },
];

const ReportTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Kullanıcı</th>
            <th className="py-2 px-4 border-b">Sebep</th>
            <th className="py-2 px-4 border-b">Rapor Kaynağı</th>
            <th className="py-2 px-4 border-b">Tarih</th>
            <th className="py-2 px-4 border-b">Durum</th>
            <th className="py-2 px-4 border-b">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {dummyReports.map((report, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{report.user}</td>
              <td className="py-2 px-4 border-b">{report.reason}</td>
              <td className="py-2 px-4 border-b">{report.source}</td>
              <td className="py-2 px-4 border-b">{report.date}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    report.status === "Açık"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {report.status === "Açık" ? "🟡" : "✅"} {report.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  İncele
                </button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Engelle
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
