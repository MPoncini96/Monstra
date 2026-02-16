"use client";

import Image from "next/image";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface Benefit {
  id: number;
  text: string;
}

const stepsData: Step[] = [
  {
    id: 1,
    title: "Submit your bot",
    description:
      "Upload your strategy, define its rules, and let it run inside Monstra's simulation engine using real market data.",
  },
  {
    id: 2,
    title: "Get discovered",
    description:
      "Your bot appears alongside official Monstra strategies, where users can explore performance, subscribe, and allocate capital.",
  },
  {
    id: 3,
    title: "Earn monthly payouts",
    description:
      "When users subscribe to your bot, you earn recurring Stripe payments through Monstra's creator revenue share.",
  },
];

const benefitsData: Benefit[] = [
  {
    id: 1,
    text: "Reach an audience of strategy enthusiasts",
  },
  {
    id: 2,
    text: "Showcase your algorithm's performance publicly",
  },
  {
    id: 3,
    text: "Build a reputation on global leaderboards",
  },
  {
    id: 4,
    text: "Earn recurring subscription revenue",
  },
];

const CreateBots = () => {
  return (
    <section suppressHydrationWarning className="pt-17.5 lg:pt-22.5 xl:pt-27.5 pb-17.5 lg:pb-22.5 xl:pb-27.5">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="pricing-item-border relative z-10 overflow-hidden rounded-[30px] bg-dark px-6 py-12 lg:px-8 lg:py-16">
          {/* <!-- bg shapes --> */}
          <div className="absolute bottom-0 left-0 -z-1 h-full w-full bg-[url(/images/cta/grid.svg)] bg-cover bg-bottom bg-no-repeat"></div>

          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <span className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2">
              <Image
                src="/images/blur/blur-22.svg"
                alt="blur-sm"
                fill
                className="max-w-none"
              />
            </span>
            <span className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2">
              <Image
                src="/images/blur/blur-23.svg"
                alt="blur-sm"
                fill
                className="max-w-none"
              />
            </span>
            <span className="absolute bottom-0 left-1/2 -z-1 aspect-530/253 max-w-[530px] -translate-x-1/2">
              <Image
                src="/images/blur/blur-24.svg"
                alt="blur-sm"
                fill
                className="max-w-none"
              />
            </span>
          </div>

          {/* <!-- stars --> */}
          <div className="absolute -bottom-25 left-1/2 -z-1 h-60 w-full max-w-[482px] -translate-x-1/2 overflow-hidden">
            <div className="stars"></div>
            <div className="stars2"></div>
          </div>

          <div className="relative z-10">
            {/* Headline */}
            <div className="mb-12 text-center md:mb-16 xl:mb-20">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl xl:text-5xl">
                Become a Monstra Creator
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-white/70 sm:text-xl">
                Turn your trading strategies into products used by the community.
              </p>
            </div>

            {/* Intro paragraph */}
            <div className="mb-16 rounded-lg overflow-hidden px-8 py-12 md:px-12 md:py-16 xl:mb-20" style={{background: 'linear-gradient(135deg, rgba(134, 70, 244, 0.05) 0%, rgba(211, 69, 248, 0.05) 100%)'}}>
              <p className="text-lg text-white/90 leading-relaxed">
                Submit your trading algorithms to the Monstra marketplace and let others allocate virtual capital to your strategies. Build a following, climb the leaderboards, and earn monthly payouts when users subscribe to your bots.
              </p>
            </div>

            {/* How it works - 3 columns */}
            <div className="mb-16 xl:mb-20">
              <h3 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
                How it works
              </h3>
              <div className="grid gap-8 md:grid-cols-3">
                {stepsData.map((step) => (
                  <div
                    key={step.id}
                    className="relative overflow-hidden rounded-2xl bg-dark/50 px-8 py-10 transition-all duration-300 hover:bg-dark/70 border border-white/10"
                  >
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl" style={{background: 'linear-gradient(135deg, rgba(134, 70, 244, 0.2) 0%, rgba(102, 51, 153, 0.2) 100%)'}}>
                      <span className="text-lg font-bold" style={{color: '#D4A574'}}>
                        {step.id}
                      </span>
                    </div>
                    <h4 className="mb-3 text-xl font-semibold text-white">
                      {step.title}
                    </h4>
                    <p className="text-white/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits section */}
            <div className="rounded-lg overflow-hidden px-8 py-12 md:px-12 md:py-16" style={{background: 'linear-gradient(135deg, rgba(134, 70, 244, 0.05) 0%, rgba(211, 69, 248, 0.05) 100%)'}}>
              <h3 className="mb-8 text-2xl font-bold text-white sm:text-3xl">
                Why creators join Monstra
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {benefitsData.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{background: 'linear-gradient(135deg, rgba(134, 70, 244, 0.3) 0%, rgba(102, 51, 153, 0.3) 100%)'}}>
                        <span style={{color: '#D4A574'}}>✓</span>
                      </div>
                    </div>
                    <p className="text-lg text-white/80">
                      {benefit.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateBots;
