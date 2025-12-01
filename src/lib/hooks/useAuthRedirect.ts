import { useRouter } from "next/navigation"; 
import Cookies from "js-cookie";
import { useEffect } from "react";

/* 1️⃣  Public pages: send signed-in users away */
export function useRedirectIfAuthenticated(
  redirectPath = "/dashboard"
) {
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("access")) {
      router.replace(redirectPath);
    }
  }, [redirectPath, router]);
}

/* 2️⃣  Private pages: boot guests to login */
export function useRedirectIfUnauthenticated(
  loginPath = "/login"
) {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get("access")) {
      router.replace(loginPath);
    }
  }, [loginPath, router]);
}
