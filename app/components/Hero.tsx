'use client';

import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";

/**
 * 文本高亮组件
 */
function HighlightText({
  text,
  patterns,
  className
}: {
  text: string;
  patterns: RegExp[];
  className: string;
}) {
  let result: (string | React.ReactElement)[] = [text];

  // 对每个模式进行匹配和替换
  patterns.forEach((pattern, patternIndex) => {
    result = result.flatMap((part, partIndex) => {
      if (typeof part !== 'string') return part;

      const parts: (string | React.ReactElement)[] = [];
      let lastIndex = 0;
      let match;

      // 重置正则表达式的 lastIndex
      pattern.lastIndex = 0;

      while ((match = pattern.exec(part)) !== null) {
        if (match.index > lastIndex) {
          parts.push(part.substring(lastIndex, match.index));
        }

        parts.push(
          <span key={`${patternIndex}-${partIndex}-${match.index}`} className={className}>
            {match[0]}
          </span>
        );

        lastIndex = match.index + match[0].length;

        if (match.index === pattern.lastIndex) {
          pattern.lastIndex++;
        }
      }

      if (lastIndex < part.length) {
        parts.push(part.substring(lastIndex));
      }

      return parts.length > 0 ? parts : [part];
    });
  });

  return <>{result}</>;
}

export default function Hero() {
  const { t } = useLanguage();
  const title = t('hero_title');

  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-24 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            className="h-24 md:h-32 mb-6 drop-shadow-[0_0_15px_rgba(230,57,70,0.3)]"
            width={128}
            height={128}
          />
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight">
            <span className="glitch text-white" data-text={title}>
              {title}
            </span>
          </h1>
        </div>

        <div className="space-y-6">
          <p className="text-xl md:text-3xl font-bold text-white leading-snug">
            <HighlightText
              text={t('hero_desc_1')}
              patterns={[
                /审查机器/gi,
                /censorship machine/gi,
                /极权系统/gi,
                /totalitarian system/gi
              ]}
              className="text-danger-red"
            />
          </p>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            <HighlightText
              text={t('hero_desc_2')}
              patterns={[
                /公开你见证的荒诞与黑暗/gi,
                /expose the absurdity and darkness you have witnessed/gi
              ]}
              className="text-gray-200 font-bold"
            />
          </p>
        </div>

        <p className="text-gray-500 text-base md:text-lg pt-4">
          {t('hero_slogan')}
        </p>

        <div className="pt-8">
          <a
            href="#guide"
            className="inline-block bg-[#e63946] text-white text-lg font-bold px-8 py-4 rounded-full hover:scale-105 hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-900/30"
          >
            {t('hero_btn')}
          </a>
        </div>
      </div>
    </section>
  );
}

