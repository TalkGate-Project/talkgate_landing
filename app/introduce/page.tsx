import type { Metadata } from "next";
import Image from "next/image";
import { PAGE_METADATA, BRAND } from "@/lib/constants";
import type { TimelineItem } from "@/types";

export const metadata: Metadata = {
  title: PAGE_METADATA.introduce.title,
  description: PAGE_METADATA.introduce.description,
};

/**
 * 회사 스토리 타임라인 데이터
 */
const STORY_ITEMS: TimelineItem[] = [
  {
    date: "2025.11.01",
    title: "고객 관계(CRM) 트렌드 선도, Talkgate이 이끄는 차세대 CX 솔루션",
  },
  {
    date: "2025.11.01",
    title: "AI 챗봇, Talkgate AI 상담 도우미로 효율 극대화",
  },
];

export default function IntroducePage() {
  return (
    <div className="pb-[132px]">
      {/* Hero Section */}
      <section className="pt-[54px] pb-[30px]">
        <div className="md:max-w-[1200px] mx-auto">
          {/* Main Visual */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 text-white mb-[50px] min-h-[400px] md:h-[526px] md:min-h-[500px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/introduce-1.png"
                alt="Talkgate Background"
                fill
                className="object-cover object-center md:object-right"
                priority
              />
              {/* Dark overlay for better text readability */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/60 to-neutral-900/40" /> */}
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-[76px] flex items-end min-h-[400px] md:min-h-[500px]">
              <div className="max-w-xl h-full flex flex-col">
                <div>
                  <svg
                    width="208"
                    height="49"
                    viewBox="0 0 208 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M124.669 8.60803V36.5285C124.669 41.9198 119.081 49.0002 113.388 49.0002H103.673V42.4893L104.007 42.2045C104.099 42.1981 104.177 42.3793 104.23 42.3793H117.411L117.745 42.0492V15.559L117.411 15.229H101.216V30.4577H115.177L115.511 30.7878V36.9686L115.177 37.2987H107.132C92.8175 37.2987 89.0244 15.1642 102.336 9.60473C102.985 9.33291 104.99 8.60156 105.566 8.60156H124.669V8.60803Z"
                      fill="#474747"
                    />
                    <path
                      d="M51.8325 18.9825C51.8849 17.9017 51.9176 16.6849 51.0594 15.8889C50.9415 15.7788 50.0047 15.2352 49.9392 15.2352H34.1901V8.61426H49.9392C54.0468 8.61426 58.7636 14.2903 58.7636 18.2123V36.9749C58.7636 37.5315 57.4469 37.0849 57.0996 37.0719C51.0005 36.9101 43.7811 37.6609 37.8784 37.0784C30.5542 36.36 27.5669 26.3671 32.7292 21.3966C33.6857 20.4776 36.352 18.976 37.6557 18.976H51.8456L51.8325 18.9825ZM51.8325 25.6034H37.6426C35.4348 25.6034 35.7755 30.4251 37.6819 30.4251C38.9201 30.4251 40.1517 30.451 41.213 30.451C43.3749 30.451 45.5564 30.451 47.7118 30.451C49.0351 30.451 50.6402 30.3539 51.8325 30.3539V25.6099V25.6034Z"
                      fill="#474747"
                    />
                    <path
                      d="M146.452 8.60803C150.219 9.11286 155.054 13.7145 155.054 17.546V36.9686C154.89 37.1952 154.858 37.2081 154.596 37.2081C147.795 37.2275 140.969 36.9233 134.162 37.0787C125.718 35.7001 123.753 23.2996 131.666 19.8241C132.269 19.5588 133.809 18.9763 134.385 18.9763H148.346C148.562 17.9084 147.717 15.2225 146.446 15.2225H130.697V8.60156H146.446L146.452 8.60803ZM148.346 25.6037H134.156C133.278 25.6037 133.036 29.4287 133.874 30.1794C133.946 30.2442 134.981 30.6778 135.047 30.6778H148.005L148.339 30.3477V25.6037H148.346Z"
                      fill="#474747"
                    />
                    <path
                      d="M208 26.2635H186.217L185.883 25.9334V19.6426H200.852V15.2286H183.983C183.662 15.4228 183.675 15.6687 183.636 15.9923C183.256 19.1895 183.714 23.7653 183.878 27.0272C183.937 28.1663 183.819 29.3248 183.865 30.4574L204.645 30.7875V36.9683C204.338 37.4602 203.931 37.0459 203.427 37.0718C193.037 37.5961 179.043 39.1947 176.77 25.6616C174.497 12.1285 187.095 5.31339 198.73 9.26783C202.995 10.7176 207.993 16.2706 207.993 20.8658V26.2764L208 26.2635Z"
                      fill="#474747"
                    />
                    <path
                      d="M77.9725 0V18.5425L78.6472 18.2124L88.3627 8.60785H97.8553L83.7703 22.8464L97.744 36.8584L97.5147 37.305L88.2513 36.9685L78.6472 27.4804L77.9725 27.1503V37.0785H71.0479V0.330075L71.382 0H77.9725Z"
                      fill="#474747"
                    />
                    <path
                      d="M34.1841 0V6.5109L33.85 6.84098H20.7804V36.9685L20.407 37.2662L14.1768 37.2467L13.8492 36.9685V6.84098H0.334111L0 6.5109V0.330075L0.334111 0H34.1841Z"
                      fill="#474747"
                    />
                    <path
                      d="M164.434 2.42725V8.60807H175.827V15.229H164.434V30.4578H175.493L175.827 30.7878V36.9687C175.146 37.7 174.104 37.0981 173.265 37.0722C169.308 36.9493 166.983 37.357 163.471 35.0529C160.72 33.2472 157.51 28.8398 157.51 25.4937V2.42725H164.434Z"
                      fill="#474747"
                    />
                    <path
                      d="M68.368 0V36.9685L68.0339 37.2532C67.9421 37.2597 67.8635 37.0785 67.8111 37.0785H61.4434V0H68.368Z"
                      fill="#474747"
                    />
                  </svg>
                </div>
                <p className="text-[20px] text-[#474747] leading-[1.5] tracking-[-0.0em] font-bold">
                  미래의 고객 변화에 미리 대응하고 앞서 나갈 수 있도록
                  <br />
                  고객 관계 혁신의 여정을
                  <br />
                  {BRAND.name}이 함께 만들어갑니다.
                </p>
              </div>
            </div>
          </div>

          {/* Second Visual + Description */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="rounded-xl overflow-hidden">
              <div className="w-full h-fullflex items-center justify-center">
                <Image
                  src="/images/introduce-2.png"
                  alt="Talkgate Background"
                  width={592}
                  height={311}
                  className="object-cover object-center md:object-right"
                  priority
                />
              </div>
            </div>
            <div>
              <p className="text-[28px] font-bold leading-[1.5] tracking-[-0.03em] text-right md:!pr-[88px]">
                AI와 자동화 기술을 통해 비효율적인 상담
                <br />
                및 영업 프로세스를 제거하고,
                <br />
                기업이 더욱 스마트하고 전략적인
                <br />
                성장을 이룰 수 있도록 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="md:max-w-[1200px] mx-auto">
          <h2 className="text-[48px] font-bold leading-[1.5] tracking-[-0.03em] text-[#252525] !mb-6">
            Our Mission
          </h2>

          <div className="">
            <p className="text-[28px] font-bold leading-[1.5] tracking-[-0.03em] text-[#252525] !mb-6">
              복잡해지는 고객 여정 속에서, 기업의 성장을 가속할 수 있는 최적의
              솔루션은 여전히 부족합니다.
            </p>

            <p className="text-[18px] text-[#252525] leading-[1.5] tracking-[-0.03em]">
              {BRAND.name}은 중소기업과 스타트업이 더 빠르게 핵심 고객을 파악할
              수 있도록, 데이터 기반의 의사결정을 돕는 통합 관리 도구와 혁신적인
              고객 관리 시스템을 제공합니다. {BRAND.name}
              <br />
              는 중소기업과 스타트업의 고객 관리 프로세스와 영업 효율 방식을
              혁신해 나가고 있습니다.
              <br />
              <br />
              앞으로도 {BRAND.name}는 기업들의 성장을 위한 가장 강력한 엔진이
              되어, 비즈니스 발전에 기여하겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="pt-[30px]">
        <div className="md:max-w-[1200px] mx-auto">
          <h2 className="text-[48px] font-bold leading-[1.5] tracking-[-0.03em] text-[#252525] !mb-[26px]">
            Our Story
          </h2>

          <div className="space-y-6">
            {STORY_ITEMS.map((item, index) => (
              <StoryCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StoryCard({ item, index }: { item: TimelineItem; index: number }) {
  return (
    <div className="flex justify-between items-center gap-6 pl-[44px] h-[180px] rounded-xl bg-muted overflow-hidden">
      <div>
        <h3 className="text-[24px] font-bold leading-[1.5] tracking-[-0.03em] text-[#000] !mb-4">
          {item.title}
        </h3>
        <p className="typo-[18px] font-medium leading-[1.5] tracking-[-0.03em] text-[#808080]">
          {item.date}
        </p>
      </div>
      <div className="h-full md:w-100 overflow-hidden flex items-center justify-center relative">
        <div className="absolute top-0 left-0 z-0">
          <Image
            src={`/images/introduce-our-story-${index + 1}.png`}
            alt="Talkgate Background"
            width={400}
            height={180}
            className="object-cover object-center md:object-right"
            priority
          />
        </div>
        <span className="text-2xl font-bold text-neutral-400 z-10">
          <svg
            width="150"
            height="36"
            viewBox="0 0 150 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M89.9058 6.32409V26.8371C89.9058 30.798 85.8758 36 81.7703 36H74.764V31.2165L75.0049 31.0072C75.071 31.0025 75.1277 31.1356 75.1655 31.1356H84.6711L84.912 30.8931V11.4309L84.6711 11.1884H72.9923V22.3769H83.0601L83.301 22.6194V27.1605L83.0601 27.403H77.2585C66.9356 27.403 64.2001 11.1409 73.8002 7.05636C74.2679 6.85665 75.7136 6.31934 76.1293 6.31934H89.9058V6.32409Z"
                fill="white"
              />
              <path
                d="M37.3792 13.9456C37.417 13.1515 37.4407 12.2576 36.8218 11.6727C36.7367 11.5919 36.0611 11.1925 36.0139 11.1925H24.6564V6.32812H36.0139C38.9761 6.32812 42.3777 10.4982 42.3777 13.3798V27.1645C42.3777 27.5734 41.4281 27.2453 41.1777 27.2358C36.7792 27.1169 31.5729 27.6685 27.3162 27.2406C22.0343 26.7128 19.88 19.3711 23.6028 15.7192C24.2926 15.044 26.2154 13.9409 27.1556 13.9409H37.3887L37.3792 13.9456ZM37.3792 18.81H27.1461C25.554 18.81 25.7997 22.3524 27.1745 22.3524C28.0674 22.3524 28.9556 22.3715 29.7209 22.3715C31.28 22.3715 32.8532 22.3715 34.4076 22.3715C35.3619 22.3715 36.5194 22.3001 37.3792 22.3001V18.8147V18.81Z"
                fill="white"
              />
              <path
                d="M105.615 6.32409C108.332 6.69498 111.818 10.0758 111.818 12.8907V27.1605C111.7 27.3269 111.676 27.3364 111.488 27.3364C106.584 27.3507 101.661 27.1272 96.752 27.2413C90.6622 26.2285 89.2449 17.1179 94.952 14.5645C95.3867 14.3695 96.4969 13.9416 96.9127 13.9416H106.98C107.136 13.157 106.527 11.1837 105.61 11.1837H94.2528V6.31934H105.61L105.615 6.32409ZM106.98 18.8107H96.7473C96.1142 18.8107 95.9394 21.6209 96.5441 22.1725C96.5961 22.22 97.3426 22.5386 97.3898 22.5386H106.735L106.976 22.2961V18.8107H106.98Z"
                fill="white"
              />
              <path
                d="M150 19.2954H134.291L134.05 19.0529V14.431H144.846V11.1881H132.68C132.449 11.3308 132.458 11.5115 132.43 11.7492C132.156 14.0982 132.486 17.46 132.605 19.8565C132.647 20.6934 132.562 21.5445 132.595 22.3766L147.581 22.6191V27.1601C147.359 27.5215 147.066 27.2172 146.702 27.2362C139.209 27.6214 129.118 28.7959 127.479 18.8532C125.839 8.9105 134.924 3.9035 143.315 6.8088C146.39 7.87391 149.995 11.9537 149.995 15.3297V19.3049L150 19.2954Z"
                fill="white"
              />
              <path
                d="M56.23 0V13.623L56.7167 13.3805L63.723 6.32414H70.5687L60.4112 16.7851L70.4884 27.0797L70.323 27.4078L63.6427 27.1605L56.7167 20.1897L56.23 19.9472V27.2413H51.2363V0.242504L51.4773 0H56.23Z"
                fill="white"
              />
              <path
                d="M24.6521 0V4.78352L24.4111 5.02602H14.9859V27.1605L14.7166 27.3792L10.2237 27.365L9.98744 27.1605V5.02602H0.240946L0 4.78352V0.242504L0.240946 0H24.6521Z"
                fill="white"
              />
              <path
                d="M118.583 1.7832V6.32422H126.798V11.1886H118.583V22.3771H126.557L126.798 22.6196V27.1606C126.307 27.6979 125.556 27.2557 124.951 27.2367C122.098 27.1463 120.42 27.4459 117.888 25.7531C115.904 24.4265 113.589 21.1883 113.589 18.73V1.7832H118.583Z"
                fill="white"
              />
              <path
                d="M49.3043 0V27.1605L49.0633 27.3697C48.9972 27.3745 48.9405 27.2413 48.9027 27.2413H44.3105V0H49.3043Z"
                fill="white"
              />
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
}
