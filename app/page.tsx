"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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
      <section className="flex flex-col items-center gap-3 pt-10 text-center">
        <div className="group relative block h-30 w-120 overflow-hidden">
          <Image
            src="/logo.png"
            alt="비마이게스트 로고"
            fill
            priority
            className="object-contain"
          />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-white">
            회차별 불판
          </h1>
          <p className="text-xs text-neutral-400">
            (총 {TOTAL_EPISODES}부작) 텍스트로 달리는 실시간 감상존
          </p>
        </div>
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
                  ? "bg-lavender/65 text-ink font-bold shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
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
                    ? "border-mint/60 bg-mint/20 hover:border-mint"
                    : "hover:border-accent/60 border-neutral-800/80 bg-neutral-900"
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    isVisited
                      ? "text-primary/80"
                      : "group-hover:text-accent text-neutral-500"
                  }`}
                >
                  EP
                </span>
                <span
                  className={`text-base font-bold ${
                    isVisited
                      ? "text-primary"
                      : "group-hover:text-accent text-neutral-200"
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
