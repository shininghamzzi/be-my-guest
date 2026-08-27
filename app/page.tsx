"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const TOTAL_EPISODES = 53;
const TABS = [
  { label: "1-15화", start: 1, end: 15 },
  { label: "16-30화", start: 16, end: 30 },
  { label: "31-45화", start: 31, end: 45 },
  { label: "46-53화", start: 46, end: 53 },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [visitedList, setVisitedList] = useState<number[]>([]);

  useEffect(() => {
    try {
      const visited = JSON.parse(
        localStorage.getItem("bemyguest_visited") || "[]",
      );
      if (Array.isArray(visited)) {
        setVisitedList(visited);
      }
    } catch {}
  }, []);

  const currentTab = TABS[activeTab];
  const episodeList = Array.from(
    { length: currentTab.end - currentTab.start + 1 },
    (_, i) => currentTab.start + i,
  );

  return (
    <>
      <section className="flex flex-col items-center gap-2.5 pt-8 text-center">
        <div className="group relative block aspect-[2172/724] w-full max-w-[320px]">
          <Image
            src="/logo.png"
            alt="비마이게스트 로고"
            fill
            priority
            className="object-contain"
          />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-gray-700">
            회차별 불판
          </h1>
          <p className="text-xs text-neutral-800">
            (총 {TOTAL_EPISODES}부작) 텍스트로 달리는 실시간 감상존
          </p>
        </div>

        <a
          href="https://www.lezhinsnack.com/ko/viewer/BGuest/0"
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-rose-500 active:scale-95"
        >
          <span>레진스낵에서 정주행하기</span>
          <span className="text-xs">↗</span>
        </a>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-neutral-900">
            회차 바로가기
          </h2>
          <span className="text-[11px] text-neutral-700">
            원하는 회차를 터치하세요
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-neutral-400 bg-neutral-200/80 p-1">
          {TABS.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={`rounded-lg py-1.5 text-xs font-medium transition ${
                activeTab === idx
                  ? "bg-peach text-ink font-bold"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {episodeList.map((epNum) => {
            const isVisited = visitedList.includes(epNum);
            return (
              <Link
                key={epNum}
                href={`/episode/${epNum}`}
                className={`group flex h-16 flex-col items-center justify-center rounded-xl border transition active:scale-95 ${
                  isVisited
                    ? "border-primary/40 bg-primary/20 hover:border-primary/60"
                    : "hover:border-primary/40 border-neutral-400/80 bg-white/40"
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    isVisited
                      ? "text-primary/80"
                      : "group-hover:text-primary text-neutral-600"
                  }`}
                >
                  EP
                </span>
                <span
                  className={`text-base font-bold ${
                    isVisited
                      ? "text-primary"
                      : "group-hover:text-primary text-neutral-600"
                  }`}
                >
                  {epNum}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
