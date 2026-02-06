import CallToAction from "@/components/CallToAction";
import Features from "@/components/Home/FeaturesList";
import FeaturesList from "@/components/Home/SpotLight";
import CreateBots from "@/components/Home/CreateBots";
// import Reviews from "@/components/Home/Reviews";
import VideoSection from "@/components/Home/Video";
import GamePlay from "@/components/GamePlay";
import { Metadata } from "next";
import { integrations } from "../../../integrations.config";

export const metadata: Metadata = {
  title: "Monstra Evolutions",
  description: "This is Home for AI Tool",
  // other metadata
};

export default function Home() {
  return (
    <>
      <VideoSection />
      <CallToAction />
      <Features />
      <FeaturesList />
      <GamePlay />
      <CreateBots />
      {/* <section className="relative z-20 overflow-hidden pb-20 pt-22.5 lg:pt-27.5 xl:pt-32.5 2xl:pt-45">
        <Reviews />
      </section> */}
    </>
  );
}
