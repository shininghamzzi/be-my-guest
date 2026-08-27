import Image from "next/image";
import { Play } from "lucide-react";
import type { ArchiveItem } from "./types";

interface ArchiveCardProps {
  item: ArchiveItem;
  onClick: () => void;
}

export function ShortCard({ item, onClick }: ArchiveCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group hover:border-primary/40 relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-neutral-400/80 bg-neutral-900 text-left transition hover:shadow-md active:scale-[0.98]"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-neutral-800">
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 448px) 50vw, 208px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
        <span className="absolute top-2 left-2 rounded-full bg-rose-600/90 px-2 py-0.5 text-[9px] font-semibold text-white shadow">
          {item.badge}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md transition-transform group-hover:scale-110 group-hover:bg-rose-600">
            <Play size={16} fill="currentColor" aria-hidden="true" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <h3 className="line-clamp-2 h-8 text-xs leading-snug font-bold text-white drop-shadow">
            {item.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-neutral-300">
            <span>쇼츠 보기</span>
            <span className="text-[9px]">▶</span>
          </p>
        </div>
      </div>
    </button>
  );
}

export function ArchiveCard({ item, onClick }: ArchiveCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group hover:border-primary/40 flex min-w-0 flex-col overflow-hidden rounded-xl border border-neutral-400/80 bg-white/45 text-left transition hover:bg-white/65 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-300">
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 448px) 50vw, 208px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute top-2 left-2 rounded-full bg-neutral-950/75 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
          {item.badge}
        </span>
        {item.type === "youtube_long" && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/15 transition group-hover:bg-neutral-950/25">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-transform group-hover:scale-110">
              <Play size={15} fill="currentColor" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-3">
        <div>
          <h3 className="group-hover:text-primary line-clamp-2 h-8 text-xs leading-snug font-bold text-neutral-950 transition">
            {item.title}
          </h3>
          {item.desc && (
            <p className="mt-1 line-clamp-2 h-7 text-[10px] leading-relaxed text-neutral-700">
              {item.desc}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-300/80 pt-2 text-[9px] text-neutral-600">
          <span className="truncate">
            {item.date ||
              (item.type === "youtube_long" ? "영상 시청" : "바로가기")}
          </span>
          <span className="text-primary ml-1 shrink-0 font-semibold transition-transform group-hover:translate-x-0.5">
            {item.type === "youtube_long" ? "재생하기 ▶" : "이동하기 ↗"}
          </span>
        </div>
      </div>
    </button>
  );
}
