import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

import { getSiteSettings } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.siteTitle || "TNT Music | 클래식 전문 연습실 & 아티스트 에이전시";
  const description = settings.siteDescription || "TNT Music은 클래식 음악 전문가를 위한 프리미엄 연습실 대관과 아티스트 에이전시 서비스를 제공합니다.";
  const keywords = settings.siteKeywords ? settings.siteKeywords.split(",").map((k: string) => k.trim()) : ["성악", "뮤지컬", "연습실", "아티스트", "에이전시"];
  const ogImage = settings.ogImageUrl || "/images/w_logo.png";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "TNT Music",
        },
      ],
    },
    icons: {
      icon: "/images/w_logo.png",
      apple: "/images/w_logo.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
