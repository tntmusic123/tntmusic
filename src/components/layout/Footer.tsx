"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSiteSettings } from "@/lib/store";

const quickLinks = [
  { href: "/about", label: "소개" },
  { href: "/studio", label: "연습실" },
  { href: "/artists", label: "아티스트" },
  { href: "/staff", label: "스태프 지원" },
  { href: "/note", label: "노트" },
  { href: "/contact", label: "문의" },
];

const studioLinks = [
  { href: "/studio", label: "연습실 안내" },
  { href: "/studio/book", label: "예약하기" },
  { href: "/studio#studio-pricing", label: "요금 안내" },
];

export default function Footer() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const businessPhone = settings.contactPhone || "010-2561-8636";
  const businessEmail = settings.contactEmail || "tntmusic@kakao.com";
  const businessAddress = settings.contactAddress || "서울특별시 강남구 논현로12길 19-6 우도빌딩 B1";
  const businessBank = settings.bankInfo || "우리은행 1005-103-980558 (최찬양)";
  return (
    <footer className="bg-navy text-white" id="main-footer">
      {/* Gold accent line */}
      <div className="h-[2px] bg-gradient-gold" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/images/w_logo.png"
              alt="TNT Music"
              width={140}
              height={40}
              className="h-9 w-auto mb-5"
            />
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              클래식 전문 연습실
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {settings.snsInstagram && (
                <a
                  href={settings.snsInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/40 transition-all hover:border-gold/50 hover:text-gold hover:bg-gold/5"
                  aria-label="Instagram"
                  id="social-instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {settings.snsYoutube && (
                <a
                  href={settings.snsYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/40 transition-all hover:border-gold/50 hover:text-gold hover:bg-gold/5"
                  aria-label="YouTube"
                  id="social-youtube"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.58 12 19.58 12 19.58s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.45z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
              )}
              {settings.snsBlog && (
                <a
                  href={settings.snsBlog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/40 transition-all hover:border-gold/50 hover:text-gold hover:bg-gold/5"
                  aria-label="Blog"
                  id="social-blog"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </a>
              )}
              {settings.snsKakao && (
                <a
                  href={settings.snsKakao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/40 transition-all hover:border-gold/50 hover:text-gold hover:bg-gold/5"
                  aria-label="Kakao"
                  id="social-kakao"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.8 8.4 8.4 0 0 1 3.8.9l5.3-2.1z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-gold mb-5 uppercase">
              바로가기
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-gold mb-5 uppercase">
              연습실
            </h3>
            <ul className="space-y-3">
              {studioLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] text-gold mb-5 uppercase">
              연락처
            </h3>
            <div className="space-y-3 text-sm text-white/50">
              <p className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-gold/50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {businessAddress}
              </p>
              <p className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-gold/50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {businessPhone}
              </p>
              <p className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-gold/50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {businessEmail}
              </p>
              {settings.bankInfo && (
                <p className="flex items-start gap-2 text-[11px] text-white/30 border-t border-white/5 pt-3 mt-3">
                  <svg className="w-3.5 h-3.5 mt-0.5 text-gold/30 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  {businessBank}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-1.5 text-xs text-white/40">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>대표: 최찬양</span>
              <span className="hidden sm:inline-block w-px h-2.5 bg-white/20" />
              <span>사업자등록번호: 729-35-00699</span>
            </div>
            <p>
              © {new Date().getFullYear()} TNT Music. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-white/30">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
