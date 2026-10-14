import type { Channel, ChannelPayload } from "@/types/channel";
import type { User } from "@/types/user";
import type {
  PublicVideoList,
  Video,
  VideoPayload,
  Visibility,
} from "@/types/video";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function persistSession({
  token,
  user,
}: {
  token?: string;
  user?: User | null;
}): boolean {
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

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function errorMessage(status: number, data: { message?: string } | null): string {
  if (data?.message) return data.message;
  if (status === 401) return "Sesi habis atau token tidak valid, silakan login ulang";
  if (status === 403) return "Akses ditolak";
  if (status === 422) return "Token tidak ada, silakan login ulang";
  return "Request gagal";
}

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T = unknown>(
  path: string,
  { token, ...options }: FetchOptions = {},
): Promise<T> {
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

  let data: { message?: string } | null = null;
  try {
    data = (await res.json()) as { message?: string };
  } catch {
    // respons kosong / bukan JSON
  }

  if (!res.ok) {
    throw new ApiError(errorMessage(res.status, data), res.status, data);
  }

  return data as T;
}

function toForm(
  fields: Record<string, string | number | null | undefined>,
  files: Record<string, File | null | undefined>,
): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, String(value ?? ""));
  }
  for (const [key, file] of Object.entries(files)) {
    if (file) form.append(key, file);
  }
  return form;
}

export const authApi = {
  register(input: { username: string; email: string; password: string }) {
    return apiFetch<{ success: boolean; message: string; token: string; data: User }>(
      "/api/register",
      { method: "POST", body: JSON.stringify(input) },
    );
  },

  login(input: { email: string; password: string }) {
    return apiFetch<{ success: boolean; message: string; token: string; data: User }>(
      "/api/login",
      { method: "POST", body: JSON.stringify(input) },
    );
  },

  me(token?: string | null) {
    return apiFetch<{ message: string; data: User }>("/api/me", { token });
  },
};

export interface PublicVideoQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const videoApi = {
  listPublic(query: PublicVideoQuery = {}) {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.category) params.set("category", query.category);
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    const qs = params.toString();
    return apiFetch<PublicVideoList>(`/api/videos/public${qs ? `?${qs}` : ""}`);
  },

  list(
    token: string | null,
    query: { channel_id?: number; visibility?: Visibility } = {},
  ) {
    const params = new URLSearchParams();
    if (query.channel_id) params.set("channel_id", String(query.channel_id));
    if (query.visibility) params.set("visibility", query.visibility);
    const qs = params.toString();
    return apiFetch<{ message: string; data: Video[] }>(
      `/api/videos${qs ? `?${qs}` : ""}`,
      { token },
    );
  },

  get(id: number, token?: string | null) {
    return apiFetch<{ message: string; data: Video }>(`/api/videos/${id}`, {
      token,
    });
  },

  create(payload: VideoPayload, token: string | null) {
    return apiFetch<{ message: string; data: Video }>("/api/videos", {
      method: "POST",
      body: toForm(
        {
          channel_id: payload.channel_id,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          duration_seconds: payload.duration_seconds ?? 0,
          views_count: payload.views_count ?? 0,
          visibility: payload.visibility ?? "public",
        },
        { image: payload.imageFile },
      ),
      token,
    });
  },

  update(id: number, payload: VideoPayload, token: string | null) {
    return apiFetch<{ message: string; data: Video }>(`/api/videos/${id}`, {
      method: "PUT",
      body: toForm(
        {
          channel_id: payload.channel_id,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          duration_seconds: payload.duration_seconds ?? 0,
          views_count: payload.views_count ?? 0,
          visibility: payload.visibility ?? "public",
        },
        { image: payload.imageFile },
      ),
      token,
    });
  },

  remove(id: number, token: string | null) {
    return apiFetch<{ message: string }>(`/api/videos/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export const channelApi = {
  list(token: string | null) {
    return apiFetch<{ message: string; data: Channel[] }>("/api/channels", {
      token,
    });
  },

  get(id: number, token: string | null) {
    return apiFetch<{ message: string; data: Channel }>(`/api/channels/${id}`, {
      token,
    });
  },

  async myChannel(token: string | null, userId: number): Promise<Channel | null> {
    const res = await channelApi.list(token);
    return res.data.find((c) => c.user_id === userId) ?? null;
  },

  create(payload: ChannelPayload, token: string | null) {
    return apiFetch<{ message: string; data: Channel }>("/api/channels", {
      method: "POST",
      body: toForm(
        {
          name: payload.name,
          description: payload.description,
          subscriber_count: payload.subscriber_count ?? 0,
        },
        { avatar: payload.avatarFile, banner: payload.bannerFile },
      ),
      token,
    });
  },

  update(id: number, payload: ChannelPayload, token: string | null) {
    return apiFetch<{ message: string; data: Channel }>(`/api/channels/${id}`, {
      method: "PUT",
      body: toForm(
        {
          name: payload.name,
          description: payload.description,
          subscriber_count: payload.subscriber_count ?? 0,
        },
        { avatar: payload.avatarFile, banner: payload.bannerFile },
      ),
      token,
    });
  },

  remove(id: number, token: string | null) {
    return apiFetch<{ message: string }>(`/api/channels/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export const usersApi = {
  list(token: string | null) {
    return apiFetch<{ message: string; data: User[] }>("/api/users", { token });
  },

  updateRole(id: number, role: "admin" | "user", token: string | null) {
    return apiFetch<{ message: string; data: { id: number; role: string } }>(
      `/api/users/${id}/role`,
      { method: "PUT", body: JSON.stringify({ role }), token },
    );
  },

  remove(id: number, token: string | null) {
    return apiFetch<{ message: string }>(`/api/users/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
