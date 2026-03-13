"use client";

import { useState } from "react";

const INITIAL_TICKER_COUNT = 5;
const MAX_TICKER_COUNT = 25;

type UniverseTickerFormProps = {
  botName: string;
  description: string;
};

export default function UniverseTickerForm({ botName, description }: UniverseTickerFormProps) {
  const [tickers, setTickers] = useState<string[]>(
    Array.from({ length: INITIAL_TICKER_COUNT }, () => ""),
  );
  const [safetyNetEquity, setSafetyNetEquity] = useState<"VOO" | "QQQ" | "CUSTOM">("VOO");
  const [customSafetyNet, setCustomSafetyNet] = useState<string>("");

  const addTicker = () => {
    setTickers((current) => {
      if (current.length >= MAX_TICKER_COUNT) return current;
      return [...current, ""];
    });
  };

  const removeTicker = () => {
    setTickers((current) => {
      if (current.length <= 1) return current;
      return current.slice(0, -1);
    });
  };

  const updateTicker = (index: number, value: string) => {
    setTickers((current) => {
      const next = [...current];
      next[index] = value.toUpperCase();
      return next;
    });
  };

  return (
    <form
      action='/create/alpha1/timing-variables'
      method='get'
      className='not-prose mt-6 rounded-lg border border-white/10 bg-white/5 p-5'
    >
      <input type='hidden' name='botName' value={botName} />
      <input type='hidden' name='description' value={description} />

      <div className='flex items-center justify-between gap-3'>
        <h2 className='text-lg font-semibold text-white'>Stock Tickers</h2>
        <span className='text-sm text-white/70'>Count: {tickers.length}</span>
      </div>

      <div className='mt-4 grid gap-3 sm:grid-cols-2'>
        {tickers.map((ticker, index) => (
          <div key={index} className='space-y-1'>
            <label
              htmlFor={`ticker-${index}`}
              className='block text-xs font-medium uppercase tracking-wide text-white/70'
            >
              Ticker {index + 1}
            </label>
            <input
              id={`ticker-${index}`}
              name='tickers'
              type='text'
              value={ticker}
              onChange={(event) => updateTicker(index, event.target.value)}
              placeholder='e.g. AAPL'
              className='w-full rounded-lg border border-white/15 bg-dark px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none'
            />
          </div>
        ))}
      </div>

      <div className='mt-4 flex gap-3'>
        <button
          type='button'
          onClick={addTicker}
          disabled={tickers.length >= MAX_TICKER_COUNT}
          className='inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10'
        >
          Add Ticker
        </button>
        <button
          type='button'
          onClick={removeTicker}
          className='inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10'
        >
          Remove Ticker
        </button>
      </div>

      <section className='mt-6 rounded-lg border border-white/10 bg-white/5 p-4'>
        <h3 className='text-base font-semibold text-white'>Safety Net Equity</h3>

        <div className='mt-3 flex flex-wrap gap-3'>
          <label className='inline-flex items-center gap-2 text-sm text-white/85'>
            <input
              type='radio'
              name='safetyNetEquity'
              value='VOO'
              checked={safetyNetEquity === "VOO"}
              onChange={() => setSafetyNetEquity("VOO")}
            />
            VOO
          </label>

          <label className='inline-flex items-center gap-2 text-sm text-white/85'>
            <input
              type='radio'
              name='safetyNetEquity'
              value='QQQ'
              checked={safetyNetEquity === "QQQ"}
              onChange={() => setSafetyNetEquity("QQQ")}
            />
            QQQ
          </label>

          <label className='inline-flex items-center gap-2 text-sm text-white/85'>
            <input
              type='radio'
              name='safetyNetEquity'
              value='CUSTOM'
              checked={safetyNetEquity === "CUSTOM"}
              onChange={() => setSafetyNetEquity("CUSTOM")}
            />
            Custom
          </label>
        </div>

        {safetyNetEquity === "CUSTOM" && (
          <div className='mt-3 max-w-xs'>
            <label
              htmlFor='customSafetyNetEquity'
              className='mb-1 block text-xs font-medium uppercase tracking-wide text-white/70'
            >
              Custom Ticker
            </label>
            <input
              id='customSafetyNetEquity'
              name='customSafetyNetEquity'
              type='text'
              value={customSafetyNet}
              onChange={(event) => setCustomSafetyNet(event.target.value.toUpperCase())}
              placeholder='e.g. SPY'
              className='w-full rounded-lg border border-white/15 bg-dark px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none'
            />
          </div>
        )}
      </section>

      <div className='mt-6 flex justify-end'>
        <button
          type='submit'
          className='button-border-gradient hover:button-gradient-hover relative inline-flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-sm text-white shadow-button hover:shadow-none'
        >
          Continue
        </button>
      </div>
    </form>
  );
}
