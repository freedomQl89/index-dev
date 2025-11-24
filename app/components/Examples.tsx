'use client';

import { useLanguage } from "@/app/contexts/LanguageContext";

export default function Examples() {
  const { t } = useLanguage();

  const cases = [
    {
      href: "https://x.com/GFWfrog/status/1974105184935584119",
      tagKey: "case_1_tag",
      titleKey: "case_1_title",
      descKey: "case_1_desc"
    },
    {
      href: "https://x.com/GFWfrog/status/1985320614769430683",
      tagKey: "case_2_tag",
      titleKey: "case_2_title",
      descKey: "case_2_desc"
    },
    {
      href: "https://x.com/GFWfrog/status/1974416822603850036",
      tagKey: "case_3_tag",
      titleKey: "case_3_title",
      descKey: "case_3_desc"
    },
    {
      href: "https://x.com/GFWfrog/status/1971451497755078869",
      tagKey: "case_4_tag",
      titleKey: "case_4_title",
      descKey: "case_4_desc"
    }
  ];

  return (
    <section id="examples" className="py-32 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold tracking-[0.5em] text-[#e63946] mb-6 uppercase">Benchmark</h2>
          <h3 className="text-3xl md:text-4xl font-black text-white">{t('case_title')}</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((caseItem, index) => (
            <a
              key={index}
              href={caseItem.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#0f0f0f] p-6 rounded-xl border border-white/5 hover:border-[#e63946]/30 transition group"
            >
              <div className="text-[#e63946] font-bold text-xs mb-3 opacity-70 group-hover:opacity-100">
                {t(caseItem.tagKey)}
              </div>
              <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#e63946] transition">
                {t(caseItem.titleKey)}
              </h4>
              <p className="text-gray-500 text-sm">
                {t(caseItem.descKey)}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

