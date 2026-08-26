import {
  Clock,
  Edit2,
  Eye,
  EyeOff,
  Heart,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Comment, FloatingHeart } from "./types";
import { formatCommentDate } from "./utils";

interface CommentsSectionProps {
  comments: Comment[];
  isLoading: boolean;
  sortBy: "latest" | "timeline";
  floatingHearts: FloatingHeart[];
  onSortChange: (sort: "latest" | "timeline") => void;
  onRefresh: () => void;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
  onHeart: (commentId: number) => void;
}

export function CommentsSection({
  comments,
  isLoading,
  sortBy,
  floatingHearts,
  onSortChange,
  onRefresh,
  onEdit,
  onDelete,
  onHeart,
}: CommentsSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1 text-xs text-neutral-800">
        <span className="flex items-center gap-1">
          <MessageSquare size={13} />
          댓글{" "}
          {isLoading ? (
            <span className="inline-block h-3 w-8 animate-pulse rounded bg-neutral-400" />
          ) : (
            `${comments.length}개`
          )}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-neutral-400 bg-neutral-200 p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => onSortChange("latest")}
              className={`rounded-md px-2 py-0.5 transition ${sortBy === "latest" ? "bg-neutral-400 font-bold text-rose-400" : "text-neutral-700 hover:text-neutral-900"}`}
            >
              최신순
            </button>
            <button
              type="button"
              onClick={() => onSortChange("timeline")}
              className={`rounded-md px-2 py-0.5 transition ${sortBy === "timeline" ? "bg-neutral-400 font-bold text-rose-400" : "text-neutral-700 hover:text-neutral-900"}`}
            >
              타임라인순 ⏱
            </button>
          </div>
          <button
            onClick={onRefresh}
            className="text-[11px] text-rose-400 hover:underline"
          >
            새로고침 ↻
          </button>
        </div>
      </div>
      <div className="space-y-2.5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse flex-col gap-2 rounded-xl border border-neutral-400/80 bg-neutral-200/40 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-20 rounded bg-neutral-400" />
                <div className="h-3.5 w-12 rounded bg-neutral-400" />
              </div>
              <div className="h-3 w-3/4 rounded bg-neutral-400/60" />
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-600">
            첫 번째 감상 댓글을 남겨보세요!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              floatingHearts={floatingHearts.filter(
                (heart) => heart.commentId === comment.id,
              )}
              onEdit={() => onEdit(comment)}
              onDelete={() => onDelete(comment)}
              onHeart={() => onHeart(comment.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

function CommentCard({
  comment,
  floatingHearts,
  onEdit,
  onDelete,
  onHeart,
}: {
  comment: Comment;
  floatingHearts: FloatingHeart[];
  onEdit: () => void;
  onDelete: () => void;
  onHeart: () => void;
}) {
  const [isSpoilerRevealed, setIsSpoilerRevealed] = useState(false);
  const isSpoilerHidden = comment.is_spoiler && !isSpoilerRevealed;

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-400/80 bg-neutral-200/60 p-3">
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-neutral-900">
            {comment.nickname}
          </span>
          {comment.timestamp_tag && (
            <span className="inline-flex items-center gap-0.5 rounded bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] text-rose-400">
              <Clock size={10} />
              {comment.timestamp_tag}
            </span>
          )}
          {comment.is_spoiler && (
            <span className="inline-flex items-center gap-0.5 rounded bg-amber-400/10 px-1.5 py-0.5 text-[10px] text-amber-300">
              <EyeOff size={10} />
              스포일러
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-700">
            {formatCommentDate(comment.created_at)}
          </span>
          {!comment.is_hidden && (
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="text-neutral-700 transition hover:text-rose-400"
                title="수정"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={onDelete}
                className="text-neutral-700 transition hover:text-rose-400"
                title="삭제"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
      {comment.is_hidden ? (
        <p className="text-xs text-neutral-600 italic">
          [관리자에 의해 가려진 댓글입니다]
        </p>
      ) : (
        <>
          {isSpoilerHidden ? (
            <button
              type="button"
              onClick={() => setIsSpoilerRevealed(true)}
              className="flex min-h-20 w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-amber-400/25 bg-amber-400/5 px-3 py-4 text-xs text-amber-200 transition hover:border-amber-400/50 hover:bg-amber-400/10"
              aria-label="스포일러 댓글 내용 보기"
            >
              <Eye size={15} />
              <span className="font-medium">스포일러가 포함된 댓글입니다</span>
              <span className="text-[10px] text-amber-200/65">
                클릭해서 보기
              </span>
            </button>
          ) : (
            <>
              {comment.content && (
                <p className="text-xs leading-relaxed whitespace-pre-wrap text-neutral-950">
                  {comment.content}
                </p>
              )}
              {comment.gif_url && (
                <div className="pt-1">
                  <img
                    src={comment.gif_url}
                    alt="첨부된 GIF"
                    loading="lazy"
                    className="max-h-48 max-w-[240px] rounded-lg border border-neutral-400 object-cover"
                  />
                </div>
              )}
            </>
          )}
          <div className="flex justify-end pt-1">
            <div className="relative inline-flex items-center">
              {floatingHearts.map((heart) => (
                <span
                  key={heart.id}
                  className="animate-heart-pop pointer-events-none absolute -top-1 left-1.5 text-xs select-none"
                >
                  ❤️
                </span>
              ))}
              <button
                type="button"
                onClick={onHeart}
                className="group flex items-center gap-1.5 rounded-full border border-neutral-400 bg-neutral-100/70 px-2.5 py-1 text-[11px] font-medium text-neutral-800 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 active:scale-95"
                title="공감 연타하기"
              >
                <Heart
                  size={12}
                  className={`transition group-hover:scale-110 ${comment.heart_count ? "fill-rose-500 text-rose-500" : "text-neutral-800 group-hover:text-rose-400"}`}
                />
                <span>{comment.heart_count || 0}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
