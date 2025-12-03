import Link from 'next/link';
import { getStartUrl } from '@/lib/auth';

export function FinalCtaSection() {
  return (
    <section className="flex justify-center mt-6 px-6">
      <div className="w-full max-w-[1170px] ">
        <div
          className="rounded-3xl px-[82px] py-16 h-[224px] flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{
            background:
              'linear-gradient(263.79deg, rgba(0, 207, 104, 0.2) 15.09%, rgba(173, 246, 210, 0.2) 101.28%)',
          }}
        >
          {/* Text Area */}
          <div className="flex-1">
            <h2 className="typo-h3 text-neutral-90">
              신속한 소통으로 고객의 신뢰를 확보하고,
              <br />
              비즈니스를 성장시키세요.
            </h2>
          </div>

          {/* Button Area */}
          <div className="flex gap-4 flex-shrink-0">
            <Link
              href={getStartUrl()}
              className="px-6 py-2 bg-neutral-90 leading-[1] text-[14px] text-neutral-0 rounded-[5px] font-semibold hover:bg-neutral-100 transition-colors"
            >
              시작하기
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2 bg-neutral-0 text-neutral-90 leading-[1] text-[14px] rounded-[5px] font-semibold hover:bg-neutral-10 transition-colors"
            >
              상담요청
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}