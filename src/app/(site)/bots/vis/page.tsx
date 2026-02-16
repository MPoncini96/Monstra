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

export default function VisPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5;
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const start = "2026-01-01";

    fetch(`/api/bots/vis/equity?start=${start}&end=${today}`)
      .then((r) => r.json())
      .then(setData);
  }, []);

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
                  <span className="hero-subtitle-text">Bot Spotlight</span>
                </span>

                <h1 className="mb-4.5 text-heading-2 font-bold text-white">
                  Vis: The Energy Leader
                </h1>

                <p className="mb-10 font-medium text-white text-lg">
                  Vis, named after strength and force, channels market power into the energy sector. 
                  It tracks energy leaders, concentrates on the strongest performers, and steps aside 
                  when momentum fades—flowing back into the broader market. When risk rises, Vis pulls 
                  back defensively, then re-enters when conditions recover. It's a strategy built to 
                  apply force with discipline: striking when energy is strong and standing down when 
                  it's not.
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
                    <source src="/images/Monsters/Vis2025.mp4" type="video/mp4" />
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
                      src="/images/Monsters/VisMonstra.png"
                      alt="Vis Energy Leader"
                      width={380}
                      height={380}
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-10 text-left">
                <p className="text-white/80 text-sm leading-relaxed">
                  Born in the glow of refinery fires and the hum of offshore rigs, Vis doesn't chase 
                  noise—he hunts pressure. He watches the sector's pulse, waits for the strongest 
                  current, then moves with purpose. When the air turns thin and risk creeps in, Vis 
                  vanishes into the dark… until the engines roar again.
                </p>

                <div className="mt-4 text-xs text-white/60">
                  Trait: <span className="text-white/80">Force with discipline</span>
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
        <div className="w-full h-[400px] bg-dark rounded-xl p-6">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="d" stroke="rgba(255,255,255,0.5)" />
              <YAxis domain={["auto", "auto"]} stroke="rgba(255,255,255,0.5)" />
              <Tooltip />
              <Line type="monotone" dataKey="equity" dot={false} stroke="#8646f4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
    </>
  );
}
