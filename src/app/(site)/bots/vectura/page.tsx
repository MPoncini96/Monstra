"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, initialEquity }: any) => {
  if (active && payload && payload.length && initialEquity) {
    const currentEquity = payload[0].value;
    const date = payload[0].payload.d;
    const returnPct = ((currentEquity - initialEquity) / initialEquity) * 100;
    const sign = returnPct >= 0 ? "+" : "";
    const color = returnPct >= 0 ? "#22c55e" : "#ef4444";

    return (
      <div
        style={{
          backgroundColor: "#0b0614",
          border: "1px solid #b56cff",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        <p
          style={{
            color: "#d6c4ff",
            margin: 0,
            marginBottom: "4px",
            fontSize: "12px",
          }}
        >
          {date}
        </p>
        <p style={{ color, margin: 0, fontWeight: "bold" }}>
          {sign}
          {returnPct.toFixed(4)}%
        </p>
      </div>
    );
  }
  return null;
};

const formatHoldings = (holdings: Record<string, number> | string | null | undefined) => {
  if (!holdings) return "—";
  let parsed: Record<string, number>;

  if (typeof holdings === "string") {
    try {
      parsed = JSON.parse(holdings) as Record<string, number>;
    } catch {
      return "—";
    }
  } else {
    parsed = holdings;
  }

  const entries = Object.entries(parsed)
    .filter(([key, value]) => key !== "_meta" && typeof value === "number")
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

  if (entries.length === 0) return "—";
  return entries
    .map(([ticker, weight]) => `${ticker} ${(weight * 100).toFixed(2)}%`)
    .join(", ");
};

export default function VecturaPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Set default to 30 days ago
  const getDefaultDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return {
      month: String(date.getMonth() + 1).padStart(2, "0"),
      day: String(date.getDate()).padStart(2, "0"),
      year: String(date.getFullYear())
    };
  };
  
  const defaultDate = getDefaultDate();
  const [startMonth, setStartMonth] = useState(defaultDate.month);
  const [startDay, setStartDay] = useState(defaultDate.day);
  const [startYear, setStartYear] = useState(defaultDate.year);
  const [initialEquity, setInitialEquity] = useState<number | null>(null);
  const [logRowCount, setLogRowCount] = useState<number>(25);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5;
  }, []);

  const setDateRange = (days: number | "ytd") => {
    const today = new Date();
    let startDate: Date;

    if (days === "ytd") {
      startDate = new Date(today.getFullYear(), 0, 1);
    } else {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - days);
    }

    setStartYear(String(startDate.getFullYear()));
    setStartMonth(String(startDate.getMonth() + 1).padStart(2, "0"));
    setStartDay(String(startDate.getDate()).padStart(2, "0"));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().slice(0, 10);
        const startDate = `${startYear}-${startMonth}-${startDay}`;

        const response = await fetch(
          `/api/bots/vectura/equity?start=${startDate}&end=${today}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP ${response.status}: Failed to fetch bot data`
          );
        }

        const equityData = await response.json();

        if (!Array.isArray(equityData)) {
          throw new Error("Invalid response format: expected an array");
        }

        // Transform data to ensure proper format for Recharts
        const transformedData = equityData.map(
          (item: { d: string; equity: number; holdings?: Record<string, number> | null }, index: number) => {
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
              originalDate: item.d,
              d: new Date(item.d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              dailyReturn,
            };
          }
        );

        setData(transformedData);
        setInitialEquity(transformedData.length > 0 ? equityData[0].equity : null);
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
  }, [startMonth, startDay, startYear]);

  let logRows = [...data];

  // Always sort newest first and take first 25
  logRows = logRows
    .sort(
      (a, b) => (b.originalDate ?? "").localeCompare(a.originalDate ?? "")
    )
    .slice(0, 25);

  return (
    <>
    <section suppressHydrationWarning className="py-20">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-7.5 items-stretch">
          {/* Left Box */}
          <div className="h-full">
            <div className="box-hover relative overflow-hidden rounded-3xl px-6 py-12 lg:px-8 lg:py-16 h-full flex flex-col justify-between">
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <span className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2">
                  <Image src="/images/blur/blur-22.svg" alt="blur" fill className="max-w-none" />
                </span>
                <span className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2">
                  <Image src="/images/blur/blur-23.svg" alt="blur" fill className="max-w-none" />
                </span>
                <span className="absolute bottom-0 left-1/2 -z-1 aspect-530/253 max-w-[530px] -translate-x-1/2">
                  <Image src="/images/blur/blur-24.svg" alt="blur" fill className="max-w-none" />
                </span>
              </div>

              <div className="wow fadeInUp relative z-10 text-left flex flex-col">
                <span className="relative mb-4 inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-medium">
                  <Image src="/images/hero/icon-title.svg" alt="icon" width={16} height={16} />
                  <span className="hero-subtitle-text">Bot Profile</span>
                </span>

                <h1 className="mb-4.5 text-heading-2 font-bold text-white">
                  Vectūra: The Carrier
                </h1>

                <p className="mb-10 font-medium text-white text-lg">
                  Vectūra specializes in transportation and logistics sectors, carrying portfolios 
                  through the infrastructure that moves the world. From airlines to railways, shipping 
                  to freight, this bot tracks the flow of goods and people. When transportation thrives, 
                  Vectūra rides the momentum. When routes close, it finds new paths.
                </p>

                <div className="mt-auto flex justify-center">
                  <video
                    ref={videoRef}
                    className="w-full max-w-2xl h-auto rounded-lg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source src="/images/Monsters/Vectura2025.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Right Box */}
          <div className="h-full">
            <div
              className="box-hover relative overflow-hidden rounded-3xl px-6 py-12 lg:px-8 lg:py-16 h-full flex flex-col justify-between"
              style={{
                background: "radial-gradient(circle, #000000 0%, #000000 60%, #1a0d3d 90%, #2d1b4d 100%)",
              }}
            >
              <div className="wow fadeInUp relative z-10 flex justify-center">
                <div className="relative aspect-square w-full max-w-[380px]">
                  <div
                    style={{
                      WebkitMaskImage: "radial-gradient(circle, black 0%, black 70%, transparent 100%)",
                      maskImage: "radial-gradient(circle, black 0%, black 70%, transparent 100%)",
                    }}
                  >
                    <Image
                      src="/images/Monsters/VecturaMonstra.png"
                      alt="Vectūra Carrier"
                      width={380}
                      height={380}
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-10 text-left">
                <p className="text-white/80 text-sm leading-relaxed">
                  Born on the highways and skyways of commerce, Vectūra knows every route and every 
                  shortcut. He doesn't question where to go—he finds the fastest, strongest path and 
                  takes it. When roads are blocked, Vectūra simply reroutes.
                </p>

                <div className="mt-4 text-xs text-white/60">
                  Trait: <span className="text-white/80">Adaptive routing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section suppressHydrationWarning className="py-20">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <h2 className="text-3xl font-bold text-white mb-8">Performance</h2>
        <div className="mb-6 flex gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Month
            </label>
            <select
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value)}
              className="px-4 py-2 bg-transparent text-[#f5c77a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, "0");
                return (
                  <option key={month} value={month} className="bg-gray-900 text-[#f5c77a]">
                    {new Date(2026, i).toLocaleString("en-US", { month: "long" })}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Day
            </label>
            <select
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
              className="px-4 py-2 bg-transparent text-[#f5c77a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {Array.from({ length: 31 }, (_, i) => {
                const day = String(i + 1).padStart(2, "0");
                return (
                  <option key={day} value={day} className="bg-gray-900 text-[#f5c77a]">
                    {day}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Year
            </label>
            <select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="px-4 py-2 bg-transparent text-[#f5c77a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="2025" className="bg-gray-900 text-[#f5c77a]">2025</option>
              <option value="2026" className="bg-gray-900 text-[#f5c77a]">2026</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setDateRange(5)}
            className="px-4 py-2 bg-transparent text-[#f5c77a] border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            5D
          </button>
          <button
            onClick={() => setDateRange(30)}
            className="px-4 py-2 bg-transparent text-[#f5c77a] border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            1M
          </button>
          <button
            onClick={() => setDateRange(90)}
            className="px-4 py-2 bg-transparent text-[#f5c77a] border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            3M
          </button>
          <button
            onClick={() => setDateRange(365)}
            className="px-4 py-2 bg-transparent text-[#f5c77a] border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            1Y
          </button>
          <button
            onClick={() => setDateRange("ytd")}
            className="px-4 py-2 bg-transparent text-[#f5c77a] border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            YTD
          </button>
        </div>

        <div className="w-full h-[400px] bg-black rounded-xl p-6 border border-white/10">
          {loading && (
            <div className="flex items-center justify-center h-full text-white/60">
              Loading bot data...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full text-red-400">
              Error: {error}
            </div>
          )}
          {!loading && !error && data.length === 0 && (
            <div className="flex items-center justify-center h-full text-white/60">
              No data available
            </div>
          )}
          {!loading && !error && data.length > 0 && (
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(181, 108, 255, 0.25)" />
                <XAxis dataKey="d" stroke="rgba(181, 108, 255, 0.85)" />
                <YAxis domain={["auto", "auto"]} stroke="rgba(181, 108, 255, 0.85)" />
                <Tooltip content={<CustomTooltip initialEquity={initialEquity} />} />
                <Line
                  type="monotone"
                  dataKey="equity"
                  dot={false}
                  stroke="#b56cff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-10 bg-black rounded-xl p-6 border border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Holdings Log</h2>
          </div>
          <div className="max-h-[360px] overflow-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="text-xs uppercase text-white/60">
                <tr className="border-b border-white/10">
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 font-medium">Holdings</th>
                </tr>
              </thead>
              <tbody>
                {logRows.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-white/60">
                      No holdings available
                    </td>
                  </tr>
                )}
                {logRows.map((row) => (
                  <tr key={row.originalDate} className="border-b border-white/10">
                    <td className="py-3 pr-4 align-top text-white/70">{row.d}</td>
                    <td className="py-3 text-white/90">{formatHoldings(row.holdings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
