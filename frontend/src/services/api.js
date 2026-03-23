const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  post: async (uri, data) => {
    const response = await fetch(`${BASE_URL}${uri}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error.message || result.message || 'Request failed');
    }

    return result;
  },

  get: async (uri) => {
    const response = await fetch(`${BASE_URL}${uri}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error.message || result.message || 'Request failed');
    }

    return result;
  },
};

export const AUTH_ENDPOINTS = {
  LOGIN: 'api/v1/auth/login',
};
