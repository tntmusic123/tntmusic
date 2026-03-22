"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getReservations, getSiteSettings, type Reservation, type SiteSettings } from "@/lib/store";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Music, Piano, ChevronLeft, ChevronRight, Shield, Maximize } from "lucide-react";
import { PremiumCarousel } from "@/components/PremiumCarousel";

const ALL_TIME_SLOTS = [
  "00:00","01:00","02:00","03:00","04:00","05:00",
  "06:00","07:00","08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00","21:00","22:00","23:00",
];

export default function StudioPage() {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadData() {
      const [fetchedReservations, fetchedSettings] = await Promise.all([
        getReservations(),
        getSiteSettings()
      ]);
      setReservations(fetchedReservations);
      setSettings(fetchedSettings as SiteSettings);
    }
    loadData();
  }, []);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const getSlotStatus = (date: Date, hour: string): "available" | "booked" | "past" => {
    const dateStr = format(date, "yyyy-MM-dd");
    const slotLabel = `${hour} - ${String(Number(hour.split(":")[0]) + 1).padStart(2, "0")}:00`;

    if (date < today && !isSameDay(date, today)) return "past";
    if (isSameDay(date, today) && Number(hour.split(":")[0]) < today.getHours()) return "past";

    const booked = reservations
      .filter((r) => r.date === dateStr && ["pending", "confirmed"].includes(r.status))
      .flatMap((r) => r.timeSlots);
      
    return booked.includes(slotLabel) ? "booked" : "available";
  };

  const prevWeek = () => setWeekStart((d) => addDays(d, -7));
  const nextWeek = () => setWeekStart((d) => addDays(d, 7));

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden" id="studio-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-navy opacity-80" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-primary uppercase mb-4">Studio</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            프리미엄 <span className="text-gradient-gold">연습실</span>
          </h1>
          <p className="mx-auto max-w-xl text-white/50 leading-relaxed">
            최고급 방음 시설과 그랜드 피아노가 구비된 전문 연습 공간
          </p>
        </div>
      </section>

      {/* Studio Info */}
      <section className="py-24 bg-background" id="studio-info">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Studio Visual */}
            <div className="rounded-2xl overflow-hidden border border-border group">
              <div className="h-80 sm:h-[400px] bg-navy relative overflow-hidden">
                {settings?.studioImages && settings.studioImages.length > 0 ? (
                  <PremiumCarousel images={settings.studioImages} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-dark to-navy-light opacity-50" />
                    <svg className="w-16 h-16 text-gold/30 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Info Area (Inside the same border card) */}
              <div className="p-8 bg-background">
                <h2 className="text-2xl font-bold text-foreground mb-1">TNT Studio</h2>
                <p className="text-sm text-primary tracking-wider mb-5">Premium Practice Room</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Maximize className="h-4 w-4 text-primary" /> 약 15평
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Piano className="h-4 w-4 text-primary" /> 그랜드 피아노
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" /> 특급 방음
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" /> 24시간 운영
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-5 mb-6">
                  {["그랜드 피아노", "특급 방음", "에어컨", "대형 거울", "보면대", "24시간"].map((f) => (
                    <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">{f}</span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-border gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground mr-4">평일 (월~금)</span>
                      <span className="font-bold text-gradient-gold">{settings?.studioPriceWeekday || "시간당 15,000원"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex-1">주말 및 공휴일 (토~일)</span>
                      <span className="font-bold text-gradient-gold">{settings?.studioPriceWeekend || "시간당 18,000원"}</span>
                    </div>
                  </div>
                  <Link href="/studio/book">
                    <Button className="btn-gold rounded-full px-8 py-2.5 text-sm font-semibold h-auto w-full sm:w-auto">
                      예약하기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Reservation Status */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" /> 실시간 예약현황
                </h3>
                <div className="flex items-center gap-1">
                  <button onClick={prevWeek} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <span className="text-sm text-muted-foreground px-2">
                    {format(weekDays[0], "M/d", { locale: ko })} ~ {format(weekDays[6], "M/d", { locale: ko })}
                  </span>
                  <button onClick={nextWeek} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/40" /> 예약 가능
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/40" /> 예약 완료
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-muted border border-border" /> 지난 시간
                </div>
              </div>

              {/* Weekly Grid */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="p-2 text-left text-muted-foreground font-medium sticky left-0 bg-card z-10 w-14">시간</th>
                          {weekDays.map((day) => (
                            <th
                              key={day.toISOString()}
                              className={`p-2 text-center font-medium min-w-[60px] ${
                                isSameDay(day, today)
                                  ? "text-primary font-bold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <div>{format(day, "E", { locale: ko })}</div>
                              <div className={`text-sm ${isSameDay(day, today) ? "text-primary" : ""}`}>
                                {format(day, "d")}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ALL_TIME_SLOTS.map((hour) => (
                          <tr key={hour} className="border-b border-border/50 last:border-0">
                            <td className="p-1.5 text-muted-foreground font-mono sticky left-0 bg-card z-10">{hour}</td>
                            {weekDays.map((day) => {
                              const status = getSlotStatus(day, hour);
                              return (
                                <td key={`${day.toISOString()}-${hour}`} className="p-0.5">
                                  <div
                                    className={`h-5 rounded-sm mx-0.5 ${
                                      status === "available"
                                        ? "bg-emerald-500/15 border border-emerald-500/30"
                                        : status === "booked"
                                        ? "bg-red-500/15 border border-red-500/30"
                                        : "bg-muted/50"
                                    }`}
                                    title={`${format(day, "M/d")} ${hour} - ${
                                      status === "available" ? "예약 가능" : status === "booked" ? "예약 완료" : "지난 시간"
                                    }`}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 text-center">
                <Link href="/studio/book">
                  <Button variant="outline" className="rounded-full px-8">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    예약하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Notice */}
      <section className="py-16 bg-muted" id="studio-pricing">
        <div className="mx-auto max-w-4xl px-6 lg:px-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">예약 안내</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            연습실 예약은 <strong className="text-primary">승인 예약제</strong>로 운영됩니다.<br />
            예약 신청 후 확인 연락을 드리며, 이용료는 계좌이체로 결제합니다.<br />
            <strong className="text-primary">24시간 운영</strong>으로 언제든 연습이 가능합니다.
          </p>
            <div className="inline-flex items-center gap-3 bg-background border border-primary/20 rounded-xl px-6 py-4">
              <Music className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground font-medium">예약 문의: 010-2561-8636</span>
            </div>
        </div>
      </section>
    </>
  );
}
