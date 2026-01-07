import Link from "next/link";
import { 
  BRAND, 
  COMPANY_INFO, 
  EXTERNAL_LINKS 
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="py-6 md:py-10 px-4">
        {/* Company Info - Mobile */}
        <div className="md:hidden text-center text-[12px] leading-[20px] tracking-[-0.02em] text-[#808080] font-medium">
          <p>
            {COMPANY_INFO.name} | 사업자등록번호 : {COMPANY_INFO.businessNumber}
          </p>
          <p>
            통신판매업신고번호 : {COMPANY_INFO.telecomNumber} | 대표이사 : {COMPANY_INFO.ceo}
          </p>
          <p>
            대표번호 : {COMPANY_INFO.representativeNumber} | 이메일 :{" "}
            <Link
              href={`mailto:${COMPANY_INFO.email}`}
              className="hover:text-foreground transition-colors"
            >
              {COMPANY_INFO.email}
            </Link>
          </p>
          <p>{COMPANY_INFO.address}</p>
        </div>

        {/* Company Info - Desktop */}
        <div className="hidden md:block text-center text-[16px] leading-[28px] tracking-[-0.02em] text-[#808080] font-medium">
          <p>
            {COMPANY_INFO.name} | 사업자등록번호 : {COMPANY_INFO.businessNumber}{" "}
            | 통신판매업신고번호 : {COMPANY_INFO.telecomNumber}
          </p>
          <p>
            대표이사 : {COMPANY_INFO.ceo} | 대표번호 : {COMPANY_INFO.representativeNumber} | 이메일 :{" "}
            <Link
              href={`mailto:${COMPANY_INFO.email}`}
              className="hover:text-foreground transition-colors"
            >
              {COMPANY_INFO.email}
            </Link>
          </p>
          <p>{COMPANY_INFO.address}</p>
        </div>

        {/* Logo */}
        <div className="mt-6 md:mt-7 flex justify-center">
          <Link
            href="/"
            className="text-xl font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              width="102"
              height="24"
              viewBox="0 0 102 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M61.1357 4.21606V17.8914C61.1357 20.532 58.3954 24 55.6036 24H50.8394V20.8109L51.0032 20.6715C51.0482 20.6683 51.0867 20.7571 51.1124 20.7571H57.5762L57.74 20.5954V7.62063L57.5762 7.45896H49.6346V14.9179H56.4807L56.6445 15.0796V18.1069L56.4807 18.2686H52.5356C45.5161 18.2686 43.656 7.42726 50.184 4.70424C50.502 4.5711 51.4851 4.21289 51.7678 4.21289H61.1357V4.21606Z"
                fill="#808080"
              />
              <path
                d="M25.4181 9.29756C25.4438 8.76817 25.4598 8.17221 25.039 7.78231C24.9812 7.72842 24.5218 7.46214 24.4896 7.46214H16.7666V4.21924H24.4896C26.5039 4.21924 28.817 6.99932 28.817 8.92033V18.1101C28.817 18.3827 28.1713 18.164 28.001 18.1577C25.0101 18.0784 21.4698 18.4461 18.5752 18.1608C14.9836 17.809 13.5186 12.9145 16.0501 10.48C16.5192 10.0298 17.8267 9.29439 18.466 9.29439H25.4245L25.4181 9.29756ZM25.4181 12.5405H18.4596C17.3769 12.5405 17.544 14.9021 18.4789 14.9021C19.0861 14.9021 19.69 14.9148 20.2105 14.9148C21.2706 14.9148 22.3404 14.9148 23.3974 14.9148C24.0463 14.9148 24.8334 14.8672 25.4181 14.8672V12.5436V12.5405Z"
                fill="#808080"
              />
              <path
                d="M71.8177 4.21606C73.6649 4.46332 76.0358 6.71718 76.0358 8.59382V18.107C75.9555 18.2179 75.9394 18.2242 75.8109 18.2242C72.4763 18.2338 69.1287 18.0848 65.7909 18.1608C61.6498 17.4856 60.686 11.4119 64.5669 9.70965C64.8624 9.57968 65.6174 9.29438 65.9001 9.29438H72.7461C72.8521 8.77133 72.4377 7.45579 71.8145 7.45579H64.0914V4.21289H71.8145L71.8177 4.21606ZM72.7461 12.5405H65.7876C65.3572 12.5405 65.2383 14.4139 65.6495 14.7816C65.6848 14.8133 66.1924 15.0257 66.2246 15.0257H72.5791L72.7429 14.8641V12.5405H72.7461Z"
                fill="#808080"
              />
              <path
                d="M102 12.8639H91.318L91.1542 12.7022V9.62101H98.495V7.45908H90.2225C90.0651 7.55418 90.0715 7.67464 90.0523 7.83314C89.8659 9.39911 90.0908 11.6403 90.1711 13.238C90.2 13.7959 90.1422 14.3633 90.1647 14.9181L100.355 15.0797V18.1071C100.204 18.348 100.005 18.1451 99.7575 18.1578C94.6623 18.4146 87.8002 19.1975 86.6855 12.5691C85.5707 5.94066 91.7485 2.60266 97.4541 4.53952C99.5455 5.2496 101.997 7.96945 101.997 10.2201V12.8703L102 12.8639Z"
                fill="#808080"
              />
              <path
                d="M38.2363 0V9.08202L38.5672 8.92035L43.3315 4.21608H47.9865L41.0794 11.1901L47.9319 18.0531L47.8195 18.2718L43.2769 18.107L38.5672 13.4598L38.2363 13.2981V18.1609H34.8406V0.161669L35.0044 0H38.2363Z"
                fill="#808080"
              />
              <path
                d="M16.7633 0V3.18901L16.5995 3.35068H10.1904V18.107L10.0072 18.2528L6.95206 18.2433L6.79143 18.107V3.35068H0.163843L0 3.18901V0.161669L0.163843 0H16.7633Z"
                fill="#808080"
              />
              <path
                d="M80.6362 1.18896V4.2163H86.2229V7.4592H80.6362V14.9182H86.0591L86.2229 15.0799V18.1072C85.8888 18.4654 85.378 18.1706 84.9668 18.1579C83.0264 18.0977 81.8859 18.2974 80.1639 17.1689C78.8147 16.2845 77.2405 14.1257 77.2405 12.4868V1.18896H80.6362Z"
                fill="#808080"
              />
              <path
                d="M33.3957 0V18.107L33.2319 18.2465C33.1869 18.2496 33.1483 18.1609 33.1226 18.1609H30V0H33.3957Z"
                fill="#808080"
              />
            </svg>
          </Link>
        </div>

      </div>

      {/* Footer Bottom Section */}
      <div className="w-full border-t border-[#EDEDED]">
        {/* Mobile: Vertical Layout */}
        <div className="md:hidden py-4 space-y-3">
          {/* Legal Links - Center */}
          <div className="flex items-center justify-center gap-2 text-[10px] leading-[12px] tracking-[-0.02em] text-[#B0B0B0] font-medium">
            <Link
              href={EXTERNAL_LINKS.privacyPolicy}
              className="hover:text-foreground transition-colors"
            >
              개인정보처리방침
            </Link>
            <div className="h-3 w-px bg-[#EDEDED]" />
            <Link
              href={EXTERNAL_LINKS.termsOfService}
              className="hover:text-foreground transition-colors"
            >
              이용약관
            </Link>
          </div>

          {/* Copyright - Center */}
          <p className="text-center text-[10px] leading-[12px] tracking-[-0.02em] text-[#B0B0B0] font-medium">
            © {new Date().getFullYear()} {BRAND.name}. Inc. All rights reserved.
          </p>
        </div>

        {/* Desktop: Horizontal Layout */}
        <div className="hidden md:flex max-w-[1170px] mx-auto h-[52px] items-center justify-between px-4 md:px-0">
          {/* Copyright - Left */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.name}. Inc. All rights reserved.
          </p>

          {/* Legal Links - Right */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href={EXTERNAL_LINKS.privacyPolicy}
              className="hover:text-foreground transition-colors"
            >
              개인정보처리방침
            </Link>
            <div className="h-3 w-px bg-border" />
            <Link
              href={EXTERNAL_LINKS.termsOfService}
              className="hover:text-foreground transition-colors"
            >
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
