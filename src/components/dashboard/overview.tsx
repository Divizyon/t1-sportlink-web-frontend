"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Demo verileri - son 12 ayın etkinlik sayıları
const data = [
  {
    name: "Oca",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Şub",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Nis",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Haz",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Tem",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Ağu",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Eyl",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Eki",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Kas",
    total: Math.floor(Math.random() * 40) + 15,
  },
  {
    name: "Ara",
    total: Math.floor(Math.random() * 40) + 15,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          formatter={(value) => [`${value} Etkinlik`, 'Toplam']}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "6px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Bar
          dataKey="total"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 