export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCookie(name, value, maxAgeSeconds) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function persistSession({ token, user }) {
  if (typeof window === "undefined" || !token) return false;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user ?? null));
  setCookie(TOKEN_KEY, token, 60 * 60);
  return true;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearCookie(TOKEN_KEY);
}

function errorMessage(status, data) {
  if (data?.message) return data.message;
  if (status === 401) return "Sesi habis atau token tidak valid, silakan login ulang";
  if (status === 403) return "Akses ditolak";
  if (status === 422) return "Token tidak ada, silakan login ulang";
  return "Request gagal";
}

export async function apiFetch(path, { token, ...options } = {}) {
  const authToken = token ?? getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers ?? {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // respons kosong / bukan JSON
  }

  if (!res.ok) {
    const error = new Error(errorMessage(res.status, data));
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

function toForm(fields, imageFile) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, String(value ?? ""));
  }
  if (imageFile) form.append("image", imageFile);
  return form;
}

export const authApi = {
  register({ username, email, password }) {
    return apiFetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
  },

  login({ email, password }) {
    return apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  me(token) {
    return apiFetch("/api/me", { token });
  },
};

export const streamerApi = {
  list(token) {
    return apiFetch("/api/streamers", { token });
  },

  create({ namast, kategorist, subscriber, views, imageFile }, token) {
    return apiFetch("/api/streamers", {
      method: "POST",
      body: toForm({ namast, kategorist, subscriber, views }, imageFile),
      token,
    });
  },

  update(id, { namast, kategorist, subscriber, views, imageFile }, token) {
    return apiFetch(`/api/streamers/${id}`, {
      method: "PUT",
      body: toForm({ namast, kategorist, subscriber, views }, imageFile),
      token,
    });
  },

  remove(id, token) {
    return apiFetch(`/api/streamers/${id}`, { method: "DELETE", token });
  },
};

export const youtuberApi = {
  list(token) {
    return apiFetch("/api/youtubers", { token });
  },

  create(
    { nama_youtuber, kategori, subscriber, views, total_video, imageFile },
    token,
  ) {
    return apiFetch("/api/youtubers", {
      method: "POST",
      body: toForm(
        { nama_youtuber, kategori, subscriber, views, total_video },
        imageFile,
      ),
      token,
    });
  },

  update(
    id,
    { nama_youtuber, kategori, subscriber, views, total_video, imageFile },
    token,
  ) {
    return apiFetch(`/api/youtubers/${id}`, {
      method: "PUT",
      body: toForm(
        { nama_youtuber, kategori, subscriber, views, total_video },
        imageFile,
      ),
      token,
    });
  },

  remove(id, token) {
    return apiFetch(`/api/youtubers/${id}`, { method: "DELETE", token });
  },
};

export const usersApi = {
  list(token) {
    return apiFetch("/api/users", { token });
  },

  updateRole(id, role, token) {
    return apiFetch(`/api/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
      token,
    });
  },

  remove(id, token) {
    return apiFetch(`/api/users/${id}`, { method: "DELETE", token });
  },
};
