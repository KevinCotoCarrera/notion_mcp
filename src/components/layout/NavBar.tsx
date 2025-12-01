"use client";

import Link from "next/link";
import Button from "@components/ui/Button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@components/shared/LocaleSwitcher";
import { useScreenSize } from "@lib/hooks/useScreenSize";
type NavItem = { href: string; label: string };

export interface HeaderProps {
  nav?: NavItem[];
  showLogin?: boolean;
}

// Labels are keys for i18n under the "nav" namespace (fallbacks handled below)
const defaultNav: NavItem[] = [
  { href: "#features", label: "features" },
  { href: "#pricing", label: "pricing" },
  { href: "#whyus", label: "whyus" },
];

export default function NavBar({
  nav = defaultNav,
}: // showLogin = true,
HeaderProps) {
  const [open, setOpen] = useState(false);
  const screen = useScreenSize();
  const t = useTranslations("nav");

  // Translate known nav keys, otherwise fall back to the provided label
  const KNOWN_NAV_KEYS = new Set([
    "features",
    "pricing",
    "about",
    "whyus",
    "login",
  ]);
  const getLabel = (label: string) => {
    const key = (label || "").toLowerCase();
    if (KNOWN_NAV_KEYS.has(key)) {
      return t(key as keyof typeof t);
    }
    return label;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/75 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-semibold text-amber-600">
            KraowKao
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm text-gray-600">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 transition-colors"
              >
                {getLabel(item.label)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Login */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>

          {/* LOGIN BUTTON COMMENTED OUT */}
          {/*
          {showLogin && (
            <Link href="/login">
              <Button size="md" variant="primary">
                {t("login")}
              </Button>
            </Link>
          )}
          */}

          {/* Lock Discount Button (visible instead of login) */}
          {/* Lock Discount Button (responsive size) */}

          <Link href="#join-waitlist">
            <Button size={screen === "xs" ? "sm" : "md"} variant="primary">
              {t("lockDiscount")}
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="px-4 py-3 sm:px-6">
            <nav className="flex flex-col gap-1 text-sm text-gray-700">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2"
                  onClick={() => setOpen(false)}
                >
                  {getLabel(item.label)}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between mt-3">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
