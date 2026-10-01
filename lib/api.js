export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "token";
const USER_KEY = "user";

// --- Token & user persistence (localStorage + cookie untuk proxy.js) ---

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
  // Cookie non-httpOnly agar bisa dibaca proxy.js untuk optimistic redirect.
  // Token JWT asli dari backend tetap diverifikasi di backend (verifyToken).
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function persistSession({ token, user }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // 1 jam mengikuti expiresIn backend ("1h")
  setCookie(TOKEN_KEY, token, 60 * 60);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearCookie(TOKEN_KEY);
}

// --- Fetch helper: otomatis pasang Authorization: Bearer <JWT> ---

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
    // backend selalu JSON, tapi jaga-jaga kalau respons kosong
  }

  if (!res.ok) {
    const message =
      data?.message ??
      (res.status === 422
        ? "Token tidak ada / tidak valid, silakan login ulang"
        : "Request gagal");
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// --- Auth API (murni proxy ke Express, tanpa logika JWT di Next.js) ---

export const authApi = {
  async register({ username, email, password }) {
    // POST /api/register -> { success, message, data, token }
    return apiFetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
  },

  async login({ email, password }) {
    // POST /api/login -> { success, message, token, data }
    return apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async me(token) {
    // GET /api/me (wajib Bearer token) -> { message, data: {id, username, email} }
    return apiFetch("/api/me", { token });
  },
};

// --- Streamer API (gambar diupload via backend -> Cloudinary folder "streamers") ---

export const streamerApi = {
  async list(token) {
    // GET /api/streamers (wajib Bearer token)
    return apiFetch("/api/streamers", { token });
  },

  async create({ namast, kategorist, subscriber, views, imageFile }, token) {
    // POST /api/streamers multipart: namast, kategorist, subscriber, views, image
    // Backend: multer memoryStorage (max 2MB, jpg/jpeg/png) -> Cloudinary
    const form = new FormData();
    form.append("namast", namast);
    form.append("kategorist", kategorist);
    form.append("subscriber", String(subscriber));
    form.append("views", String(views));
    if (imageFile) form.append("image", imageFile);

    return apiFetch("/api/streamers", { method: "POST", body: form, token });
  },

  async update(id, { namast, kategorist, subscriber, views, imageFile }, token) {
    // PUT /api/streamers/:id multipart, image opsional
    // (kalau ada file baru backend upload ke Cloudinary + hapus yang lama)
    const form = new FormData();
    form.append("namast", namast);
    form.append("kategorist", kategorist);
    form.append("subscriber", String(subscriber));
    form.append("views", String(views));
    if (imageFile) form.append("image", imageFile);

    return apiFetch(`/api/streamers/${id}`, {
      method: "PUT",
      body: form,
      token,
    });
  },

  async remove(id, token) {
    // DELETE /api/streamers/:id (backend juga destroy image di Cloudinary)
    return apiFetch(`/api/streamers/${id}`, { method: "DELETE", token });
  },
};
