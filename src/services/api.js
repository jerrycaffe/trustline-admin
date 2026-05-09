const sanitizeBaseUrl = (rawValue) => {
  const value = String(rawValue ?? "").trim();

  if (!value || value === "undefined" || value === "null") {
    return "/";
  }

  return value;
};

const BASE_URL = sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const buildUrl = (uri) => {
  const normalizedUri = `/${String(uri || "").replace(/^\/+/, "")}`;

  if (BASE_URL === "/") {
    return normalizedUri;
  }

  const normalizedBase = BASE_URL.replace(/\/+$/, "");
  return `${normalizedBase}${normalizedUri}`;
};

const parseResponseBody = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    // Some backends return plain-text errors; keep it as message instead of crashing.
    return { message: text };
  }
};

const getErrorMessage = (response, result) => {
  return (
    result?.error?.message ||
    result?.message ||
    `Request failed with status ${response.status}`
  );
};

export const api = {
  post: async (uri, data) => {
    const response = await fetch(buildUrl(uri), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await parseResponseBody(response);

    if (!response.ok || result?.error) {
      throw new Error(getErrorMessage(response, result));
    }

    return result || {};
  },

  get: async (uri) => {
    const response = await fetch(buildUrl(uri), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await parseResponseBody(response);

    if (!response.ok || result?.error) {
      throw new Error(getErrorMessage(response, result));
    }

    return result || {};
  },
};

export const AUTH_ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
};
