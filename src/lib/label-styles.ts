import type { LabelColor } from "./memos";

/** 메모의 색 라벨 → 디자인 토큰 클래스 (label/* 변수) */
export const labelStyles: Record<LabelColor, { solid: string; soft: string; text: string }> = {
  blue: { solid: "bg-label-blue", soft: "bg-label-blue-soft", text: "text-label-blue" },
  green: { solid: "bg-label-green", soft: "bg-label-green-soft", text: "text-label-green" },
  orange: { solid: "bg-label-orange", soft: "bg-label-orange-soft", text: "text-label-orange" },
  pink: { solid: "bg-label-pink", soft: "bg-label-pink-soft", text: "text-label-pink" },
};

/** 화면 낭독용 색 이름 */
export const labelNames: Record<LabelColor, string> = {
  blue: "파랑",
  green: "초록",
  orange: "주황",
  pink: "분홍",
};
