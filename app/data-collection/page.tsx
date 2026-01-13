import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고객정보 적법 수집 및 제3자 제공 책임 확인 | Talkgate",
  description: "Talkgate 고객정보 적법 수집 및 제3자 제공 책임 확인",
};

/**
 * 고객정보 적법 수집 및 제3자 제공 책임 확인 페이지
 */
export default function DataCollectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-foreground">
          고객정보 적법 수집 및 제3자 제공 책임 확인
        </h1>
        <br/>
        <div className="space-y-6 md:space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-neutral-70 pl-0 md:pl-4">
            본인은 Talkgate에 입력&middot;연동&middot;관리하는 모든 고객정보에 대하여 다음 사항을 확인하고 이에 동의합니다.
          </p>

          <ul className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed text-neutral-70 pl-4 md:pl-6">
            <li className="pl-2">
              해당 개인정보는 개인정보보호법 및 관계 법령에 따라 적법하게 수집되었습니다.
            </li>
            <li className="pl-2">
              광고사 또는 제3자로부터 제공받은 개인정보의 경우, 정보주체로부터 적법한 제3자 제공 동의를 사전에 확보하였습니다.
            </li>
            <li className="pl-2">
              회사는 해당 개인정보의 수집 경위, 동의 여부, 적법성에 대해 검증할 책임이 없음을 이해합니다.
            </li>
            <li className="pl-2">
              본 확인 내용이 사실과 다를 경우 발생하는 모든 민&middot;형사&middot;행정상 책임은 본인에게 귀속됨을 확인합니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
