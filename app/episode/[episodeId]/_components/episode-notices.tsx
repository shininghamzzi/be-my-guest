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
        <div className="flex items-center justify-between gap-2 rounded-xl border border-neutral-400 bg-neutral-200/90 px-3 py-2 text-xs text-neutral-900">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="bg-peach text-ink shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold">
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
            className="shrink-0 text-neutral-700 hover:text-neutral-900"
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
            <span className="font-semibold text-amber-900">
              스포일러 주의:{" "}
            </span>
            5화 이후는 유료 구간입니다. 스포가 될 수 있는 댓글은 스포 방지
            기능을 이용해주세요!
          </div>
        </div>
      )}
    </div>
  );
}
