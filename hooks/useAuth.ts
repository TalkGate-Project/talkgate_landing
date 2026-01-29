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

import { useEffect, useState, useCallback } from 'react';

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
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
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
 * 마운트 시 /api/auth/check 호출로 클라이언트에서 재검사하여
 * 로그인 유지(쿠키 기반) 상태를 헤더 등에 반영합니다.
 * 
 * @example
 * ```tsx
 * const { isAuthenticated, checkAuth } = useAuth({ initialAuth });
 * ```
 */
export function useAuth({
  initialAuth = false,
  pollingInterval = 0,
}: UseAuthOptions = {}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);

  const checkAuth = useCallback(async () => {
    const auth = await checkAuthFromClient();
    setIsAuthenticated(auth);
    return auth;
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (pollingInterval <= 0) return;
    const intervalId = setInterval(checkAuth, pollingInterval);
    return () => clearInterval(intervalId);
  }, [pollingInterval, checkAuth]);

  return {
    isAuthenticated,
    checkAuth,
  };
}
