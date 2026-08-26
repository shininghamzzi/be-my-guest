"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { use, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CommentForm } from "./_components/comment-form";
import { CommentModal, GifModal } from "./_components/comment-modals";
import { CommentsSection } from "./_components/comments-section";
import { EpisodeFooter, EpisodeHeader } from "./_components/episode-navigation";
import { EpisodeNotices } from "./_components/episode-notices";
import type {
  Comment,
  CommentModalType,
  FloatingHeart,
  GiphyItem,
} from "./_components/types";
import { parseTimeToSeconds } from "./_components/utils";

const TOTAL_EPISODES = 53;
const MAX_HEARTS_PER_COMMENT = 10;
const BANNER_STORAGE_KEY = "bemyguest_hide_banner_v1";
const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || "";

export default function EpisodePage({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = use(params);
  const currentEpisodeId = Number(episodeId);
  const previousEpisodeId = currentEpisodeId > 1 ? currentEpisodeId - 1 : null;
  const nextEpisodeId =
    currentEpisodeId < TOTAL_EPISODES ? currentEpisodeId + 1 : null;
  const [comments, setComments] = useState<Comment[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [timestampTag, setTimestampTag] = useState("");
  const [content, setContent] = useState("");
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "timeline">("latest");
  const [botTrap, setBotTrap] = useState("");
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState("");
  const [gifList, setGifList] = useState<GiphyItem[]>([]);
  const [isGifLoading, setIsGifLoading] = useState(false);
  const [modalComment, setModalComment] = useState<Comment | null>(null);
  const [modalType, setModalType] = useState<CommentModalType | null>(null);
  const [modalPassword, setModalPassword] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTimestampTag, setEditTimestampTag] = useState("");
  const [editGifUrl, setEditGifUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // localStorage hydration intentionally happens once per episode navigation.
  useEffect(() => {
    const savedNickname = localStorage.getItem("bemyguest_nickname");
    const savedPassword = localStorage.getItem("bemyguest_password");
    if (savedNickname) setNickname(savedNickname);
    if (savedPassword) setPassword(savedPassword);
    if (!localStorage.getItem(BANNER_STORAGE_KEY)) setShowBanner(true);
    try {
      const visited = JSON.parse(
        localStorage.getItem("bemyguest_visited") || "[]",
      );
      if (Array.isArray(visited) && !visited.includes(currentEpisodeId))
        localStorage.setItem(
          "bemyguest_visited",
          JSON.stringify([...visited, currentEpisodeId]),
        );
    } catch {}
  }, [currentEpisodeId]);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("episode_id", episodeId)
      .order("created_at", { ascending: false });
    if (data) setComments(data);
    setIsLoading(false);
  }, [episodeId]);
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(
      () =>
        setToastMessage((previous) => (previous === message ? null : previous)),
      2500,
    );
  };
  const handleHeartClick = async (commentId: number) => {
    let heartCounts: Record<string, number> = {};
    try {
      heartCounts = JSON.parse(
        localStorage.getItem("bemyguest_hearts") || "{}",
      );
    } catch {}
    const currentCount = heartCounts[commentId] || 0;
    if (currentCount >= MAX_HEARTS_PER_COMMENT) {
      showToast("진정하세요! 이 댓글엔 이미 사랑을 듬뿍(최대치) 보냈어요 🐹");
      return;
    }
    heartCounts[commentId] = currentCount + 1;
    localStorage.setItem("bemyguest_hearts", JSON.stringify(heartCounts));
    setComments((previous) =>
      previous.map((comment) =>
        comment.id === commentId
          ? { ...comment, heart_count: (comment.heart_count || 0) + 1 }
          : comment,
      ),
    );
    const id = Date.now() + Math.random();
    setFloatingHearts((previous) => [...previous, { id, commentId }]);
    setTimeout(
      () =>
        setFloatingHearts((previous) =>
          previous.filter((heart) => heart.id !== id),
        ),
      700,
    );
    const { error } = await supabase.rpc("increment_comment_heart", {
      comment_id: commentId,
    });
    if (error) console.error(error);
  };
  const fetchGifs = async (query = "") => {
    if (!GIPHY_API_KEY) return;
    setIsGifLoading(true);
    try {
      const endpoint = query.trim()
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=24&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=24&rating=g`;
      const json = await (await fetch(endpoint)).json();
      if (json.data) setGifList(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGifLoading(false);
    }
  };
  const handleTimestampInput = (
    value: string,
    setter: (value: string) => void,
  ) => {
    const digits = value.replace(/[^0-9]/g, "").slice(0, 4);
    setter(
      digits.length >= 3
        ? `${digits.slice(0, -2)}:${digits.slice(-2)}`
        : digits,
    );
  };
  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    if (botTrap) return;
    if (/https?:\/\/|www\./i.test(content)) {
      alert("링크(URL)는 등록할 수 없습니다.");
      return;
    }
    if (
      !nickname.trim() ||
      !password.trim() ||
      (!content.trim() && !selectedGif)
    ) {
      alert("닉네임, 비밀번호 및 내용이나 GIF를 입력해주세요.");
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
        gif_url: selectedGif || null,
        is_spoiler: isSpoiler,
      },
    ]);
    setIsSubmitting(false);
    if (error) alert("댓글 등록에 실패했습니다.");
    else {
      localStorage.setItem("bemyguest_nickname", nickname.trim());
      localStorage.setItem("bemyguest_password", password.trim());
      setContent("");
      setTimestampTag("");
      setSelectedGif(null);
      setIsSpoiler(false);
      fetchComments();
    }
  };
  const openModal = (comment: Comment, type: CommentModalType) => {
    setModalComment(comment);
    setModalType(type);
    setModalPassword(localStorage.getItem("bemyguest_password") || "");
    if (type === "edit") {
      setEditContent(comment.content);
      setEditTimestampTag(comment.timestamp_tag || "");
      setEditGifUrl(comment.gif_url || null);
    }
  };
  const closeModal = () => {
    setModalComment(null);
    setModalType(null);
    setModalPassword("");
    setEditContent("");
    setEditTimestampTag("");
    setEditGifUrl(null);
  };
  const verifyPassword = async () => {
    if (!modalComment || !modalPassword.trim()) {
      alert("비밀번호 4자리를 입력해주세요.");
      return false;
    }
    const { data, error } = await supabase
      .from("comments")
      .select("id")
      .eq("id", modalComment.id)
      .eq("password", modalPassword.trim());
    if (error || !data?.length) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }
    return true;
  };
  const handleEditSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    if (!editContent.trim() && !editGifUrl) {
      alert("내용을 입력해주세요.");
      return;
    }
    setIsProcessing(true);
    if (!(await verifyPassword())) {
      setIsProcessing(false);
      return;
    }
    const { error } = await supabase
      .from("comments")
      .update({
        content: editContent.trim(),
        timestamp_tag: editTimestampTag.trim() || null,
        gif_url: editGifUrl || null,
      })
      .eq("id", modalComment!.id);
    setIsProcessing(false);
    if (error) alert("수정 중 오류가 발생했습니다.");
    else {
      alert("댓글이 수정되었습니다.");
      closeModal();
      fetchComments();
    }
  };
  const handleDeleteSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    if (!(await verifyPassword())) {
      setIsProcessing(false);
      return;
    }
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", modalComment!.id);
    setIsProcessing(false);
    if (error) alert("삭제 중 오류가 발생했습니다.");
    else {
      alert("댓글이 삭제되었습니다.");
      closeModal();
      fetchComments();
    }
  };
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "latest")
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    const timeA = parseTimeToSeconds(a.timestamp_tag),
      timeB = parseTimeToSeconds(b.timestamp_tag);
    if (timeA === null && timeB === null) return 0;
    if (timeA === null) return 1;
    if (timeB === null) return -1;
    return timeA - timeB;
  });

  return (
    <>
      {toastMessage && (
        <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 animate-bounce rounded-full border border-rose-500/40 bg-neutral-200/95 px-4 py-2 text-xs font-semibold text-rose-300 shadow-2xl backdrop-blur-md">
          {toastMessage}
        </div>
      )}
      <EpisodeHeader
        episodeId={episodeId}
        previousEpisodeId={previousEpisodeId}
        nextEpisodeId={nextEpisodeId}
      />
      <EpisodeNotices
        currentEpisodeId={currentEpisodeId}
        showBanner={showBanner}
        onCloseBanner={() => {
          localStorage.setItem(BANNER_STORAGE_KEY, "true");
          setShowBanner(false);
        }}
      />
      <CommentForm
        nickname={nickname}
        password={password}
        timestampTag={timestampTag}
        content={content}
        selectedGif={selectedGif}
        isSpoiler={isSpoiler}
        botTrap={botTrap}
        isSubmitting={isSubmitting}
        onNicknameChange={setNickname}
        onPasswordChange={setPassword}
        onTimestampChange={(value) =>
          handleTimestampInput(value, setTimestampTag)
        }
        onContentChange={setContent}
        onSpoilerChange={setIsSpoiler}
        onBotTrapChange={setBotTrap}
        onRemoveGif={() => setSelectedGif(null)}
        onOpenGifModal={() => {
          setIsGifModalOpen(true);
          if (!gifList.length) fetchGifs();
        }}
        onSubmit={handleSubmit}
      />
      <CommentsSection
        comments={sortedComments}
        isLoading={isLoading}
        sortBy={sortBy}
        floatingHearts={floatingHearts}
        onSortChange={setSortBy}
        onRefresh={fetchComments}
        onEdit={(comment) => openModal(comment, "edit")}
        onDelete={(comment) => openModal(comment, "delete")}
        onHeart={handleHeartClick}
      />
      <EpisodeFooter
        previousEpisodeId={previousEpisodeId}
        nextEpisodeId={nextEpisodeId}
      />
      <GifModal
        isOpen={isGifModalOpen}
        query={gifSearchQuery}
        gifs={gifList}
        isLoading={isGifLoading}
        onClose={() => setIsGifModalOpen(false)}
        onQueryChange={setGifSearchQuery}
        onSearch={() => fetchGifs(gifSearchQuery)}
        onSelect={(url) => {
          setSelectedGif(url);
          setIsGifModalOpen(false);
          setGifSearchQuery("");
        }}
      />
      <CommentModal
        type={modalType}
        comment={modalComment}
        password={modalPassword}
        content={editContent}
        timestampTag={editTimestampTag}
        gifUrl={editGifUrl}
        isProcessing={isProcessing}
        onClose={closeModal}
        onPasswordChange={setModalPassword}
        onContentChange={setEditContent}
        onTimestampChange={(value) =>
          handleTimestampInput(value, setEditTimestampTag)
        }
        onRemoveGif={() => setEditGifUrl(null)}
        onSubmit={
          modalType === "delete" ? handleDeleteSubmit : handleEditSubmit
        }
      />
    </>
  );
}
