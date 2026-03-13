import { Metadata } from "next";
import Link from "next/link";
import UniverseTickerForm from "./UniverseTickerForm";

type UniversePageProps = {
  searchParams?: Promise<{
    botName?: string | string[];
    description?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Universe | Create alpha1",
  description: "Universe step for alpha1 bot creation",
};

export default async function Alpha1UniversePage({ searchParams }: UniversePageProps) {
  const params = await searchParams;
  const botName =
    typeof params?.botName === "string" ? params.botName : "";
  const description =
    typeof params?.description === "string"
      ? params.description
      : "";
  const backParams = new URLSearchParams({ botName, description }).toString();

  return (
    <article>
      <h1>Universe</h1>
      <p className='font-medium'>
        You are on the Universe step for alpha1.
      </p>

      <div className='not-prose mt-6 rounded-lg border border-white/10 bg-white/5 p-5'>
        <p className='text-sm text-white/80'>
          Bot Name: <span className='text-white'>{botName || "-"}</span>
        </p>
        <p className='mt-2 text-sm text-white/80'>
          Description: <span className='text-white'>{description || "-"}</span>
        </p>
      </div>

      <div className='not-prose mt-4'>
        <Link
          href={`/create/alpha1?${backParams}`}
          className='inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10'
        >
          Back to alpha1
        </Link>
      </div>

      <UniverseTickerForm botName={botName} description={description} />
    </article>
  );
}
