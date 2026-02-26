"use client";
import { useClerk, useUser } from "@clerk/nextjs";
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
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useUser();
  const { signOut } = useClerk();

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

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete-account", { method: "DELETE" });
      if (res.ok) {
        await signOut({ redirectUrl: "/" });
      } else {
        alert("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account");
    } finally {
      setIsDeleting(false);
    }
  };

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
                  <div className="relative">
                    <button
                      onClick={() => setSettingsOpen(!settingsOpen)}
                      className="text-sm text-white hover:text-opacity-75"
                    >
                      ⚙️
                    </button>
                    {settingsOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-lg bg-dark/95 shadow-lg border border-white/10 z-1001">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Delete Account"}
                        </button>
                      </div>
                    )}
                  </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-7 flex items-center gap-6 lg:mt-0">
              {user ? (
                <>
                  {monstraBytes !== null && (
                    <div className="flex items-center gap-2 text-sm text-white">
                      <span className="font-semibold">{monstraBytes}</span>
                      <span className="text-xs text-white/80">MB</span>
                    </div>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-white hover:text-opacity-75"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-sm text-white hover:text-opacity-75"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="button-border-gradient hover:button-gradient-hover relative flex items-center gap-1.5 rounded-lg px-4.5 py-2 text-sm text-white shadow-button hover:shadow-none"
                  >
                    Sign up
                    <svg
                      className="mt-0.5"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.4002 7.60002L9.2252 2.35002C9.0002 2.12502 8.6502 2.12502 8.4252 2.35002C8.2002 2.57502 8.2002 2.92502 8.4252 3.15002L12.6252 7.42502H2.0002C1.7002 7.42502 1.4502 7.67502 1.4502 7.97502C1.4502 8.27502 1.7002 8.55003 2.0002 8.55003H12.6752L8.4252 12.875C8.2002 13.1 8.2002 13.45 8.4252 13.675C8.5252 13.775 8.6752 13.825 8.8252 13.825C8.9752 13.825 9.1252 13.775 9.2252 13.65L14.4002 8.40002C14.6252 8.17502 14.6252 7.82503 14.4002 7.60002Z"
                        fill="white"
                      />
                    </svg>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
