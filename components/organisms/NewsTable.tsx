import React from "react";
import FilterBar from "@/components/molecules/FilterBar";

const dummyNews = [
  {
    title: "Koşu Etkinliği",
    source: "sporhaber.com",
    type: "scraped",
    date: "2024-04-12",
  },
  {
    title: "Basketbol Finali",
    source: "fanatik.com",
    type: "manual",
    date: "2024-04-10",
  },
  {
    title: "E-spor Zirvesi",
    source: "esportsdaily.io",
    type: "scraped",
    date: "2024-04-05",
  },
];

const NewsTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <FilterBar />
      <table className="min-w-full bg-white mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Başlık</th>
            <th className="py-2 px-4 border-b">Kaynak</th>
            <th className="py-2 px-4 border-b">Kaynak Türü</th>
            <th className="py-2 px-4 border-b">Tarih</th>
            <th className="py-2 px-4 border-b">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {dummyNews.map((news, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{news.title}</td>
              <td className="py-2 px-4 border-b">{news.source}</td>
              <td className="py-2 px-4 border-b">
                {news.type === "scraped" ? "🤖" : "✍️"}
              </td>
              <td className="py-2 px-4 border-b">{news.date}</td>
              <td className="py-2 px-4 border-b">
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

export default NewsTable;
