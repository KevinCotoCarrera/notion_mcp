"use client";

import { useTransition } from "react";
import { Locale } from "@lib/services/i18n/config";
import { setUserLocale } from "@lib/services/i18n/locale";
import { Languages } from "lucide-react";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

// Flag emojis for languages
const FLAGS: Record<string, string> = {
  en: "🇺🇸",
  th: "🇹🇭",
  es: "🇪🇸",
  ch: "🇨🇳",
  jp: "🇯🇵",
  it: "🇮🇹",
  de: "🇩🇪",
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const locale = e.target.value as Locale;
    startTransition(async () => {
      await setUserLocale(locale);
    });
  }

  const currentFlag = FLAGS[defaultValue] || "🌐";

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="locale-switcher">
        {label}
      </label>

      {/* Flag Display */}
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <span className="text-lg">{currentFlag}</span>
      </div>

      <select
        id="locale-switcher"
        value={defaultValue}
        onChange={onChange}
        disabled={isPending}
        className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 
                   transition-colors hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 
                   focus:border-transparent appearance-none disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-sm"
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {/* Dropdown Icon */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        {isPending ? (
          <div className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full" />
        ) : (
          <Languages className="h-4 w-4 text-gray-500" />
        )}
      </div>
    </div>
  );
}
