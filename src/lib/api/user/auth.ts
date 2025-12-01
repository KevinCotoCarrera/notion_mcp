// services/auth.ts
import axios from "../axios";
import {
  setAuthCookies,
  clearAuthCookies,
  getAccessToken,
} from "@lib/utils/cookies";

interface TokenPair {
  access: string;
  refresh: string;
}

export async function register(
  username: string,
  password: string,
  email: string
) {
  const { data } = await axios.post<TokenPair>("/register/", {
    username,
    password,
    email,
  });
  setAuthCookies(data.access, data.refresh);
  return data;
}

export async function login(username: string, password: string) {
  console.log("Login attempt:", {
    username,
    baseURL: axios.defaults.baseURL,
    fullURL: axios.defaults.baseURL + "/token/",
  });

  // Log headers being sent
  const headers = { ...axios.defaults.headers };
  console.log("Request headers:", headers);

  try {
    // Use more detailed approach to debug request
    const response = await axios.post<TokenPair>("/token/", {
      username,
      password,
    });

    console.log("Login successful:", {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    setAuthCookies(response.data.access, response.data.refresh);
    return response.data;
  } catch (error: any) {
    console.error("Login failed:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          }
        : "No response",
      request: error.request
        ? "Request was made but no response"
        : "No request",
      config: error.config
        ? {
            url: error.config.url,
            method: error.config.method,
            baseURL: error.config.baseURL,
            headers: error.config.headers,
          }
        : "No config",
    });
    throw error;
  }
}

export function logout() {
  clearAuthCookies();
}

export { getAccessToken };
