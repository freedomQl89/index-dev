"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";
import Navigation from "@/app/components/Navigation";
import { useState, useEffect } from "react";
import type { Tweet } from "@/types/tweet";
import Image from "next/image";

export default function TweetsPage() {
  const { t } = useLanguage();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);

  // 加载推文数据
  const loadTweets = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tweets?page=${pageNum}&limit=20`);
      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setTweets(data.data);
        } else {
          setTweets((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.pagination.page < data.pagination.totalPages);
      } else {
        setError(data.error || t("tweets_error"));
      }
    } catch (err) {
      console.error("Error loading tweets:", err);
      setError(t("tweets_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTweets(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTweets(tweets);
    } else {
      const filtered = tweets.filter((tweet) =>
        tweet.text?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTweets(filtered);
    }
  }, [searchQuery, tweets]);

  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 格式化数字
  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              {t("tweets_title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-400">
              {t("tweets_subtitle")}
            </p>
          </div>

          {/* 搜索框 */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("tweets_search_placeholder")}
                className="w-full pl-12 pr-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-danger-red/50 focus:ring-1 focus:ring-danger-red/50 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-center text-gray-400 text-sm mt-3">
                {t("tweets_search_results")}: {filteredTweets.length}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-danger-red/10 border border-danger-red/30 rounded-lg p-4 mb-6 text-center">
              <p className="text-danger-red">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {filteredTweets.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  {searchQuery ? t("tweets_no_results") : t("tweets_no_data")}
                </p>
              </div>
            )}
            {filteredTweets.map((tweet) => {
              const tweetUrl = `https://x.com/${tweet.user_screen_name}/status/${tweet.tweet_id}`;

              return (
                <a
                  key={tweet.tweet_id}
                  href={tweetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#0f0f0f] border border-white/5 rounded-xl p-6 hover:border-danger-red/30 transition cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/10 bg-black">
                      <img
                        src="/logo.png"
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-bold truncate">
                          {tweet.user_name || "Unknown User"}
                        </h3>
                        {tweet.user_screen_name && (
                          <span className="text-gray-500 text-sm truncate">
                            @{tweet.user_screen_name}
                          </span>
                        )}
                      </div>
                      {tweet.created_at && (
                        <p className="text-gray-500 text-sm">
                          {t("tweets_posted_at")} {formatDate(tweet.created_at)}
                        </p>
                      )}
                    </div>
                  </div>

                  {tweet.text && (
                    <p className="text-white text-base leading-relaxed mb-4 whitespace-pre-wrap break-words">
                      {tweet.text}
                    </p>
                  )}

                  {tweet.media && tweet.media.length > 0 && (
                    <div
                      className={`mb-4 ${
                        tweet.media.length === 1
                          ? "flex justify-center"
                          : "grid gap-2"
                      } ${
                        tweet.media.length === 2
                          ? "grid-cols-2"
                          : tweet.media.length === 3
                          ? "grid-cols-2 md:grid-cols-3"
                          : tweet.media.length >= 4
                          ? "grid-cols-2"
                          : ""
                      }`}
                    >
                      {tweet.media.slice(0, 4).map((media, index) => (
                        <div
                          key={index}
                          className={`relative bg-black/50 rounded-lg overflow-hidden group border border-white/5 hover:border-white/20 transition ${
                            tweet.media && tweet.media.length === 1
                              ? "aspect-[16/10] max-w-xl w-full"
                              : "aspect-video"
                          }`}
                        >
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
                              className="block w-full h-full relative cursor-zoom-in"
                            >
                              <Image
                                src={media.url}
                                alt={`Media ${index + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                unoptimized
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center opacity-0 hover:opacity-100">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
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
                            </div>
                          )}

                          {media.type === "video" && media.url && (
                            <div className="relative w-full h-full">
                              <video
                                src={media.url}
                                controls
                                className="w-full h-full object-cover bg-black"
                                preload="metadata"
                                playsInline
                              >
                                您的浏览器不支持视频播放。
                              </video>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-gray-500 text-sm flex-wrap">
                    {tweet.reply_count !== null && tweet.reply_count > 0 && (
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span>{formatNumber(tweet.reply_count)}</span>
                      </div>
                    )}
                    {tweet.retweet_count !== null &&
                      tweet.retweet_count > 0 && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          <span>{formatNumber(tweet.retweet_count)}</span>
                        </div>
                      )}
                    {tweet.favorite_count !== null &&
                      tweet.favorite_count > 0 && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>{formatNumber(tweet.favorite_count)}</span>
                        </div>
                      )}
                    {tweet.bookmark_count !== null &&
                      tweet.bookmark_count > 0 && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                          <span>{formatNumber(tweet.bookmark_count)}</span>
                        </div>
                      )}
                  </div>
                </a>
              );
            })}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">{t("tweets_loading")}</p>
            </div>
          )}

          {!loading && tweets.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("tweets_no_data")}</p>
            </div>
          )}

          {!loading && hasMore && tweets.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  loadTweets(nextPage);
                }}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition border border-white/10 hover:border-white/20"
              >
                {t("tweets_load_more")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
