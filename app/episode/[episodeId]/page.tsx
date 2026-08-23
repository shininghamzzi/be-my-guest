"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  Clock,
  ShieldAlert,
  Edit2,
  Trash2,
  X,
  Check,
} from "lucide-react";

interface Comment {
  id: number;
  episode_id: number;
  nickname: string;
  content: string;
  timestamp_tag: string | null;
  is_hidden: boolean;
  created_at: string;
}

const TOTAL_EPISODES = 53;

const parseTimeToSeconds = (timeStr: string | null): number | null => {
  if (!timeStr) return null;
  const clean = timeStr.trim();

  const mmssMatch = clean.match(/^(\d{1,2}):([0-5]\d)$/);
  if (mmssMatch) {
    const mins = Number(mmssMatch[1]);
    const secs = Number(mmssMatch[2]);
    const total = mins * 60 + secs;
    return total <= 600 ? total : null;
  }

  if (/^\d{1,3}$/.test(clean)) {
    const total = Number(clean);
    return total <= 600 ? total : null;
  }

  return null;
};

const formatCommentDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function EpisodePage({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = use(params);
  const currentEpisodeId = Number(episodeId);

  const prevEpisodeId = currentEpisodeId > 1 ? currentEpisodeId - 1 : null;
  const nextEpisodeId =
    currentEpisodeId < TOTAL_EPISODES ? currentEpisodeId + 1 : null;

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [timestampTag, setTimestampTag] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "timeline">("latest");
  const [botTrap, setBotTrap] = useState("");

  const [modalComment, setModalComment] = useState<Comment | null>(null);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [modalPassword, setModalPassword] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTimestampTag, setEditTimestampTag] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedNickname = localStorage.getItem("bemyguest_nickname");
    const savedPassword = localStorage.getItem("bemyguest_password");
    if (savedNickname) setNickname(savedNickname);
    if (savedPassword) setPassword(savedPassword);

    try {
      const visited = JSON.parse(
        localStorage.getItem("bemyguest_visited") || "[]",
      );
      if (Array.isArray(visited) && !visited.includes(currentEpisodeId)) {
        localStorage.setItem(
          "bemyguest_visited",
          JSON.stringify([...visited, currentEpisodeId]),
        );
      }
    } catch {}
  }, [currentEpisodeId]);

  const fetchComments = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("episode_id", episodeId)
      .order("created_at", { ascending: false });

    if (data) setComments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [episodeId]);

  const handleTimestampInput = (val: string, setter: (v: string) => void) => {
    const digits = val.replace(/[^0-9]/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setter(`${digits.slice(0, digits.length - 2)}:${digits.slice(-2)}`);
    } else {
      setter(digits);
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "timeline") {
      const timeA = parseTimeToSeconds(a.timestamp_tag);
      const timeB = parseTimeToSeconds(b.timestamp_tag);
      if (timeA === null && timeB === null) return 0;
      if (timeA === null) return 1;
      if (timeB === null) return -1;
      return timeA - timeB;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (botTrap) return;

    if (/https?:\/\/|www\./i.test(content)) {
      alert("링크(URL)는 등록할 수 없습니다.");
      return;
    }

    if (!nickname.trim() || !password.trim() || !content.trim()) {
      alert("닉네임, 비밀번호, 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("comments").insert([
      {
        episode_id: currentEpisodeId,
        nickname: nickname.trim(),
        password: password.trim(),
        timestamp_tag: timestampTag.trim() || null,
        content: content.trim(),
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      alert("댓글 등록에 실패했습니다.");
    } else {
      localStorage.setItem("bemyguest_nickname", nickname.trim());
      localStorage.setItem("bemyguest_password", password.trim());

      setContent("");
      setTimestampTag("");
      fetchComments();
    }
  };

  const openModal = (comment: Comment, type: "edit" | "delete") => {
    setModalComment(comment);
    setModalType(type);
    setModalPassword(localStorage.getItem("bemyguest_password") || "");
    if (type === "edit") {
      setEditContent(comment.content);
      setEditTimestampTag(comment.timestamp_tag || "");
    }
  };

  const closeModal = () => {
    setModalComment(null);
    setModalType(null);
    setModalPassword("");
    setEditContent("");
    setEditTimestampTag("");
  };

  const handleEditSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!modalComment) return;
    if (!modalPassword.trim()) {
      alert("비밀번호 4자리를 입력해주세요.");
      return;
    }
    if (!editContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setIsProcessing(true);

    const { data: checkData, error: checkError } = await supabase
      .from("comments")
      .select("id")
      .eq("id", modalComment.id)
      .eq("password", modalPassword.trim());

    if (checkError || !checkData || checkData.length === 0) {
      alert("비밀번호가 일치하지 않습니다.");
      setIsProcessing(false);
      return;
    }

    const { error } = await supabase
      .from("comments")
      .update({
        content: editContent.trim(),
        timestamp_tag: editTimestampTag.trim() || null,
      })
      .eq("id", modalComment.id);

    setIsProcessing(false);

    if (error) {
      alert("수정 중 오류가 발생했습니다.");
    } else {
      alert("댓글이 수정되었습니다.");
      closeModal();
      fetchComments();
    }
  };

  const handleDeleteSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!modalComment) return;
    if (!modalPassword.trim()) {
      alert("비밀번호 4자리를 입력해주세요.");
      return;
    }

    setIsProcessing(true);

    const { data: checkData, error: checkError } = await supabase
      .from("comments")
      .select("id")
      .eq("id", modalComment.id)
      .eq("password", modalPassword.trim());

    if (checkError || !checkData || checkData.length === 0) {
      alert("비밀번호가 일치하지 않습니다.");
      setIsProcessing(false);
      return;
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", modalComment.id);

    setIsProcessing(false);

    if (error) {
      alert("삭제 중 오류가 발생했습니다.");
    } else {
      alert("댓글이 삭제되었습니다.");
      closeModal();
      fetchComments();
    }
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs text-neutral-400 transition hover:text-white"
        >
          <ChevronLeft size={16} />
          <span>회차 목록</span>
        </Link>

        <div className="flex items-center gap-2">
          {prevEpisodeId ? (
            <Link
              href={`/episode/${prevEpisodeId}`}
              className="rounded p-1 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
              title="이전 회차"
            >
              <ChevronLeft size={16} />
            </Link>
          ) : (
            <div className="w-6" />
          )}

          <h1 className="text-base font-bold text-rose-400">
            EP.{String(episodeId).padStart(2, "0")} 불판
          </h1>

          {nextEpisodeId ? (
            <Link
              href={`/episode/${nextEpisodeId}`}
              className="rounded p-1 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
              title="다음 회차"
            >
              <ChevronRight size={16} />
            </Link>
          ) : (
            <div className="w-6" />
          )}
        </div>

        <div className="w-14" />
      </header>

      <div className="flex flex-col gap-2">
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs text-rose-300">
          ✨ 게스트하우스 '느루' 연준이(이태빈) 비주얼 & 연기 주접 대환영 🐹
        </div>

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

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900 p-3.5"
      >
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={botTrap}
            onChange={(e) => setBotTrap(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <input
            type="text"
            placeholder="익명 닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={15}
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-rose-500/50 focus:outline-none"
          />
          <input
            type="password"
            placeholder="비번(4자리)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={4}
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-rose-500/50 focus:outline-none"
          />
          <input
            type="text"
            placeholder="01:23 (선택)"
            value={timestampTag}
            onChange={(e) =>
              handleTimestampInput(e.target.value, setTimestampTag)
            }
            maxLength={5}
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 font-mono text-xs text-neutral-300 placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none"
          />
        </div>

        <textarea
          placeholder="감상을 남겨주세요! (타임라인 환영)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 self-end rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:bg-neutral-800"
        >
          <Send size={12} />
          <span>{isSubmitting ? "등록 중..." : "감상 남기기"}</span>
        </button>
      </form>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <MessageSquare size={13} />
            댓글{" "}
            {isLoading ? (
              <span className="inline-block h-3 w-8 animate-pulse rounded bg-neutral-800" />
            ) : (
              `${comments.length}개`
            )}
          </span>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setSortBy("latest")}
                className={`rounded-md px-2 py-0.5 transition ${
                  sortBy === "latest"
                    ? "bg-neutral-800 font-bold text-rose-400"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                최신순
              </button>
              <button
                type="button"
                onClick={() => setSortBy("timeline")}
                className={`rounded-md px-2 py-0.5 transition ${
                  sortBy === "timeline"
                    ? "bg-neutral-800 font-bold text-rose-400"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                타임라인순 ⏱
              </button>
            </div>

            <button
              onClick={fetchComments}
              className="text-[11px] text-rose-400 hover:underline"
            >
              새로고침 ↻
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse flex-col gap-2 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-20 rounded bg-neutral-800" />
                  <div className="h-3.5 w-12 rounded bg-neutral-800" />
                </div>
                <div className="h-3 w-3/4 rounded bg-neutral-800/60" />
              </div>
            ))
          ) : sortedComments.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-600">
              첫 번째 감상 댓글을 남겨보세요!
            </div>
          ) : (
            sortedComments.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-1.5 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-neutral-300">
                      {c.nickname}
                    </span>
                    {c.timestamp_tag && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] text-rose-400">
                        <Clock size={10} />
                        {c.timestamp_tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500">
                      {formatCommentDate(c.created_at)}
                    </span>
                    {!c.is_hidden && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(c, "edit")}
                          className="text-neutral-500 transition hover:text-rose-400"
                          title="수정"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => openModal(c, "delete")}
                          className="text-neutral-500 transition hover:text-rose-400"
                          title="삭제"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {c.is_hidden ? (
                  <p className="text-xs text-neutral-600 italic">
                    [관리자에 의해 가려진 댓글입니다]
                  </p>
                ) : (
                  <p className="text-xs leading-relaxed whitespace-pre-wrap text-neutral-200">
                    {c.content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2 pt-2">
        {prevEpisodeId ? (
          <Link
            href={`/episode/${prevEpisodeId}`}
            className="flex items-center justify-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900/80 py-3 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800"
          >
            <ChevronLeft size={14} />
            <span>EP.{String(prevEpisodeId).padStart(2, "0")} 이전화</span>
          </Link>
        ) : (
          <div />
        )}

        {nextEpisodeId ? (
          <Link
            href={`/episode/${nextEpisodeId}`}
            className="flex items-center justify-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
          >
            <span>EP.{String(nextEpisodeId).padStart(2, "0")} 다음화</span>
            <ChevronRight size={14} />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {modalType && modalComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="text-xs font-bold text-neutral-200">
                {modalType === "edit" ? "댓글 수정" : "댓글 삭제"}
              </h3>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {modalType === "delete" ? (
              <form
                onSubmit={handleDeleteSubmit}
                className="flex flex-col gap-3"
              >
                <p className="text-xs text-neutral-400">
                  댓글 등록 시 입력한{" "}
                  <strong className="text-rose-400">비밀번호 4자리</strong>를
                  입력해주세요.
                </p>
                <input
                  type="password"
                  placeholder="비밀번호 4자리"
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  maxLength={4}
                  required
                  autoFocus
                  className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-rose-500/50 focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs text-neutral-400 hover:bg-neutral-700"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:bg-neutral-800"
                  >
                    {isProcessing ? "삭제 중..." : "삭제하기"}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleEditSubmit}
                className="flex flex-col gap-2.5"
              >
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="password"
                    placeholder="비번(4자리)"
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                    maxLength={4}
                    required
                    autoFocus
                    className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-rose-500/50 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="01:23 (선택)"
                    value={editTimestampTag}
                    onChange={(e) =>
                      handleTimestampInput(e.target.value, setEditTimestampTag)
                    }
                    maxLength={5}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 font-mono text-xs text-neutral-300 placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none"
                  />
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  required
                  className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white focus:border-rose-500/50 focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs text-neutral-400 hover:bg-neutral-700"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:bg-neutral-800"
                  >
                    <Check size={12} />
                    <span>{isProcessing ? "저장 중..." : "수정 완료"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
