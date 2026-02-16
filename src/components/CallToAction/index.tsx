"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const CallToAction = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <section suppressHydrationWarning>
      <div className="mx-auto max-w-full px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4 items-stretch">
          <div className="cta-box-gradient relative z-999 overflow-hidden rounded-[30px] bg-dark px-6 py-12 lg:px-8 lg:py-16 max-h-[500px] lg:max-h-[750px]">
            {/* <!-- bg shapes --> */}

            <div className="absolute bottom-0 left-0 -z-1 h-full w-full bg-[url(/images/cta/grid.svg)] bg-cover bg-bottom bg-no-repeat"></div>

            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <span className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2">
                <Image
                  src="/images/blur/blur-22.svg"
                  alt="blur-sm"
                  fill
                  className="max-w-none"
                />
              </span>
              <span className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2">
                <Image
                  src="/images/blur/blur-23.svg"
                  alt="blur-sm"
                  fill
                  className="max-w-none"
                />
              </span>
              <span className="absolute bottom-0 left-1/2 -z-1 aspect-530/253 max-w-[530px] -translate-x-1/2">
                <Image
                  src="/images/blur/blur-24.svg"
                  alt="blur-sm"
                  fill
                  className="max-w-none"
                />
              </span>
            </div>

            {/* <!-- stars --> */}
            <div className="absolute -bottom-25 left-1/2 -z-1 h-60 w-full max-w-[482px] -translate-x-1/2 overflow-hidden">
              <div className="stars"></div>
              <div className="stars2"></div>
            </div>

            <div className="wow fadeInUp text-left relative z-10">
              <h2 className="mb-4.5 text-2xl font-extrabold text-white sm:text-4xl xl:text-heading-2">
                A platform for trading strategy simulation and portfolio management.
              </h2>
              <p className="mb-9 font-medium text-white text-lg">
                Monstra reimagines algorithmic trading as an interactive, simulated experience. Users allocate virtual capital to strategy “Monsters,” track performance over time, and learn how different approaches behave under real market conditions — all in a risk-free environment.
              </p>
              <p className="mb-9 font-medium text-white text-lg">
                Explore and subscribe to bots created by Monstra and the community, build your own virtual portfolio, and compete on leaderboards to see who can grow their capital the fastest. Developers can submit their own trading algorithms, compare results against other strategies, and earn revenue when users subscribe to their bots.              </p>
              <p className="mb-9 font-medium text-white text-lg">
                By combining strategy creation, portfolio management, and community competition, Monstra turns algorithmic trading into a collaborative, gamified learning platform. </p>
            </div>
          </div>

          <div className="cta-box-gradient relative z-999 overflow-hidden rounded-[30px] px-6 py-12 lg:px-8 lg:py-16 flex flex-col max-h-[500px] lg:max-h-[750px]" style={{background: 'radial-gradient(circle, #000000 0%, #000000 60%, #1a0d3d 90%, #2d1b4d 100%)'}}>
              <div className="absolute -bottom-25 left-1/2 -z-1 h-60 w-full max-w-[482px] -translate-x-1/2 overflow-hidden">
              <div className="stars"></div>
              <div className="stars2"></div>
            </div>
            <div className="absolute bottom-0 left-0 -z-1 h-full w-full bg-[url(/images/cta/grid.svg)] bg-cover bg-bottom bg-no-repeat"></div>
            <div className="wow fadeInUp relative z-10 overflow-y-auto flex flex-col gap-8">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[30vh] sm:max-h-[40vh] lg:max-h-[50vh] object-contain"
                autoPlay
                muted
                loop
              >
                <source src="/images/Monsters/Vis2025.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
                            <video
                ref={videoRef}
                className="w-full h-auto max-h-[30vh] sm:max-h-[40vh] lg:max-h-[50vh] object-contain"
                autoPlay
                muted
                loop
              >
                <source src="/images/Monsters/Bellator2025.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
