export interface Comment {
  id: number;
  episode_id: number;
  nickname: string;
  content: string;
  timestamp_tag: string | null;
  gif_url?: string | null;
  heart_count?: number;
  is_hidden: boolean;
  created_at: string;
}

export interface FloatingHeart {
  id: number;
  commentId: number;
}

export interface GiphyItem {
  id: string;
  title: string;
  images: { fixed_height: { url: string } };
}

export type CommentModalType = "edit" | "delete";
