"use client";
import { useState } from "react";
import api from "@lib/api/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { useRedirectIfAuthenticated } from "@lib/hooks/useAuthRedirect";
import { useTranslations } from "next-intl";
import PasswordVisibilityToggle from "@components/ui/PasswordVisibilityToggle";
import PageLayout from "@components/layout/PageLayout";
import FormSection from "@components/form/FormSection";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";

export default function RegisterPage() {
  useRedirectIfAuthenticated();
  const t = useTranslations("auth");
  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await api.post("/register/", fields);
      setSuccess(true);
      setTimeout(() => router.push("/verify-email-sent"), 1000);
    } catch (err) {
      const error = err as AxiosError<{
        username?: string[];
        email?: string[];
        password?: string[];
      }>;
      setError(
        error.response?.data?.username?.[0] ||
          error.response?.data?.email?.[0] ||
          error.response?.data?.password?.[0] ||
          t("registrationFailed")
      );
      setIsSubmitting(false);
    }
  }

  return (
    <PageLayout showLocaleSwitch={true}>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <FormSection
            title={t("createAccount")}
            description={t("registerSubtitle")}
            onSubmit={handleSubmit}
            error={error}
            success={success ? t("registrationSuccess") : undefined}
          >
            <div className="space-y-5">
              <Input
                id="username"
                name="username"
                label={t("username")}
                value={fields.username}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="username"
              />

              <Input
                id="email"
                name="email"
                type="email"
                label={t("email")}
                value={fields.email}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="email"
              />

              <Input
                id="password"
                name="password"
                label={t("password")}
                type={showPassword ? "text" : "password"}
                value={fields.password}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="new-password"
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
                disabled={success}
              >
                {t("register")}
              </Button>
            </div>

            <div className="text-center mt-6 text-sm text-gray-600">
              {t("loginInYourAccount")}{" "}
              <Link
                href="/login"
                className="font-medium text-amber-600 hover:text-amber-500"
              >
                {t("login")}
              </Link>
            </div>
          </FormSection>
        </div>
      </div>
    </PageLayout>
  );
}
