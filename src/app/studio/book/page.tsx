"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "sonner";
import { addReservation, getBookedSlots } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User, Phone, Mail, MessageSquare, CheckCircle2, ArrowLeft } from "lucide-react";
import "react-day-picker/style.css";

const ALL_TIME_SLOTS = [
  "00:00 - 01:00","01:00 - 02:00","02:00 - 03:00","03:00 - 04:00",
  "04:00 - 05:00","05:00 - 06:00","06:00 - 07:00","07:00 - 08:00",
  "08:00 - 09:00","09:00 - 10:00","10:00 - 11:00","11:00 - 12:00",
  "12:00 - 13:00","13:00 - 14:00","14:00 - 15:00","15:00 - 16:00",
  "16:00 - 17:00","17:00 - 18:00","18:00 - 19:00","19:00 - 20:00",
  "20:00 - 21:00","21:00 - 22:00","22:00 - 23:00","23:00 - 00:00",
];

const bookingSchema = z.object({
  name: z.string().min(2, "이름을 2자 이상 입력해주세요."),
  phone: z.string().min(10, "올바른 연락처를 입력해주세요.").regex(/^[0-9-]+$/, "숫자와 하이픈(-)만 입력 가능합니다."),
  email: z.string().email("올바른 이메일을 입력해주세요.").optional().or(z.literal("")),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function StudioBookPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // 날짜 선택 시 해당 날짜의 예약된 슬롯 조회
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setBookedSlots(getBookedSlots(dateStr));
      setSelectedSlots([]); // 날짜 변경 시 선택 초기화
    }
  }, [selectedDate]);

  const toggleSlot = (slot: string) => {
    if (bookedSlots.includes(slot)) return; // 이미 예약된 슬롯은 클릭 불가
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || selectedSlots.length === 0) {
      toast.error("날짜와 시간대를 모두 선택해주세요.");
      return;
    }

    addReservation({
      ...data,
      date: format(selectedDate, "yyyy-MM-dd"),
      timeSlots: selectedSlots,
    });

    toast.success("예약 신청이 완료되었습니다! 확인 후 연락드리겠습니다.");
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section className="min-h-screen pt-32 pb-20 bg-background">
        <div className="mx-auto max-w-lg px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">예약 신청 완료</h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            예약 신청이 정상적으로 접수되었습니다.<br />
            확인 후 연락드리겠습니다.
          </p>
          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle className="text-sm text-primary">입금 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">은행:</strong> OO은행</p>
              <p><strong className="text-foreground">계좌번호:</strong> 000-000-000000</p>
              <p><strong className="text-foreground">예금주:</strong> TNT Music</p>
              <p className="text-xs text-destructive mt-3">* 24시간 내 입금 확인이 되지 않으면 예약이 자동 취소됩니다.</p>
            </CardContent>
          </Card>
          <Link href="/studio">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> 연습실로 돌아가기
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-navy opacity-80" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-primary uppercase mb-4">Reservation</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            연습실 <span className="text-gradient-gold">예약</span>
          </h1>
          <p className="text-white/50 text-sm">날짜와 시간을 선택하고 예약을 신청하세요. (24시간 운영)</p>
        </div>
      </section>

      {/* Booking Flow */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

            {/* Step 1: 날짜 선택 */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                <CalendarDays className="h-4 w-4" /> 날짜 선택
              </h2>
              <Card>
                <CardContent className="p-6 flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={ko}
                    disabled={{ before: new Date() }}
                    classNames={{
                      today: "text-primary font-bold",
                      selected: "bg-primary text-primary-foreground rounded-md",
                      chevron: "fill-primary",
                    }}
                  />
                </CardContent>
              </Card>
              {selectedDate && (
                <p className="mt-3 text-sm text-muted-foreground">
                  선택된 날짜: <strong className="text-foreground">{format(selectedDate, "yyyy년 MM월 dd일 (EEEE)", { locale: ko })}</strong>
                </p>
              )}
            </div>

            {/* Step 2: 시간대 선택 (24시간) */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                <Clock className="h-4 w-4" /> 시간 선택 <span className="text-xs text-muted-foreground font-normal">(복수 선택 가능 · 24시간 운영)</span>
              </h2>

              {!selectedDate ? (
                <p className="text-sm text-muted-foreground bg-muted rounded-lg p-4">먼저 날짜를 선택해주세요.</p>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/40" /> 선택됨
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/40" /> 예약 불가
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {ALL_TIME_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => toggleSlot(slot)}
                          className={`rounded-lg border px-2 py-2.5 text-xs font-medium transition-all ${
                            isBooked
                              ? "bg-red-500/10 border-red-500/30 text-red-400 cursor-not-allowed line-through"
                              : isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Step 3: 예약자 정보 */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                <User className="h-4 w-4" /> 예약자 정보
              </h2>
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-1">
                        <User className="h-3 w-3" /> 이름 <span className="text-destructive">*</span>
                      </Label>
                      <Input id="name" placeholder="이름을 입력하세요" {...register("name")} />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> 연락처 <span className="text-destructive">*</span>
                      </Label>
                      <Input id="phone" placeholder="010-0000-0000" {...register("phone")} />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> 이메일 (선택)
                    </Label>
                    <Input id="email" type="email" placeholder="email@example.com" {...register("email")} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> 추가 요청사항 (선택)
                    </Label>
                    <Textarea id="message" rows={3} placeholder="기타 요청사항이 있으면 적어주세요." {...register("message")} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit */}
            <div className="text-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !selectedDate || selectedSlots.length === 0}
                className="btn-gold rounded-full px-12 py-4 text-sm font-semibold tracking-wider h-auto"
              >
                {isSubmitting ? "신청 중..." : "예약 신청하기"}
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                승인 예약제로 운영됩니다. 신청 후 확인 연락을 드립니다.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
