const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api";

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  return res;
};