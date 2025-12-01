// axios.ts
import Axios from "axios";
import { getAccessToken, clearAuthCookies } from "@lib/utils/cookies";

// Make sure backend URL has a protocol
const ensureProtocol = (url: string | undefined): string => {
  if (!url) return "http://localhost:8000/v1"; // Default fallback

  // Check if the URL already has a protocol
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Add http:// protocol if missing
  return `http://${url}`;
};

// Get the backend URL with guaranteed protocol
const backendUrl = ensureProtocol(process.env.NEXT_PUBLIC_BACKEND_URL);

// Log axios setup
console.log("Axios initializing with baseURL:", backendUrl);

const axios = Axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 10 seconds
});

// Log the created axios instance
console.log("Axios instance created with config:", {
  baseURL: axios.defaults.baseURL,
  timeout: axios.defaults.timeout,
  headers: axios.defaults.headers,
});

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Log outgoing requests in development
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `Request: ${config.method?.toUpperCase()} ${config.baseURL}${
          config.url
        }`,
        {
          headers: config.headers,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV !== "production") {
      console.log(`Response: ${response.status} ${response.config.url}`, {
        headers: response.headers,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Log errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response error:", {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });

      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.log("401 Unauthorized response - clearing auth cookies");
        clearAuthCookies();
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network error - no response received:", {
        url: error.config?.url,
        method: error.config?.method,
        request: error.request,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;
