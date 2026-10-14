export type Visibility = "public" | "private" | "unlisted";

export interface Video {
  id: number;
  channel_id: number;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  image_public_id: string | null;
  duration_seconds: number;
  views_count: number;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
  channel_name?: string;
  channel_avatar?: string | null;
  owner_username?: string;
  channel_owner_id?: number;
}

export interface VideoPayload {
  channel_id: number;
  title: string;
  description?: string;
  category?: string;
  duration_seconds?: number;
  views_count?: number;
  visibility?: Visibility;
  imageFile?: File | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PublicVideoList {
  message: string;
  data: Video[];
  pagination: Pagination;
}
