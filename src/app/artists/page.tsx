export const dynamic = "force-dynamic";

import Link from "next/link";
import { getArtists, getSiteSettings } from "@/lib/store";
import { FilterBar } from "@/components/FilterBar";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ARTISTS | TNT Music",
  description: "TNT Music 소속 아티스트 로스터 - 재능 있는 성악가와 뮤지컬 배우를 만나보세요.",
};

export default async function ArtistsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string }> 
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "전체";
  let artists = await getArtists();

  // 필터링 적용
  if (currentCategory !== "전체") {
    artists = artists.filter(artist => artist.role === currentCategory);
  }

  const siteSettings = await getSiteSettings();
  const fields = ["전체", ...(siteSettings.artistFields || ["성악", "뮤지컬"])];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden" id="artists-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-navy opacity-80" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-gold uppercase mb-4">Artists</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            <span className="text-gradient-gold">아티스트</span> 로스터
          </h1>
          <p className="mx-auto max-w-xl text-white/50 leading-relaxed">
            TNT Music과 함께하는 재능 있는 아티스트들을 만나보세요.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-2 bg-background border-b border-border sticky top-[64px] z-30" id="artists-filter">
        <Suspense fallback={<div className="h-10" />}>
          <FilterBar 
            categories={fields} 
            currentCategory={currentCategory} 
            baseUrl="/artists" 
          />
        </Suspense>
      </section>

      {/* Artist Grid */}
      <section className="py-24 bg-background" id="artists-grid">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-20 text-muted-foreground">
                등록된 아티스트가 없습니다.
              </div>
            ) : (
              artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="group rounded-2xl border border-border overflow-hidden transition-all hover:shadow-2xl hover:border-gold/30 hover:-translate-y-1 block"
                >
                  <div className="aspect-[3/4] bg-navy relative overflow-hidden flex items-center justify-center">
                    {artist.imageUrl ? (
                      <img src={artist.imageUrl} alt={artist.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                       <span className="text-6xl font-bold text-gold/10 group-hover:scale-110 transition-transform duration-700">{artist.name[0]}</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-6 left-6 right-6 z-10 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase px-2 py-0.5 bg-gold/10 border border-gold/20 rounded w-fit backdrop-blur-sm">
                          {artist.role}
                        </span>
                        <h3 className="text-2xl font-bold text-white tracking-tight leading-none">{artist.name}</h3>
                        {artist.bio && (
                          <p className="text-xs text-white/60 line-clamp-1 font-medium mt-1">
                            {artist.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">아티스트로 등록하고 싶으신가요?</p>
            <Link
              href="/contact"
              className="btn-gold inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold tracking-wider"
            >
              아티스트 등록 문의
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
