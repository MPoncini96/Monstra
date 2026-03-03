import { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "Leaderboard | Monstra",
  description: "Top 5 performing Monstra bots over the last 2 weeks",
};
export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
