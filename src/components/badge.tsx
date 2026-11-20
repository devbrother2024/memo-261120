import { labelStyles } from "@/lib/label-styles";
import type { LabelColor } from "@/lib/memos";

/** Badge — 메모의 분류 배지. 색은 메모의 색 라벨을 따른다 */
export function Badge({ color, children }: { color: LabelColor; children: React.ReactNode }) {
  const { soft, text } = labelStyles[color];
  return (
    <span className={`inline-flex h-6.5 items-center rounded-full px-space-8 text-caption-sm ${soft} ${text}`}>
      {children}
    </span>
  );
}
