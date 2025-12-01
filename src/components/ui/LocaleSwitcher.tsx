"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@lib/services/i18n/locale";

type Props = {
  className?: string;
};

export default function LocaleSwitcher({ className = "" }: Props) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const items = [
    {
      value: "en",
      label: t("en"),
    },
    {
      value: "th",
      label: t("th"),
    },
  ];

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value as "en" | "th";
    startTransition(async () => {
      await setUserLocale(newLocale);
    });
  }

  return (
    <div className={`relative ${className}`}>
      <label className="sr-only" htmlFor="locale-switcher">
        {t("label")}
      </label>
      <div className="relative">
        <select
          id="locale-switcher"
          value={locale}
          onChange={onChange}
          disabled={isPending}
          className="h-10 rounded-md border border-gray-200 bg-white pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors appearance-none"
        >
          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {/* Globe icon and dropdown indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
