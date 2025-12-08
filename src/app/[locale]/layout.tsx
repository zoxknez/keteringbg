import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "../globals.css";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
 
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    metadataBase: new URL('https://www.keteringbeo.rs'),
    icons: {
      icon: '/icon',
      apple: '/apple-icon',
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://www.keteringbeo.rs/${locale}`,
      siteName: 'Ketering Beograd',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: `https://www.keteringbeo.rs/${locale}`,
      languages: {
        'sr': 'https://www.keteringbeo.rs/sr',
        'en': 'https://www.keteringbeo.rs/en',
        'ru': 'https://www.keteringbeo.rs/ru',
      },
    },
    verification: {
      google: 'Phm1sOTCtlXTtuSTXWg88VexucQ6m89iz8GYxY5RD9A',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: 'Ketering Beograd',
    image: 'https://www.keteringbeo.rs/og-image.jpg',
    description: 'Ekskluzivni ketering za vaše proslave.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Belgrade',
      addressRegion: 'Belgrade',
      addressCountry: 'RS'
    },
    url: 'https://www.keteringbeo.rs',
    telephone: '+381637044428',
    email: 'spalevic.dragan@gmail.com',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '08:00',
        closes: '22:00'
      }
    ],
    servesCuisine: 'International, Serbian',
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.keteringbeo.rs/#menu',
        inLanguage: locale,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/IOSPlatform',
          'http://schema.org/AndroidPlatform'
        ]
      },
      result: {
        '@type': 'FoodEstablishmentReservation',
        name: 'Order Catering'
      }
    }
  }

  return (
    <html lang={locale}>
      <body
        className={`${playfair.variable} ${lato.variable} font-sans antialiased text-neutral-100 min-h-screen flex flex-col selection:bg-amber-500/30`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Background />
          <LanguageSwitcher />
          <main className="flex-grow relative z-10">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
