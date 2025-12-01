import { useTranslations } from "next-intl";

// Password visibility toggle component with eye icon
type PasswordVisibilityToggleProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  visible: boolean;
};

export default function PasswordVisibilityToggle({
  onClick,
  visible,
}: PasswordVisibilityToggleProps) {
  const t = useTranslations("auth");

  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={visible ? t("hidePassword") : t("showPassword")}
      className="flex items-center focus:outline-none"
      onClick={onClick}
    >
      {visible ? (
        // Open eye
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#fb64b6"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ) : (
        // Slashed eye
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#fb64b6"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M9.88 9.88A3 3 0 0112 9c.795 0 1.558.316 2.12.88m2.121 2.121a3 3 0 01-4.242 4.243"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.53 6.53A9.969 9.969 0 002.46 12c1.27 4.05 5.06 7 9.54 7 1.76 0 3.41-.42 4.85-1.17m3.15-3.15A9.953 9.953 0 0021.54 12c-1.27-4.05-5.06-7-9.54-7-1.07 0-2.09.16-3.05.46"
          />
        </svg>
      )}
      <span className="text-sm text-gray-600 ml-1">
        {visible ? t("hidePassword") : t("showPassword")}
      </span>
    </button>
  );
}
