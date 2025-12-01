// ReloadButton.jsx
import React from "react";

type ReloadButtonProps = {
  onReload: () => void;
  loading?: boolean;
  label?: string;
  className?: string;
};

export default function ReloadButton({
  onReload,
  loading = false,
  label = "Reload",
  className = "",
}: ReloadButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onReload}
      disabled={loading}
      className={`
        flex items-center justify-center
        h-11 w-11
        rounded-full
        bg-gradient-to-tr from-amber-500 via-amber-400 to-fuchsia-500
        text-white
        shadow-lg
        hover:shadow-2xl
        hover:scale-105
        active:scale-95
        transition-all duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-70"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 100 20v-2a8 8 0 01-8-8z"
          ></path>
        </svg>
      ) : (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12a7.5 7.5 0 0112.95-5.3m0 0V3.75m0 2.95h-2.95m6 5.8a7.5 7.5 0 01-12.95 5.3m0 0v3.45m0-2.95h2.95"
          />
        </svg>
      )}
    </button>
  );
}
