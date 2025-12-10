/**
 * Talkgate Landing - 공통 타입 정의
 */

// ============================================
// Navigation
// ============================================

export interface NavItem {
  label: string;
  href: string;
  /** 외부 링크 여부 */
  external?: boolean;
  /** 비활성화 여부 (준비 중 등) */
  disabled?: boolean;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

// ============================================
// Pricing
// ============================================

export interface PricingPlan {
  id: string;
  name: string;
  /** 뱃지 텍스트 (예: "Basic", "Premium") */
  badge?: string;
  /** 월 가격 (원) */
  priceMonthly: number;
  /** 연 가격 (원, 연간 결제시) */
  priceYearly?: number;
  /** 가격 단위 설명 */
  priceUnit: string;
  /** 플랜 설명 */
  description?: string;
  /** 포함 기능 목록 */
  features: string[];
  /** 강조 표시 여부 */
  highlighted?: boolean;
  /** CTA 버튼 텍스트 */
  ctaText: string;
  /** CTA 버튼 링크 */
  ctaHref: string;
  /** 최대 멤버 수 */
  maxMembers: number;
  /** 월 AI 상담 도우미 토큰 수 */
  aiTokensPerMonth: number;
  /** 월 문자 전송 횟수 */
  smsCountPerMonth: number;
}

export type BillingCycle = 'monthly' | 'yearly';

// ============================================
// Case Studies (고객 성공 사례)
// ============================================

export interface CaseStudy {
  id: string;
  /** 회사/고객 유형 태그 (예: "[스타트업]", "[중견 기업]") */
  tag: string;
  /** 제목 */
  title: string;
  /** 요약 설명 */
  summary: string;
  /** 썸네일 이미지 경로 */
  thumbnailUrl: string;
  /** 상세 페이지 경로 (있을 경우) */
  detailHref?: string;
  /** 게시일 */
  publishedAt: string;
  /** 조회수 */
  viewCount?: number;
  /** 상세 페이지 메인 이미지 */
  detailImageUrl?: string;
  /** 상세 페이지 섹션들 */
  sections?: CaseStudySection[];
}

export interface CaseStudySection {
  /** 섹션 제목 */
  title: string;
  /** 섹션 내용 */
  content: string;
}

export type CaseSortOption = 'all' | 'date' | 'views';

// ============================================
// Company / About
// ============================================

export interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  imageUrl?: string;
  bio?: string;
}

// ============================================
// Common UI
// ============================================

export interface Feature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatarUrl?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// ============================================
// Auth
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

/** 인증 상태 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

// ============================================
// Project
// ============================================

export interface Project {
  id: string;
  name: string;
  logoUrl?: string;
  memberCount?: number;
  assignedCustomerCount?: number;
  todayScheduleCount?: number;
  useAttendanceMenu?: boolean;
}

// ============================================
// SEO
// ============================================

export interface PageSEO {
  title: string;
  description: string;
  ogImage?: string;
  noIndex?: boolean;
}

// ============================================
// Footer
// ============================================

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface CompanyInfo {
  name: string;
  businessNumber: string;
  telecomNumber: string;
  ceo: string;
  email: string;
  phone: string;
  representativeNumber: string;
  address: string;
}

