import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/store";
import type { Metadata } from "next";
import { PremiumCarousel } from "@/components/PremiumCarousel";

export const metadata: Metadata = {
  title: "ABOUT | TNT Music",
  description: "TNT Music 소개 - 성악과 뮤지컬 전문가를 위한 프리미엄 공간과 에이전시 서비스를 제공합니다.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden" id="about-hero">
        {settings?.aboutImageUrl && (
          <div className="absolute inset-0 z-0 opacity-40">
            <img src={settings.aboutImageUrl} alt="About Us" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-navy opacity-80 z-10" />
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-gold/5 rounded-full blur-3xl z-10" />
        <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-gold uppercase mb-4">About</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            TNT <span className="text-gradient-gold">Music</span>
          </h1>
          <p className="mx-auto max-w-xl text-white/50 leading-relaxed">
            음악을 사랑하는 이들을 위한 최고의 환경과 기회를 만들어갑니다.
          </p>
        </div>
      </section>

      {/* Mission / Values */}
      <section className="py-24 bg-background" id="about-mission">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-medium tracking-[0.3em] text-gold uppercase mb-4 block">Our Story</span>
              <h2 className="text-3xl font-bold text-foreground tracking-tight mb-6">
                예술가의 꿈을 <br className="hidden sm:block" />현실로 만드는 파트너
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                TNT Music은 성악과 뮤지컬 분야에서 활동하는 예술가들에게 최상의 연습 환경과 무대 기회를 제공하기 위해 설립되었습니다.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                최고급 방음 시설과 그랜드 피아노가 구비된 전문 연습실부터, 재능 있는 아티스트를 무대에 연결하는 에이전시 서비스까지 — 음악인의 성장을 위한 모든 것을 한곳에서 제공합니다.
              </p>
              <Link
                href="/contact"
                className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wider"
              >
                문의하기
              </Link>
            </div>
            <div className="relative group">
              <div className="aspect-[4/3] rounded-2xl bg-navy overflow-hidden border border-white/5 shadow-xl relative">
                {settings?.aboutImages && settings.aboutImages.length > 0 ? (
                  <PremiumCarousel images={settings.aboutImages} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src="/images/b_logo.png"
                      alt="TNT Music"
                      width={200}
                      height={200}
                      className="w-32 h-auto opacity-20 invert"
                    />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold text-gradient-gold">T&T</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-muted" id="about-values">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-medium tracking-[0.3em] text-gold uppercase mb-4 block">Our Values</span>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">핵심 가치</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🎵", title: "전문성", desc: "성악·뮤지컬 분야에 특화된 전문 공간과 네트워크를 제공합니다." },
              { icon: "✨", title: "프리미엄", desc: "최고급 시설과 서비스로 아티스트의 퍼포먼스를 극대화합니다." },
              { icon: "🤝", title: "연결", desc: "아티스트와 무대를 연결하여 새로운 기회를 창출합니다." },
            ].map((value) => (
              <div key={value.title} className="bg-background rounded-2xl p-8 text-center border border-border transition-all hover:shadow-lg hover:border-gold/20">
                <div className="text-4xl mb-5">{value.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
