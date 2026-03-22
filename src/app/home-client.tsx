"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getSiteSettings, getNotes, type SiteSettings, type Note } from "@/lib/store";
import PartnersSlider from "@/components/PartnersSlider";
import { Calendar, ChevronRight } from "lucide-react";

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [featuredNotes, setFeaturedNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [settingsData, notesData] = await Promise.all([
        getSiteSettings(),
        getNotes()
      ]);
      setSettings(settingsData as SiteSettings);
      setFeaturedNotes(notesData.filter(n => n.isMainExposed).slice(0, 3));
    }
    fetchData();
  }, []);

  const heroImage = settings?.heroImageUrl || "";

  return (
    <>
      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy"
        id="hero-section"
      >
        {/* Admin-controlled Background Image */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy/70" />
          </div>
        )}

        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b from-navy-dark via-navy to-navy-light ${heroImage ? "opacity-60" : "opacity-90"}`} />

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gold/3 blur-3xl" />

        {/* Musical note decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-[10%] text-8xl text-white">♪</div>
          <div className="absolute top-40 right-[15%] text-6xl text-white">♫</div>
          <div className="absolute bottom-32 left-[20%] text-7xl text-white">♬</div>
          <div className="absolute bottom-20 right-[25%] text-9xl text-white">𝄞</div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="animate-fade-in-up mb-10 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-5 py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-medium tracking-[0.2em] text-gold-light uppercase">
              Premium Music Studio & Agency
            </span>
          </div>

          <h1 className="animate-fade-in-up-delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            당신의 <span className="text-gradient-gold">예술</span>이
            <br />
            완성되는 공간
          </h1>

          <p className="animate-fade-in-up-delay-2 mx-auto max-w-2xl text-base sm:text-lg text-white/50 leading-relaxed mb-12">
            클래식 음악인을 위한 프리미엄 연습실.
          </p>

          <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/studio"
              className="btn-gold flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-wider"
              id="hero-cta-studio"
            >
              연습실 둘러보기
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/artists"
              className="flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-medium tracking-wider text-white/80 transition-all hover:border-gold/30 hover:text-gold-light hover:bg-gold/5"
              id="hero-cta-artists"
            >
              아티스트 보기
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ========================================
          INTRO SECTION
          ======================================== */}
      <section className="py-24 sm:py-32 bg-background" id="intro-section">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-medium tracking-[0.3em] text-gold uppercase mb-4">
              About TNT Music
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              음악이 시작되는 곳
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
              TNT Music은 클래식 음악인을 위한 최적의 음향 환경을 갖춘 전문 연습실 서비스를 제공합니다.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Studio Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-navy p-10 lg:p-12 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/5" id="feature-studio">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-gold/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gold/10 mb-6 transition-all duration-300 group-hover:bg-gold/20">
                  <svg className="w-7 h-7 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">프리미엄 연습실</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6">
                  최고급 방음 시설과 그랜드 피아노가 구비된 전문 연습실. 24시간 이용 가능합니다.
                </p>
                <Link href="/studio" className="inline-flex items-center gap-2 text-sm font-medium text-gold transition-all hover:gap-3">
                  자세히 보기
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Artist Agency Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-navy p-10 lg:p-12 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/5" id="feature-artists">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-gold/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gold/10 mb-6 transition-all duration-300 group-hover:bg-gold/20">
                  <svg className="w-7 h-7 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">아티스트 에이전시</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6">
                  재능 있는 성악가와 뮤지컬 배우를 무대에 연결합니다. 전문적인 매니지먼트를 제공합니다.
                </p>
                <Link href="/artists" className="inline-flex items-center gap-2 text-sm font-medium text-gold transition-all hover:gap-3">
                  아티스트 보기
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Staff Support Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-navy p-10 lg:p-12 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/5" id="feature-staff">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-gold/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gold/10 mb-6 transition-all duration-300 group-hover:bg-gold/20">
                  <svg className="w-7 h-7 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">공연장 스태프 지원</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6">
                  공연, 콘서트, 리사이틀 현장에 전문 스태프를 파견합니다. 무대·음향·조명 인력을 지원합니다.
                </p>
                <Link href="/staff" className="inline-flex items-center gap-2 text-sm font-medium text-gold transition-all hover:gap-3">
                  자세히 보기
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          FEATURED NOTES SECTION
          ======================================== */}
      {featuredNotes.length > 0 && (
        <section className="py-24 bg-[#05050a] border-y border-white/5" id="featured-notes">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-3 block">LATEST INSIGHTS</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">티앤티 <span className="text-gradient-gold">뮤직 노트</span></h2>
                <p className="text-white/70 mt-4 max-w-xl">보이스 랩, 오디션 팁, 아티스트 인터뷰 등 TNT Music이 전하는 깊이 있는 음악 이야기들을 만나보세요.</p>
              </div>
              <Link href="/note" className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-colors">
                모든 노트 보기 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredNotes.map(note => (
                <Link key={note.id} href={`/note/${note.id}`} className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={note.coverImageUrl || "/images/placeholder.jpg"} 
                      alt={note.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 uppercase tracking-wider">{note.category}</span>
                      <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {note.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================
          PARTNERS SECTION
          ======================================== */}
      {settings?.partnerLogos && settings.partnerLogos.length > 0 && (
        <PartnersSlider logos={settings.partnerLogos} />
      )}

      {/* ========================================
          CTA SECTION
          ======================================== */}
      <section className="py-24 sm:py-32 bg-navy relative overflow-hidden" id="cta-section">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <Image
            src="/images/w_logo.png"
            alt="TNT Music"
            width={100}
            height={30}
            className="h-7 w-auto mx-auto mb-8 opacity-40"
          />
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
            지금 바로 <span className="text-gradient-gold">예약</span>하세요
          </h2>
          <p className="text-white/40 leading-relaxed mb-10">
            최적의 연습 환경에서 당신의 음악을 완성하세요.
            <br />
            24시간 운영, 간편한 예약 시스템으로 원하는 시간에 바로 이용 가능합니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/studio/book" className="btn-gold rounded-full px-10 py-4 text-sm font-semibold tracking-wider" id="cta-reserve">
              연습실 예약
            </Link>
            <Link href="/contact" className="rounded-full border border-white/15 px-10 py-4 text-sm font-medium tracking-wider text-white/60 transition-all hover:border-gold/30 hover:text-gold-light" id="cta-contact">
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
