# Icons

SVG 아이콘 컴포넌트를 관리하는 폴더입니다.

## 사용 규칙

### 간단한 SVG (4줄 이하)
인라인으로 직접 사용합니다.

```tsx
<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M10 2L3 7v11h14V7l-7-5z" stroke="currentColor" strokeWidth="2"/>
</svg>
```

### 복잡한 SVG (4줄 초과)
이 폴더에 React 컴포넌트로 변환하여 저장합니다.

## 컴포넌트 작성 가이드

1. **파일명**: `PascalCase` + `Icon` suffix (예: `CheckIcon.tsx`)
2. **컴포넌트명**: 파일명과 동일
3. **Props**: `SVGProps<SVGSVGElement>` 확장, `size` prop 제공
4. **색상**: `currentColor` 사용하여 부모 색상 상속
5. **viewBox**: 반응형을 위해 명시

## 예시

```tsx
// CheckIcon.tsx
import type { SVGProps } from 'react';

interface CheckIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function CheckIcon({ size = 24, ...props }: CheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
```

## Export

`index.ts`에서 모든 아이콘을 re-export합니다.

```tsx
// index.ts
export { CheckIcon } from './CheckIcon';
export { ArrowRightIcon } from './ArrowRightIcon';
```

