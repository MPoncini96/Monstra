import SectionTitle from "@/components/Common/SectionTitle";
import Image from "next/image";
import SingleFeature from "./SingleFeature";
import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    title: "Strategy AI Assistants",
    description:
      "Learn faster with AI-powered strategy analysis. Monstra reviews trades, explains outcomes, and helps you refine your monster's behavior.",
    icon: "/images/features/icon-01.svg",
  },
  {
    id: 2,
    title: "Real Market Data",
    description: "Strategies run on real historical market data. See how your monster would perform across bull markets, crashes, and everything in between.",
    icon: "/images/features/icon-02.svg",
  },
  {
    id: 3,
    title: "Secure Player Accounts",
    description:
      "Create monsters, track performance, and build your strategy portfolio safely in your personal arena.",
    icon: "/images/features/icon-03.svg",
  },
  {
    id: 4,
    title: "Automated Strategy Simulation",
    description:
      "Deploy monsters that trade continuously in a controlled simulation environment: no real money required.",
    icon: "/images/features/icon-04.svg",
    rotate: true,
  },
  {
    id: 5,
    title: "Build or Battle Strategies",
    description:
      "Create your own trading algorithms or compete against other players in 1v1 and 5v5 strategy battles.",
    icon: "/images/features/icon-05.svg",
    rotate: true,
  },
  {
    id: 6,
    title: "Transparent Performance Tracking",
    description: "Every trade is logged. Every decision is visible. Understand why your monstrosities succeed.",
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
