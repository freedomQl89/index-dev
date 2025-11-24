"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";
import Navigation from "@/app/components/Navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface MediaItem {
  url: string;
  type: string;
}

interface HotTweet {
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

export default function EventDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const [tweet, setTweet] = useState<HotTweet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tweetId = params.id as string;

  useEffect(() => {
    const fetchTweetDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hot-tweets/${tweetId}`);
        const result = await response.json();

        if (result.success) {
          setTweet(result.data);
        } else {
          setError(result.error || "Failed to load tweet");
        }
      } catch (err) {
        console.error("Error fetching tweet detail:", err);
        setError("Failed to load tweet");
      } finally {
        setLoading(false);
      }
    };

    if (tweetId) {
      fetchTweetDetail();
    }
  }, [tweetId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t("locale_code"), {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return "0";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <button
            onClick={() => router.push(`/${language}/events`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>{t("events_back")}</span>
          </button>

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-danger-red border-t-transparent"></div>
              <p className="text-gray-400 mt-4">{t("tweets_loading")}</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-danger-red text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && tweet && (
            <div className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/10 bg-black">
                    <img
                      src="/logo.png"
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white font-bold">
                      {tweet.user_name || "Unknown"}
                    </div>
                    <div className="text-gray-500 text-sm">
                      @{tweet.user_screen_name || "unknown"}
                    </div>
                  </div>
                </div>
                {tweet.created_at && (
                  <div className="text-gray-500 text-sm">
                    {formatDate(tweet.created_at)}
                  </div>
                )}
              </div>

              <div className="p-6">
                {tweet.text && (
                  <p className="text-white text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                    {tweet.text}
                  </p>
                )}

                {tweet.media && tweet.media.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {tweet.media.map((media, index) => (
                      <div key={index} className="w-full">
                        {media.type === "image" && media.url && (
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                media.url,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                            className="relative w-full rounded-lg overflow-hidden border border-white/10 cursor-zoom-in group"
                          >
                            <Image
                              src={media.url}
                              alt={`Media ${index + 1}`}
                              width={1200}
                              height={800}
                              className="w-full h-auto object-contain bg-black group-hover:opacity-95 transition-opacity"
                              unoptimized
                            />
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}

                        {media.type === "video" && media.url && (
                          <div className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-black">
                            <video
                              src={media.url}
                              controls
                              className="w-full h-auto"
                              preload="metadata"
                              playsInline
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm border-t border-white/5 pt-6">
                  {tweet.retweet_count !== null && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.18 2.18V7.5a3.75 3.75 0 0 0-3.75-3.75h-5.85a.75.75 0 0 0 0 1.5h5.85c1.24 0 2.25 1.01 2.25 2.25v10.35l-2.18-2.18a.749.749 0 1 0-1.06 1.06l3.5 3.5a.747.747 0 0 0 1.06 0l3.5-3.5a.749.749 0 0 0 0-1.06zm-10.66 3.28H7.26a2.25 2.25 0 0 1-2.25-2.25V6.35l2.18 2.18a.749.749 0 1 0 1.06-1.06l-3.5-3.5a.747.747 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06l2.18-2.18v10.35a3.75 3.75 0 0 0 3.75 3.75h5.85a.75.75 0 0 0 0-1.5z" />
                      </svg>
                      <span className="font-bold text-white">
                        {formatNumber(tweet.retweet_count)}
                      </span>
                      <span>{t("tweets_retweets")}</span>
                    </div>
                  )}
                  {tweet.favorite_count !== null && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span className="font-bold text-white">
                        {formatNumber(tweet.favorite_count)}
                      </span>
                      <span>{t("tweets_likes")}</span>
                    </div>
                  )}
                  {tweet.reply_count !== null && tweet.reply_count > 0 && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828a.85.85 0 0 0 .12.403.744.744 0 0 0 1.034.229c.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67a.75.75 0 0 0-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z" />
                      </svg>
                      <span className="font-bold text-white">
                        {formatNumber(tweet.reply_count)}
                      </span>
                      <span>{t("tweets_replies")}</span>
                    </div>
                  )}
                  {tweet.quote_count !== null && tweet.quote_count > 0 && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.18 2.18V7.5a3.75 3.75 0 0 0-3.75-3.75h-5.85a.75.75 0 0 0 0 1.5h5.85c1.24 0 2.25 1.01 2.25 2.25v10.35l-2.18-2.18a.749.749 0 1 0-1.06 1.06l3.5 3.5a.747.747 0 0 0 1.06 0l3.5-3.5a.749.749 0 0 0 0-1.06zm-10.66 3.28H7.26a2.25 2.25 0 0 1-2.25-2.25V6.35l2.18 2.18a.749.749 0 1 0 1.06-1.06l-3.5-3.5a.747.747 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06l2.18-2.18v10.35a3.75 3.75 0 0 0 3.75 3.75h5.85a.75.75 0 0 0 0-1.5z" />
                      </svg>
                      <span className="font-bold text-white">
                        {formatNumber(tweet.quote_count)}
                      </span>
                      <span>{t("tweets_quotes")}</span>
                    </div>
                  )}
                  {tweet.bookmark_count !== null &&
                    tweet.bookmark_count > 0 && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.9 23.5a.755.755 0 0 1-.442-.144L12 17.928l-7.458 5.43a.75.75 0 0 1-1.192-.607V5.6c0-1.24 1.01-2.25 2.25-2.25h12.798c1.24 0 2.25 1.01 2.25 2.25v17.15a.75.75 0 0 1-.75.75zM12 16.25a.74.74 0 0 1 .442.144l6.558 4.77V5.6a.752.752 0 0 0-.75-.75H5.6a.752.752 0 0 0-.75.75v15.564l6.558-4.77a.74.74 0 0 1 .442-.144z" />
                        </svg>
                        <span className="font-bold text-white">
                          {formatNumber(tweet.bookmark_count)}
                        </span>
                        <span>{t("tweets_bookmarks")}</span>
                      </div>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <a
                    href={`https://x.com/${tweet.user_screen_name}/status/${tweet.tweet_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-danger-red hover:text-danger-red/80 transition font-bold"
                  >
                    <span>{t("events_view_original")}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
