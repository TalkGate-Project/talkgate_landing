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
  { label: '고객 성공 사례', href: '/case' },
  { label: '체험하기', href: '/trial', disabled: true }, // TBD
  { label: '회사소개', href: '/introduce' },
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
} as const;

// ============================================
// Company Info
// ============================================

/**
 * 회사 정보 (푸터 등에 표시)
 */
export const COMPANY_INFO: CompanyInfo = {
  name: '주식회사 000',
  businessNumber: '000-00-00000',
  telecomNumber: '제 0000-서울강서-00000호',
  ceo: '000',
  email: 'support@talkgate.com',
  phone: '000-0000-0000',
  address: '서울시 강서구 공항대로 220 6층 603호',
};

// ============================================
// Brand
// ============================================

export const BRAND = {
  name: 'Talkgate',
  tagline: 'All your business workflows in one place.',
  description:
    '고객의 고객데이터 기반 CRM, 상담 관리, 상담 이력 관리 등 전화, 카카오톡, 채널톡, 구글 비즈니스 프로필, 네이버 톡톡 등 다양한 고객 소통 채널을 하나로 연결하여 스마트하게 관리합니다.',
} as const;

// ============================================
// Page Metadata
// ============================================

export const PAGE_METADATA = {
  main: {
    title: 'Talkgate | All your business workflows in one place.',
    description: BRAND.description,
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

