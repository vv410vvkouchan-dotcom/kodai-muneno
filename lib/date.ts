export function formatJpDate(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
}

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
