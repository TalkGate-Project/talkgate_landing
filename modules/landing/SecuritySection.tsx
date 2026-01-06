'use client';

import { useEffect, useRef, useState } from 'react';

export function SecuritySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="py-5 md:py-20 px-4" ref={sectionRef}>
      <div className="w-full max-w-[1170px] mx-auto">
        <div className="mb-8 md:mb-11">
          <h5 className="text-primary-60 font-semibold text-[16px] md:text-[18px] leading-[1.5] tracking-[-0.02em] mb-3">
            안전한 데이터 관리 체계
          </h5>
          <h2 className="text-[24px] md:text-[32px] leading-[1.5] tracking-[-0.03em] font-bold">
            사용자 데이터 보호를 최우선으로,<br className="md:hidden" /> 안정적인 시스템을 운영합니다.
          </h2>
        </div>
        <ul className="security-section-list flex flex-col md:flex-row md:h-[394px] gap-4 md:gap-6">
          <li className={`flex-1 security-card ${isVisible ? 'animate' : ''}`}>
            <div 
              className="relative w-full min-h-[345px] h-full pt-6 md:pt-8 px-4 md:px-7 pb-6 md:pb-0 bg-[#f8f8f8] rounded-[12px] overflow-hidden min-h-[300px] md:h-full"
              style={{
                backgroundImage: 'url(/images/security-1.png)',
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            >
              <label className="w-full block text-[18px] md:text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#000] text-center mb-4 md:mb-5 z-10">
                보안 및 개인정보 보호
              </label>
              <h3 className="text-[14px] md:text-[16px] text-[#00B55B] leading-[1.5] tracking-[-0.02em] font-bold mb-2 z-10">
                KISA 보안 기준 기반의 내부 보안 점검 완료
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[1.5] tracking-[-0.02em] text-[#252525] font-medium h-[100px] z-10">
                한국인터넷진흥원(KISA)에서 제시한 클라우드 <br className="hidden md:block" />
                보안 가이드라인을 기준으로 내부 보안 점검을 <br className="hidden md:block" />
                수행해 안정적인 환경을 유지하고 있어요.
              </p>
              <h3 className="text-[14px] md:text-[16px] text-[#00B55B] leading-[1.5] tracking-[-0.02em] font-bold mb-2 z-10 mt-6 md:mt-[30px]">
                물리적·네트워크 기반 접근 통제
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[1.5] tracking-[-0.02em] text-[#252525] font-medium min-h-[60px] md:h-[72px] z-10">
                내부 데이터베이스는 지정된 IP에서만 접근이 가능 <br className="hidden md:block" />
                하며, 외부 네트워크에서는 직접 접근할 수 없도록 <br className="hidden md:block" />
                차단되어 있어요.
              </p>
            </div>
          </li>
          <li className={`flex-1 security-card ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.15s' }}>
            <div 
              className="relative w-full min-h-[345px] h-full pt-6 md:pt-8 px-4 md:px-7 pb-6 md:pb-0 bg-[#f8f8f8] rounded-[12px] overflow-hidden min-h-[250px] md:h-full"
              style={{
                backgroundImage: 'url(/images/security-2.png)',
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            >
              <label className="w-full block text-[18px] md:text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#000] text-center mb-4 md:mb-5">
                계정·권한 보안
              </label>
              <h3 className="text-[14px] md:text-[16px] text-[#00B55B] leading-[1.5] tracking-[-0.02em] font-bold mb-2 z-10">
                권한 기반 관리 정책
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[1.5] tracking-[-0.02em] text-[#252525] font-medium h-[100px] z-10">
                조직 내 역할에 따라 접근 가능한 기능과 데이터가 <br className="hidden md:block" />
                자동으로 구분돼요.
              </p>
              <h3 className="text-[14px] md:text-[16px] text-[#00B55B] leading-[1.5] tracking-[-0.02em] font-bold mb-2 z-10 mt-6 md:mt-[30px]">
                조직도 기반 접근 제한
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[1.5] tracking-[-0.02em] text-[#252525] font-medium min-h-[40px] md:h-[72px] z-10">
                프로젝트 내 공유 데이터는 허가된 조직 및 사용자만 <br className="hidden md:block" />
                접근할 수 있어요.
              </p>
            </div>
          </li>
          <li className={`flex-1 security-card ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.3s' }}>
            <div 
              className="relative w-full min-h-[390px] h-full pt-6 md:pt-8 px-4 md:px-7 pb-6 md:pb-0 bg-[#f8f8f8] rounded-[12px] overflow-hidden min-h-[350px] md:h-full"
              style={{
                backgroundImage: 'url(/images/security-3.png)',
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            >
              <label className="w-full block text-[18px] md:text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-[#000] text-center mb-4 md:mb-5">
                데이터 암호화 및 보호
              </label>
              <h3 className="text-[14px] md:text-[16px] text-[#00B55B] leading-[1.5] tracking-[-0.02em] font-bold mb-2 z-10">
                암호화된 통신
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[1.5] tracking-[-0.02em] text-[#252525] font-medium h-[60px] z-10">
                모든 통신은 암호화되어 제3자가 데이터를 탈취 <br className="hidden md:block" />
                하더라도 복호화가 불가능합니다.
              </p>
              <h3 className="text-[14px] md:text-[16px] text-[#00B55B] leading-[1.5] tracking-[-0.02em] font-bold mb-2 z-10 mt-4 md:mt-[10px]">
                데이터 보안
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[1.5] tracking-[-0.02em] text-[#252525] font-medium h-[60px] z-10">
                저장되는 데이터는 보안 키로 암호화되어 내부 <br className="hidden md:block" />
                직원도 임의로 접근할 수 없습니다.
              </p>
              <h3 className="text-[14px] md:text-[16px] text-[#00B55B] leading-[1.5] tracking-[-0.02em] font-bold mb-2 z-10 mt-4 md:mt-[10px]">
                데이터 관리
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[1.5] tracking-[-0.02em] text-[#252525] font-medium min-h-[60px] md:h-[72px] z-10">
                사용자의 요청이 있을 경우, 관련 데이터는 내부 <br className="hidden md:block" />
                보안 기준에 따라 안전하게 삭제되며 삭제된 <br className="hidden md:block" />
                데이터는 복구할 수 없도록 처리됩니다.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
