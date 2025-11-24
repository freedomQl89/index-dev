'use client';

import { useLanguage } from "@/app/contexts/LanguageContext";

/**
 * 用于高亮 <strong> 标签内容
 */
function HighlightStrong({ text }: { text: string }) {
  // 匹配 <strong>...</strong> 标签
  const parts = text.split(/(<strong>.*?<\/strong>)/gi);

  return (
    <>
      {parts.map((part, index) => {
        const strongMatch = part.match(/<strong>(.*?)<\/strong>/i);
        if (strongMatch) {
          return <strong key={index} className="text-white">{strongMatch[1]}</strong>;
        }
        return part;
      })}
    </>
  );
}

export default function Guide() {
  const { t } = useLanguage();

  const contactMethods = [
    {
      href: "https://t.me/laohuhaha_BOT",
      icon: "✈️",
      titleKey: "contact_tg",
      subtitle: "@laohuhaha_bot",
      bgClass: "bg-white/5 hover:bg-[#e63946]/20 border-white/10 hover:border-[#e63946]/50"
    },
    {
      href: "https://twitter.com/messages/compose?recipient_id=GFWfrog",
      icon: "𝕏",
      titleKey: "contact_x",
      subtitle: "@GFWfrog",
      bgClass: "bg-white/5 hover:bg-white/10 border-white/10"
    },
    {
      href: "mailto:GFWfrog@gmail.com",
      icon: "🔒",
      titleKey: "contact_email",
      subtitle: "GFWfrog@gmail.com",
      bgClass: "bg-white/5 hover:bg-white/10 border-white/10"
    },
    {
      href: "https://signal.me/#eu/X9Ji2kG_aM1Pu1--PI78P7QbPhc_rQpHvG3jIReRU24JvnuqELtKE7kusfSejuOF",
      icon: "💬",
      titleKey: "contact_signal",
      subtitle: "@GFWfrog.64",
      bgClass: "bg-white/5 hover:bg-white/10 border-white/10"
    }
  ];

  return (
    <section id="guide" className="py-32 px-6 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black mb-4 text-white">{t('guide_title')}</h2>
          <p className="text-[#e63946] font-bold">{t('guide_warning')}</p>
        </div>

        <div className="bg-black p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black mb-8">
          <ul className="space-y-5 text-gray-300 mb-12 text-left">
            <li className="flex items-start">
              <span className="text-[#e63946] mr-3 text-xl">➤</span>
              <div className="pt-0.5">
                <HighlightStrong text={t('guide_li1')} />
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#e63946] mr-3 text-xl">➤</span>
              <div className="pt-0.5">
                <HighlightStrong text={t('guide_li2')} />
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#e63946] mr-3 text-xl">➤</span>
              <div className="pt-0.5">{t('guide_li3')}</div>
            </li>
            <li className="flex items-start bg-white/5 p-4 rounded-xl border border-[#e63946]/20 -mx-4">
              <span className="text-[#e63946] mr-3 text-xl">➤</span>
              <div className="pt-0.5">
                <strong className="text-white block mb-2">{t('guide_li4_title')}</strong>
                <p className="mb-3">{t('guide_li4_desc1')}</p>
                <div className="text-gray-400 text-sm bg-black/50 p-3 rounded-lg border-l-2 border-[#e63946]">
                  <strong className="text-[#e63946]">{t('guide_li4_help_strong')}</strong><br />
                  {t('guide_li4_help_desc')}
                </div>
              </div>
            </li>
          </ul>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white">{t('submit_methods_title')}</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${method.bgClass} border p-4 rounded-xl flex items-center transition group text-left`}
              >
                <span className="w-12 flex justify-center text-3xl mr-3 opacity-80 group-hover:opacity-100 transition text-white">
                  {method.icon}
                </span>
                <div className="overflow-hidden">
                  <div className="text-white font-bold truncate">{t(method.titleKey)}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-300 truncate">{method.subtitle}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <span className="inline-block w-2 h-2 bg-[#e63946] rounded-full mr-2 animate-pulse"></span>
          <span>{t('footer_coming_soon')}</span>
        </div>
      </div>
    </section>
  );
}

