import Header from "@/components/Header";
import Image from "next/image";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-dark min-h-screen relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[url(/images/cta/grid.svg)] bg-cover bg-center bg-no-repeat"></div>
      
      {/* Blur effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <span className="absolute bottom-0 left-1/2 z-0 h-full w-full -translate-x-1/2">
          <Image
            src="/images/blur/blur-22.svg"
            alt="blur"
            fill
            className="max-w-none"
          />
        </span>
        <span className="absolute bottom-0 left-1/2 -z-1 h-full w-full -translate-x-1/2">
          <Image
            src="/images/blur/blur-23.svg"
            alt="blur"
            fill
            className="max-w-none"
          />
        </span>
        <span className="absolute bottom-0 left-1/2 -z-1 aspect-530/253 max-w-[530px] -translate-x-1/2">
          <Image
            src="/images/blur/blur-24.svg"
            alt="blur"
            fill
            className="max-w-none"
          />
        </span>
      </div>

      {/* Stars */}
      <div className="absolute -bottom-25 left-1/2 z-0 h-60 w-full max-w-[482px] -translate-x-1/2 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <div className="pt-24">{children}</div>
      </div>
    </div>
  );
}
