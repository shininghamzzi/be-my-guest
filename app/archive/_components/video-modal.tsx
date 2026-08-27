import { X } from "lucide-react";
import type { ActiveVideo } from "./types";

interface VideoModalProps {
  video: ActiveVideo;
  onClose: () => void;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="유튜브 영상"
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-black shadow-2xl ${
          video.isShort
            ? "aspect-[9/16] w-full max-w-[360px]"
            : "aspect-video w-full max-w-3xl"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="영상 닫기"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/90"
        >
          <X size={16} aria-hidden="true" />
        </button>
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
