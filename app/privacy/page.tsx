import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Talkgate",
  description: "Talkgate 개인정보처리방침",
};

/**
 * 개인정보처리방침 페이지
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-foreground">
          개인정보처리방침
        </h1>
        <br/>
        <div className="space-y-8 md:space-y-10">
          {/* 1. 개인정보 처리자 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              1. 개인정보 처리자
            </h2>
            <ul className="space-y-2 md:space-y-3 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">회사명: 주식회사 핑크코브라</li>
              <li className="pl-2">서비스명: Talkgate</li>
            </ul>
          </section>

          {/* 2. 개인정보 처리의 역할 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              2. 개인정보 처리의 역할
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              회사는 이용자의 고객정보를 개인정보 처리수탁자의 지위에서 처리합니다.
            </p>
          </section>

          {/* 3. 개인정보 처리 목적 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              3. 개인정보 처리 목적
            </h2>
            <ul className="space-y-2 md:space-y-3 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">CRM 서비스 제공</li>
              <li className="pl-2">고객정보 저장, 관리, 조회</li>
              <li className="pl-2">보안 관리 및 장애 대응</li>
              <li className="pl-2">시스템 운영 및 유지보수</li>
            </ul>
          </section>

          {/* 4. 처리하는 개인정보 항목 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              4. 처리하는 개인정보 항목
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              이용자가 서비스에 직접 입력하거나 외부 시스템과 연동한 고객정보 일체
            </p>
            <p className="text-sm md:text-base leading-relaxed text-neutral-60 pl-4 md:pl-8 mt-2">
              (성명, 연락처, 상담 내용 등)
            </p>
          </section>

          {/* 5. 개인정보 보유 및 이용기간 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              5. 개인정보 보유 및 이용기간
            </h2>
            <ul className="space-y-2 md:space-y-3 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">위탁 계약 종료 시까지</li>
              <li className="pl-2">처리 목적 달성 후 지체 없이 파기</li>
            </ul>
          </section>

          {/* 6. 개인정보 파기 절차 및 방법 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              6. 개인정보 파기 절차 및 방법
            </h2>
            <ul className="space-y-2 md:space-y-3 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">전자적 파일: 복구 불가능한 기술적 방법으로 삭제</li>
              <li className="pl-2">출력물: 파쇄 또는 소각</li>
            </ul>
          </section>

          {/* 7. 개인정보 재수탁 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              7. 개인정보 재수탁
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4 mb-3 md:mb-4">
              회사는 서비스 제공을 위해 다음과 같은 재수탁자를 둘 수 있습니다.
            </p>
            <ul className="space-y-2 md:space-y-3 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6 mb-3 md:mb-4">
              <li className="pl-2">클라우드 인프라 제공사</li>
              <li className="pl-2">AI 기반 서비스 제공사</li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              재수탁자는 위탁 목적 범위 내에서만 개인정보를 처리합니다.
            </p>
          </section>

          {/* 8. 기술적·관리적 보호조치 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              8. 기술적&middot;관리적 보호조치
            </h2>
            <ul className="space-y-2 md:space-y-3 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">접근권한 관리</li>
              <li className="pl-2">접속 기록 보관</li>
              <li className="pl-2">개인정보 암호화</li>
              <li className="pl-2">내부 관리계획 수립 및 교육</li>
            </ul>
          </section>

          {/* 9. 개인정보 보호책임자 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              9. 개인정보 보호책임자
            </h2>
            <ul className="space-y-2 md:space-y-3 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">직책: 개인정보 보호책임자</li>
              <li className="pl-2">
                문의처:{" "}
                <a
                  href="mailto:support@talkgate.im"
                  className="text-primary-60 hover:text-primary-80 underline"
                >
                  support@talkgate.im
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
