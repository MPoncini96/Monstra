import Link from "next/link";
import Image from "next/image";

const bots = [
  { name: "Bellator", path: "/bots/bellator", image: "/images/Monsters/Bellator_icon.png" },
  { name: "Cyclus", path: "/bots/cyclus", image: "/images/Monsters/Cylcus_icon.png" },
  { name: "Imperium", path: "/bots/imperium", image: "/images/Monsters/Imperium_Icon.png" },
  { name: "Medicus", path: "/bots/medicus", image: "/images/Monsters/Medicus_Icon.png" },
  { name: "Vectura", path: "/bots/vectura" },
  { name: "Viator", path: "/bots/viator" },
  { name: "Vis", path: "/bots/vis" },
];

export default function BotsPage() {
  return (
    <section className="mx-auto max-w-[1170px] px-4 pb-20 pt-32 sm:px-8 xl:px-0">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bots.map((bot) => (
          <Link
            key={bot.name}
            href={bot.path}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
          >
            {bot.image ? (
              <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/30">
                <Image
                  src={bot.image}
                  alt={bot.name}
                  fill
                  className={`p-2 drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)] transition-all duration-300 ${
                    bot.name === "Bellator"
                      ? "object-contain group-hover:object-cover group-hover:scale-105"
                      : "object-contain"
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.03] text-sm text-white/40">
                Image Placeholder
              </div>
            )}
            <h2 className="mt-3 text-base font-medium text-white">{bot.name}</h2>
          </Link>
        ))}
      </div>
    </section>
  );
}
