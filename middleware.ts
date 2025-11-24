import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['zh-CN', 'zh-TW', 'en'];
const defaultLocale = 'zh-CN';

// 获取首选语言
function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    if (acceptLanguage.includes('zh-TW') || acceptLanguage.includes('zh-HK')) {
      return 'zh-TW';
    }
    if (acceptLanguage.includes('zh')) {
      return 'zh-CN';
    }
    if (acceptLanguage.includes('en')) {
      return 'en';
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  
  newUrl.search = request.nextUrl.search;
  
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|logo.png).*)',
  ],
};

