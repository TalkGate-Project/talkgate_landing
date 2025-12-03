import Image from "next/image";

export function IntroduceStatusSection() {
  return (
    <section className="py-20">
      <div className="container-landing">
        <div className="text-center mb-16">
          <h5 className="text-primary-60 typo-title-1 mb-4">
            데이터 기반의 통계
          </h5>
          <h2 className="typo-h1">
            성과 랭킹을 공개하여 목표달성을 촉진하세요.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-[70px]">
          <div className="bg-[#F6F6F6] rounded-[16px] text-center !px-[36px] !pt-[58px] w-full md:min-h-[570px]">
            <Image
              src="/images/introduce-status-1.png"
              alt="introduce-status-1"
              width={478}
              height={264}
            />
            <h3>다양한 기준별 성과 및 순위 분석</h3>
            <p>
              일간, 월간 등 기간별 상세 데이터를 손쉽게 비교하고, <br />
              다양한 기준별 비즈니스 성장의 패턴을 명확히 파악하세요.
            </p>
          </div>
          <div className="bg-[#F6F6F6] rounded-[16px] !px-[36px] !pt-[58px] w-full md:min-h-[570px]">
            <Image
              src="/images/introduce-status-2.png"
              alt="introduce-status-2"
              width={478}
              height={264}
            />
            <h3>팀별 랭킹을 공개하여 목표 달성 촉진</h3>
            <p>
              팀별 성과 랭킹과 금액을 투명하게 공개하고, 건강한 경쟁을 통해{" "}
              <br />
              목표 달성을 촉진하세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
