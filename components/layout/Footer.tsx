import Link from 'next/link';
import { BRAND, COMPANY_INFO, EXTERNAL_LINKS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-landing py-12">
        {/* Company Info */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            {COMPANY_INFO.name} | 사업자등록번호 : {COMPANY_INFO.businessNumber}{' '}
            | 통신판매업신고번호 : {COMPANY_INFO.telecomNumber}
          </p>
          <p>
            대표이사 : {COMPANY_INFO.ceo} | 이메일 :{' '}
            <Link
              href={`mailto:${COMPANY_INFO.email}`}
              className="hover:text-foreground transition-colors"
            >
              {COMPANY_INFO.email}
            </Link>{' '}
            | 연락처 : {COMPANY_INFO.phone}
          </p>
          <p>{COMPANY_INFO.address}</p>
        </div>

        {/* Logo */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="text-xl font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            {BRAND.name}
          </Link>
        </div>

        {/* Legal Links */}
        <div className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
          <Link
            href={EXTERNAL_LINKS.termsOfService}
            className="hover:text-foreground transition-colors"
          >
            이용약관
          </Link>
          <Link
            href={EXTERNAL_LINKS.privacyPolicy}
            className="hover:text-foreground transition-colors"
          >
            개인정보처리방침
          </Link>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

