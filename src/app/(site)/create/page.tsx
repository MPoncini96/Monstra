import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create | Monstra",
  description: "Create page",
};

export default function CreatePage() {
  return (
    <article>
      <h1>Choose a Strategy</h1>

      <p className='font-medium'>
        Select one option below to start. We currently support alpha1 and
        alpha2.
      </p>

      <div className='not-prose mt-6 grid gap-4 sm:grid-cols-2'>
        <Link
          href='/create/alpha1'
          className='rounded-lg border border-white/10 bg-white/5 p-5 text-white/90 transition hover:bg-white/10'
        >
          <div className='text-lg font-semibold text-white'>alpha1</div>
          <p className='mt-2 text-sm text-white/70'>Open alpha1 setup.</p>
        </Link>

        <Link
          href='/create/alpha2'
          className='rounded-lg border border-white/10 bg-white/5 p-5 text-white/90 transition hover:bg-white/10'
        >
          <div className='text-lg font-semibold text-white'>alpha2</div>
          <p className='mt-2 text-sm text-white/70'>Open alpha2 setup.</p>
        </Link>
      </div>
    </article>
  );
}
