import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['sr', 'en', 'ru'],
  defaultLocale: 'sr',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
  }
});
 
export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
