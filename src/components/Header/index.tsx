"use client";
import { useUser, UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "../../../public/images/logo/logo.png";
import DropDown from "./DropDown";
import menuData from "./menuData";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [monstraBytes, setMonstraBytes] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { user } = useUser();

  const pathUrl = usePathname();

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  // Fetch user's monstra bytes
  useEffect(() => {
    if (user) {
      const fetchMonstraBytes = async () => {
        try {
          const res = await fetch("/api/user/monstra-bytes");
          if (res.ok) {
            const data = await res.json();
            setMonstraBytes(data.monstraBytes);
          }
        } catch (error) {
          console.error("Failed to fetch monstra bytes:", error);
        }
      };
      fetchMonstraBytes();
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-1000 w-full ${
          stickyMenu
            ? "before:features-row-border bg-dark/70 py-8! shadow-sm backdrop-blur-lg transition duration-100 before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full lg:py-2!"
            : "py-12 lg:py-3"
        }`}
      >
        <div className="relative mx-auto max-w-[1170px] items-center justify-between px-4 sm:px-8 lg:flex xl:px-0">
          <div className="flex w-full items-center justify-between lg:w-auto">
            <div className="flex flex-col gap-2 pt-4 pb-4 lg:pt-0 lg:pb-0">
              <Link href="/" className="pt-4">
                <Image src={logo} alt="Logo" width={164} height={36} />
              </Link>
              {user && (
                <Link
                  href="/premium"
                  className="button-border-gradient hover:button-gradient-hover relative flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white shadow-button hover:shadow-none"
                >
                  Join Monstra Premium
                </Link>
              )}
            </div>

            <button
              onClick={() => setNavigationOpen(!navigationOpen)}
              className="block lg:hidden"
            >
              <span className="relative block h-5.5 w-5.5 cursor-pointer">
                <span className="du-block absolute right-0 h-full w-full">
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-white delay-0 duration-200 ease-in-out ${
                      !navigationOpen ? "w-full! delay-300" : "w-0"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-white delay-150 duration-200 ease-in-out ${
                      !navigationOpen ? "delay-400 w-full!" : "w-0"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-white delay-200 duration-200 ease-in-out ${
                      !navigationOpen ? "w-full! delay-500" : "w-0"
                    }`}
                  ></span>
                </span>
                <span className="du-block absolute right-0 h-full w-full rotate-45">
                  <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-white delay-300 duration-200 ease-in-out ${
                      !navigationOpen ? "h-0! delay-0" : "h-full"
                    }`}
                  ></span>
                  <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-white duration-200 ease-in-out ${
                      !navigationOpen ? "h-0! delay-200" : "h-0.5"
                    }`}
                  ></span>
                </span>
              </span>
            </button>
          </div>

          <div
            className={`invisible h-0 w-full items-center justify-end lg:visible lg:flex lg:h-auto lg:flex-1 ${
              navigationOpen
                ? "visible! relative mt-4 h-auto! max-h-[400px] overflow-y-scroll rounded-md bg-dark p-7.5 shadow-lg"
                : ""
            }`}
          >
            <nav className="lg:ml-auto">
              <ul className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-2">
                {menuData.map((menuItem, key) => (
                  <li
                    key={key}
                    className={`nav__menu group relative ${
                      stickyMenu ? "lg:py-4" : "lg:py-7"
                    }`}
                  >
                    {menuItem.submenu ? (
                      <>
                        <DropDown menuItem={menuItem} />
                      </>
                    ) : (
                      <Link
                        href={`${menuItem.path}`}
                        className={`hover:nav-gradient relative border border-transparent px-4 py-1.5 text-sm hover:text-white ${
                          pathUrl === menuItem.path
                            ? "nav-gradient text-white"
                            : "text-white/80"
                        }`}
                      >
                        {menuItem.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-7 flex items-center gap-6 lg:mt-0">
              <SignedIn>
                <div className="relative group">
                  <button
                    className="button-border-gradient hover:button-gradient-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white shadow-button hover:shadow-none focus:outline-none"
                    onClick={() => setSettingsOpen((open) => !open)}
                    onBlur={() => setTimeout(() => setSettingsOpen(false), 150)}
                  >
                    Currencies
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {settingsOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-dark/95 shadow-lg border border-white/10 z-1001 p-4">
                      <div className="flex flex-col gap-2 text-sm text-white">
                        <div className="flex items-center gap-2 justify-between">
                          <span>MonstraBytes</span>
                          <span className="font-semibold">3</span>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <span>AurumBytes</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <span>Nums</span>
                          <span className="font-semibold">10</span>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <span>Flamma</span>
                          <span className="font-semibold">5</span>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <span>Mutates</span>
                          <span className="font-semibold">5</span>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <span>Fortuna</span>
                          <span className="font-semibold">1000</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "hidden", // Hide the avatar
                      userButtonPopoverCard: "bg-[#18144a] border border-[#22204a] text-[#b8860b] rounded-lg shadow-lg",
                      userButtonPopoverActionButton: "hover:bg-[#0a1433] text-[#b8860b]",
                      userButtonPopoverActionButtonIcon: "text-[#b8860b]",
                      userButtonPopoverFooter: "bg-[#0a1433] text-[#b8860b] rounded-b-lg",
                      userButtonPopoverActionText: "text-[#b8860b]",
                      userButtonPopoverAction: "text-[#b8860b]"
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <span className="button-border-gradient hover:button-gradient-hover relative flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-sm text-white shadow-button hover:shadow-none cursor-pointer">
                    Sign In
                  </span>
                </SignInButton>
                <Link
                  href="/sign-up"
                  className="button-border-gradient hover:button-gradient-hover relative flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-sm text-white shadow-button hover:shadow-none"
                >
                  Sign up
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
