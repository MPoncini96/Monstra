import { Metadata } from "next";
import Link from "next/link";
import SubmitBotButton from "./SubmitBotButton";

export const metadata: Metadata = {
  title: "Review | Create alpha1",
  description: "Review your alpha1 bot configuration before submitting",
};

type ReviewPageProps = {
  searchParams?: Promise<{
    botName?: string | string[];
    description?: string | string[];
    safetyNetEquity?: string | string[];
    customSafetyNetEquity?: string | string[];
    tickers?: string | string[];
    lookback?: string | string[];
    portfolioSize?: string | string[];
    weights?: string | string[];
  }>;
};

export default async function Alpha1ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;

  const botName = typeof params?.botName === "string" ? params.botName : "";
  const description = typeof params?.description === "string" ? params.description : "";
  const lookback = typeof params?.lookback === "string" ? params.lookback : "";
  const portfolioSize = typeof params?.portfolioSize === "string" ? params.portfolioSize : "";

  const safetyNetEquity =
    typeof params?.safetyNetEquity === "string" ? params.safetyNetEquity : "VOO";
  const customSafetyNetEquity =
    typeof params?.customSafetyNetEquity === "string" ? params.customSafetyNetEquity : "";
  const safetyNetDisplay =
    safetyNetEquity === "CUSTOM" ? customSafetyNetEquity || "CUSTOM" : safetyNetEquity;

  const tickerValues = Array.isArray(params?.tickers)
    ? params.tickers
    : typeof params?.tickers === "string"
      ? [params.tickers]
      : [];
  const cleanTickers = tickerValues
    .map((t) => t.trim().toUpperCase())
    .filter((t) => t.length > 0);

  const weightValues = Array.isArray(params?.weights)
    ? params.weights
    : typeof params?.weights === "string"
      ? [params.weights]
      : [];
  const cleanWeights = weightValues.map((w) => Number(w));

  const backParams = new URLSearchParams();
  if (botName) backParams.set("botName", botName);
  if (description) backParams.set("description", description);
  if (safetyNetEquity) backParams.set("safetyNetEquity", safetyNetEquity);
  if (safetyNetEquity === "CUSTOM" && customSafetyNetEquity)
    backParams.set("customSafetyNetEquity", customSafetyNetEquity);
  cleanTickers.forEach((t) => backParams.append("tickers", t));
  if (lookback) backParams.set("lookback", lookback);
  if (portfolioSize) backParams.set("portfolioSize", portfolioSize);
  cleanWeights.forEach((w) => backParams.append("weights", String(w)));

  const rows: { label: string; value: string }[] = [
    { label: "Bot Name", value: botName || "-" },
    { label: "Description", value: description || "-" },
    { label: "Safety Net Equity", value: safetyNetDisplay || "-" },
    { label: "Universe Tickers", value: cleanTickers.length ? cleanTickers.join(", ") : "-" },
    { label: "Lookback (days)", value: lookback || "-" },
    { label: "Portfolio Size", value: portfolioSize || "-" },
  ];

  return (
    <article>
      <h1>Review</h1>
      <p className='font-medium'>
        Review your alpha1 bot configuration before submitting.
      </p>

      {/* ── Summary table ── */}
      <div className='not-prose mt-6 overflow-hidden rounded-lg border border-white/10'>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:gap-6 ${i !== rows.length - 1 ? "border-b border-white/10" : ""}`}
          >
            <span className='w-44 shrink-0 text-sm font-medium text-white/60'>{row.label}</span>
            <span className='text-sm text-white'>{row.value}</span>
          </div>
        ))}

        {/* Allocation weights */}
        {cleanWeights.length > 0 && (
          <div className='border-t border-white/10 px-5 py-4'>
            <span className='text-sm font-medium text-white/60'>Allocation Weights</span>
            <div className='mt-3 space-y-3'>
              {cleanWeights.map((w, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <span className='w-16 shrink-0 text-sm text-white/70'>Stock {i + 1}</span>
                  <div className='flex-1 overflow-hidden rounded-full bg-white/10'>
                    <div
                      className='h-2 rounded-full bg-primary transition-all'
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <span className='w-10 text-right text-sm tabular-nums text-white'>{w}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className='not-prose mt-6 flex items-center justify-between gap-4'>
        <Link
          href={`/create/alpha1/portfolio-make-up?${backParams.toString()}`}
          className='inline-flex items-center rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10'
        >
          ← Back
        </Link>

        <SubmitBotButton
          botName={botName}
          description={description}
          tickers={cleanTickers}
          safetyNetEquity={safetyNetEquity}
          lookback={lookback}
          portfolioSize={portfolioSize}
          weights={cleanWeights}
        />
      </div>
    </article>
  );
}
