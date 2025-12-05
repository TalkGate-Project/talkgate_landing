/**
 * 클라이언트 사이드 인증 상태 관리 훅
 * 
 * 서버 컴포넌트에서 전달받은 초기 인증 상태를 기반으로
 * 클라이언트에서 실시간으로 인증 상태를 확인합니다.
 */

'use client';

import { useEffect, useState } from 'react';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

/**
 * 쿠키에서 인증 상태 확인
 * 
 * 메인 서비스에서 설정한 tg_access_token 쿠키를 확인하여
 * 로그인 여부를 판단합니다.
 */
function checkAuthFromClient(): boolean {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
  );
  
  // 쿠키가 있고 값이 비어있지 않은 경우에만 인증됨으로 간주
  if (!authCookie) return false;
  
  const value = authCookie.split('=')[1];
  return !!value && value !== 'undefined' && value !== 'null';
}

interface UseAuthOptions {
  /** 초기 인증 상태 (서버에서 전달) */
  initialAuth?: boolean;
  /** 폴링 간격 (ms) - 0이면 폴링 비활성화 */
  pollingInterval?: number;
}

/**
 * 인증 상태 관리 훅
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * function MyComponent({ initialAuth }: { initialAuth: boolean }) {
 *   const { isAuthenticated, checkAuth } = useAuth({ initialAuth });
 *   
 *   return (
 *     <div>
 *       {isAuthenticated ? '로그인됨' : '로그아웃됨'}
 *       <button onClick={checkAuth}>상태 새로고침</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth({
  initialAuth = false,
  pollingInterval = 0, // 기본적으로 폴링 비활성화
}: UseAuthOptions = {}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);

  // 인증 상태 확인 함수
  const checkAuth = () => {
    const auth = checkAuthFromClient();
    setIsAuthenticated(auth);
    return auth;
  };

  // 마운트 시 초기 확인
  useEffect(() => {
    checkAuth();
  }, []);

  // 폴링 (선택적)
  useEffect(() => {
    if (pollingInterval <= 0) return;

    const intervalId = setInterval(checkAuth, pollingInterval);
    return () => clearInterval(intervalId);
  }, [pollingInterval]);

  return {
    isAuthenticated,
    checkAuth,
  };
}
