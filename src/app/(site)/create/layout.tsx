"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";

function CreateNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAlpha1 = pathname.startsWith("/create/alpha1");
  const isAlpha1SubStep =
    pathname.startsWith("/create/alpha1/") && pathname !== "/create/alpha1";
  const isAlpha2 = pathname.startsWith("/create/alpha2");
  const alpha1Params = searchParams.toString();
  const alpha1Href = alpha1Params ? `/create/alpha1?${alpha1Params}` : "/create/alpha1";
  const alpha1UniverseHref = alpha1Params
    ? `/create/alpha1/universe?${alpha1Params}`
    : "/create/alpha1/universe";
  const alpha1TimingVariablesHref = alpha1Params
    ? `/create/alpha1/timing-variables?${alpha1Params}`
    : "/create/alpha1/timing-variables";
  const alpha1PortfolioMakeUpHref = alpha1Params
    ? `/create/alpha1/portfolio-make-up?${alpha1Params}`
    : "/create/alpha1/portfolio-make-up";
  const alpha1ReviewHref = alpha1Params
    ? `/create/alpha1/review?${alpha1Params}`
    : "/create/alpha1/review";

  return (
    <nav>
      <ul className='space-y-2'>
        <li>
          <Link
            href='/create'
            className='block rounded px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white'
          >
            Overview
          </Link>
        </li>
        {isAlpha1 && (
          <>
            <li>
              <Link
                href={alpha1Href}
                className='block rounded px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white'
              >
                alpha1
              </Link>
            </li>
            {isAlpha1SubStep && (
              <li>
                <Link
                  href={alpha1UniverseHref}
                  className='block rounded px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white'
                >
                  Universe
                </Link>
              </li>
            )}
            {isAlpha1SubStep && (
              <li>
                <Link
                  href={alpha1TimingVariablesHref}
                  className='block rounded px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white'
                >
                  Timing Variables
                </Link>
              </li>
            )}
            {isAlpha1SubStep && (
              <li>
                <Link
                  href={alpha1PortfolioMakeUpHref}
                  className='block rounded px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white'
                >
                  Portfolio Make Up
                </Link>
              </li>
            )}
            {isAlpha1SubStep && (
              <li>
                <Link
                  href={alpha1ReviewHref}
                  className='block rounded px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white'
                >
                  Review
                </Link>
              </li>
            )}
          </>
        )}
        {isAlpha2 && (
          <li>
            <Link
              href='/create/alpha2'
              className='block rounded px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white'
            >
              alpha2
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default function CreateLayout({ children }: PropsWithChildren) {
  return (
    <div className='mx-auto grid max-w-[1170px] gap-x-8 gap-y-4 pt-24 pb-16 md:pt-28 md:pb-20 lg:grid-cols-[auto_1fr] lg:pt-32 lg:pb-24'>
      <aside className='max-h-fit rounded-lg bg-white/5 p-4 lg:sticky lg:top-[80px]'>
        <Suspense fallback={null}>
          <CreateNav />
        </Suspense>
      </aside>

      <main className='prose prose-invert rounded-lg bg-white/5 px-8 py-11 sm:p-[55px] lg:px-8 xl:p-[55px]'>
        {children}
      </main>
    </div>
  );
}
