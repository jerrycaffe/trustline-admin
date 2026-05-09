const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const BASE_URL = RAW_BASE_URL.endsWith("/") ? RAW_BASE_URL : `${RAW_BASE_URL}/`;

const buildUrl = (uri) => {
  const normalizedUri = uri.startsWith("/") ? uri.slice(1) : uri;
  return `${BASE_URL}${normalizedUri}`;
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
  LOGIN: "api/v1/auth/login",
};
