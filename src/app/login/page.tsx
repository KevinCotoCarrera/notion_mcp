"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@lib/api/user/auth";
import { useRedirectIfAuthenticated } from "@lib/hooks/useAuthRedirect";
import { useTranslations } from "next-intl";
import PasswordVisibilityToggle from "@components/ui/PasswordVisibilityToggle";
import PageLayout from "@components/layout/PageLayout";
import FormSection from "@components/form/FormSection";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  useRedirectIfAuthenticated();
  const t = useTranslations("auth");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    console.log("Form submitted, attempting login...");

    try {
      await login(username, password);
      console.log("Login successful, redirecting...");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error details:", error);

      // More detailed error message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setError(`${t("invalidCredentials")} (${error.response.status})`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        setError("Server not responding. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request error:", error.message);
        setError(`Error: ${error.message}`);
      }

      setIsSubmitting(false);
    }
  }

  return (
    <PageLayout showLocaleSwitch={true}>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <FormSection
            title={t("login")}
            description={t("loginSubtitle")}
            onSubmit={handleSubmit}
            error={error}
          >
            <div className="space-y-5">
              <Input
                id="username"
                label={t("username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                autoComplete="username"
              />

              <Input
                id="password"
                label={t("password")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete="current-password"
                endIcon={
                  <PasswordVisibilityToggle
                    visible={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                    iconOnly
                  />
                }
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                className="mt-4"
              >
                {t("login")}
              </Button>
            </div>

            <div className="text-center mt-6 text-sm text-gray-600">
              {/* Add a "Don't have an account? Register" link if needed */}
              <Link
                href="/register"
                className="font-medium text-amber-600 hover:text-amber-500"
              >
                {t("createAccount")}{" "}
              </Link>
            </div>
          </FormSection>
        </div>
      </div>
    </PageLayout>
  );
}
