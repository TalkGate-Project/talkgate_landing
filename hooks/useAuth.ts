/**
 * 클라이언트 사이드 인증 상태 관리 훅
 * 
 * 서버 컴포넌트에서 전달받은 초기 인증 상태를 기반으로
 * 클라이언트에서 실시간으로 인증 상태를 확인합니다.
 * 
 * httpOnly 쿠키는 JavaScript에서 읽을 수 없으므로
 * 서버 API를 통해 인증 상태를 확인합니다.
 */

'use client';

import { useEffect, useState } from 'react';

/**
 * 서버 API를 통해 인증 상태 확인
 * 
 * httpOnly 쿠키는 JavaScript에서 읽을 수 없으므로
 * 랜딩 페이지의 API 엔드포인트를 통해 확인합니다.
 */
async function checkAuthFromClient(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include', // httpOnly 쿠키를 포함하기 위해 필수
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.authenticated === true;
  } catch (error) {
    console.warn('인증 상태 확인 실패:', error);
    return false;
  }
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
  const checkAuth = async () => {
    const auth = await checkAuthFromClient();
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
