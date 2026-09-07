/**
 * 요금제의 정적인 소개 영역은 데이터 로딩과 무관하게 초기 HTML에 포함합니다.
 * 비동기 상태는 실제 API 데이터가 필요한 카드 영역에서만 표시합니다.
 */
export default function PricingLoadingState() {
  return (
    <section className="pt-0 pb-12 md:pb-20 min-h-screen bg-white">
      <div className="max-w-[1192px] mx-auto px-6 md:px-4">
        <div className="flex justify-center mb-9.5 md:mb-12">
          <div className="w-full md:w-auto inline-flex rounded-full bg-[#F8F8F8] p-1" aria-hidden="true">
            <div className="w-1/2 md:w-[196px] h-9 md:h-auto px-4 md:px-8 py-0 md:py-3 rounded-full bg-[#252525] text-white font-semibold text-[14px] md:text-[18px] flex items-center justify-center">
              월마다
            </div>
            <div className="w-1/2 md:w-[196px] h-9 md:h-auto px-4 md:px-8 py-0 md:py-3 rounded-full text-[#808080] font-semibold text-[14px] md:text-[18px] flex items-center justify-center">
              3개월마다
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20" role="status">
          <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#E2E2E2] border-t-[#00E272] rounded-full animate-spin mb-4" />
          <div className="text-[16px] text-[#808080]">플랜 정보를 불러오는 중...</div>
        </div>
      </div>
    </section>
  );
}
