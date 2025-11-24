"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";
import Navigation from "@/app/components/Navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function EventsPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [tweets, setTweets] = useState<HotTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotTweets = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/hot-tweets");
        const result = await response.json();

        if (result.success) {
          setTweets(result.data);
        } else {
          setError(result.error || "Failed to load tweets");
        }
      } catch (err) {
        console.error("Error fetching hot tweets:", err);
        setError("Failed to load tweets");
      } finally {
        setLoading(false);
      }
    };

    fetchHotTweets();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t("locale_code"), {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const getFirstImage = (media: MediaItem[] | null): string | null => {
    if (!media || media.length === 0) return null;
    const image = media.find((m) => m.type === "image");
    return image ? image.url : null;
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-xs font-bold tracking-[0.5em] text-danger-red uppercase">
                Benchmark
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              {t("events_title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              {t("events_subtitle")}
            </p>
          </div>

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

          {!loading && !error && tweets.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">{t("events_no_data")}</p>
            </div>
          )}

          {!loading && !error && tweets.length > 0 && (
            <div className="space-y-6">
              {tweets.map((tweet) => {
                const firstImage = getFirstImage(tweet.media);

                return (
                  <div
                    key={tweet.tweet_id}
                    onClick={() =>
                      router.push(`/${language}/events/${tweet.tweet_id}`)
                    }
                    className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden hover:border-danger-red/30 transition cursor-pointer group flex flex-col md:flex-row"
                  >
                    {firstImage && (
                      <div className="relative w-full md:w-80 h-64 md:h-auto bg-black flex-shrink-0">
                        <Image
                          src={firstImage}
                          alt="Event image"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      {tweet.created_at && (
                        <div className="text-danger-red text-sm font-bold mb-3 opacity-70 group-hover:opacity-100 transition">
                          {formatDate(tweet.created_at)}
                        </div>
                      )}

                      {tweet.user_name && (
                        <div className="inline-block bg-danger-red/10 text-danger-red text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
                          @{tweet.user_screen_name || tweet.user_name}
                        </div>
                      )}

                      {tweet.text && (
                        <p className="text-white text-base leading-relaxed mb-4 line-clamp-3 flex-1">
                          {tweet.text}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {tweet.favorite_count !== null &&
                            tweet.favorite_count > 0 && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span>
                                  {formatNumber(tweet.favorite_count)}
                                </span>
                              </div>
                            )}
                          {tweet.retweet_count !== null &&
                            tweet.retweet_count > 0 && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.18 2.18V7.5a3.75 3.75 0 0 0-3.75-3.75h-5.85a.75.75 0 0 0 0 1.5h5.85c1.24 0 2.25 1.01 2.25 2.25v10.35l-2.18-2.18a.749.749 0 1 0-1.06 1.06l3.5 3.5a.747.747 0 0 0 1.06 0l3.5-3.5a.749.749 0 0 0 0-1.06zm-10.66 3.28H7.26a2.25 2.25 0 0 1-2.25-2.25V6.35l2.18 2.18a.749.749 0 1 0 1.06-1.06l-3.5-3.5a.747.747 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06l2.18-2.18v10.35a3.75 3.75 0 0 0 3.75 3.75h5.85a.75.75 0 0 0 0-1.5z" />
                                </svg>
                                <span>{formatNumber(tweet.retweet_count)}</span>
                              </div>
                            )}
                        </div>

                        <div className="flex items-center text-danger-red text-sm font-bold group-hover:gap-2 transition-all">
                          <span>{t("events_view_details")}</span>
                          <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
