"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> 홈으로 돌아가기
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-10 tracking-tight">개인정보처리방침</h1>
        
        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">1. 개인정보의 수집 및 이용 목적</h2>
            <p>
              티앤티뮤직스튜디오(이하 '회사')는 다음의 목적을 위하여 개인정보를 수집 및 이용합니다. 수집된 개인정보는 정해진 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>연습실 예약 및 관리: 예약 확인, 예약 내역 통지, 본인 확인, 서비스 이용에 따른 문의 대응 등</li>
              <li>상담 신청 처리: 레슨 상담, 대관 문의 등 고객 요청 사항에 대한 답변 및 안내</li>
              <li>서비스 운영 및 개선: 서비스 이용 기록 분석, 통계적 활용, 신규 서비스 개발 및 맞춤형 서비스 제공</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">2. 수집하는 개인정보 항목</h2>
            <p>회사는 서비스 제공을 위해 최소한의 범위 내에서 다음과 같은 개인정보를 수집하고 있습니다.</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>예약 시: 성함, 연락처(휴대폰 번호), 이메일(선택)</li>
              <li>문의 시: 성함, 연락처, 이메일, 문의 내용</li>
              <li>자동 수집 항목: IP 주소, 쿠키, 서비스 이용 기록, 접속 로그 등</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">3. 개인정보의 보유 및 이용 기간</h2>
            <p>
              회사는 이용자로부터 개인정보를 수집 시에 동의받은 개인정보 보유 및 이용 기간 내에서 개인정보를 처리하고 보유합니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>예약 기록: 예약 완료 후 5년 (전자상거래 등에서의 소비자 보호에 관한 법률)</li>
              <li>문의 기록: 문의 처리 완료 후 1년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">4. 개인정보의 파기 절차 및 방법</h2>
            <p>
              회사는 원칙적으로 개인정보 처리 목적이 달성된 경우에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하며, 종이 문서에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통해 파기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">5. 이용자의 권리와 그 행사 방법</h2>
            <p>
              이용자는 회사에 대해 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">6. 개인정보의 안전성 확보 조치</h2>
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>관리적 조치: 내부관리계획 수립 및 시행, 정기적 직원 교육 등</li>
              <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
              <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">7. 개인정보 보호책임자</h2>
            <p>개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <div className="mt-4 p-4 bg-muted rounded-xl border border-border">
              <p>성명: 최찬양</p>
              <p>연락처: 010-2561-8586</p>
              <p>이메일: tntmusic@kakao.com</p>
            </div>
          </section>
          
          <p className="pt-10 text-sm">공고일자: 2024년 03월 23일 / 시행일자: 2024년 03월 23일</p>
        </div>
      </div>
    </div>
  );
}
