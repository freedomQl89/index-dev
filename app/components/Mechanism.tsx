'use client';

import { useLanguage } from "@/app/contexts/LanguageContext";

export default function Mechanism() {
  const { t } = useLanguage();

  return (
    <section id="mechanism" className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black mb-4 text-white">{t('mech_title')}</h2>
        </div>
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-3 bg-[#e63946]/10 p-8 md:p-10 rounded-3xl border-2 border-[#e63946]/30 relative overflow-hidden">
            <div className="absolute -right-12 top-8 bg-[#e63946] text-white w-48 py-1 rotate-45 flex justify-center font-bold text-sm shadow-lg">
              {t('mech_s_badge')}
            </div>
            <h3 className="text-3xl font-black text-white mb-6 flex items-center">
              <span className="mr-3">💣</span> <span>{t('mech_s_title')}</span>
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              {t('mech_s_desc')}
            </p>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="text-[#e63946] mr-2 text-lg">📄</span>
                <span><strong>{t('mech_s_li1_title')}</strong>{t('mech_s_li1_desc')}</span>
              </li>
              <li className="flex items-start bg-[#e63946]/10 p-3 rounded-xl -mx-3">
                <span className="text-[#e63946] mr-2 text-lg">🗣️</span>
                <span><strong>{t('mech_s_li2_title')}</strong>{t('mech_s_li2_desc')}</span>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2 bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col h-full justify-center">
            <div>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center opacity-80">
                <span className="mr-3">📢</span> <span>{t('mech_a_title')}</span>
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {t('mech_a_desc')}
              </p>
              <p className="text-sm text-gray-500 font-medium text-center">
                {t('mech_a_slogan')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

