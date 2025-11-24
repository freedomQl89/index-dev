/**
 * 安全工具函数
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return "";

  let cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  const MAX_TEXT_LENGTH = 10000;
  if (cleaned.length > MAX_TEXT_LENGTH) {
    cleaned = cleaned.substring(0, MAX_TEXT_LENGTH) + "...";
  }

  return cleaned;
}

/**
 * 验证 URL 是否安全
 * 只允许 http 和 https 协议
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    // 只允许 http 和 https 协议
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * 清理 URL，确保安全
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return "";

  // 如果 URL 不安全，返回空字符串
  if (!isSafeUrl(url)) {
    console.warn("Unsafe URL detected and blocked:", url);
    return "";
  }

  return url;
}

/**
 * 验证推文 ID 格式
 */
export function isValidTweetId(id: string | null | undefined): boolean {
  if (!id) return false;

  // Twitter ID 应该是数字字符串，长度在 1-20 位之间
  return /^\d{1,20}$/.test(id);
}

/**
 * 清理用户名，只允许字母、数字、下划线
 */
export function sanitizeUsername(username: string | null | undefined): string {
  if (!username) return "";

  // 只保留字母、数字、下划线和连字符
  return username.replace(/[^a-zA-Z0-9_-]/g, "");
}

/**
 * 转义 HTML 特殊字符（额外的安全层）
 * React 已经做了这个，但在某些情况下可能需要手动转义
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * 验证和清理媒体 URL
 * 只允许来自 Twitter 官方域名的媒体
 */
export function sanitizeMediaUrl(url: string | null | undefined): string {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const allowedHosts = [
      "pbs.twimg.com",
      "video.twimg.com",
      "abs.twimg.com",
      "ton.twimg.com",
    ];

    // 检查协议和主机名
    if (
      parsed.protocol === "https:" &&
      allowedHosts.includes(parsed.hostname)
    ) {
      return url;
    }

    console.warn("Unsafe media URL detected and blocked:", url);
    return "";
  } catch {
    return "";
  }
}

/**
 * 媒体项接口
 */
interface MediaItem {
  url: string;
  preview_url?: string;
  type?: string;
  width?: number;
  height?: number;
}

/**
 * 推文接口 - 兼容数据库返回的推文对象
 */
interface TweetLike {
  tweet_id?: string;
  user_name?: string | null;
  user_screen_name?: string | null;
  text?: string | null;
  media?: MediaItem[] | null;
  user_created_at?: string | null;
  bookmark_count?: number | null;
  created_at?: string | null;
  favorite_count?: number | null;
  quote_count?: number | null;
  reply_count?: number | null;
  retweet_count?: number | null;
}

/**
 * 清理推文对象，确保所有字段都是安全的
 * 使用泛型保持原始类型
 */
export function sanitizeTweet<T extends TweetLike>(
  tweet: T | null | undefined
): T | null {
  if (!tweet) return null;

  return {
    ...tweet,
    tweet_id: isValidTweetId(tweet.tweet_id) ? tweet.tweet_id : "",
    user_name: sanitizeText(tweet.user_name),
    user_screen_name: sanitizeUsername(tweet.user_screen_name),
    text: sanitizeText(tweet.text),
    media: Array.isArray(tweet.media)
      ? (tweet.media
          .map((item: MediaItem) => ({
            ...item,
            url: sanitizeMediaUrl(item.url),
            preview_url: item.preview_url
              ? sanitizeMediaUrl(item.preview_url)
              : undefined,
          }))
          .filter((item: MediaItem) => item.url) as T['media'])
      : null,
  } as T;
}
