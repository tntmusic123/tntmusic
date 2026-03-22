import Link from "next/link";
import { format } from "date-fns";
import { getNotes } from "@/lib/store";
import { FilterBar } from "@/components/FilterBar";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NOTE | TNT Music",
  description: "TNT Music 노트 - 성악, 뮤지컬, 보이스 트레이닝에 대한 소소한 이야기를 전합니다.",
};

const categories = ["전체", "보이스 랩", "오디션 인사이드", "아티스트 인터뷰", "공연 리뷰", "Notice"];

// Next.js 서버 컴포넌트는 페이지 컴포넌트에 async를 사용할 수 있습니다.
export default async function NotePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string }> 
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "전체";
  let posts = await getNotes();

  // 필터링 적용
  if (currentCategory !== "전체") {
    posts = posts.filter(post => post.category === currentCategory);
  }
  
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
      <section className="py-2 bg-background border-b border-border sticky top-[64px] z-30" id="journal-filter">
        <Suspense fallback={<div className="h-10" />}>
          <FilterBar 
            categories={categories} 
            currentCategory={currentCategory} 
            baseUrl="/note" 
          />
        </Suspense>
      </section>

      {/* Posts Grid */}
      <section className="py-24 bg-background" id="journal-posts">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                선택한 카테고리에 등록된 노트가 없습니다.
              </div>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/note/${post.id}`}
                  className="group rounded-2xl border border-border overflow-hidden transition-all hover:shadow-xl hover:border-gold/20 flex flex-col h-full bg-card hover:-translate-y-1 duration-300"
                  id={`post-${post.id}`}
                >
                  {post.coverImageUrl ? (
                    <div className="h-56 relative overflow-hidden flex items-center justify-center bg-muted">
                      <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover transition-all group-hover:scale-105" />
                      <span className="absolute top-4 left-4 text-[10px] px-3 py-1 rounded-full bg-gold/90 text-white font-bold z-10 uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                  ) : (
                    <div className="h-56 bg-navy relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/80 to-navy-light/80 transition-all group-hover:opacity-70" />
                      <svg className="w-10 h-10 text-gold/20 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                      <span className="absolute top-4 left-4 text-[10px] px-3 py-1 rounded-full bg-gold/90 text-white font-bold z-10 uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    <time className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                      {format(new Date(post.createdAt), "yyyy. MM. dd")}
                    </time>
                    <h3 className="text-xl font-bold text-foreground mt-3 mb-4 group-hover:text-gold transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                      {post.content.length > 100 ? post.content.substring(0, 100).replace(/[#*`]/g, '') + "..." : post.content.replace(/[#*`]/g, '')}
                    </p>
                    <div className="mt-auto">
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-gold transition-all hover:gap-3 group/link">
                        자세히 보기
                        <span className="w-6 h-px bg-gold/30 group-hover/link:w-10 transition-all font-normal" />
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
