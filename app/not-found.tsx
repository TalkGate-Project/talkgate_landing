import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-20">
      <div className="container-landing text-center">
        <h1 className="typo-hero text-muted-foreground mb-4">404</h1>
        <h2 className="typo-h2 mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="typo-body text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}

