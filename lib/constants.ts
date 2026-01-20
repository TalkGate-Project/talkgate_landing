/**
 * 상수 정의
 *
 * 네비게이션, 외부 링크, 회사 정보 등
 * 프로젝트 전반에서 사용하는 상수를 관리합니다.
 */

import type { NavItem, CompanyInfo } from '@/types';

// ============================================
// Navigation
// ============================================

/**
 * 메인 네비게이션 항목
 */
export const NAV_ITEMS: NavItem[] = [
  { label: '회사소개', href: '/introduce' },
  { label: '이용가이드', href: 'https://talkgate.gitbook.io/talkgate', external: true },
  { label: '요금제', href: '/pricing' },
];

/**
 * 푸터 네비게이션
 */
export const FOOTER_NAV = {
  product: [
    { label: '요금제', href: '/pricing' },
    { label: '고객 성공 사례', href: '/case' },
  ],
  company: [
    { label: '회사소개', href: '/introduce' },
  ],
  support: [
    { label: '문의하기', href: 'mailto:support@talkgate.com', external: true },
  ],
} as const;

// ============================================
// External Links
// ============================================

/**
 * 외부 링크
 */
export const EXTERNAL_LINKS = {
  /** 고객 지원 이메일 */
  supportEmail: 'support@talkgate.com',

  /** 이용약관 (메인 서비스) */
  termsOfService: '/terms',

  /** 개인정보처리방침 (메인 서비스) */
  privacyPolicy: '/privacy',

  /** 개인정보 처리위탁에 대한 동의 */
  privacyConsignment: '/privacy-consignment',

  /** 고객정보 적법 수집 및 제3자 제공 책임 확인 */
  dataCollection: '/data-collection',

  /** Talkgate 마케팅 정보 수신 동의 */
  marketingConsent: '/marketing-consent',
} as const;

// ============================================
// Company Info
// ============================================

/**
 * 회사 정보 (푸터 등에 표시)
 */
export const COMPANY_INFO: CompanyInfo = {
  name: '주식회사 핑크코브라',
  businessNumber: '103-87-01124',
  telecomNumber: '2021-서울강북-0945',
  ceo: '정진웅',
  email: 'support@talkgate.im',
  phone: '',
  representativeNumber: '1533-4005',
  address: '서울특별시 강북구 삼양로173길 223(우이동)',
};

// ============================================
// Brand
// ============================================

export const BRAND = {
  name: 'Talkgate',
  tagline: 'All your business workflows in one place.',
  description:
    '흩어진 고객 데이터, 채팅, 성과 지표를 실시간으로 통합하여,\n놓치지 말아야 할 성장의 순간을 포착하세요.',
} as const;

// ============================================
// Page Metadata
// ============================================

export const PAGE_METADATA = {
  main: {
    title: 'Talkgate | All your business workflows in one place.',
    titleKo: '톡게이트 | 모든 비즈니스 워크플로우를 한 곳에서',
    description: BRAND.description,
    keywords: [
      'Talkgate',
      '톡게이트',
      '토크게이트',
      'CRM',
      '고객관리',
      '상담관리',
      '채팅 상담',
      '고객 만족',
      '비즈니스 워크플로우',
      '통합 상담',
      'AI 상담',
      '고객 서비스',
      '고객 관계 관리',
      '상담 솔루션',
      '고객 커뮤니케이션',
    ],
  },
  pricing: {
    title: '요금제 | Talkgate',
    description: '복잡한 고민 없이, 모든 기능을 지금 바로 시작하세요.',
  },
  case: {
    title: '고객 성공 사례 | Talkgate',
    description: '실제 기업들의 성과를 확인하고, 가치를 확인하세요.',
  },
  introduce: {
    title: '회사소개 | Talkgate',
    description:
      '미래의 고객 변화에 미리 대응하고 앞서 나갈 수 있도록 고객 관계 혁신의 여정을 Talkgate이 함께 만들어갑니다.',
  },
} as const;

// ============================================
// UI Constants
// ============================================

/**
 * 애니메이션 지속 시간 (ms)
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * 반응형 브레이크포인트 (px)
 * Tailwind 기본값과 동일
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

