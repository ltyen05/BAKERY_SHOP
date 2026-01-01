export function timeAgo(dateTime, now) {
  const past = new Date(dateTime); // ✅ parse được RFC 1123

  if (isNaN(past.getTime())) return "";

  const diffMs = now - past;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 60) {
    return `${diffSeconds}s trước`;
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }

  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  return past.toLocaleDateString("vi-VN");
}
