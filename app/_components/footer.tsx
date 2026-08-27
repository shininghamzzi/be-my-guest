"use client";

import Link from "next/link";
import { Library, MessagesSquare } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isArchive = pathname === "/archive";

  return (
    <footer className="border-primary/20 flex flex-col items-center gap-1.5 border-t py-2 text-center text-xs text-neutral-700">
      <Link
        href={isArchive ? "/" : "/archive"}
        className="group my-3 flex w-full items-center justify-between rounded-lg border border-pink-200 bg-white/40 p-3.5 transition hover:bg-white/70"
      >
        <div className="flex items-center gap-2.5 text-left">
          {isArchive ? <MessagesSquare size={16} /> : <Library size={16} />}
          <div>
            <div className="text-xs font-bold text-gray-600 transition group-hover:text-rose-600">
              {isArchive
                ? "드라마 비 마이 게스트 회차별 의견 나누기"
                : "비마이게스트 & 이태빈 아카이브"}
            </div>
            {isArchive || (
              <div className="text-[11px] text-gray-400">
                공식 티저, 메이킹 영상, 인터뷰 기사 모아보기
              </div>
            )}
          </div>
        </div>
        <span className="text-xs font-semibold text-rose-500 transition-transform">
          이동하기 →
        </span>
      </Link>

      <p className="text-[11px] text-neutral-600">
        비방·악플 및 치명적인 스포일러는 무통보 삭제될 수 있습니다.
      </p>
      <p className="text-[10px] leading-tight text-neutral-600">
        본 사이트는 비공식 팬 사이트이며, 작품의 모든 저작권은 LEZHIN SNACK 및
        제작사에 있습니다.
      </p>
      <p className="pt-1 font-mono text-[10px] text-neutral-600">
        Made with 💙 for 이태빈 by{" "}
        <a
          href="https://x.com/shininghamzzi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 transition hover:text-rose-600"
        >
          @shininghamzzi
        </a>
      </p>
    </footer>
  );
}
