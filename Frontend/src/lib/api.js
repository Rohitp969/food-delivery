import { clearSession, getSession } from "./session";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error("VITE_API_URL is required. Set it in the frontend environment file.");
}

export const API_URL = configuredApiUrl.replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const handleExpiredSession = () => {
  clearSession();
  const { pathname, search } = window.location;
  if (!pathname.startsWith("/login")) {
    window.location.assign(`/login?expired=1&next=${encodeURIComponent(pathname + search)}`);
  }
};

// fetch wrapper: adds the auth token, parses JSON and throws ApiError with the
// server's message when the request fails
export const api = async (path, { method = "GET", body, headers = {} } = {}) => {
  const { token } = getSession();
  const isForm = body instanceof FormData;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(isForm || body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: isForm ? body : body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && token) {
    handleExpiredSession();
  }
  if (!response.ok || data.success === false) {
    throw new ApiError(data.message || "Something went wrong. Please try again.", response.status, data);
  }
  return data;
};

export const uploadImage = async (file) => {
  const form = new FormData();
  form.append("image", file);
  const data = await api("/api/upload", { method: "POST", body: form });
  return data.url;
};
