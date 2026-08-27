import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface EpisodeNavigationProps {
  episodeId: string;
  previousEpisodeId: number | null;
  nextEpisodeId: number | null;
}

export function EpisodeHeader({
  episodeId,
  previousEpisodeId,
  nextEpisodeId,
}: EpisodeNavigationProps) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-400/80 pb-3">
      <Link
        href="/"
        className="hover:text-primary flex items-center gap-1 text-xs text-neutral-800 transition"
      >
        <ChevronLeft size={16} />
        <span>회차 목록</span>
      </Link>
      <div className="flex items-center gap-2">
        {previousEpisodeId ? (
          <Link
            href={`/episode/${previousEpisodeId}`}
            className="hover:bg-peach hover:text-primary rounded p-1 text-neutral-800 transition"
            title="이전 회차"
          >
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <div className="w-6" />
        )}
        <h1 className="text-base font-bold text-rose-400">
          EP.{episodeId.padStart(2, "0")} 불판
        </h1>
        {nextEpisodeId ? (
          <Link
            href={`/episode/${nextEpisodeId}`}
            className="hover:bg-peach hover:text-primary rounded p-1 text-neutral-800 transition"
            title="다음 회차"
          >
            <ChevronRight size={16} />
          </Link>
        ) : (
          <div className="w-6" />
        )}
      </div>
      <a
        href={`https://www.lezhinsnack.com/ko/viewer/BGuest/${episodeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md bg-rose-200 px-2 py-1 text-xs text-gray-700 transition hover:bg-rose-500 hover:text-white active:scale-95"
      >
        <span>본편 보기</span>
        <ExternalLink size={13} aria-hidden="true" />
      </a>
    </header>
  );
}

export function EpisodeFooter({
  previousEpisodeId,
  nextEpisodeId,
}: Omit<EpisodeNavigationProps, "episodeId">) {
  return (
    <div className="grid grid-cols-2 gap-2 pt-2">
      {previousEpisodeId ? (
        <Link
          href={`/episode/${previousEpisodeId}`}
          className="hover:bg-peach flex items-center justify-center gap-1 rounded-xl border border-neutral-400 bg-neutral-200/80 py-3 text-xs font-medium text-neutral-900 transition"
        >
          <ChevronLeft size={14} />
          <span>EP.{String(previousEpisodeId).padStart(2, "0")} 이전화</span>
        </Link>
      ) : (
        <div />
      )}
      {nextEpisodeId ? (
        <Link
          href={`/episode/${nextEpisodeId}`}
          className="text-primary flex items-center justify-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-semibold transition hover:bg-rose-500/20"
        >
          <span>EP.{String(nextEpisodeId).padStart(2, "0")} 다음화</span>
          <ChevronRight size={14} />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
