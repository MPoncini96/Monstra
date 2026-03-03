"use client";

import { useEffect, useState } from "react";

type LeaderboardItem = {
  botId: string;
  returnPct: number;
};

type PeriodOption = {
  value: string;
  label: string;
};

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: "lastDay", label: "Last day" },
  { value: "lastWeek", label: "Last week" },
  { value: "lastTwoWeeks", label: "Last two weeks" },
  { value: "lastMonth", label: "Last month" },
  { value: "lastThreeMonths", label: "Last 3 months" },
  { value: "ytd", label: "YTD" },
  { value: "lastYear", label: "Last year" },
];

function formatBotName(botId: string) {
  return botId.charAt(0).toUpperCase() + botId.slice(1);
}

export default function LeaderboardClient() {
  const [period, setPeriod] = useState<string>("lastTwoWeeks");
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const response = await fetch(`/api/leaderboard?period=${period}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const details = errorData.error || `HTTP ${response.status}`;
          throw new Error(details);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid leaderboard response");
        }

        setLeaderboard(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load leaderboard";
        setErrorMessage(message);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period]);

  const selectedLabel =
    PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? "Last two weeks";

  return (
    <section className="relative z-20 overflow-hidden pb-20 pt-35 md:pt-40 lg:pt-45 xl:pt-50">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Leaderboard</h1>
            <p className="text-white/70">Top 5 bot performance for {selectedLabel.toLowerCase()}</p>
          </div>

          <div className="w-full max-w-xs">
            <label htmlFor="leaderboard-period" className="mb-2 block text-sm text-white/70">
              Time range
            </label>
            <div className="relative">
              <select
                id="leaderboard-period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full appearance-none rounded-lg border border-white/15 bg-dark/90 px-4 py-2.5 pr-10 text-white shadow-none outline-none transition-colors focus:border-purple-400"
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-dark text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/60">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-lg border border-white/10 bg-dark p-6 text-white/70">
            Loading leaderboard...
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-white/10 bg-dark p-6 text-red-400">
            Failed to load leaderboard: {errorMessage}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-dark p-6 text-white/70">
            No leaderboard data available for {selectedLabel.toLowerCase()}.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-white/10 bg-dark/80">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 bg-dark">
                <tr>
                  <th className="px-5 py-4 text-sm font-medium text-white/70">Rank</th>
                  <th className="px-5 py-4 text-sm font-medium text-white/70">Bot</th>
                  <th className="px-5 py-4 text-sm font-medium text-white/70">Return</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item.botId} className="border-b border-white/5 last:border-b-0">
                    <td className="px-5 py-4 text-white">#{index + 1}</td>
                    <td className="px-5 py-4 text-white">{formatBotName(item.botId)}</td>
                    <td
                      className={`px-5 py-4 font-semibold ${
                        item.returnPct >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {item.returnPct >= 0 ? "+" : ""}
                      {item.returnPct.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
