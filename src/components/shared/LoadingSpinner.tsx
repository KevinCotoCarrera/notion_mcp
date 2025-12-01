import React from "react";
import { useTranslations } from "next-intl";

interface LoadingSpinnerProps {
  message?: string;
  translationKey?: string;
}

export default function LoadingSpinner({
  message,
  translationKey = "dashboard.settingsNav.loading",
}: LoadingSpinnerProps) {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400">
          {message || t(translationKey)}
        </p>
      </div>
    </div>
  );
}
