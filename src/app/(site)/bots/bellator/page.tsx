"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

export default function BellatorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5;
  }, []);

  return (
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
  );
}
