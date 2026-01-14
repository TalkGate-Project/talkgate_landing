/**
 * 토큰 관리 유틸리티
 */

const ACCESS_TOKEN_KEY = "tg_access_token";
const REFRESH_TOKEN_KEY = "tg_refresh_token";

/**
 * 모든 토큰을 제거합니다.
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Ignore errors
  }
}
