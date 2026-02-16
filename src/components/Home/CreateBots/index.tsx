"use client";

import Image from "next/image";

const CreateBots = () => {
  return (
    <section suppressHydrationWarning className="pt-17.5 lg:pt-22.5 xl:pt-27.5">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="cta-box-gradient relative z-999 overflow-hidden rounded-[30px] bg-dark px-6 py-12 lg:px-8 lg:py-16">
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

          <div className="wow fadeInUp text-left relative z-10">
            <h2 className="mb-4.5 text-2xl font-extrabold text-white sm:text-4xl xl:text-heading-2">
              Create Monstra Bots
            </h2>
            <p className="mb-9 font-medium text-white text-lg">
            Design and deploy custom trading algorithms in Monstra's simulation environment. Backtest, refine, and compare your strategies using real market data — then submit your best bots to the Monstra marketplace and earn monthly Stripe payouts when users subscribe to your strategies.            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateBots;
