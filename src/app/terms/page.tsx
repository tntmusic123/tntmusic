"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> 홈으로 돌아가기
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-10 tracking-tight">이용약관</h1>
        
        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">제 1 조 (목적)</h2>
            <p>
              이 약관은 티앤티뮤직스튜디오(이하 '회사')가 운영하는 웹사이트 및 제공하는 서비스(이하 '서비스')의 이용 조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">제 2 조 (용어의 정의)</h2>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>'웹사이트'란 회사가 서비스를 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 구성한 가상의 영업장을 의미합니다.</li>
              <li>'이용자'란 웹사이트에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 고객 및 방문객을 말합니다.</li>
              <li>'예약'이란 이용자가 웹사이트를 통해 연습실을 일정 시간 동안 사용하기 위해 신청하는 행위를 말합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">제 3 조 (약관의 명시와 개정)</h2>
            <p>
              회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 웹사이트의 하단에 게시합니다. 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 약관을 개정할 경우에는 적용 일자 및 개정 사유를 명시하여 현행 약관과 함께 웹사이트에 게시합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">제 4 조 (서비스의 제공 및 변경)</h2>
            <p>회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>연습실 예약 서비스</li>
              <li>아티스트 정보 및 레슨 상담 안내</li>
              <li>각종 커뮤니티(노트) 서비스</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">제 5 조 (예약 및 결제)</h2>
            <p>
              이용자는 웹사이트 내의 예약 폼을 통해 연습실 사용을 신청할 수 있습니다. 성함, 연락처 등 필수 정보를 정확히 입력해야 하며, 부정한 방법이나 정보를 입력할 경우 예약이 취소될 수 있습니다. 결제 방식은 무통장 입금 또는 현장 결제 등 서비스에서 안내하는 방식에 따릅니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">제 6 조 (취소 및 환불)</h2>
            <p>
              예약의 취소 및 환불은 회사가 정한 환불 정책에 따릅니다. 이용자의 단순 변심에 의한 취소는 사용 예정 일시로부터 일정 시간 이전까지 가능하며, 일정 기간 이후의 취소 시에는 위약금이 발생하거나 환불이 불가할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">제 7 조 (이용자의 의무)</h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
              <li>시설물의 고의적 훼손 또는 무단 유출</li>
              <li>기타 연습실 운영 방침 및 사회공공질서를 해치는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">제 8 조 (면책조항)</h2>
            <p>
              회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애 및 이용자가 시설 내에서 개인 물품을 분실하거나 도난당한 경우 책임을 지지 않습니다.
            </p>
          </section>

          <p className="pt-10 text-sm">공고일자: 2024년 03월 23일 / 시행일자: 2024년 03월 23일</p>
        </div>
      </div>
    </div>
  );
}
