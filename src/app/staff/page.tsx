import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "공연장 스태프 지원 | TNT Music",
  description: "공연, 콘서트, 리사이틀 현장에 전문 스태프를 파견합니다. 무대 감독, 음향, 조명, 진행 등 전문 인력을 지원합니다.",
};

const staffRoles = [
  {
    title: "무대 감독 / 무대 매니저",
    icon: "🎬",
    description: "공연의 전체 흐름을 관리하고, 리허설부터 본 공연까지 원활한 진행을 책임집니다.",
    tasks: ["공연 전체 타임라인 관리", "출연자·스태프 큐 사인", "리허설 진행 및 조율", "비상 상황 대응"],
  },
  {
    title: "음향 엔지니어",
    icon: "🎙️",
    description: "공연장 음향 시스템 설치부터 실시간 믹싱까지, 최상의 사운드를 제공합니다.",
    tasks: ["PA 시스템 설치 및 세팅", "실시간 사운드 운영", "마이크 관리 및 모니터링", "리허설 음향 체크"],
  },
  {
    title: "조명 엔지니어",
    icon: "💡",
    description: "공연의 분위기를 완성하는 조명 설계 및 실시간 오퍼레이션을 담당합니다.",
    tasks: ["조명 플랜 설계 및 세팅", "공연 중 실시간 조명 운영", "특수 효과 연출", "장비 관리"],
  },
  {
    title: "공연 진행 / 하우스 매니저",
    icon: "🎤",
    description: "관객 안내, 티켓 관리, 로비 운영 등 프론트오브하우스 전반을 관리합니다.",
    tasks: ["관객 입·퇴장 관리", "하우스 오픈 및 클로즈", "안내 스태프 배치 및 지휘", "관객 안전 관리"],
  },
  {
    title: "무대 설치 / 전환 스태프",
    icon: "🔧",
    description: "세트, 소품, 악기 등 무대 설치와 장면 전환을 신속하고 안전하게 수행합니다.",
    tasks: ["무대 세트 설치·해체", "장면 전환 (인터미션 포함)", "악기 및 소품 배치", "안전 수칙 준수"],
  },
  {
    title: "영상 / 중계 스태프",
    icon: "📹",
    description: "공연 실황 촬영, 라이브 스트리밍, 영상 송출 등 영상 관련 전문 인력을 지원합니다.",
    tasks: ["멀티캠 촬영 운영", "라이브 스트리밍 세팅", "LED 스크린 송출", "공연 영상 기록"],
  },
];

const processSteps = [
  { step: "01", title: "문의 접수", desc: "공연 일정, 규모, 필요 인력을 알려주세요." },
  { step: "02", title: "인력 매칭", desc: "공연 성격에 맞는 전문 스태프를 배정합니다." },
  { step: "03", title: "사전 미팅", desc: "공연 디테일을 조율하고 리허설 일정을 확인합니다." },
  { step: "04", title: "현장 투입", desc: "리허설부터 본 공연까지 전문 인력이 함께합니다." },
];

export default function StaffPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden" id="staff-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-navy opacity-80" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-primary uppercase mb-4">Staff Support</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            공연장 <span className="text-gradient-gold">스태프 지원</span>
          </h1>
          <p className="mx-auto max-w-xl text-white/50 leading-relaxed">
            공연, 콘서트, 리사이틀 현장에 검증된 전문 스태프를 파견합니다.<br />
            무대 위의 아티스트가 공연에만 집중할 수 있도록 지원합니다.
          </p>
        </div>
      </section>

      {/* Staff Roles */}
      <section className="py-24 bg-background" id="staff-roles">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-medium tracking-[0.3em] text-primary uppercase mb-4">Professional Crew</span>
            <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">지원 가능 분야</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">각 분야의 현장 경험이 풍부한 전문 인력을 필요에 맞춰 배정합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffRoles.map((role) => (
              <Card key={role.title} className="group hover:shadow-lg hover:border-primary/20 transition-all">
                <CardContent className="p-7">
                  <div className="text-3xl mb-4">{role.icon}</div>
                  <h3 className="text-base font-bold text-foreground mb-2">{role.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{role.description}</p>
                  <ul className="space-y-1.5">
                    {role.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span> {task}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-muted" id="staff-process">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-3">진행 프로세스</h2>
            <p className="text-sm text-muted-foreground">문의부터 현장 투입까지 체계적으로 진행합니다.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, i) => (
              <div key={s.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 right-0 translate-x-1/2 w-8 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy" id="staff-cta">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            공연 스태프가 <span className="text-gradient-gold">필요하신가요?</span>
          </h2>
          <p className="text-white/40 leading-relaxed mb-8">
            공연 규모와 일정을 알려주시면, 최적의 인력을 매칭하여 안내해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button className="btn-gold rounded-full px-10 py-4 text-sm font-semibold tracking-wider h-auto">
                스태프 지원 문의하기
              </Button>
            </Link>
            <a href="tel:010-2561-8636">
              <Button variant="outline" className="rounded-full border-white/15 text-white/60 hover:border-gold/30 hover:text-gold-light px-10 py-4 h-auto">
                전화 문의: 010-2561-8636
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
