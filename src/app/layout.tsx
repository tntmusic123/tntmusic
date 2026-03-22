import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TNT Music | 성악·뮤지컬 전문 연습실 & 아티스트 에이전시",
  description:
    "TNT Music은 성악과 뮤지컬 전문가를 위한 프리미엄 연습실 대관과 아티스트 에이전시 서비스를 제공합니다. 최고의 음향 환경에서 당신의 예술을 완성하세요.",
  keywords: ["성악", "뮤지컬", "연습실", "아티스트", "에이전시", "TNT Music", "연습실 대관"],
  openGraph: {
    title: "TNT Music | 성악·뮤지컬 전문 연습실 & 아티스트 에이전시",
    description:
      "프리미엄 연습실 대관과 아티스트 에이전시 서비스. 최고의 음향 환경에서 당신의 예술을 완성하세요.",
    type: "website",
    locale: "ko_KR",
  },
  icons: {
    icon: "/icon.png",
  },
};

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
