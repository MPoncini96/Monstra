"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function BotPage({ params }: { params: { bot: string } }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startMonth, setStartMonth] = useState("01");
  const [startDay, setStartDay] = useState("01");
  const [startYear, setStartYear] = useState("2026");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().slice(0, 10);
        const startDate = `${startYear}-${startMonth}-${startDay}`;

        const response = await fetch(
          `/api/bots/${params.bot}/equity?start=${startDate}&end=${today}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const details = errorData.details || errorData.error || `HTTP ${response.status}`;
          throw new Error(details);
        }

        const equityData = await response.json();

        if (!Array.isArray(equityData)) {
          throw new Error("Invalid response format: expected an array");
        }

        if (equityData.length === 0) {
          setData([]);
          setError(null);
          return;
        }

        // Transform data to include formatted dates and calculated metrics
        const transformedData = equityData.map(
          (item: { d: string; equity: number }, index: number) => {
            const dailyReturn =
              index > 0
                ? parseFloat(
                    (
                      ((item.equity - equityData[index - 1].equity) /
                        equityData[index - 1].equity) *
                      100
                    ).toFixed(2)
                  )
                : 0;

            return {
              ...item,
              date: new Date(item.d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              dailyReturn,
            };
          }
        );

        setData(transformedData);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred fetching data";
        console.error("Bot data fetch error:", errorMessage);
        setError(errorMessage);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.bot, startMonth, startDay, startYear]);

  if (loading) {
    return (
      <div className="p-10">
        <div className="text-center text-gray-500">Loading bot data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-10">
        <div className="text-center text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold capitalize">{params.bot} Performance</h1>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl p-6 shadow-md flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Month
          </label>
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-[#f5c77a] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const month = String(i + 1).padStart(2, "0");
              return (
                <option key={month} value={month} className="bg-gray-800 text-[#f5c77a]">
                  {new Date(2026, i).toLocaleString("en-US", { month: "long" })}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day
          </label>
          <select
            value={startDay}
            onChange={(e) => setStartDay(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-[#f5c77a] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 31 }, (_, i) => {
              const day = String(i + 1).padStart(2, "0");
              return (
                <option key={day} value={day} className="bg-gray-800 text-[#f5c77a]">
                  {day}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-[#f5c77a] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2025" className="bg-gray-800 text-[#f5c77a]">2025</option>
            <option value="2026" className="bg-gray-800 text-[#f5c77a]">2026</option>
          </select>
        </div>
      </div>

      {/* Equity Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Equity Curve</h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") {
                    return value.toFixed(4);
                  }
                  return value;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
                name="Equity"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Returns Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daily Returns (%)</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number" || typeof value === "string") {
                    return `${value}%`;
                  }
                  return value;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="dailyReturn"
                stroke="#10b981"
                dot={false}
                strokeWidth={2}
                name="Daily Return"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
