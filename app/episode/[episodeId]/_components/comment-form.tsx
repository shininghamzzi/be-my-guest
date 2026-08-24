import { Film, Send, X } from "lucide-react";

interface CommentFormProps {
  nickname: string;
  password: string;
  timestampTag: string;
  content: string;
  selectedGif: string | null;
  botTrap: string;
  isSubmitting: boolean;
  onNicknameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTimestampChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onBotTrapChange: (value: string) => void;
  onRemoveGif: () => void;
  onOpenGifModal: () => void;
  onSubmit: (event: React.SubmitEvent) => void;
}

export function CommentForm(props: CommentFormProps) {
  return (
    <form
      onSubmit={props.onSubmit}
      className="flex flex-col gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900 p-3.5"
    >
      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          value={props.botTrap}
          onChange={(event) => props.onBotTrapChange(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="익명 닉네임"
          value={props.nickname}
          onChange={(event) => props.onNicknameChange(event.target.value)}
          maxLength={15}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-rose-500/50 focus:outline-none"
        />
        <input
          type="password"
          placeholder="비번(4자리)"
          value={props.password}
          onChange={(event) => props.onPasswordChange(event.target.value)}
          maxLength={4}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-rose-500/50 focus:outline-none"
        />
        <input
          type="text"
          placeholder="01:23 (선택)"
          value={props.timestampTag}
          onChange={(event) => props.onTimestampChange(event.target.value)}
          maxLength={5}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 font-mono text-xs text-neutral-300 placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none"
        />
      </div>
      <textarea
        placeholder="감상을 남겨주세요! 연준이(이태빈) 비주얼 & 연기 주접 대환영!"
        value={props.content}
        onChange={(event) => props.onContentChange(event.target.value)}
        rows={3}
        className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none"
      />
      {props.selectedGif && (
        <div className="relative inline-block self-start">
          <img
            src={props.selectedGif}
            alt="선택된 GIF"
            className="h-24 rounded-lg border border-neutral-700 object-cover"
          />
          <button
            type="button"
            onClick={props.onRemoveGif}
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white"
          >
            <X size={10} />
          </button>
        </div>
      )}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={props.onOpenGifModal}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs font-semibold text-neutral-300 transition hover:border-neutral-700 hover:text-white"
        >
          <Film size={13} className="text-rose-400" />
          <span>GIF 첨부</span>
        </button>
        <button
          type="submit"
          disabled={props.isSubmitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:bg-neutral-800"
        >
          <Send size={12} />
          <span>{props.isSubmitting ? "등록 중..." : "감상 남기기"}</span>
        </button>
      </div>
    </form>
  );
}
