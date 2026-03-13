"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  botName: string;
  description: string;
  tickers: string[];
  safetyNetEquity: string;
  lookback: string;
  portfolioSize: string;
  weights: number[];
};

export default function SubmitBotButton({
  botName,
  description,
  tickers,
  safetyNetEquity,
  lookback,
  portfolioSize,
  weights,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/bots/create-alpha1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botName,
          description,
          tickers,
          safetyNetEquity,
          lookback,
          portfolioSize,
          weights,
        }),
      });

      const data = await res.json() as { success?: boolean; botId?: string; error?: string };

      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong.");
        return;
      }

      // Success — navigate to the main logged-in landing page
      router.push("/");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className='flex flex-col items-end gap-2'>
      {status === "error" && (
        <p className='text-sm text-red-400'>{errorMsg}</p>
      )}
      <button
        type='button'
        onClick={handleSubmit}
        disabled={status === "loading"}
        className='button-border-gradient hover:button-gradient-hover relative inline-flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-sm text-white shadow-button hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
      >
        {status === "loading" ? "Submitting…" : "Submit Bot"}
      </button>
    </div>
  );
}
