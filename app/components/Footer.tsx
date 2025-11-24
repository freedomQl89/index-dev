'use client';

import { useLanguage } from "@/app/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 text-center text-gray-600 text-sm bg-black border-t border-white/5">
      <p>© 2025 <span>{t('footer_copyright')}</span></p>
    </footer>
  );
}

