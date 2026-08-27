export type ArchiveItemType =
  "youtube_short" | "youtube_long" | "insta" | "news" | "post";

export interface RawArchiveItem {
  id: string;
  type: ArchiveItemType;
  category: "drama" | "actor";
  badge: string;
  url: string;
  title?: string;
  desc?: string;
  date?: string;
  thumbnail?: string;
}

export interface ArchiveItem extends RawArchiveItem {
  title: string;
  thumbnail: string;
  youtubeId?: string;
}

export interface ActiveVideo {
  id: string;
  isShort: boolean;
}
