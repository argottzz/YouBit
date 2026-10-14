import type { Video } from "./video";

export interface Channel {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  avatar_url: string | null;
  avatar_public_id: string | null;
  banner_url: string | null;
  banner_public_id: string | null;
  subscriber_count: number;
  created_at: string;
  owner_username?: string;
  videos?: Video[];
}

export interface ChannelPayload {
  name: string;
  description?: string;
  subscriber_count?: number;
  avatarFile?: File | null;
  bannerFile?: File | null;
}
