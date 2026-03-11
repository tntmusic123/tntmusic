import Link from "next/link";
import { format } from "date-fns";
import { getNotes } from "@/lib/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NOTE | TNT Music",
  description: "TNT Music 노트 - 성악, 뮤지컬, 보이스 트레이닝에 대한 소소한 이야기를 전합니다.",
};

const categories = ["전체", "보이스 랩", "오디션 인사이드", "아티스트 인터뷰", "공연 리뷰", "Notice"];

// Next.js 서버 컴포넌트는 페이지 컴포넌트에 async를 사용할 수 있습니다.
export default async function NotePage() {
  const posts = await getNotes();
  
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden" id="journal-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-navy opacity-80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-gold uppercase mb-4">Note</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            <span className="text-gradient-gold">노트</span>
          </h1>
          <p className="mx-auto max-w-xl text-white/50 leading-relaxed">
            성악과 뮤지컬에 대한 전문 콘텐츠를 만나보세요.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-background border-b border-border sticky top-[64px] z-30" id="journal-filter">
        <div className="mx-auto max-w-6xl px-6 flex items-center gap-3 overflow-x-auto">
          {categories.map((cat) => (
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

      {/* Posts Grid */}
      <section className="py-24 bg-background" id="journal-posts">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl border border-border overflow-hidden transition-all hover:shadow-xl hover:border-gold/20"
                id={`post-${post.id}`}
              >
                {post.coverImageUrl ? (
                  <div className="h-48 relative overflow-hidden flex items-center justify-center bg-muted">
                    <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover transition-all group-hover:scale-105" />
                    <span className="absolute top-4 left-4 text-[11px] px-3 py-1 rounded-full bg-gold/90 text-white font-medium z-10">
                      {post.category}
                    </span>
                  </div>
                ) : (
                  <div className="h-48 bg-navy relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/80 to-navy-light/80 transition-all group-hover:opacity-70" />
                    <svg className="w-10 h-10 text-gold/20 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    <span className="absolute top-4 left-4 text-[11px] px-3 py-1 rounded-full bg-gold/90 text-white font-medium z-10">
                      {post.category}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(post.createdAt), "yyyy. MM. dd")}
                  </time>
                  <h3 className="text-lg font-bold text-foreground mt-2 mb-3 group-hover:text-gold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {post.content.length > 50 ? post.content.substring(0, 50) + "..." : post.content}
                  </p>
                  <Link
                    href={`/note/${post.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gold mt-4 transition-all hover:gap-2"
                  >
                    읽기
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
