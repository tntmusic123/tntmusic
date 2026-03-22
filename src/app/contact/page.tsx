"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Landmark, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

const contactSchema = z.object({
  name: z.string().min(2, "이름을 2자 이상 입력해주세요."),
  phone: z.string().min(10, "올바른 연락처를 입력해주세요.").regex(/^[0-9-]+$/, "숫자와 하이픈(-)만 입력 가능합니다."),
  email: z.string().email("올바른 이메일을 입력해주세요.").optional().or(z.literal("")),
  inquiryType: z.string().min(1, "문의 유형을 선택해주세요."),
  message: z.string().min(10, "문의 내용을 10자 이상 입력해주세요."),
});

type ContactFormData = z.infer<typeof contactSchema>;

import { addInquiry, getSiteSettings } from "@/lib/store";
import { useEffect } from "react";
import { sendAdminNotification } from "@/app/actions/email";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const businessPhone = settings.contactPhone || "010-2561-8636";
  const businessEmail = settings.contactEmail || "tntmusic@kakao.com";
  const businessAddress = settings.contactAddress || "서울특별시 강남구 논현로12길 19-6 우도빌딩 B1";
  const businessBank = settings.bankInfo || "우리은행 1005-103-980558 (최찬양)";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    await addInquiry(
      data.inquiryType,
      data.name,
      data.phone,
      data.email,
      data.message,
      window.location.href // sourceUrl
    );

    // [이메일 알림 연동]
    await sendAdminNotification({
      subject: `웹사이트 문의 접수: ${data.name} 님`,
      content: `[문의 유형] ${data.inquiryType}\n[이름] ${data.name}\n[연락처] ${data.phone}\n[이메일] ${data.email || "미입력"}\n\n[문의 내용]\n${data.message}`,
    });

    toast.success("문의가 정상적으로 접수되었습니다. 빠르게 답변드리겠습니다!");
    setIsSubmitted(true);
    reset();
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden" id="contact-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark to-navy opacity-80" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <span className="inline-block text-xs font-medium tracking-[0.3em] text-primary uppercase mb-4">Contact</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            <span className="text-gradient-gold">문의</span>하기
          </h1>
          <p className="mx-auto max-w-xl text-white/50 leading-relaxed">
            연습실 예약, 아티스트 섭외 등 궁금한 점을 남겨주세요.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-24 bg-background" id="contact-form-section">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              {isSubmitted ? (
                <Card className="text-center py-16">
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">문의가 접수되었습니다</h3>
                    <p className="text-sm text-muted-foreground">빠른 시일 내 답변드리겠습니다.</p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      새 문의 작성
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form id="contact-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름 <span className="text-destructive">*</span></Label>
                      <Input id="name" placeholder="이름을 입력하세요" {...register("name")} />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">연락처 <span className="text-destructive">*</span></Label>
                      <Input id="phone" placeholder={businessPhone} {...register("phone")} />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" placeholder="email@example.com" {...register("email")} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiry-type">문의 유형 <span className="text-destructive">*</span></Label>
                    <select
                      id="inquiry-type"
                      {...register("inquiryType")}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                    >
                      <option value="">선택하세요</option>
                      <option value="studio">연습실 예약</option>
                      <option value="artist-booking">아티스트 섭외</option>
                      <option value="artist-register">아티스트 등록</option>
                      <option value="staff">공연장 스태프 지원</option>
                      <option value="other">기타 문의</option>
                    </select>
                    {errors.inquiryType && <p className="text-xs text-destructive">{errors.inquiryType.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">문의 내용 <span className="text-destructive">*</span></Label>
                    <Textarea id="message" rows={6} placeholder="문의하실 내용을 자세히 적어주세요." {...register("message")} />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full sm:w-auto rounded-full px-10 py-3.5 text-sm font-semibold tracking-wider h-auto"
                    id="contact-submit"
                  >
                    {isSubmitting ? "전송 중..." : "문의 보내기"}
                  </Button>
                </form>
              )}
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-2">
              <Card className="bg-navy text-white border-none sticky top-28">
                <CardHeader>
                  <CardTitle className="text-lg text-gradient-gold">연락 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1 tracking-wider uppercase">주소</p>
                      <p className="text-sm text-white/70">{businessAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1 tracking-wider uppercase">전화</p>
                      <p className="text-sm text-white/70">{businessPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1 tracking-wider uppercase">이메일</p>
                      <p className="text-sm text-white/70">{businessEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1 tracking-wider uppercase">운영 시간</p>
                      <p className="text-sm text-white/70">24시간 운영</p>
                    </div>
                  </div>

                  {/* Bank info */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Landmark className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1 tracking-wider uppercase">입금 계좌</p>
                        <p className="text-sm text-white/70">우리은행 1005-103-980558</p>
                        <p className="text-xs text-white/40 mt-1">예금주: 최찬양(티엔티뮤직)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-24 bg-muted" id="contact-map">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-medium tracking-[0.3em] text-primary uppercase mb-4">Location</span>
            <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <MapPin className="h-6 w-6 text-primary" /> 오시는 길
            </h2>
            <p className="text-muted-foreground">{businessAddress}</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg h-[400px] sm:h-[500px] w-full relative mb-12">
            <iframe
              src="https://maps.google.com/maps?q=37.475351,127.0490843&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale-[20%] contrast-[1.1]"
            />
          </div>

          {/* Detailed Map & Pricing Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> 상세 약도 안내
              </h3>
              <div className="rounded-2xl overflow-hidden border border-border shadow-xl bg-white p-2">
                <img src="/images/contact_map.png" alt="TNT Music 상세 약도" className="w-full h-auto" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> 연습실 이용 및 요금 안내
              </h3>
              <div className="rounded-2xl overflow-hidden border border-border shadow-xl bg-white p-2">
                <img src="/images/pricing_info.png" alt="TNT Music 이용 시간 및 금액" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
