import { Metadata } from "next";

type TimingVariablesPageProps = {
  searchParams?: Promise<{
    botName?: string | string[];
    description?: string | string[];
    safetyNetEquity?: string | string[];
    customSafetyNetEquity?: string | string[];
    tickers?: string | string[];
    lookback?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Timing Variables | Create alpha1",
  description: "Timing Variables step for alpha1 bot creation",
};

export default async function Alpha1TimingVariablesPage({ searchParams }: TimingVariablesPageProps) {
  const params = await searchParams;

  const botName = typeof params?.botName === "string" ? params.botName : "";
  const description = typeof params?.description === "string" ? params.description : "";

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

  const safetyNetDisplay =
    safetyNetEquity === "CUSTOM"
      ? customSafetyNetEquity || "CUSTOM"
      : safetyNetEquity;

  const lookbackParam =
    typeof params?.lookback === "string" ? Number.parseInt(params.lookback, 10) : NaN;
  const lookbackDefault = Number.isFinite(lookbackParam)
    ? Math.min(120, Math.max(1, lookbackParam))
    : 60;

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
      </div>

      <h1 className='mt-6'>Timing Variables</h1>
      <p className='font-medium'>
        Timing Variables section.
      </p>

      <form
        action='/create/alpha1/portfolio-make-up'
        method='get'
        className='not-prose mt-6 max-w-sm rounded-lg border border-white/10 bg-white/5 p-5'
      >
        <input type='hidden' name='botName' value={botName} />
        <input type='hidden' name='description' value={description} />
        <input type='hidden' name='safetyNetEquity' value={safetyNetEquity} />
        {safetyNetEquity === "CUSTOM" && (
          <input type='hidden' name='customSafetyNetEquity' value={customSafetyNetEquity} />
        )}
        {cleanTickers.map((ticker) => (
          <input key={ticker} type='hidden' name='tickers' value={ticker} />
        ))}

        <label
          htmlFor='lookback'
          className='mb-2 block text-sm font-medium text-white/90'
        >
          Lookback (1-120)
        </label>
        <input
          id='lookback'
          name='lookback'
          type='number'
          min={1}
          max={120}
          step={1}
          required
          defaultValue={lookbackDefault}
          className='w-full rounded-lg border border-white/15 bg-dark px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none'
        />

        <div className='mt-6 flex justify-end'>
          <button
            type='submit'
            className='button-border-gradient hover:button-gradient-hover relative inline-flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-sm text-white shadow-button hover:shadow-none'
          >
            Continue
          </button>
        </div>
      </form>
    </article>
  );
}
