import { Metadata } from "next";

type Alpha1PageProps = {
  searchParams?: Promise<{
    botName?: string | string[];
    description?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Create alpha1 | Monstra",
  description: "alpha1 setup page",
};

export default async function CreateAlpha1Page({ searchParams }: Alpha1PageProps) {
  const params = await searchParams;
  const botName =
    typeof params?.botName === "string" ? params.botName : "";
  const description =
    typeof params?.description === "string"
      ? params.description
      : "";

  return (
    <article>
      <h1>alpha1</h1>
      <p className='font-medium'>
        alpha1 is selected. Start by creating your bot name below.
      </p>

      <form
        action='/create/alpha1/universe'
        method='get'
        className='not-prose mt-6 max-w-xl space-y-4 rounded-lg border border-white/10 bg-white/5 p-5'
      >
        <div className='space-y-2'>
          <label htmlFor='botName' className='block text-sm font-medium text-white/90'>
            Bot Name
          </label>
          <input
            id='botName'
            name='botName'
            type='text'
            required
            defaultValue={botName}
            placeholder='Enter bot name'
            className='w-full rounded-lg border border-white/15 bg-dark px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none'
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='description' className='block text-sm font-medium text-white/90'>
            Description
          </label>
          <textarea
            id='description'
            name='description'
            required
            rows={4}
            defaultValue={description}
            placeholder='Describe what this bot should do'
            className='w-full rounded-lg border border-white/15 bg-dark px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none'
          />
        </div>

        <button
          type='submit'
          className='button-border-gradient hover:button-gradient-hover relative inline-flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-sm text-white shadow-button hover:shadow-none'
        >
          Continue
        </button>
      </form>
    </article>
  );
}
