import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ARTISTS | TNT Music",
  description: "TNT Music 소속 아티스트 로스터 - 재능 있는 성악가와 뮤지컬 배우를 만나보세요.",
};

const artists = [
  { id: 1, name: "아티스트명", voice: "소프라노", field: "성악", initial: "A" },
  { id: 2, name: "아티스트명", voice: "테너", field: "성악", initial: "B" },
  { id: 3, name: "아티스트명", voice: "바리톤", field: "뮤지컬", initial: "C" },
  { id: 4, name: "아티스트명", voice: "메조소프라노", field: "성악", initial: "D" },
  { id: 5, name: "아티스트명", voice: "뮤지컬 배우", field: "뮤지컬", initial: "E" },
  { id: 6, name: "아티스트명", voice: "소프라노", field: "성악", initial: "F" },
];

export default function ArtistsPage() {
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
      <section className="py-6 bg-background border-b border-border sticky top-[64px] z-30" id="artists-filter">
        <div className="mx-auto max-w-6xl px-6 flex items-center gap-3 overflow-x-auto">
          {["전체", "성악", "뮤지컬"].map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                cat === "전체"
                  ? "bg-gold text-white"
                  : "bg-muted text-muted-foreground hover:bg-gold/10 hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Artist Grid */}
      <section className="py-24 bg-background" id="artists-grid">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="group rounded-2xl border border-border overflow-hidden transition-all hover:shadow-xl hover:border-gold/20"
                id={`artist-card-${artist.id}`}
              >
                {/* Placeholder avatar */}
                <div className="aspect-[3/4] bg-navy relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-transparent" />
                  <span className="text-6xl font-bold text-gold/10">{artist.initial}</span>
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-lg font-bold text-white mb-1">{artist.name}</h3>
                    <div className="flex gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/20 text-gold-light">{artist.voice}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">{artist.field}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
