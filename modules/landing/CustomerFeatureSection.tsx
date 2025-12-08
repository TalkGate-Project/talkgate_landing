"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type Tab = "list" | "info";

export function CustomerFeatureSection() {
  const [activeTab, setActiveTab] = useState<Tab>("list");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 자동 탭 전환 (7초마다)
  useEffect(() => {
    const startAutoSwitch = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setActiveTab((prev) => (prev === "list" ? "info" : "list"));
      }, 7000);
    };

    startAutoSwitch();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    // 수동 클릭 시 타이머 리셋
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveTab((prev) => (prev === "list" ? "info" : "list"));
    }, 7000);
  };

  return (
    <section className="py-20" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <h5 className="text-primary-60 font-semibold text-[18px] leading-[1.5] tracking-[-0.02em] !mb-3">
            효율적인 고객 목록 관리
          </h5>
          <h2 className="typo-h1 !mb-12">
            고객 데이터를 한눈에 파악하고, 성장의 기회를 만드세요.
          </h2>

          <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Tab Area */}
            <div className={`flex-1 w-full lg:w-auto customer-image ${isVisible ? 'animate' : ''}`}>
              {activeTab === "list" ? (
                <Image
                  src="/images/customer-feature-list.png"
                  alt="고객목록"
                  width={617}
                  height={448}
                />
              ) : (
                <Image
                  src="/images/customer-feature-info.png"
                  alt="고객정보"
                  width={617}
                  height={448}
                />
              )}
            </div>

            {/* Right Content Area */}
            <div className={`flex-1 w-full h-[424px] flex flex-col justify-center customer-content ${isVisible ? 'animate' : ''}`}>
              <div className="w-[368px] h-[56px] relative inline-flex bg-neutral-20 rounded-full ml-[94px]">
                {/* Sliding Background Indicator */}
                <div
                  className="absolute top-[2px] left-1 bottom-1 w-[176px] h-[52px] bg-neutral-90 rounded-full transition-all duration-300 ease-out"
                  style={{
                    transform:
                      activeTab === "info"
                        ? "translateX(184px)"
                        : "translateX(0)",
                  }}
                />

                {/* Tab Buttons */}
                <button
                  onClick={() => handleTabClick("list")}
                  className={`cursor-pointer relative z-10 w-[180px] h-[56px] rounded-full font-semibold text-[18px] transition-colors duration-300 flex items-center justify-center ${
                    activeTab === "list"
                      ? "text-neutral-0"
                      : "text-neutral-70 hover:text-neutral-90"
                  }`}
                >
                  고객목록
                </button>
                <button
                  onClick={() => handleTabClick("info")}
                  className={`cursor-pointer relative z-10 pl-3 w-[180px] h-[56px] rounded-full font-semibold text-[18px] transition-colors duration-300 flex items-center justify-center ${
                    activeTab === "info"
                      ? "text-neutral-0"
                      : "text-neutral-70 hover:text-neutral-90"
                  }`}
                >
                  고객정보
                </button>
              </div>

              <div className="text-left mt-12 pl-[94px]">
                {activeTab === "list" ? (
                  <>
                    <h2 className="text-[20px] font-bold leading-[1.5] tracking-[-0.03em] text-[#040815] !mb-8">고객 데이터를 체계적으로 관리하고 확인하세요.</h2>
                    <ul>
                      <li className="!mb-8">
                        <div className="flex gap-3">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 2.66675C8.65329 2.66675 2.66663 8.65341 2.66663 16.0001C2.66663 23.3467 8.65329 29.3334 16 29.3334C23.3466 29.3334 29.3333 23.3467 29.3333 16.0001C29.3333 8.65341 23.3466 2.66675 16 2.66675ZM22.3733 12.9334L14.8133 20.4934C14.6266 20.6801 14.3733 20.7867 14.1066 20.7867C13.84 20.7867 13.5866 20.6801 13.4 20.4934L9.62663 16.7201C9.23996 16.3334 9.23996 15.6934 9.62663 15.3067C10.0133 14.9201 10.6533 14.9201 11.04 15.3067L14.1066 18.3734L20.96 11.5201C21.3466 11.1334 21.9866 11.1334 22.3733 11.5201C22.76 11.9067 22.76 12.5334 22.3733 12.9334Z"
                              fill="#474747"
                            />
                          </svg>
                          <span className="text-[18px] leading-[1.5] tracking-[-0.03em] text-[#000000]">원하는 고객 데이터를 한 번에 검색 및 조회</span>
                        </div>
                      </li>
                      <li className="!mb-8">
                        <div className="flex gap-3">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 2.66675C8.65329 2.66675 2.66663 8.65341 2.66663 16.0001C2.66663 23.3467 8.65329 29.3334 16 29.3334C23.3466 29.3334 29.3333 23.3467 29.3333 16.0001C29.3333 8.65341 23.3466 2.66675 16 2.66675ZM22.3733 12.9334L14.8133 20.4934C14.6266 20.6801 14.3733 20.7867 14.1066 20.7867C13.84 20.7867 13.5866 20.6801 13.4 20.4934L9.62663 16.7201C9.23996 16.3334 9.23996 15.6934 9.62663 15.3067C10.0133 14.9201 10.6533 14.9201 11.04 15.3067L14.1066 18.3734L20.96 11.5201C21.3466 11.1334 21.9866 11.1334 22.3733 11.5201C22.76 11.9067 22.76 12.5334 22.3733 12.9334Z"
                              fill="#474747"
                            />
                          </svg>
                          <span className="text-[18px] leading-[1.5] tracking-[-0.03em] text-[#000000]">고객 배정 상태 및 진행 현황 실시간 파악</span>
                        </div>
                      </li>
                      <li>
                        <div className="flex gap-3">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 2.66675C8.65329 2.66675 2.66663 8.65341 2.66663 16.0001C2.66663 23.3467 8.65329 29.3334 16 29.3334C23.3466 29.3334 29.3333 23.3467 29.3333 16.0001C29.3333 8.65341 23.3466 2.66675 16 2.66675ZM22.3733 12.9334L14.8133 20.4934C14.6266 20.6801 14.3733 20.7867 14.1066 20.7867C13.84 20.7867 13.5866 20.6801 13.4 20.4934L9.62663 16.7201C9.23996 16.3334 9.23996 15.6934 9.62663 15.3067C10.0133 14.9201 10.6533 14.9201 11.04 15.3067L14.1066 18.3734L20.96 11.5201C21.3466 11.1334 21.9866 11.1334 22.3733 11.5201C22.76 11.9067 22.76 12.5334 22.3733 12.9334Z"
                              fill="#474747"
                            />
                          </svg>
                          <span className="text-[18px] leading-[1.5] tracking-[-0.03em] text-[#000000]">고객별 중요 활동 기록 및 히스토리 관리</span>
                        </div>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <h2 className="text-[20px] font-bold leading-[1.5] tracking-[-0.03em] text-[#040815] !mb-8">클릭으로 고객 정보를 조회, 편집하여 활용하세요.</h2>
                    <ul>
                      <li className="!mb-8">
                        <div className="flex gap-3">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 2.66675C8.65329 2.66675 2.66663 8.65341 2.66663 16.0001C2.66663 23.3467 8.65329 29.3334 16 29.3334C23.3466 29.3334 29.3333 23.3467 29.3333 16.0001C29.3333 8.65341 23.3466 2.66675 16 2.66675ZM22.3733 12.9334L14.8133 20.4934C14.6266 20.6801 14.3733 20.7867 14.1066 20.7867C13.84 20.7867 13.5866 20.6801 13.4 20.4934L9.62663 16.7201C9.23996 16.3334 9.23996 15.6934 9.62663 15.3067C10.0133 14.9201 10.6533 14.9201 11.04 15.3067L14.1066 18.3734L20.96 11.5201C21.3466 11.1334 21.9866 11.1334 22.3733 11.5201C22.76 11.9067 22.76 12.5334 22.3733 12.9334Z"
                              fill="#474747"
                            />
                          </svg>
                          <span className="text-[18px] leading-[1.5] tracking-[-0.03em] text-[#000000]">
                            클릭 한 번으로 상세 고객 정보 및 히스토리 바로 연결
                          </span>
                        </div>
                      </li>
                      <li className="!mb-8">
                        <div className="flex gap-3">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 2.66675C8.65329 2.66675 2.66663 8.65341 2.66663 16.0001C2.66663 23.3467 8.65329 29.3334 16 29.3334C23.3466 29.3334 29.3333 23.3467 29.3333 16.0001C29.3333 8.65341 23.3466 2.66675 16 2.66675ZM22.3733 12.9334L14.8133 20.4934C14.6266 20.6801 14.3733 20.7867 14.1066 20.7867C13.84 20.7867 13.5866 20.6801 13.4 20.4934L9.62663 16.7201C9.23996 16.3334 9.23996 15.6934 9.62663 15.3067C10.0133 14.9201 10.6533 14.9201 11.04 15.3067L14.1066 18.3734L20.96 11.5201C21.3466 11.1334 21.9866 11.1334 22.3733 11.5201C22.76 11.9067 22.76 12.5334 22.3733 12.9334Z"
                              fill="#474747"
                            />
                          </svg>
                          <span className="text-[18px] leading-[1.5] tracking-[-0.03em] text-[#000000]">
                            기본 정보, 데이터 정보, 영업 정보를 효율적으로 관리
                          </span>
                        </div>
                      </li>
                      <li>
                        <div className="flex gap-3">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 2.66675C8.65329 2.66675 2.66663 8.65341 2.66663 16.0001C2.66663 23.3467 8.65329 29.3334 16 29.3334C23.3466 29.3334 29.3333 23.3467 29.3333 16.0001C29.3333 8.65341 23.3466 2.66675 16 2.66675ZM22.3733 12.9334L14.8133 20.4934C14.6266 20.6801 14.3733 20.7867 14.1066 20.7867C13.84 20.7867 13.5866 20.6801 13.4 20.4934L9.62663 16.7201C9.23996 16.3334 9.23996 15.6934 9.62663 15.3067C10.0133 14.9201 10.6533 14.9201 11.04 15.3067L14.1066 18.3734L20.96 11.5201C21.3466 11.1334 21.9866 11.1334 22.3733 11.5201C22.76 11.9067 22.76 12.5334 22.3733 12.9334Z"
                              fill="#474747"
                            />
                          </svg>
                          <span className="text-[18px] leading-[1.5] tracking-[-0.03em] text-[#000000]">고객 정보를 이용하여 맞춤형 케어 제공</span>
                        </div>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
