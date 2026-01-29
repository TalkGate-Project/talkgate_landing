import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 이용약관 | Talkgate",
  description: "Talkgate 서비스 이용약관",
};

/**
 * 서비스 이용약관 페이지
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-foreground">
          Talkgate 서비스 이용약관
        </h1>
        <br/>
        <div className="space-y-8 md:space-y-10">
          {/* 제1조 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제1조 (목적)
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              본 약관은 주식회사 핑크코브라(이하 &quot;회사&quot;)가 제공하는 Talkgate CRM 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리&middot;의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제2조 (서비스의 성격 및 지위)
            </h2>
            <ul className="space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">
                ① Talkgate는 이용자가 보유하거나 관리 권한을 가진 고객정보를 저장&middot;관리&middot;조회할 수 있도록 제공되는 B2B CRM 소프트웨어(SaaS)입니다.
              </li>
              <li className="pl-2">
                ② 회사는 고객 개인정보를 직접 수집하지 않으며, 이용자의 지시에 따라 개인정보를 기술적&middot;관리적으로 처리하는 개인정보 처리수탁자의 지위에 있습니다.
              </li>
              <li className="pl-2">
                ③ 서비스에는 이용자가 고객에게 문자메시지(SMS/LMS/MMS 등)를 발송할 수 있도록 지원하는 기능이 포함될 수 있으며, 회사는 이용자의 지시에 따라 문자 발송을 기술적으로 중개&middot;지원하는 역할만을 수행합니다.
              </li>
              <li className="pl-2">
                ④ 회사는 문자메시지의 내용, 수신 대상, 발송 적법성에 대해 발송 주체가 아니며, 해당 책임은 전적으로 이용자에게 귀속됩니다.
              </li>
            </ul>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제3조 (이용자의 개인정보 적법성 보증)
            </h2>
            <ul className="space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">
                ① 이용자는 서비스에 입력&middot;연동&middot;업로드하는 모든 개인정보가 개인정보보호법 및 관계 법령에 따라 적법하게 수집&middot;이용&middot;제공된 정보임을 보증합니다.
              </li>
              <li className="pl-2">
                ② 광고사, 제휴사 등 제3자로부터 제공받은 개인정보를 사용하는 경우, 이용자는 정보주체로부터 적법한 제3자 제공 동의를 사전에 확보하여야 합니다.
              </li>
            </ul>
          </section>

          {/* 제3조의2 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제3조의2 (문자 발송 적법성 및 동의 보증)
            </h2>
            <ul className="space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">
                ① 이용자는 서비스를 통해 문자메시지를 발송함에 있어 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「개인정보 보호법」, 「전기통신사업법」 등 관계 법령을 준수할 것을 보증합니다.
              </li>
              <li className="pl-2">
                ② 광고성 문자메시지를 발송하는 경우, 이용자는 정보주체로부터 사전 수신동의를 적법하게 확보하여야 하며, 법령이 정한 표시사항(광고 표시, 발신자 정보, 수신거부 방법 등)을 모두 포함하여야 합니다.
              </li>
              <li className="pl-2">
                ③ 이용자는 수신동의의 획득, 보관, 철회 관리에 대한 책임을 부담하며, 관련 분쟁 발생 시 이를 직접 소명하여야 합니다.
              </li>
            </ul>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제4조 (이용자의 책임)
            </h2>
            <ul className="space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">
                ① 이용자의 개인정보 처리 행위, 영업 활동, 상담 행위 및 그 결과에 대한 모든 법적 책임은 이용자에게 귀속됩니다.
              </li>
              <li className="pl-2">
                ② 이용자의 위법 또는 부적절한 개인정보 처리로 인해 발생하는 민&middot;형사&middot;행정상 책임에 대해 회사는 어떠한 책임도 부담하지 않습니다.
              </li>
            </ul>
          </section>

          {/* 제4조의2 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제4조의2 (문자 발송 제한 및 차단)
            </h2>
            <ul className="space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">
                ① 회사는 다음 각 호에 해당하는 경우, 사전 통지 없이 문자 발송을 제한하거나 중단할 수 있습니다.
                <ul className="mt-2 space-y-1 list-disc list-inside pl-2 text-neutral-70">
                  <li>불법&middot;스팸&middot;사기&middot;도박&middot;성인&middot;금융투자 관련 내용이 포함된 경우</li>
                  <li>관계 법령 또는 통신사, 문자중계사의 정책을 위반하거나 위반 우려가 있는 경우</li>
                  <li>광고성 문자임에도 불구하고 필수 표시사항이 누락된 경우</li>
                  <li>다수 민원, 신고 또는 이상 발송 패턴이 감지된 경우</li>
                </ul>
              </li>
              <li className="pl-2">
                ② 회사는 서비스 안정성 및 법령 준수를 위하여 문자 메시지 내용에 대한 기술적 필터링, 발송량 제한, 발송 지연 등의 조치를 취할 수 있습니다.
              </li>
              <li className="pl-2">
                ③ 본 조에 따른 발송 제한 또는 중단으로 발생한 손해에 대해 회사는 책임을 부담하지 않습니다.
              </li>
            </ul>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제5조 (회사의 책임 제한)
            </h2>
            <ul className="space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">
                ① 회사는 이용자가 입력한 개인정보의 정확성, 적법성, 최신성, 동의 여부에 대해 검증하거나 확인할 의무를 부담하지 않습니다.
              </li>
              <li className="pl-2">
                ② 회사는 이용자의 영업 성과, 상담 결과, 마케팅 효과 등에 대해 책임을 지지 않습니다.
              </li>
              <li className="pl-2">
                ③ 회사는 이용자가 발송한 문자메시지의 내용, 수신 대상의 적법성, 수신동의 여부, 광고성 여부에 대해 이를 사전에 검증할 의무를 부담하지 않습니다.
              </li>
              <li className="pl-2">
                ④ 문자 발송으로 인해 발생한 민원, 분쟁, 과태료, 손해배상 등 모든 책임은 이용자에게 귀속됩니다.
              </li>
            </ul>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제6조 (서비스 중단 및 데이터 손실)
            </h2>
            <ul className="space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
              <li className="pl-2">
                ① 회사는 천재지변, 시스템 장애, 통신 장애, 제3자 귀책 사유 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.
              </li>
              <li className="pl-2">
                ② 회사는 고의 또는 중과실이 없는 한 데이터 손실에 대해 책임을 부담하지 않습니다.
              </li>
              <li className="pl-2">
                ③ 회사는 법령 위반, 스팸 발송 의심, 통신사 또는 문자중계사의 요청이 있는 경우, 서비스의 전부 또는 일부를 즉시 중단할 수 있습니다.
              </li>
            </ul>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제7조 (손해배상 한도)
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              회사의 귀책 사유로 손해가 발생한 경우에도 회사의 손해배상 책임은 최근 3개월간 이용자가 회사에 지급한 이용요금의 총액을 한도로 합니다.
            </p>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제8조 (재수탁)
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              회사는 서비스 제공을 위하여 클라우드 인프라 제공사, AI 서비스 제공사 등 제3자에게 개인정보 처리 업무의 일부를 재위탁할 수 있습니다.
            </p>
          </section>

          {/* 제9조 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              제9조 (관할법원)
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
              본 약관과 관련하여 발생하는 분쟁의 관할법원은 회사의 본점 소재지를 관할하는 법원으로 합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
