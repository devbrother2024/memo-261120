/** 날짜는 서버(어느 나라에 있든)와 브라우저에서 같게 보이도록 한국 시간으로 계산한다 */
const TIME_ZONE = "Asia/Seoul";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
  weekday: "short",
});

const WEEKDAYS: Record<string, string> = { Sun: "일", Mon: "월", Tue: "화", Wed: "수", Thu: "목", Fri: "금", Sat: "토" };

function kst(date: Date) {
  const get = (type: Intl.DateTimeFormatPartTypes) => formatter.formatToParts(date).find((p) => p.type === type)?.value ?? "";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    weekday: WEEKDAYS[get("weekday")] ?? "",
  };
}

/** 홈 목록의 날짜: 오늘, 어제, 그 이전은 "10월 30일" */
export function formatListDate(created: Date, now: Date): string {
  const c = kst(created);
  const n = kst(now);
  const days = Math.round((Date.UTC(n.year, n.month - 1, n.day) - Date.UTC(c.year, c.month - 1, c.day)) / 86_400_000);
  if (days <= 0) return "오늘";
  if (days === 1) return "어제";
  return `${c.month}월 ${c.day}일`;
}

/** 상세 화면의 날짜: "10월 30일 오전 9:12" */
export function formatDetailDate(created: Date): string {
  const c = kst(created);
  const period = c.hour < 12 ? "오전" : "오후";
  const hour12 = c.hour % 12 === 0 ? 12 : c.hour % 12;
  return `${c.month}월 ${c.day}일 ${period} ${hour12}:${String(c.minute).padStart(2, "0")}`;
}

/** 홈 위쪽 날짜: "10월 30일 금요일" */
export function formatToday(now: Date): string {
  const n = kst(now);
  return `${n.month}월 ${n.day}일 ${n.weekday}요일`;
}
