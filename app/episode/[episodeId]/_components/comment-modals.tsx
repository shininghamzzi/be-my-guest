import { Check, Search, X } from "lucide-react";
import type { Comment, CommentModalType, GiphyItem } from "./types";

export function GifModal({
  isOpen,
  query,
  gifs,
  isLoading,
  onClose,
  onQueryChange,
  onSearch,
  onSelect,
}: {
  isOpen: boolean;
  query: string;
  gifs: GiphyItem[];
  isLoading: boolean;
  onClose: () => void;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onSelect: (url: string) => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="flex h-[420px] w-full max-w-sm flex-col rounded-2xl border border-neutral-400 bg-neutral-200 p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between border-b border-neutral-400 pb-2">
          <h3 className="text-xs font-bold text-neutral-950">GIF 검색</h3>
          <button
            onClick={onClose}
            className="text-neutral-800 hover:text-neutral-900"
          >
            <X size={14} />
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
          className="relative mb-3"
        >
          <input
            type="text"
            placeholder="검색어 입력 (예: 햄스터, 눈물, 환호)"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            autoFocus
            className="w-full rounded-lg border border-neutral-400 bg-neutral-100 py-1.5 pr-8 pl-2.5 text-xs text-neutral-900 placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-neutral-800 hover:text-rose-400"
          >
            <Search size={13} />
          </button>
        </form>
        <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-lg bg-neutral-400"
              />
            ))
          ) : gifs.length === 0 ? (
            <div className="col-span-2 flex h-full items-center justify-center text-xs text-neutral-600">
              검색 결과가 없습니다.
            </div>
          ) : (
            gifs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.images.fixed_height.url)}
                className="group relative h-24 w-full overflow-hidden rounded-lg border border-neutral-400 transition hover:border-rose-500/50"
              >
                <img
                  src={item.images.fixed_height.url}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface CommentModalProps {
  type: CommentModalType | null;
  comment: Comment | null;
  password: string;
  content: string;
  timestampTag: string;
  gifUrl: string | null;
  isProcessing: boolean;
  onClose: () => void;
  onPasswordChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onTimestampChange: (value: string) => void;
  onRemoveGif: () => void;
  onSubmit: (event: React.SubmitEvent) => void;
}

export function CommentModal(props: CommentModalProps) {
  if (!props.type || !props.comment) return null;
  const isDelete = props.type === "delete";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xs rounded-2xl border border-neutral-400 bg-neutral-200 p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between border-b border-neutral-400 pb-2">
          <h3 className="text-xs font-bold text-neutral-950">
            {isDelete ? "댓글 삭제" : "댓글 수정"}
          </h3>
          <button
            onClick={props.onClose}
            className="text-neutral-800 hover:text-neutral-900"
          >
            <X size={14} />
          </button>
        </div>
        {isDelete ? (
          <form onSubmit={props.onSubmit} className="flex flex-col gap-3">
            <p className="text-xs text-neutral-800">
              댓글 등록 시 입력한{" "}
              <strong className="text-rose-400">비밀번호 4자리</strong>를
              입력해주세요.
            </p>
            <PasswordInput
              value={props.password}
              onChange={props.onPasswordChange}
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-1">
              <CancelButton onClick={props.onClose} />
              <button
                type="submit"
                disabled={props.isProcessing}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-rose-500 disabled:bg-neutral-400"
              >
                {props.isProcessing ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={props.onSubmit} className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <PasswordInput
                value={props.password}
                onChange={props.onPasswordChange}
                autoFocus
              />
              <input
                type="text"
                placeholder="01:23 (선택)"
                value={props.timestampTag}
                onChange={(event) =>
                  props.onTimestampChange(event.target.value)
                }
                maxLength={5}
                className="rounded-lg border border-neutral-400 bg-neutral-100 px-2.5 py-1.5 font-mono text-xs text-neutral-900 placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none"
              />
            </div>
            <textarea
              value={props.content}
              onChange={(event) => props.onContentChange(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-400 bg-neutral-100 p-2.5 text-xs text-neutral-900 focus:border-rose-500/50 focus:outline-none"
            />
            {props.gifUrl && (
              <div className="relative inline-block self-start">
                <img
                  src={props.gifUrl}
                  alt="첨부된 GIF"
                  className="h-20 rounded-lg border border-neutral-500 object-cover"
                />
                <button
                  type="button"
                  onClick={props.onRemoveGif}
                  className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-neutral-500 bg-neutral-200 text-neutral-900 hover:text-neutral-900"
                >
                  <X size={9} />
                </button>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <CancelButton onClick={props.onClose} />
              <button
                type="submit"
                disabled={props.isProcessing}
                className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-rose-500 disabled:bg-neutral-400"
              >
                <Check size={12} />
                <span>{props.isProcessing ? "저장 중..." : "수정 완료"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <input
      type="password"
      placeholder="비번(4자리)"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      maxLength={4}
      required
      autoFocus={autoFocus}
      className="rounded-lg border border-neutral-400 bg-neutral-100 px-2.5 py-1.5 text-xs text-neutral-900 focus:border-rose-500/50 focus:outline-none"
    />
  );
}
function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-neutral-400 px-3 py-1.5 text-xs text-neutral-800 hover:bg-neutral-500"
    >
      취소
    </button>
  );
}
