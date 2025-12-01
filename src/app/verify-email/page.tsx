"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@lib/api/axios";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("Invalid or missing verification token.");
      return;
    }

    api
      .get(`/verify-email/?token=${token}`)
      .then((res) => {
        Cookies.set("access", res.data.access, { sameSite: "strict" });
        Cookies.set("refresh", res.data.refresh, { sameSite: "strict" });
        setStatus("Email verified! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1500);
      })
      .catch(() => {
        setStatus("Verification failed or token expired.");
      });
  }, [params, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p>{status}</p>
    </div>
  );
}
