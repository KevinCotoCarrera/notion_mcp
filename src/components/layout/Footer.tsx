"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("home.footer");
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <span>KraowKao</span>
          <span className="text-gray-400">•</span>
          <span>
            {t("tagline", { default: "AI-powered feedback for restaurants" })}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <a className="hover:text-amber-600" href="tel:+66636455571">
            {t("phoneLabel", { default: "Phone" })}: +66 63 645 5571
          </a>
          <span className="hidden sm:inline text-gray-300">|</span>
          <a
            className="hover:text-amber-600"
            href="mailto:founder@kraowkao.com"
          >
            {t("emailLabel", { default: "Email" })}: founder@kraowkao.com
          </a>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-4 text-xs text-gray-500 flex items-center justify-between">
          <span>
            © {new Date().getFullYear()} KraowKao.{" "}
            {t("rights", { default: "All rights reserved." })}
          </span>
          <div className="flex items-center gap-4">
            <Link href="#features" className="hover:text-gray-700">
              {t("links.features", { default: "Features" })}
            </Link>
            <Link href="#pricing" className="hover:text-gray-700">
              {t("links.pricing", { default: "Pricing" })}
            </Link>
            <Link href="#whyus" className="hover:text-gray-700">
              {t("links.whyus", { default: "Why Us" })}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
