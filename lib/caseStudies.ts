import type { CaseStudy } from '@/types';

/**
 * 고객 성공 사례 데이터
 * 실제 운영 환경에서는 API 또는 CMS에서 데이터를 가져옵니다.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    tag: '[스타트업]',
    title: 'NANO-M (온라인 구독 서비스)',
    summary:
      "'통합 히스토리 뷰' 기능을 도입하여 고객의 과거 상담 기록, 웹사이트 방문 기록, 구매 내역 등을 클릭 한 번으로 확인할 수 있습니다.",
    thumbnailUrl: '/images/success-case-1.png',
    publishedAt: '2025.11.01',
    viewCount: 1250,
    detailImageUrl: '/images/success-case-1.png',
    sections: [
      {
        title: 'RAG 기반의 완벽한 고객 정보 통합',
        content:
          'NANO-M의 상담 대시보드는 RAG(검색 증강 생성) 기반 지식 센터의 안정적인 구조를 기반으로 합니다. 과거 상담 기록, 웹사이트 방문 히스토리, 구독 및 구매 내역 등 흩어진 고객 데이터를 클릭 한 번으로 통합하여 보여줍니다. 외부 LLM에 데이터를 학습시키지 않는 안전한 보안 구조는 그대로 유지됩니다.',
      },
      {
        title: '단순 응대를 넘어, 행동을 유도하는 맞춤형 CX',
        content:
          '상담원은 통합 히스토리 뷰를 통해 고객의 니즈와 맥락을 완벽하게 이해합니다. 단순히 묻고 답하는 수준을 넘어, 고객의 현재 구독 상황이나 최근 관심사를 기반으로 개인화된 업셀링/크로스셀링 프롬프트를 생성할 수 있습니다. 마치 고객의 취향을 파악한 전문 컨설턴트처럼 대화의 흐름 속에서 실제 구독 전환을 유도합니다.',
      },
      {
        title: 'NANO-M 전환율 38% 달성의 비밀',
        content:
          "통합 히스토리 뷰는 이미 실질적인 ROI로 증명되었습니다. NANO-M의 상담 기록 분석 결과, 해당 기능을 활용한 챗봇 상담 중 38%가 실제 구독 문의 또는 상품 주문으로 전환되는 성과를 기록했습니다. 데이터 파악 시간이 단축되고 대화의 질이 향상되면서, **'상담이 곧 매출'**로 이어지는 고객 경험 플랫폼을 완성했습니다.",
      },
    ],
  },
  {
    id: '2',
    tag: '[중견 기업]',
    title: 'D-Partners (B2B 솔루션 영업)',
    summary:
      "'자동 활동 기록' 기능으로 전화, 이메일 등 모든 상호작용이 자동으로 기록되어 데이터 누락을 원천 차단했습니다.",
    thumbnailUrl: '/images/success-case-2.png',
    publishedAt: '2025.10.28',
    viewCount: 980,
    detailImageUrl: '/images/success-case-2.png',
    sections: [
      {
        title: '자동 활동 기록으로 데이터 누락 제로',
        content:
          'D-Partners는 영업 사원들이 수동으로 고객 상담 내용을 기록해야 하는 번거로움을 겪고 있었습니다. Talkgate의 자동 활동 기록 기능 도입 후, 전화, 이메일, 채팅 등 모든 고객 접점이 자동으로 기록되어 영업팀의 생산성이 40% 향상되었습니다.',
      },
      {
        title: 'B2B 세일즈 사이클 단축',
        content:
          '과거 고객과의 모든 대화 기록이 자동으로 정리되어 있어, 신규 담당자도 즉시 맥락을 파악할 수 있습니다. 이를 통해 평균 세일즈 사이클이 30% 단축되고, 고객 만족도가 크게 개선되었습니다.',
      },
      {
        title: '데이터 기반 영업 전략 수립',
        content:
          '축적된 고객 데이터를 분석하여 효과적인 영업 시점, 제안 방식, 고객 니즈 패턴을 파악할 수 있게 되었습니다. 이를 바탕으로 전략적인 영업 활동을 전개하여 분기 매출이 25% 증가했습니다.',
      },
    ],
  },
  {
    id: '3',
    tag: '[금융사]',
    title: 'K-Asset (자산 관리)',
    summary:
      "'권한 기반 관리 정책' 기능을 활용하여, 자산 관리팀, CS팀, 마케팅팀 등 조직 역할에 따라 접근할 수 있는 고객 데이터 영역을 자동으로 구분하고 통제했습니다.",
    thumbnailUrl: '/images/success-case-3.png',
    publishedAt: '2025.10.25',
    viewCount: 1580,
    detailImageUrl: '/images/success-case-3.png',
    sections: [
      {
        title: '금융권 수준의 보안 체계',
        content:
          'K-Asset은 고객의 민감한 금융 정보를 다루기 때문에 강력한 보안이 필수였습니다. Talkgate의 권한 기반 관리 정책을 도입하여 팀별, 역할별로 접근 가능한 데이터를 세밀하게 통제할 수 있게 되었으며, 금융감독원의 보안 규정을 완벽히 준수하게 되었습니다.',
      },
      {
        title: '조직별 맞춤형 정보 제공',
        content:
          '자산 관리팀은 포트폴리오 정보를, CS팀은 문의 이력을, 마케팅팀은 상품 관심도를 각각 확인할 수 있습니다. 각 팀에 필요한 정보만 제공하여 업무 효율성이 향상되었으며, 불필요한 정보 노출로 인한 리스크도 제거되었습니다.',
      },
      {
        title: '컴플라이언스 자동 관리',
        content:
          '모든 고객 데이터 접근 기록이 자동으로 로깅되고, 이상 접근 패턴을 실시간으로 탐지합니다. 정기 감사 시 필요한 모든 증적 자료가 자동으로 준비되어 컴플라이언스 업무 시간이 70% 절감되었습니다.',
      },
    ],
  },
  {
    id: '4',
    tag: '[IT 서비스]',
    title: 'TechFlow (클라우드 솔루션)',
    summary:
      "'실시간 대시보드' 기능을 통해 고객 응대 현황과 성과 지표를 한눈에 파악하고, 즉각적인 의사결정이 가능해졌습니다.",
    thumbnailUrl: '/images/success-case-4.png',
    publishedAt: '2025.10.20',
    viewCount: 2100,
    detailImageUrl: '/images/success-case-4.png',
    sections: [
      {
        title: '실시간 고객 응대 현황 모니터링',
        content:
          'TechFlow는 글로벌 고객을 대상으로 24/7 기술 지원을 제공합니다. Talkgate의 실시간 대시보드를 통해 각 지역별, 시간대별 문의 현황과 응대율을 실시간으로 파악하여 인력 배치를 최적화할 수 있게 되었습니다.',
      },
      {
        title: '성과 지표 기반 품질 관리',
        content:
          '평균 응답 시간, 고객 만족도, 해결률 등 핵심 지표를 실시간으로 추적하고, 목표치 대비 현황을 즉시 확인할 수 있습니다. 이를 통해 서비스 품질이 지속적으로 개선되고 있으며, NPS 점수가 15점 상승했습니다.',
      },
      {
        title: '데이터 기반 즉각적 의사결정',
        content:
          '대시보드에서 이상 패턴이 감지되면 즉시 알림을 받고 대응할 수 있습니다. 특정 이슈로 인한 문의 급증 시 신속하게 추가 인력을 투입하거나 공지사항을 게시하여 고객 불만을 최소화할 수 있게 되었습니다.',
      },
    ],
  },
  {
    id: '5',
    tag: '[제조업]',
    title: 'GlobalTech (산업 자동화)',
    summary:
      "'AI 예측 분석' 기능으로 고객의 구매 패턴과 니즈를 사전에 파악하여, 맞춤형 제안으로 매출이 30% 증가했습니다.",
    thumbnailUrl: '/images/success-case-5.png',
    publishedAt: '2025.10.15',
    viewCount: 1750,
    detailImageUrl: '/images/success-case-5.png',
    sections: [
      {
        title: 'AI 기반 고객 니즈 예측',
        content:
          'GlobalTech는 산업용 자동화 장비를 공급하는 제조업체입니다. Talkgate의 AI 예측 분석 기능을 통해 고객의 구매 주기, 유지보수 시기, 확장 계획 등을 사전에 파악하여 선제적으로 제안할 수 있게 되었습니다.',
      },
      {
        title: '맞춤형 크로스셀링 전략',
        content:
          '고객이 보유한 장비와 사용 패턴을 분석하여 최적의 추가 제품이나 업그레이드 옵션을 추천합니다. 이를 통해 크로스셀링 성공률이 45% 향상되었고, 고객당 평균 거래액이 30% 증가했습니다.',
      },
      {
        title: '예방적 고객 관리',
        content:
          'AI가 고객의 이탈 신호를 조기에 감지하여 담당자에게 알림을 보냅니다. 문제가 커지기 전에 선제적으로 대응하여 고객 이탈률이 50% 감소했으며, 장기 고객 비율이 크게 증가했습니다.',
      },
    ],
  },
  {
    id: '6',
    tag: '[교육]',
    title: 'EduNext (온라인 교육 플랫폼)',
    summary:
      "'멀티채널 통합 관리' 기능으로 웹, 모바일, 이메일 등 다양한 채널의 고객 문의를 하나의 플랫폼에서 효율적으로 관리합니다.",
    thumbnailUrl: '/images/success-case-6.png',
    publishedAt: '2025.10.10',
    viewCount: 1420,
    detailImageUrl: '/images/success-case-6.png',
    sections: [
      {
        title: '모든 채널을 하나의 플랫폼으로',
        content:
          'EduNext는 학생들이 웹, 모바일 앱, 이메일, 카카오톡 등 다양한 채널로 문의를 하고 있었습니다. Talkgate의 멀티채널 통합 관리 기능으로 모든 채널의 문의를 하나의 대시보드에서 확인하고 응대할 수 있게 되었습니다.',
      },
      {
        title: '일관된 고객 경험 제공',
        content:
          '학생이 어떤 채널로 문의하든 동일한 품질의 답변을 받을 수 있습니다. 채널 간 이동 시에도 대화 이력이 유지되어 학생이 같은 내용을 반복 설명할 필요가 없어졌으며, 고객 만족도가 35% 향상되었습니다.',
      },
      {
        title: '응대 효율성 극대화',
        content:
          '상담원은 여러 채널을 번갈아 확인할 필요 없이 하나의 화면에서 모든 문의를 처리합니다. 평균 응답 시간이 40% 단축되었고, 동일한 인력으로 처리 가능한 문의량이 50% 증가했습니다.',
      },
    ],
  },
];

/**
 * ID로 특정 케이스 스터디 찾기
 */
export function getCaseStudyById(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find((caseStudy) => caseStudy.id === id);
}

/**
 * 모든 케이스 스터디 ID 목록 가져오기 (SSG용)
 */
export function getAllCaseStudyIds(): string[] {
  return CASE_STUDIES.map((caseStudy) => caseStudy.id);
}

