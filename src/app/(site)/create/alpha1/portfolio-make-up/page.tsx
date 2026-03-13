import { Metadata } from "next";
import PortfolioMakeUpForm from "./PortfolioMakeUpForm";

type PortfolioMakeUpPageProps = {
  searchParams?: Promise<{
    botName?: string | string[];
    description?: string | string[];
    safetyNetEquity?: string | string[];
    customSafetyNetEquity?: string | string[];
    tickers?: string | string[];
    lookback?: string | string[];
    portfolioSize?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Portfolio Make Up | Create alpha1",
  description: "Portfolio make up step for alpha1 bot creation",
};

export default async function Alpha1PortfolioMakeUpPage({ searchParams }: PortfolioMakeUpPageProps) {
  const params = await searchParams;

  const botName = typeof params?.botName === "string" ? params.botName : "";
  const description = typeof params?.description === "string" ? params.description : "";
  const lookback = typeof params?.lookback === "string" ? params.lookback : "";

  const safetyNetEquity =
    typeof params?.safetyNetEquity === "string" ? params.safetyNetEquity : "VOO";
  const customSafetyNetEquity =
    typeof params?.customSafetyNetEquity === "string" ? params.customSafetyNetEquity : "";

  const tickerValues = Array.isArray(params?.tickers)
    ? params.tickers
    : typeof params?.tickers === "string"
      ? [params.tickers]
      : [];

  const cleanTickers = tickerValues
    .map((ticker) => ticker.trim().toUpperCase())
    .filter((ticker) => ticker.length > 0);

  const portfolioSizeMax = cleanTickers.length > 0
    ? Math.min(20, cleanTickers.length)
    : 20;

  const portfolioSizeParam =
    typeof params?.portfolioSize === "string"
      ? Number.parseInt(params.portfolioSize, 10)
      : Number.NaN;
  const portfolioSizeDefault = Number.isFinite(portfolioSizeParam)
    ? Math.min(portfolioSizeMax, Math.max(1, portfolioSizeParam))
    : 4;

  const safetyNetDisplay =
    safetyNetEquity === "CUSTOM"
      ? customSafetyNetEquity || "CUSTOM"
      : safetyNetEquity;

  return (
    <article>
      <div className='not-prose rounded-lg border border-white/10 bg-white/5 p-5'>
        <h2 className='text-base font-semibold text-white'>Previous Selections</h2>

        <p className='mt-3 text-sm text-white/80'>
          Bot Name: <span className='text-white'>{botName || "-"}</span>
        </p>
        <p className='mt-2 text-sm text-white/80'>
          Description: <span className='text-white'>{description || "-"}</span>
        </p>
        <p className='mt-2 text-sm text-white/80'>
          Safety Net Equity: <span className='text-white'>{safetyNetDisplay || "-"}</span>
        </p>
        <p className='mt-2 text-sm text-white/80'>
          Tickers: <span className='text-white'>{cleanTickers.length ? cleanTickers.join(", ") : "-"}</span>
        </p>
        <p className='mt-2 text-sm text-white/80'>
          Lookback: <span className='text-white'>{lookback || "-"}</span>
        </p>
      </div>

      <h1 className='mt-6'>Portfolio Make Up</h1>
      <p className='font-medium'>How many equities should this portfolio hold at one time?</p>

      <PortfolioMakeUpForm
        botName={botName}
        description={description}
        safetyNetEquity={safetyNetEquity}
        customSafetyNetEquity={customSafetyNetEquity}
        tickers={cleanTickers}
        lookback={lookback}
        portfolioSizeMax={portfolioSizeMax}
        portfolioSizeDefault={portfolioSizeDefault}
      />
    </article>
  );
}
