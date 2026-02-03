/**
 * 인증 관련 유틸리티
 *
 * 랜딩 페이지는 직접 인증을 처리하지 않고,
 * 메인 서비스로 위임합니다.
 */

import { env } from './env';

// ============================================
// 쿠키 관련 상수
// ============================================

const ACCESS_COOKIE = "tg_access_token";
const REFRESH_COOKIE = "tg_refresh_token";
const PROJECT_COOKIE = "tg_selected_project_id";

// ============================================
// 브라우저/도메인 확인 유틸리티
// ============================================

/**
 * 브라우저 환경인지 확인
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * returnUrl 등에 쓸 랜딩 기준 URL.
 * 브라우저면 현재 접속 origin(dev.talkgate.im / talkgate.im 등),
 * SSR이면 env.LANDING_URL → 동일 빌드가 여러 도메인에 서빙되어도 returnUrl 불일치 방지.
 */
function getLandingBaseUrl(): string {
  if (isBrowser()) return window.location.origin;
  return env.LANDING_URL.replace(/\/$/, "");
}

/**
 * 요청 헤더로 랜딩 기준 URL 계산 (서버 전용).
 * SSR 시 Link href에 env.LANDING_URL 대신 요청 Host 사용 → dev/talkgate 등 도메인 불일치 방지.
 * @param headers - next/headers의 headers() 반환값
 */
export function getLandingBaseUrlFromRequest(headers: Headers): string {
  const host = headers.get("x-forwarded-host") || headers.get("host") || "";
  const proto = headers.get("x-forwarded-proto") || "https";
  if (!host) return env.LANDING_URL.replace(/\/$/, "");
  const base = `${proto === "https" ? "https" : "http"}://${host}`.replace(/\/$/, "");
  return base;
}

/** 경로 또는 전체 URL → returnUrl로 사용할 전체 URL */
function toReturnUrl(base: string, pathOrUrl: string): string {
  const s = pathOrUrl.trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const path = s.startsWith("/") ? s : `/${s}`;
  return `${base.replace(/\/$/, "")}${path}`;
}

/**
 * 프로덕션 도메인인지 확인
 */
function isProductionDomain(): boolean {
  if (!isBrowser()) return false;
  const hostname = window.location.hostname;
  return hostname.endsWith(".talkgate.im") || hostname === "talkgate.im";
}

// ============================================
// 간소화된 인증 쿠키 관리
// ============================================

/**
 * 모든 TalkGate 인증 쿠키를 삭제합니다.
 * 
 * `.talkgate.im` 도메인에 설정된 쿠키를 삭제하므로,
 * 랜딩 페이지(talkgate.im)에서 호출해도 앱의 쿠키가 함께 삭제됩니다.
 */
export function clearAuthCookies(): void {
  if (!isBrowser()) return;

  const cookiesToDelete = [ACCESS_COOKIE, REFRESH_COOKIE, PROJECT_COOKIE];

  // 기본 삭제 속성
  const baseAttrs = ["Max-Age=0", "Path=/"];

  // HTTPS 환경에서는 Secure 속성 추가
  if (window.location.protocol === "https:") {
    baseAttrs.push("Secure");
  }

  cookiesToDelete.forEach(cookieName => {
    // 1. 프로덕션 환경: .talkgate.im 도메인 쿠키 삭제
    if (isProductionDomain()) {
      const prodAttrs = [...baseAttrs, "Domain=.talkgate.im"];
      document.cookie = `${cookieName}=; ${prodAttrs.join("; ")}`;
    }

    // 2. 현재 도메인 쿠키도 삭제 (HostOnly 쿠키가 있을 수 있으므로)
    document.cookie = `${cookieName}=; ${baseAttrs.join("; ")}`;
  });

  console.log("[Landing] 🍪 인증 쿠키 삭제 완료");
}

/**
 * 로그인 상태 확인 (쿠키 존재 여부)
 * 
 * 클라이언트 사이드에서만 사용 가능합니다.
 * 단순히 쿠키 존재 여부만 확인합니다.
 */
export function isLoggedIn(): boolean {
  if (!isBrowser()) return false;
  return document.cookie.includes(ACCESS_COOKIE);
}

/**
 * 액세스/리프레시 토큰이 **둘 다** 없는지 확인.
 * 클라이언트 전용. 둘 다 없으면 true (비로그인).
 * /pricing 등에서 비로그인 시 더미 플랜 선택 페이지로 보낼 때 사용.
 */
export function areBothTokensMissing(): boolean {
  if (!isBrowser()) return true;
  const hasValid = (name: string) => {
    const cookies = document.cookie.split(";");
    const c = cookies.find((x) => x.trim().startsWith(`${name}=`));
    if (!c) return false;
    const v = (c.split("=")[1] ?? "").trim();
    return !!v && v !== "undefined" && v !== "null";
  };
  return !hasValid(ACCESS_COOKIE) && !hasValid(REFRESH_COOKIE);
}

/**
 * 앱 도메인 URL 반환
 * 
 * env.MAIN_SERVICE_URL에서 도메인을 추출하여 반환합니다.
 * 프로덕션: app.talkgate.im
 * 개발: app-dev.talkgate.im
 */
export function getAppDomain(): string {
  // env.MAIN_SERVICE_URL에서 도메인 추출
  const url = env.MAIN_SERVICE_URL;
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  return domain;
}

/**
 * 로그인 URL 생성
 *
 * 메인 서비스의 로그인 페이지로 리다이렉트하며,
 * returnUrl을 쿼리 파라미터로 전달합니다.
 * returnUrl은 현재 접속 도메인(dev.talkgate.im / talkgate.im 등) 기준으로 생성합니다.
 *
 * @param returnPath - 로그인 후 돌아올 경로 또는 전체 URL (선택)
 * @param baseUrlOverride - SSR 시 서버에서 넘긴 랜딩 기준 URL (요청 Host 기반). 있으면 이걸 사용.
 *
 * @example
 * ```tsx
 * <Link href={getLoginUrl('/pricing')}>로그인</Link>
 * <Link href={getLoginUrl(pathname, landingBaseUrl)}>로그인</Link>
 * ```
 */
export function getLoginUrl(returnPath?: string, baseUrlOverride?: string): string {
  const loginUrl = new URL('/login', env.MAIN_SERVICE_URL);
  if (typeof returnPath === "string") {
    const base = baseUrlOverride ?? getLandingBaseUrl();
    const returnUrl = toReturnUrl(base, returnPath);
    loginUrl.searchParams.set("returnUrl", returnUrl);
  }
  return loginUrl.toString();
}

/**
 * 회원가입 CTA가 이동할 로그인 URL 생성
 * returnUrl은 현재 접속 도메인 기준으로 생성합니다.
 *
 * @param returnPath - 로그인 후 돌아올 경로 (기본: '/') 또는 전체 URL
 * @param baseUrlOverride - SSR 시 서버에서 넘긴 랜딩 기준 URL. 있으면 이걸 사용.
 */
export function getSignupUrl(returnPath: string = '/', baseUrlOverride?: string): string {
  return getLoginUrl(returnPath, baseUrlOverride);
}

/**
 * 시작하기 URL 생성
 *
 * 인증 여부에 따라 다른 페이지로 이동합니다.
 * - 인증됨: 메인 서비스 대시보드
 * - 미인증: 메인 서비스 회원가입
 *
 * @param isAuthenticated - 인증 여부
 * @param baseUrlOverride - SSR 시 랜딩 기준 URL (미인증 회원가입 returnUrl용).
 */
export function getStartUrl(isAuthenticated: boolean = false): string {
  if (isAuthenticated) {
    return `${env.MAIN_SERVICE_URL}/dashboard`;
  }
  return getLoginUrl();
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
 * 메인 서비스의 로그아웃 페이지로 리다이렉트하며,
 * callbackUrl/returnUrl을 쿼리 파라미터로 전달합니다.
 * 두 URL 모두 현재 접속 도메인 기준으로 생성합니다.
 *
 * @param returnPath - 로그아웃 후 돌아올 경로 (기본: '/') 또는 전체 URL
 * @param baseUrlOverride - SSR 시 랜딩 기준 URL. 있으면 이걸 사용.
 *
 * @example
 * ```tsx
 * <Link href={getLogoutUrl('/')}>로그아웃</Link>
 * ```
 */
export function getLogoutUrl(returnPath: string = '/', baseUrlOverride?: string): string {
  const base = baseUrlOverride ?? getLandingBaseUrl();
  const callbackUrl = `${base}/api/auth/logout-callback`;
  const returnUrl = toReturnUrl(base, returnPath);

  const logoutUrl = new URL('/logout', env.MAIN_SERVICE_URL);
  logoutUrl.searchParams.set('callbackUrl', callbackUrl);
  logoutUrl.searchParams.set('returnUrl', returnUrl);

  return logoutUrl.toString();
}

/**
 * 클라이언트 사이드에서 로그아웃 처리
 * 
 * HttpOnly 쿠키를 포함한 모든 인증 쿠키를 삭제합니다.
 * 서버 사이드 API를 통해 쿠키를 삭제한 후, 클라이언트에서도 추가로 삭제를 시도합니다.
 * 
 * @param options - 로그아웃 옵션
 * @param options.redirect - 로그아웃 후 리다이렉트할 경로 (기본: '/')
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { handleLogout } from '@/lib/auth';
 * 
 * <button onClick={() => handleLogout()}>
 *   Logout
 * </button>
 * ```
 */
export async function handleLogout(options?: {
  redirect?: string;
}): Promise<void> {
  const { redirect = '/' } = options || {};

  if (typeof window === 'undefined') return;

  // 1. 서버 사이드 로그아웃 API 호출 (HttpOnly 쿠키 삭제)
  try {
    const apiUrl = '/api/auth/logout';
    const response = await fetch(apiUrl, {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('로그아웃 API 응답 실패:', response.status);
    }
  } catch (error) {
    console.warn('로그아웃 API 호출 실패:', error);
    // API 호출 실패해도 클라이언트 사이드 쿠키 삭제는 진행
  }

  // 2. 클라이언트에서도 쿠키 삭제 시도 (HttpOnly가 아닌 쿠키용)
  // HttpOnly 쿠키는 서버 API에서만 삭제 가능하지만, 
  // 클라이언트에서도 시도하여 가능한 모든 쿠키를 삭제
  if (typeof document !== 'undefined') {
    const cookiePath = '; Path=/';
    const cookieExpires = '; Expires=Thu, 01 Jan 1970 00:00:00 UTC';
    const cookieMaxAge = '; Max-Age=0';
    const cookieSecure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const cookieSameSite = process.env.NODE_ENV === 'production' ? '; SameSite=None' : '; SameSite=Lax';
    
    // 프로덕션 환경에서는 Domain 속성도 포함하여 삭제
    // 개발 환경(localhost)에서는 Domain 속성 없이 삭제
    const cookieDomain = env.COOKIE_DOMAIN 
      ? `; Domain=${env.COOKIE_DOMAIN}` 
      : '';

    // 삭제할 쿠키 목록
    const cookiesToDelete = [
      AUTH_COOKIE_NAME,
      REFRESH_COOKIE_NAME,
      'tg_selected_project_id', // 프로젝트 선택 쿠키도 삭제
    ];

    // 각 쿠키 삭제 시도
    for (const cookieName of cookiesToDelete) {
      // Domain이 있는 경우와 없는 경우 모두 삭제 시도
      const domains = cookieDomain ? [cookieDomain, ''] : [''];
      
      for (const domain of domains) {
        const cookieString = `${cookieName}=${cookieExpires}${cookieMaxAge}${cookiePath}${domain}${cookieSecure}${cookieSameSite}`;
        document.cookie = cookieString;
      }
    }
  }

  // 3. 리다이렉트
  window.location.href = redirect;
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
 * /api/proxy와 동일하게 API_BASE_URL + tg_access_token 쿠키 기반으로 검증합니다.
 *
 * @example
 * ```tsx
 * import { cookies } from 'next/headers';
 * import { checkAuthStatus } from '@/lib/auth';
 *
 * export default async function Page() {
 *   const cookieStore = await cookies();
 *   const isAuthenticated = await checkAuthStatus(cookieStore);
 *   // ...
 * }
 * ```
 */
export async function checkAuthStatus(
  cookieStore: { get: (name: string) => { value: string } | undefined; getAll: () => Array<{ name: string; value: string }> }
): Promise<boolean> {
  try {
    const accessToken =
      cookieStore.get?.('tg_access_token')?.value ??
      cookieStore.getAll().find((c) => c.name === 'tg_access_token')?.value;

    if (!accessToken || accessToken === 'undefined' || accessToken === 'null') {
      return false;
    }

    const response = await fetch(`${env.API_BASE_URL}/v1/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    return response.ok;
  } catch (error) {
    console.warn('인증 상태 확인 실패:', error);
    return false;
  }
}

/**
 * @deprecated httpOnly 쿠키는 JavaScript에서 읽을 수 없으므로 사용하지 않습니다.
 * 대신 checkAuthStatus()를 사용하세요.
 */
export function checkAuthFromCookies(
  cookieStore: { get: (name: string) => { value: string } | undefined }
): boolean {
  // httpOnly 쿠키는 서버에서도 직접 읽을 수 없으므로 항상 false 반환
  // 실제 인증 확인은 checkAuthStatus()를 사용해야 합니다.
  void cookieStore; // 사용하지 않는 파라미터 명시 (deprecated 함수)
  return false;
}

