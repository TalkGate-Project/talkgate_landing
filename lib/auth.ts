/**
 * 인증 관련 유틸리티
 *
 * 랜딩 페이지는 직접 인증을 처리하지 않고,
 * 메인 서비스로 위임합니다.
 */

import { env } from './env';

/**
 * 로그인 URL 생성
 *
 * 메인 서비스의 로그인 페이지로 리다이렉트하며,
 * returnUrl을 쿼리 파라미터로 전달합니다.
 *
 * @param returnPath - 로그인 후 돌아올 경로 (기본: '/')
 * @returns 메인 서비스 로그인 URL
 *
 * @example
 * ```tsx
 * <Link href={getLoginUrl('/pricing')}>로그인</Link>
 * ```
 */
export function getLoginUrl(returnPath: string = '/'): string {
  const returnUrl = `${env.LANDING_URL}${returnPath}`;
  const loginUrl = new URL('/login', env.MAIN_SERVICE_URL);
  loginUrl.searchParams.set('returnUrl', returnUrl);

  return loginUrl.toString();
}

/**
 * 회원가입 URL 생성
 *
 * @param returnPath - 가입 후 돌아올 경로 (기본: '/')
 * @returns 메인 서비스 회원가입 URL
 */
export function getSignupUrl(returnPath: string = '/'): string {
  const returnUrl = `${env.LANDING_URL}${returnPath}`;
  const signupUrl = new URL('/signup', env.MAIN_SERVICE_URL);
  signupUrl.searchParams.set('returnUrl', returnUrl);

  return signupUrl.toString();
}

/**
 * 시작하기 URL 생성
 *
 * 인증 여부에 따라 다른 페이지로 이동합니다.
 * - 인증됨: 메인 서비스 대시보드
 * - 미인증: 메인 서비스 회원가입
 *
 * @param isAuthenticated - 인증 여부
 * @returns 적절한 URL
 */
export function getStartUrl(isAuthenticated: boolean = false): string {
  if (isAuthenticated) {
    return `${env.MAIN_SERVICE_URL}/dashboard`;
  }

  return getSignupUrl('/');
}

/**
 * 메인 서비스 대시보드 URL
 */
export function getDashboardUrl(): string {
  return `${env.MAIN_SERVICE_URL}/dashboard`;
}

/**
 * 로그아웃 URL 생성
 *
 * @param returnPath - 로그아웃 후 돌아올 경로 (기본: '/')
 * @returns 메인 서비스 로그아웃 URL
 */
export function getLogoutUrl(returnPath: string = '/'): string {
  const returnUrl = `${env.LANDING_URL}${returnPath}`;
  const logoutUrl = new URL('/logout', env.MAIN_SERVICE_URL);
  logoutUrl.searchParams.set('returnUrl', returnUrl);

  return logoutUrl.toString();
}

// ============================================
// Server-side 인증 확인 (추후 구현)
// ============================================

/**
 * 인증 쿠키 설정
 * 메인 서비스와 동일한 설정 사용
 */
export const AUTH_COOKIE_NAME = 'tg_access_token';
export const REFRESH_COOKIE_NAME = 'tg_refresh_token';

/**
 * 쿠키 설정 옵션
 * 메인 서비스에서 설정한 쿠키와 동일한 옵션 사용
 * 
 * 참고: 실제 쿠키는 메인 서비스에서 설정되며,
 * 이 옵션은 문서화 및 참고 목적으로만 사용됩니다.
 */
export const COOKIE_OPTIONS = {
  domain: env.COOKIE_DOMAIN, // 프로덕션: .talkgate.im
  path: '/',
  // 프로덕션: cross-site 쿠키 공유를 위해 'none' 사용
  // 개발: same-site만 허용하는 'lax' 사용
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  httpOnly: false, // 클라이언트에서도 읽을 수 있도록 설정
} as const;

/**
 * 서버 사이드에서 인증 상태 확인
 *
 * @example
 * ```tsx
 * // Server Component에서 사용
 * import { cookies } from 'next/headers';
 * import { checkAuthFromCookies } from '@/lib/auth';
 *
 * export default async function Page() {
 *   const cookieStore = await cookies();
 *   const isAuthenticated = checkAuthFromCookies(cookieStore);
 *   // ...
 * }
 * ```
 */
export function checkAuthFromCookies(
  cookieStore: { get: (name: string) => { value: string } | undefined }
): boolean {
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!sessionCookie?.value) return false;
  
  // 쿠키가 있고 값이 유효한 경우에만 인증됨으로 간주
  // 빈 값, 'undefined', 'null' 문자열 체크
  const value = sessionCookie.value;
  return !!value && value !== 'undefined' && value !== 'null';
}

