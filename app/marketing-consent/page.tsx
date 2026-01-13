import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talkgate 마케팅 정보 수신 동의 | Talkgate",
  description: "Talkgate 마케팅 정보 수신 동의",
};

/**
 * Talkgate 마케팅 정보 수신 동의 페이지
 */
export default function MarketingConsentPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-foreground">
          Talkgate 마케팅 정보 수신 동의
        </h1>
        <br/>
        <div className="space-y-6 md:space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
            본인은 주식회사 핑크코브라가 Talkgate 서비스와 관련하여 다음과 같은 정보를 제공하는 것에 동의합니다.
          </p><br/>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              수신 내용
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              서비스 안내, 기능 업데이트, 이벤트 및 프로모션 정보
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              수신 방법
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              이메일, 문자메시지, 알림톡 등
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              동의 철회
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              언제든지 수신 거부 가능
            </p>
          </section>

          <section className="pt-4 md:pt-6 border-t border-border">
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              본 동의는 선택 사항이며, 동의하지 않더라도 Talkgate 서비스 이용에는 제한이 없습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
