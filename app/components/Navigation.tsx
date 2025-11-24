"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const languages = [
    { code: "zh-CN" as const, name: t("lang_zh_cn") },
    { code: "zh-TW" as const, name: t("lang_zh_tw") },
    { code: "en" as const, name: t("lang_en") },
  ];

  const currentLanguageName =
    languages.find((lang) => lang.code === language)?.name || "简体中文";

  const handleLanguageChange = (langCode: "zh-CN" | "zh-TW" | "en") => {
    setLanguage(langCode);
    setIsDropdownOpen(false);
  };

  const currentPathWithoutLang =
    pathname.replace(/^\/(zh-CN|zh-TW|en)/, "") || "/";
  const isHomePage = currentPathWithoutLang === "/";

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: t("top_home"), href: `/${language}` }];

    if (currentPathWithoutLang === "/events") {
      breadcrumbs.push({ name: t("top_events"), href: `/${language}/events` });
    } else if (currentPathWithoutLang === "/tweets") {
      breadcrumbs.push({ name: t("top_tweets"), href: `/${language}/tweets` });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="fixed w-full z-50 top-0 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="py-4 px-4 md:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <Link href={`/${language}`}>
            <Image
              src="/logo.png"
              alt="Logo"
              className="h-8 md:h-12 mr-3 cursor-pointer"
              width={48}
              height={48}
            />
          </Link>
          <Link
            href={`/${language}`}
            className="font-black tracking-tighter text-lg md:text-xl text-white hidden md:block hover:opacity-80 transition"
          >
            {t("top_title")}
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href={`/${language}/events`}
            className={`hidden md:flex text-xs md:text-sm font-medium transition px-3 py-2 rounded-lg ${
              currentPathWithoutLang === "/events"
                ? "text-white bg-white/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t("top_events")}
          </Link>

          <Link
            href={`/${language}/tweets`}
            className={`hidden md:flex text-xs md:text-sm font-medium transition px-3 py-2 rounded-lg ${
              currentPathWithoutLang === "/tweets"
                ? "text-white bg-white/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t("top_tweets")}
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-xs md:text-sm font-medium text-gray-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
            >
              <span>{currentLanguageName}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-40 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition ${
                        language === lang.code
                          ? "bg-[#e63946]/20 text-white font-bold"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {isHomePage && (
            <a
              href="#guide"
              className="hidden md:block text-xs md:text-sm font-bold bg-[#e63946]/90 hover:bg-[#e63946] px-3 py-2 md:px-5 md:py-2.5 rounded-full text-white transition-all shadow-lg shadow-red-900/20 whitespace-nowrap"
            >
              {t("top_cta")}
            </a>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white transition p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {!isHomePage && (
        <div className="md:hidden px-4 pb-3 flex items-center gap-2 text-xs">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && (
                <svg
                  className="w-3 h-3 text-gray-600"
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
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-white font-medium">{crumb.name}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-gray-400 hover:text-white transition"
                >
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-2">
            <Link
              href={`/${language}/events`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                currentPathWithoutLang === "/events"
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t("top_events")}
            </Link>

            <Link
              href={`/${language}/tweets`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                currentPathWithoutLang === "/tweets"
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t("top_tweets")}
            </Link>

            {isHomePage && (
              <a
                href="#guide"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-bold bg-[#e63946]/90 hover:bg-[#e63946] text-white transition-all text-center"
              >
                {t("top_cta")}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
