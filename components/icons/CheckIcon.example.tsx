/**
 * CheckIcon - 예시 컴포넌트
 *
 * 이 파일은 템플릿 예시입니다.
 * 실제 사용 시에는 이 파일을 복사하여 새로운 아이콘 컴포넌트를 만드세요.
 */

import type { SVGProps } from 'react';

interface CheckIconProps extends SVGProps<SVGSVGElement> {
  /** 아이콘 크기 (px) */
  size?: number;
}

/**
 * 체크 아이콘 컴포넌트
 *
 * @example
 * ```tsx
 * <CheckIcon className="text-primary" size={20} />
 * ```
 */
export function CheckIcon({ size = 24, className, ...props }: CheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

