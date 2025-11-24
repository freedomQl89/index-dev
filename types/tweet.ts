// 推文数据类型定义
export interface Tweet {
  tweet_id: string;
  user_created_at: string | null;
  user_name: string | null;
  user_screen_name: string | null;
  text: string | null;
  bookmark_count: number | null;
  created_at: string | null;
  favorite_count: number | null;
  quote_count: number | null;
  reply_count: number | null;
  retweet_count: number | null;
  media: MediaItem[] | null;
}

// 媒体项类型
export interface MediaItem {
  type: string;
  url: string;
  preview_url?: string;
  width?: number;
  height?: number;
}
