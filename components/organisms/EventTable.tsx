import React from "react";

const dummyEvents = [
  {
    name: "Tenis Turnuvası",
    organizer: "Konya Belediyesi",
    date: "2024-05-10",
    participants: 12,
    status: "Bekliyor",
  },
  {
    name: "Basketbol Maçı",
    organizer: "Spor Kulübü A",
    date: "2024-04-20",
    participants: 8,
    status: "Onaylı",
  },
  {
    name: "E-Spor Kupası",
    organizer: "Kullanıcı B",
    date: "2024-03-15",
    participants: 16,
    status: "Silinmiş",
  },
];

const EventTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
          <tr>
            <th className="py-2 px-4 border-b text-left">Etkinlik Adı</th>
            <th className="py-2 px-4 border-b text-left">Organizatör</th>
            <th className="py-2 px-4 border-b text-left">Tarih</th>
            <th className="py-2 px-4 border-b text-left">Katılımcı Sayısı</th>
            <th className="py-2 px-4 border-b text-left">Durum</th>
            <th className="py-2 px-4 border-b text-left">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {dummyEvents.map((event, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{event.name}</td>
              <td className="py-2 px-4 border-b">{event.organizer}</td>
              <td className="py-2 px-4 border-b">{event.date}</td>
              <td className="py-2 px-4 border-b">{event.participants}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    event.status === "Bekliyor"
                      ? "bg-yellow-100 text-yellow-800"
                      : event.status === "Onaylı"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {event.status === "Bekliyor"
                    ? "🟡"
                    : event.status === "Onaylı"
                    ? "✅"
                    : "🔴"}{" "}
                  {event.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                  Onayla
                </button>
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Düzenle
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

export default EventTable;
