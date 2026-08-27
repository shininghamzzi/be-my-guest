"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ARCHIVE_DATA } from "./archive-data";
import { ArchiveCard, ShortCard } from "./archive-cards";
import type { ActiveVideo, ArchiveItem } from "./types";
import { formatArchiveItem, isYouTubeItem } from "./utils";
import { VideoModal } from "./video-modal";

export function ArchiveContent() {
  const [items, setItems] = useState<ArchiveItem[]>(() =>
    ARCHIVE_DATA.map(formatArchiveItem),
  );
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);

  useEffect(() => {
    async function fetchYouTubeTitles() {
      const updatedItems = await Promise.all(
        ARCHIVE_DATA.map(async (item) => {
          const formattedItem = formatArchiveItem(item);

          if (item.title || !isYouTubeItem(item) || !formattedItem.youtubeId) {
            return formattedItem;
          }

          try {
            const watchUrl = `https://www.youtube.com/watch?v=${formattedItem.youtubeId}`;
            const response = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
            );

            if (response.ok) {
              const data: { title?: string } = await response.json();
              return {
                ...formattedItem,
                title: data.title || "비마이게스트 영상",
              };
            }
          } catch {
            // 네트워크 오류 시 아래 기본 제목을 사용한다.
          }

          return { ...formattedItem, title: "비마이게스트 영상" };
        }),
      );

      setItems(updatedItems);
    }

    void fetchYouTubeTitles();
  }, []);

  const handleCardClick = (item: ArchiveItem) => {
    if (isYouTubeItem(item) && item.youtubeId) {
      setActiveVideo({
        id: item.youtubeId,
        isShort: item.type === "youtube_short",
      });
      return;
    }

    window.open(item.url, "_blank", "noopener,noreferrer");
  };

  const shortItems = items.filter((item) => item.type === "youtube_short");
  const dramaMediaItems = items.filter(
    (item) => item.category === "drama" && item.type !== "youtube_short",
  );
  const actorItems = items.filter((item) => item.category === "actor");

  return (
    <>
      <ArchiveHeader />

      <main className="space-y-8 pt-6">
        <section className="space-y-1 text-center">
          <p className="text-primary font-mono text-[10px] font-semibold tracking-[0.18em]">
            BE MY GUEST COLLECTION
          </p>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">
            비마이게스트 아카이브
          </h2>
          <p className="text-xs text-neutral-700">
            드라마 공식 미디어 &amp; 이태빈 배우 소식 모음
          </p>
        </section>

        {shortItems.length > 0 && (
          <ArchiveSection title="공식 숏폼 & 예고편" label="SHORTS / REELS">
            {shortItems.map((item) => (
              <ShortCard
                key={item.id}
                item={item}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </ArchiveSection>
        )}

        <ArchiveSection title="드라마 공식 미디어" label="OFFICIAL & NEWS">
          {dramaMediaItems.map((item) => (
            <ArchiveCard
              key={item.id}
              item={item}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </ArchiveSection>

        <ArchiveSection title="배우 이태빈" label="ACTOR & BEHIND">
          {actorItems.map((item) => (
            <ArchiveCard
              key={item.id}
              item={item}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </ArchiveSection>
      </main>

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}

function ArchiveHeader() {
  return (
    <header className="sticky top-0 z-30 -mx-4 -mt-8 border-b border-neutral-400/60 bg-neutral-200/65 px-4 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="text-primary inline-flex items-center gap-1 text-xs font-semibold transition hover:text-rose-600"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>불판으로</span>
        </Link>
        <h1 className="text-sm font-bold tracking-tight text-neutral-950">
          비마이게스트 <span className="text-primary">ARCHIVE</span>
        </h1>
        <a
          href="https://www.lezhinsnack.com/ko/viewer/BGuest/0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-rose-500 active:scale-95"
        >
          <span>본편 보기</span>
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}

function ArchiveSection({
  title,
  label,
  children,
}: {
  title: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="border-primary/20 flex items-end justify-between border-b px-1 pb-2">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
        <span className="font-mono text-[10px] text-neutral-600">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">{children}</div>
    </section>
  );
}
