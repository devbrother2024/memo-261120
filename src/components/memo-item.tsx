import Link from "next/link";
import { labelStyles } from "@/lib/label-styles";
import type { Memo } from "@/lib/memos";
import { Icon } from "./icon";

/** Memo/Item — 메모 목록의 한 줄. 누르면 메모 상세로 이동한다. 미리보기는 1줄까지 보이고 넘치면 말줄임 */
export function MemoItem({ memo }: { memo: Memo }) {
  const { soft, text } = labelStyles[memo.color];
  return (
    <Link
      href={`/memos/${memo.id}`}
      className="flex min-h-18 items-center gap-space-16 px-space-20 py-space-12 active:opacity-70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
    >
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-sm ${soft} ${text}`}>
        <Icon name="note" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-space-4">
        <span className="truncate text-title-md text-text-primary">{memo.title}</span>
        {memo.preview && <span className="truncate text-body-sm text-text-secondary">{memo.preview}</span>}
      </span>
      <span className="shrink-0 text-caption-sm text-text-muted">{memo.listDate}</span>
    </Link>
  );
}
