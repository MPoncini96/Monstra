import SectionTitle from "@/components/Common/SectionTitle";
import Image from "next/image";
import SingleFeature from "./SingleFeature";
import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    title: "Strategy AI Assistants",
    description:
      "Learn faster with AI-powered strategy insights. Monstra analyzes performance, explains outcomes, and helps you improve your trading bots over time.",
    icon: "/images/features/icon-01.svg",
  },
  {
    id: 2,
    title: "Real Market Data",
    description: "All strategies run on real historical and live market data. See how each bot performs across bull markets, downturns, and changing conditions.",
    icon: "/images/features/icon-02.svg",
  },
  {
    id: 3,
    title: "Your Virtual Portfolio",
    description:
      "Allocate virtual capital to bots, rebalance your portfolio, and track how your strategy allocations grow or shrink over time.",
    icon: "/images/features/icon-03.svg",
  },
  {
    id: 4,
    title: "Automated Strategy Simulation",
    description:
      "Every bot runs continuously inside a controlled simulation environment — no real money required.",
    icon: "/images/features/icon-04.svg",
    rotate: true,
  },
  {
    id: 5,
    title: "Build or Submit Your Own Bots",
    description:
      "Develop trading algorithms, submit them to the platform, and compare their performance against Monstra and community strategies.",
    icon: "/images/features/icon-05.svg",
    rotate: true,
  },
  {
    id: 6,
    title: "Leaderboards & Transparent Performance",
    description: "Compete on global leaderboards and explore fully transparent performance data for every bot and portfolio.",
    icon: "/images/features/icon-06.svg",
    rotate: true,
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="scroll-mt-17 overflow-hidden pt-17.5 lg:pt-22.5 xl:pt-27.5"
    >
      <div className="mx-auto max-w-[1222px] px-4 sm:px-8 xl:px-0">
        {/* <SectionTitle
          subTitle="Bot Features"
          title="Why Choose Monstra"
          paragraph="A complete trading simulation platform designed for strategy creation, testing, and competitive play."
        /> */}

        <div className="relative">
          <div className="features-row-border absolute left-1/2 top-1/2 hidden h-[1px] w-1/2 -translate-y-1/2 rotate-90 lg:left-1/4 lg:block lg:-translate-x-1/3"></div>
          <div className="features-row-border absolute right-1/2 top-1/2 hidden h-[1px] w-1/2 -translate-y-1/2 rotate-90 lg:right-[8.3%] lg:block"></div>

          {/* <!--=== Features Row ===--> */}
          <div className="flex flex-wrap justify-center">
            {featuresData.slice(0, 3).map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>

          <div className="features-row-border h-[1px] w-full"></div>

          {/* <!--=== Features Row ===--> */}
          <div className="flex flex-wrap justify-center">
            {featuresData.slice(3).map((feature) => (
              <SingleFeature key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
