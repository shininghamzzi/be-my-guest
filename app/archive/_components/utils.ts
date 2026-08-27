import type { ArchiveItem, RawArchiveItem } from "./types";

export function isYouTubeItem(item: RawArchiveItem) {
  return item.type === "youtube_short" || item.type === "youtube_long";
}

export function parseYouTubeUrl(url: string) {
  const match = url.match(
    /(?:shorts\/|v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/,
  );
  const youtubeId = match?.[1];

  return {
    youtubeId,
    thumbnail: youtubeId
      ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
      : "",
  };
}

export function formatArchiveItem(item: RawArchiveItem): ArchiveItem {
  const youtube = isYouTubeItem(item);
  const { youtubeId, thumbnail } = youtube
    ? parseYouTubeUrl(item.url)
    : { youtubeId: undefined, thumbnail: "" };

  return {
    ...item,
    title: item.title ?? (youtube ? "영상 불러오는 중..." : ""),
    thumbnail: item.thumbnail || thumbnail,
    youtubeId,
  };
}
