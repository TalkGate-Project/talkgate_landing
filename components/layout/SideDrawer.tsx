"use client";

import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { getLoginUrl, getStartUrl } from "@/lib/auth";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  pathname: string;
  /** SSR 시 랜딩 base URL (로그인 returnUrl용) */
  landingBaseUrl?: string;
  onLogout: () => void;
}

export function SideDrawer({
  isOpen,
  onClose,
  isAuthenticated,
  pathname,
  landingBaseUrl,
  onLogout,
}: SideDrawerProps) {
  // 배경 오버레이 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* 사이드 드로워 */}
      <div
        className={`
          fixed top-[60px] left-[-1px] h-[calc(100vh-60px)] bg-white z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          width: '336px',
          borderRadius: '0px 12px 0px 0px',
        }}
      >
        {/* 헤더 */}
        <div className="relative flex items-center justify-between h-[24px] mt-[15px] px-[29px]">
          {/* 로고 - SVG */}
          <Link href="/" onClick={onClose} className="flex items-center">
            <svg
              width="102"
              height="24"
              viewBox="0 0 102 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6"
            >
              <path
                d="M61.1357 4.21609V17.8914C61.1357 20.532 58.3954 24 55.6036 24H50.8394V20.811L51.0032 20.6715C51.0482 20.6683 51.0867 20.7571 51.1124 20.7571H57.5762L57.74 20.5954V7.62066L57.5762 7.45899H49.6346V14.918H56.4807L56.6445 15.0796V18.107L56.4807 18.2687H52.5356C45.5161 18.2687 43.656 7.42729 50.184 4.70427C50.502 4.57113 51.4851 4.21292 51.7678 4.21292H61.1357V4.21609Z"
                fill="#474747"
              />
              <path
                d="M25.4181 9.29759C25.4438 8.7682 25.4598 8.17224 25.039 7.78234C24.9812 7.72845 24.5218 7.46217 24.4896 7.46217H16.7666V4.21927H24.4896C26.5039 4.21927 28.817 6.99935 28.817 8.92036V18.1102C28.817 18.3828 28.1713 18.164 28.001 18.1577C25.0101 18.0785 21.4698 18.4462 18.5752 18.1609C14.9836 17.809 13.5186 12.9145 16.0501 10.48C16.5192 10.0299 17.8267 9.29442 18.466 9.29442H25.4245L25.4181 9.29759ZM25.4181 12.5405H18.4596C17.3769 12.5405 17.544 14.9021 18.4789 14.9021C19.0861 14.9021 19.69 14.9148 20.2105 14.9148C21.2706 14.9148 22.3404 14.9148 23.3974 14.9148C24.0463 14.9148 24.8334 14.8673 25.4181 14.8673V12.5437V12.5405Z"
                fill="#474747"
              />
              <path
                d="M71.8177 4.21609C73.6649 4.46335 76.0358 6.71721 76.0358 8.59385V18.107C75.9555 18.2179 75.9394 18.2243 75.8109 18.2243C72.4763 18.2338 69.1287 18.0848 65.7909 18.1609C61.6498 17.4857 60.686 11.412 64.5669 9.70968C64.8624 9.57971 65.6174 9.29441 65.9001 9.29441H72.7461C72.8521 8.77136 72.4377 7.45582 71.8145 7.45582H64.0914V4.21292H71.8145L71.8177 4.21609ZM72.7461 12.5405H65.7876C65.3572 12.5405 65.2383 14.4139 65.6495 14.7817C65.6848 14.8134 66.1924 15.0258 66.2246 15.0258H72.5791L72.7429 14.8641V12.5405H72.7461Z"
                fill="#474747"
              />
              <path
                d="M102 12.8638H91.318L91.1542 12.7022V9.62094H98.495V7.45901H90.2225C90.0651 7.55411 90.0715 7.67457 90.0523 7.83307C89.8659 9.39905 90.0908 11.6402 90.1711 13.2379C90.2 13.7958 90.1422 14.3632 90.1647 14.918L100.355 15.0797V18.107C100.204 18.3479 100.005 18.145 99.7575 18.1577C94.6623 18.4145 87.8002 19.1975 86.6855 12.569C85.5707 5.94059 91.7485 2.60259 97.4541 4.53945C99.5455 5.24953 101.997 7.96938 101.997 10.2201V12.8702L102 12.8638Z"
                fill="#474747"
              />
              <path
                d="M38.2363 1.52588e-05V9.08203L38.5672 8.92036L43.3315 4.2161H47.9865L41.0794 11.1901L47.9319 18.0531L47.8195 18.2718L43.2769 18.107L38.5672 13.4598L38.2363 13.2981V18.1609H34.8406V0.161685L35.0044 1.52588e-05H38.2363Z"
                fill="#474747"
              />
              <path
                d="M16.7633 0V3.18901L16.5995 3.35068H10.1904V18.107L10.0072 18.2528L6.95206 18.2433L6.79143 18.107V3.35068H0.163843L0 3.18901V0.161669L0.163843 0H16.7633Z"
                fill="#474747"
              />
              <path
                d="M80.6362 1.18876V4.2161H86.2229V7.459H80.6362V14.918H86.0591L86.2229 15.0797V18.107C85.8888 18.4652 85.378 18.1704 84.9668 18.1577C83.0264 18.0975 81.8859 18.2972 80.1639 17.1687C78.8147 16.2842 77.2405 14.1255 77.2405 12.4866V1.18876H80.6362Z"
                fill="#474747"
              />
              <path
                d="M33.5266 1.52588e-05V18.107L33.3627 18.2465C33.3178 18.2496 33.2792 18.1609 33.2535 18.1609H30.1309V1.52588e-05H33.5266Z"
                fill="#474747"
              />
            </svg>
          </Link>

          {/* 우측: Login/Logout 텍스트 + X 버튼 */}
          <div className="flex items-center gap-4" style={{ position: 'absolute', right: '29px' }}>
            {/* Login 또는 Logout 텍스트 */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="typo-body-sm font-medium text-[#252525] transition-colors"
              >
                로그아웃
              </button>
            ) : (
              <Link
                href={getLoginUrl(pathname ?? "/", landingBaseUrl)}
                onClick={onClose}
                className="typo-body-sm font-medium text-[#252525] transition-colors"
              >
                로그인
              </Link>
            )}
            {/* X 버튼 */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6"
              aria-label="메뉴 닫기"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 구분선 */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#E2E2E2',
            opacity: 0.5,
            marginTop: '24px',
            marginLeft: '20px',
            marginRight: '20px',
          }}
        />

        {/* 메뉴 아이템 */}
        <nav className="flex flex-col" style={{ gap: '4px', marginTop: '12px', paddingLeft: '15px', paddingRight: '15px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            // 외부 링크인 경우
            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="transition-colors hover:bg-neutral-10"
                  style={{
                    padding: '12px 20px',
                    fontSize: '16px',
                    lineHeight: '19px',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Pretendard',
                    color: '#808080',
                  }}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.disabled ? "#" : item.href}
                onClick={onClose}
                className={`
                  transition-colors
                  ${
                    item.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-neutral-10"
                  }
                `}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  lineHeight: '19px',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Pretendard',
                  color: '#808080',
                }}
                aria-disabled={item.disabled}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

