"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Link2 } from "lucide-react";

const TOTAL_EPISODES = 53;
const TABS = [
  { label: "1-15화", start: 1, end: 15 },
  { label: "16-30화", start: 16, end: 30 },
  { label: "31-45화", start: 31, end: 45 },
  { label: "46-53화", start: 46, end: 53 },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);

  const currentTab = TABS[activeTab];
  const episodeList = Array.from(
    { length: currentTab.end - currentTab.start + 1 },
    (_, i) => currentTab.start + i,
  );

  return (
    <>
      <section className="flex flex-col items-center gap-3 text-center">
        <a
          href="/poster.jpeg"
          target="_blank"
          rel="noopener noreferrer"
          title="포스터 원본 크게 보기"
          className="group relative block h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-rose-500/50 bg-neutral-900 shadow-lg shadow-rose-500/20 transition active:scale-95"
        >
          <Image
            src="/poster.jpeg"
            alt="드라마 포스터"
            fill
            priority
            className="object-cover transition duration-300 group-hover:scale-110"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            🔍
          </div>
        </a>

        <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-300/90">
          <span className="shrink-0 text-sm">⚠️</span>
          <div>
            <span className="font-semibold text-amber-200">
              스포일러 주의 안내:{" "}
            </span>
            5화 이후는 유료 회차입니다. 배려 넘치는 감상을 위해 과도한
            스포일러는 예고 없이 블라인드 처리될 수 있습니다.
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-white">
            &lt;비마이게스트&gt; 회차별 불판
          </h1>
          <p className="text-xs text-neutral-400">
            (총 {TOTAL_EPISODES}부작) 캡처 대신 텍스트로 달리는 실시간 감상존
          </p>
        </div>

        <a
          href="https://www.lezhinsnack.com/ko/viewer/BGuest/0"
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-rose-500 active:scale-95"
        >
          <span>레진에서 정주행하기</span>
          <span className="text-xs">↗</span>
        </a>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-neutral-300">
            회차 바로가기
          </h2>
          <span className="text-[11px] text-neutral-500">
            원하는 회차를 터치하세요
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 p-1">
          {TABS.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={`rounded-lg py-1.5 text-xs font-medium transition ${
                activeTab === idx
                  ? "bg-neutral-800 font-bold text-rose-400 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {episodeList.map((epNum) => (
            <Link
              key={epNum}
              href={`/episode/${epNum}`}
              className="group relative flex h-16 flex-col items-center justify-center rounded-xl border border-neutral-800/80 bg-neutral-900 transition hover:border-rose-500/50 active:scale-95"
            >
              <span className="font-mono text-[10px] text-neutral-500 group-hover:text-rose-400">
                EP
              </span>
              <span className="text-base font-bold text-neutral-200 group-hover:text-white">
                {epNum}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-3 border-t border-neutral-900 pt-6">
        <div className="flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-neutral-500">
            <Link2 size={12} />
            <span>레진스낵 공식 홍보 영상</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href="https://www.instagram.com/reel/DcQSTFAlP11"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-300 transition hover:border-rose-500/40 hover:bg-neutral-900"
          >
            <span className="text-[11px] font-medium">인스타 릴스 #1</span>
            <ExternalLink
              size={11}
              className="text-neutral-600 group-hover:text-neutral-400"
            />
          </a>

          <a
            href="https://www.instagram.com/reel/DcQZHBJDeeI"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-300 transition hover:border-rose-500/40 hover:bg-neutral-900"
          >
            <span className="text-[11px] font-medium">인스타 릴스 #2</span>
            <ExternalLink
              size={11}
              className="text-neutral-600 group-hover:text-neutral-400"
            />
          </a>

          <a
            href="https://www.youtube.com/shorts/5QmOG-lD4Is"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-300 transition hover:border-rose-500/40 hover:bg-neutral-900"
          >
            <span className="text-[11px] font-medium">유튜브 쇼츠 #1</span>
            <ExternalLink
              size={11}
              className="text-neutral-600 group-hover:text-neutral-400"
            />
          </a>

          <a
            href="https://www.youtube.com/shorts/vryl5YlAtIM"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-2.5 text-neutral-300 transition hover:border-rose-500/40 hover:bg-neutral-900"
          >
            <span className="text-[11px] font-medium">유튜브 쇼츠 #2</span>
            <ExternalLink
              size={11}
              className="text-neutral-600 group-hover:text-neutral-400"
            />
          </a>
        </div>
      </section>
    </>
  );
}
