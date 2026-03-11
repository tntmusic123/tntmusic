"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface EmailPayload {
  subject: string;
  content: string;
}

export async function sendAdminNotification(payload: EmailPayload) {
  try {
    const { data, error } = await resend.emails.send({
      // Resend 기본 테스트 도메인 발신자. 실제 운영 시 자체 도메인(예: no-reply@tntmusic.com) 인증 필요.
      from: "TNT Music 알림 <onboarding@resend.dev>", 
      to: ["tntmusic@kakao.com", "cco1548@naver.com"],
      subject: `[TNT Music] ${payload.subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
           <h2 style="color: #333;">📢 TNT Music 신규 접수 내역</h2>
           <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; white-space: pre-wrap; line-height: 1.6; margin-bottom: 20px;">${payload.content}</div>
           <p style="font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
             본 메일은 TNT Music 웹사이트에서 자동 발송되었습니다.
           </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API 발송 에러:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("이메일 발송 중 서버 에러:", error);
    return { success: false, error };
  }
}
