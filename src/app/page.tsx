"use client";
import { useRedirectIfAuthenticated } from "@lib/hooks/useAuthRedirect";
import NavBar from "@components/layout/NavBar";
import { useTranslations } from "next-intl";
import SEOScripts from "@components/seo/SEOScripts";
import { useState, useEffect } from "react";

import Header from "@components/sections/Header";
import HeaderImage from "@components/sections/HeaderImage";
import Features from "@components/sections/Features";
import WhyUs from "@components/sections/WhyUs";
import SalesImpact from "@components/sections/SalesImpact";
import JoinWaitlist from "@components/sections/JoinWaitlist";
import PricingSection from "@components/sections/PricingSection";
import Footer from "@components/layout/Footer";

export default function Home() {
  const t = useTranslations("home");
  useRedirectIfAuthenticated();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <>
      <SEOScripts />
      <div
        className={`pb-12 md:pb-4 transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <NavBar />
        <div className="min-h-screen bg-gray-50">
          {/* Full-bleed Hero */}
          <section className="w-full bg-gray-100/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-8 py-12">
              <div className="relative grid items-center gap-12 md:grid-cols-2">
                <Header />
                {/* Right: Image with overlays */}
                <HeaderImage />
              </div>
            </div>
          </section>

          {/* Main content (constrained) */}
          <main className="mx-auto max-w-7xl px-4 sm:px-8 py-12 ">
            {/* Features */}
            <Features />

            {/* Why Us */}
            <WhyUs />

            {/* Sales Impact */}
            <SalesImpact />

            {/* Join Waitlist */}
            <JoinWaitlist />
            <PricingSection />
            {/* Banner */}
            {/* <section
              id="pricing"
              className="mt-16 rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm"
            >
              <span className="text-3xl font-semibold text-gray-800">
                {t("bannerTitle")}
              </span>
            </section> */}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
