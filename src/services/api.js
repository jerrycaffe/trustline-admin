import CryptoJS from "crypto-js";

const sanitizeBaseUrl = (rawValue) => {
  const value = String(rawValue ?? "").trim();

  if (!value || value === "undefined" || value === "null") {
    return "/";
  }

  return value;
};

const BASE_URL = sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
const STORAGE_SECRET = import.meta.env.VITE_STORAGE_SECRET;

const getStoredToken = () => {
  if (typeof window === "undefined" || !STORAGE_SECRET) {
    return "";
  }

  const encryptedToken = localStorage.getItem("authToken");
  if (!encryptedToken) {
    return "";
  }

  try {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedToken,
      STORAGE_SECRET,
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return "";
  }
};

const createHeaders = (includeAuth = false, skipContentType = false) => {
  const headers = {};

  if (!skipContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (includeAuth) {
    const token = getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

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

const dispatchSessionExpired = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sessionExpired"));
  }
};

export const getStoredEmail = () => {
  if (typeof window === "undefined" || !STORAGE_SECRET) {
    return "";
  }

  const encrypted = localStorage.getItem("authEmail");
  if (!encrypted) return "";

  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, STORAGE_SECRET).toString(
      CryptoJS.enc.Utf8,
    );
    return JSON.parse(decrypted) || "";
  } catch {
    return "";
  }
};

export const api = {
  post: async (uri, data, options = {}) => {
    const { auth = false } = options;
    const isFormData = data instanceof FormData;

    const fetchOptions = {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    };

    if (isFormData) {
      // For FormData, let browser auto-set multipart/form-data boundary
      // Only add Authorization header if needed
      if (auth) {
        const token = getStoredToken();
        if (token) {
          fetchOptions.headers = { Authorization: `Bearer ${token}` };
        }
      }
    } else {
      // For JSON requests, include standard headers
      fetchOptions.headers = createHeaders(auth, false);
    }

    const response = await fetch(buildUrl(uri), fetchOptions);

    const result = await parseResponseBody(response);

    if (!response.ok || result?.error) {
      if (response.status === 401) dispatchSessionExpired();
      throw new Error(getErrorMessage(response, result));
    }

    return result || {};
  },

  get: async (uri) => {
    const response = await fetch(buildUrl(uri), {
      method: "GET",
      headers: createHeaders(true),
    });

    const result = await parseResponseBody(response);

    if (!response.ok || result?.error) {
      if (response.status === 401) dispatchSessionExpired();
      throw new Error(getErrorMessage(response, result));
    }

    return result || {};
  },

  put: async (uri, data, options = {}) => {
    const { auth = false } = options;
    const isFormData = data instanceof FormData;

    const fetchOptions = {
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
    };

    if (isFormData) {
      if (auth) {
        const token = getStoredToken();
        if (token) {
          fetchOptions.headers = { Authorization: `Bearer ${token}` };
        }
      }
    } else {
      fetchOptions.headers = createHeaders(auth, false);
    }

    const response = await fetch(buildUrl(uri), fetchOptions);

    const result = await parseResponseBody(response);

    if (!response.ok || result?.error) {
      if (response.status === 401) dispatchSessionExpired();
      throw new Error(getErrorMessage(response, result));
    }

    return result || {};
  },

  delete: async (uri, options = {}) => {
    const { auth = false } = options;

    const response = await fetch(buildUrl(uri), {
      method: "DELETE",
      headers: createHeaders(auth),
    });

    // 204 No Content is a valid success response for DELETE
    if (response.status === 204) {
      return {};
    }

    const result = await parseResponseBody(response);

    if (!response.ok || result?.error) {
      if (response.status === 401) dispatchSessionExpired();
      throw new Error(getErrorMessage(response, result));
    }

    return result || {};
  },
};

export const AUTH_ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
};
