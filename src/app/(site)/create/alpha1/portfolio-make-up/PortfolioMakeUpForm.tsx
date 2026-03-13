"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  botName: string;
  description: string;
  safetyNetEquity: string;
  customSafetyNetEquity: string;
  tickers: string[];
  lookback: string;
  portfolioSizeMax: number;
  portfolioSizeDefault: number;
};

export default function PortfolioMakeUpForm({
  botName,
  description,
  safetyNetEquity,
  customSafetyNetEquity,
  tickers,
  lookback,
  portfolioSizeMax,
  portfolioSizeDefault,
}: Props) {
  const router = useRouter();

  const [portfolioSize, setPortfolioSize] = useState(portfolioSizeDefault);
  const [rawSize, setRawSize] = useState(String(portfolioSizeDefault));
  const [weights, setWeights] = useState<number[]>([]);
  const [slidersVisible, setSlidersVisible] = useState(false);

  const showSliders = () => {
    const v = Number.parseInt(rawSize, 10);
    const count = Math.max(1, Math.min(portfolioSizeMax, Number.isNaN(v) ? portfolioSize : v));
    setPortfolioSize(count);
    setRawSize(String(count));
    const preset = Math.round(100 / count);
    setWeights(Array.from({ length: count }, () => preset));
    setSlidersVisible(true);
  };

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const remaining = 100 - totalWeight;

  const updateWeight = (index: number, value: number) => {
    setWeights((prev) => {
      const next = [...prev];
      const maxAllowed = prev[index] + Math.max(0, 100 - prev.reduce((s, w) => s + w, 0));
      next[index] = Math.min(value, maxAllowed);
      return next;
    });
  };

  const handleFinalContinue = () => {
    const params = new URLSearchParams();
    params.set("botName", botName);
    params.set("description", description);
    params.set("safetyNetEquity", safetyNetEquity);
    if (safetyNetEquity === "CUSTOM") {
      params.set("customSafetyNetEquity", customSafetyNetEquity);
    }
    tickers.forEach((t) => params.append("tickers", t));
    params.set("lookback", lookback);
    params.set("portfolioSize", String(portfolioSize));
    weights.forEach((w) => params.append("weights", String(w)));
    router.push(`/create/alpha1/review?${params.toString()}`);
  };

  return (
    <div className='not-prose mt-6 rounded-lg border border-white/10 bg-white/5 p-5'>
      {/* ── Step 1: pick count ── */}
      <div className='max-w-sm'>
        <label
          htmlFor='portfolioSize'
          className='mb-2 block text-sm font-medium text-white/90'
        >
          Equities in portfolio at one time
        </label>
        <input
          id='portfolioSize'
          type='number'
          min={1}
          max={portfolioSizeMax}
          step={1}
          value={rawSize}
          onChange={(e) => {
            const raw = e.target.value;
            setRawSize(raw);
            const v = Number.parseInt(raw, 10);
            if (!Number.isNaN(v) && v >= 1) {
              const clamped = Math.min(portfolioSizeMax, Math.max(1, v));
              setPortfolioSize(clamped);
              if (slidersVisible) {
                const preset = Math.round(100 / clamped);
                setWeights(Array.from({ length: clamped }, () => preset));
              }
            } else if (raw === '' || raw === '0') {
              setSlidersVisible(false);
            }
          }}
          onBlur={() => {
            const v = Number.parseInt(rawSize, 10);
            const clamped = Number.isNaN(v) || v < 1 ? 1 : Math.min(portfolioSizeMax, v);
            setPortfolioSize(clamped);
            setRawSize(String(clamped));
            if (slidersVisible) {
              const preset = Math.round(100 / clamped);
              setWeights(Array.from({ length: clamped }, () => preset));
            }
          }}
          className='w-full rounded-lg border border-white/15 bg-dark px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none'
        />
        <p className='mt-1 text-xs text-white/50'>Max: {portfolioSizeMax}</p>
      </div>

      {!slidersVisible && (
        <div className='mt-6 flex justify-end'>
          <button
            type='button'
            onClick={showSliders}
            className='button-border-gradient hover:button-gradient-hover relative inline-flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-sm text-white shadow-button hover:shadow-none'
          >
            Continue
          </button>
        </div>
      )}

      {/* ── Step 2: weight sliders ── */}
      {slidersVisible && (
        <>
          <div className='mt-8'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-semibold text-white'>Allocation Weights</h3>
              <span className={`text-sm tabular-nums font-medium ${remaining === 0 ? 'text-green-400' : remaining < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                {totalWeight}% / 100%
              </span>
            </div>
            <p className='mt-1 text-sm text-white/60'>
              Set the weight for each position. Preset evenly at{" "}
              {Math.round(100 / portfolioSize)}% each.
            </p>

            <div className='mt-4 space-y-5'>
              {weights.map((w, i) => (
                <div key={i}>
                  <div className='mb-1 flex items-center justify-between'>
                    <span className='text-sm font-medium text-white/90'>Stock {i + 1}</span>
                    <span className='text-sm tabular-nums text-white'>{w}%</span>
                  </div>
                  <input
                    type='range'
                    min={0}
                    max={w + Math.max(0, remaining)}
                    step={1}
                    value={w}
                    onChange={(e) => updateWeight(i, Number(e.target.value))}
                    className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-primary'
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='mt-8 flex items-center justify-between gap-4'>
            <button
              type='button'
              onClick={() => setWeights((prev) => prev.map(() => 0))}
              className='inline-flex items-center rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10'
            >
              Reset to 0
            </button>
            <div className='flex items-center gap-4'>
              {remaining !== 0 && (
                <p className='text-xs text-yellow-400'>
                  {remaining > 0 ? `${remaining}% remaining to allocate` : `${Math.abs(remaining)}% over budget — reduce a slider`}
                </p>
              )}
              <button
                type='button'
                onClick={handleFinalContinue}
                disabled={remaining !== 0}
                className='button-border-gradient hover:button-gradient-hover relative inline-flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-sm text-white shadow-button hover:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none'
              >
                Continue
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
