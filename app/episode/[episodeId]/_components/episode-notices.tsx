import { ShieldAlert, X } from "lucide-react";

export function EpisodeNotices({
  currentEpisodeId,
  showBanner,
  onCloseBanner,
}: {
  currentEpisodeId: number;
  showBanner: boolean;
  onCloseBanner: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {showBanner && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-neutral-800 bg-neutral-900/90 px-3 py-2 text-xs text-neutral-300">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="shrink-0 rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-400">
              NEW
            </span>
            <span className="truncate">
              하트 연타(최대 10개) 기능 추가! <br />
              마음에 드는 댓글에 하트를 보내보세요 💙
            </span>
          </div>
          <button
            type="button"
            onClick={onCloseBanner}
            className="shrink-0 text-neutral-500 hover:text-white"
            title="닫기"
          >
            <X size={13} />
          </button>
        </div>
      )}
      {currentEpisodeId > 5 && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-amber-200">
              스포일러 주의:{" "}
            </span>
            5화 이후는 유료 구간입니다. 내용 누설 댓글은 블라인드 처리될 수
            있습니다.
          </div>
        </div>
      )}
    </div>
  );
}
