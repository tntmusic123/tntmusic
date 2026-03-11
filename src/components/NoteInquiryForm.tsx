"use client";

import { useState } from "react";
import { Headset, CheckCircle2 } from "lucide-react";
import { addInquiry } from "@/lib/store";
import { sendAdminNotification } from "@/app/actions/email";
import { toast } from "sonner";

export default function NoteInquiryForm({ noteTitle }: { noteTitle: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    // 1. DB (inquiries 테이블)에 저장
    await addInquiry("note", name, phone, "", message, window.location.href);

    // 2. 관리자에게 이메일 알림 발송
    await sendAdminNotification({
      subject: `노트 페이지 통한 상담 문의: ${name} 님`,
      content: `[유입 보고서] 노트 제목: ${noteTitle}\n[이름] ${name}\n[연락처] ${phone}\n\n[문의 내용]\n${message}`
    });

    toast.success("상담 문의가 성공적으로 접수되었습니다.");
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="bg-background rounded-2xl p-6 sm:p-8 shadow-xl text-center border border-border">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">상담 문의 접수 완료</h3>
        <p className="text-sm text-muted-foreground">담당자가 확인 후 빠르게 연락드리겠습니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-background rounded-2xl p-6 sm:p-8 shadow-xl text-left border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">이름</label>
          <input 
            name="name"
            type="text" 
            placeholder="이름을 입력하세요" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">연락처</label>
          <input 
            name="phone"
            type="tel" 
            placeholder="010-0000-0000" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>
      </div>
      <div className="space-y-2 mb-6">
        <label className="text-xs font-medium text-foreground">문의 내용</label>
        <textarea 
          name="message"
          placeholder="진행 중인 노트 내용에 대해 궁금한 점을 남겨주세요." 
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          required
        />
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-gold w-full rounded-md py-3 text-sm font-bold flex items-center justify-center gap-2"
      >
        <Headset className="w-4 h-4" /> {isSubmitting ? "전송 중..." : "간편 문의 남기기"}
      </button>
      <p className="text-[10px] text-center text-muted-foreground mt-4">
        문의를 남기시면 TNT Music의 개인정보처리방침에 동의하는 것으로 간주됩니다.
      </p>
    </form>
  );
}
