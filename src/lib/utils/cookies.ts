// utils/authCookies.ts
import Cookies from "js-cookie";

const COOKIE_OPTIONS = {
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
};

export function setAuthCookies(access: string, refresh: string) {
  Cookies.set("access",  access,  COOKIE_OPTIONS);
  Cookies.set("refresh", refresh, COOKIE_OPTIONS);
}

export function clearAuthCookies() {
  Cookies.remove("access");
  Cookies.remove("refresh");
}

export const getAccessToken = () => Cookies.get("access");
