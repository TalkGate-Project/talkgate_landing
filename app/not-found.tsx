import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-montserrat)] text-[120px] font-bold tracking-[-0.011em] leading-[1]">404</h1>
        <h2 className="font-[family-name:var(--font-montserrat)] text-[40px] font-bold tracking-[-0.011em] leading-[1] !mb-[42px]">NOT FOUND</h2>
        <p className="text-[24px] font-semibold tracking-[-0.011em] leading-[1] text-muted-foreground !mb-8">
        찾으시는 페이지를 발견할 수 없습니다.
        </p>
        <Link href="/" className="btn btn-outline">
          처음으로 돌아가기
        </Link>
      </div>
    </section>
  );
}

