export const parseTimeToSeconds = (timeStr: string | null): number | null => {
  if (!timeStr) return null;
  const clean = timeStr.trim();
  const mmssMatch = clean.match(/^(\d{1,2}):([0-5]\d)$/);

  if (mmssMatch) {
    const total = Number(mmssMatch[1]) * 60 + Number(mmssMatch[2]);
    return total <= 600 ? total : null;
  }

  if (/^\d{1,3}$/.test(clean)) {
    const total = Number(clean);
    return total <= 600 ? total : null;
  }

  return null;
};

export const formatCommentDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
};
