import { labelNames, labelStyles } from "@/lib/label-styles";
import type { LabelColor } from "@/lib/memos";

/** Label/Dot — 색 라벨 고르기. 고른 색은 바깥에 파란 테두리(2px) */
export function ColorDot({
  color,
  selected = false,
  onClick,
}: {
  color: LabelColor;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${labelNames[color]} 색`}
      aria-pressed={selected}
      onClick={onClick}
      className={`flex size-8 shrink-0 items-center justify-center rounded-full border-primary active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected ? "border-2" : "border-0"
      }`}
    >
      <span className={`size-5.5 rounded-full ${labelStyles[color].solid}`} />
    </button>
  );
}
