"use client";

import Image from "next/image";
import OfferItem from "./OfferItem";

type GameMode = {
  id: string;
  unit_amount: number;
  nickname: string;
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
};

const SingleGameMode = ({ gameMode }: { gameMode: GameMode }) => {
  const handleCTA = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(`Selected game mode: ${gameMode.id}`);
  };

  const displayTitle = gameMode.title || gameMode.nickname;
  const defaultFeatures = ["Feature 1", "Feature 2", "Feature 3"];
  const features = gameMode.features || defaultFeatures;

  return (
    <div className="wow fadeInUp pricing-item-border relative z-20 overflow-hidden rounded-3xl bg-dark px-8 pb-10 pt-12.5 xl:px-10">
      <h3 className="mb-3 text-heading-6 font-semibold text-white">
        {displayTitle}
      </h3>

      {gameMode.subtitle && (
        <p className="mb-2 text-lg font-semibold text-white/90">
          {gameMode.subtitle}
        </p>
      )}

      {gameMode.description ? (
        <p className="text-sm font-medium text-white/70">
          {gameMode.description}
        </p>
      ) : (
        <p className="text-sm font-medium text-white/70">
          ${(gameMode.unit_amount / 100).toFixed(2)} per month
        </p>
      )}

      <div className="pricing-gradient-divider my-10 h-[1px] w-full"></div>

      <ul className="flex flex-col gap-4">
        {features.map((feature, index) => (
          <OfferItem key={index} text={feature} />
        ))}
      </ul>

      {/* bg shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="absolute bottom-0 left-0 -z-1 aspect-370/553 w-full">
          <Image
            src="/images/blur/blur-16.svg"
            alt="blur-sm"
            fill
            className="max-w-none"
          />
        </span>
        <span className="absolute left-0 top-0 -z-1 aspect-370/350 w-full">
          <Image
            src="/images/blur/blur-17.svg"
            alt="blur-sm"
            fill
            className="max-w-none"
          />
        </span>
      </div>
    </div>
  );
};

export default SingleGameMode;
