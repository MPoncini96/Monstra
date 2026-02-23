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

export default function BellatorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().slice(0, 10);
        const start = "2026-01-01";

        const response = await fetch(
          `/api/bots/bellator/equity?start=${start}&end=${today}`
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
              d: new Date(item.d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
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
  }, []);

  return (
    <>
    <section suppressHydrationWarning className="py-20">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-7.5 items-stretch">
          {/* Left Box - Video and Description */}
          <div className="h-full">
            <div className="box-hover relative overflow-hidden rounded-3xl px-6 py-12 lg:px-8 lg:py-16 h-full flex flex-col justify-between">
              {/* Background layers */}
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <span className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2">
                  <Image
                    src="/images/blur/blur-22.svg"
                    alt="blur"
                    fill
                    className="max-w-none"
                  />
                </span>
                <span className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2">
                  <Image
                    src="/images/blur/blur-23.svg"
                    alt="blur"
                    fill
                    className="max-w-none"
                  />
                </span>
                <span className="absolute bottom-0 left-1/2 -z-1 aspect-530/253 max-w-[530px] -translate-x-1/2">
                  <Image
                    src="/images/blur/blur-24.svg"
                    alt="blur"
                    fill
                    className="max-w-none"
                  />
                </span>
              </div>

              {/* Content */}
              <div className="wow fadeInUp relative z-10 text-left flex flex-col">
                <span className="relative mb-4 inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-medium">
                  <Image
                    src="/images/hero/icon-title.svg"
                    alt="icon"
                    width={16}
                    height={16}
                  />
                  <span className="hero-subtitle-text">Bot Profile</span>
                </span>

                <h1 className="mb-4.5 text-heading-2 font-bold text-white">
                  Bellator: The Warrior
                </h1>

                <p className="mb-10 font-medium text-white text-lg">
                  Bellator embodies the spirit of battle and strategy. Built for aggressive market movements, 
                  this bot identifies strong momentum and acts decisively. When markets show strength, Bellator 
                  engages fully. When conditions deteriorate, it retreats to safety, waiting for the next opportunity 
                  to strike with precision and power.
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
                    <source src="/images/Monsters/Bellator2025.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Right Box - Image and Lore */}
          <div className="h-full">
            <div
              className="box-hover relative overflow-hidden rounded-3xl px-6 py-12 lg:px-8 lg:py-16 h-full flex flex-col justify-between"
              style={{
                background:
                  "radial-gradient(circle, #000000 0%, #000000 60%, #1a0d3d 90%, #2d1b4d 100%)",
              }}
            >
              {/* Image */}
              <div className="wow fadeInUp relative z-10 flex justify-center">
                <div className="relative aspect-square w-full max-w-[380px]">
                  <div
                    style={{
                      WebkitMaskImage:
                        "radial-gradient(circle, black 0%, black 70%, transparent 100%)",
                      maskImage:
                        "radial-gradient(circle, black 0%, black 70%, transparent 100%)",
                    }}
                  >
                    <Image
                      src="/images/Monsters/BellatorMonstra.png"
                      alt="Bellator Warrior"
                      width={380}
                      height={380}
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Lore */}
              <div className="relative z-10 mt-10 text-left">
                <p className="text-white/80 text-sm leading-relaxed">
                  Forged in the heat of market battles, Bellator doesn't hesitate when opportunity 
                  calls. This warrior watches, waits, and strikes when the momentum is undeniable. 
                  When the tide turns against him, Bellator withdraws to the shadows, conserving 
                  energy for the next engagement.
                </p>

                <div className="mt-4 text-xs text-white/60">
                  Trait: <span className="text-white/80">Aggressive precision</span>
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b0614",
                    borderColor: "#b56cff",
                    color: "#f2e9ff",
                  }}
                  labelStyle={{ color: "#d6c4ff" }}
                />
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
      </div>
    </section>
    </>
  );
}
