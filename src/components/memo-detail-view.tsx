import type { Memo } from "@/lib/memos";
import { Badge } from "./badge";
import { ButtonPrimary } from "./button-primary";
import { IconButton } from "./icon-button";
import { MemoBody } from "./memo-body";
import { Screen } from "./screen";

/** 메모 상세 화면 — Figma Mobile/Detail */
export function MemoDetailView({ memo }: { memo: Memo }) {
  return (
    <Screen className="pt-space-48">
      <nav aria-label="메모 도구" className="flex items-center justify-between">
        <IconButton icon="chevron-left" label="뒤로가기" href="/" />
        <div className="flex">
          <IconButton icon="pin-24" label="고정" />
          <IconButton icon="share" label="공유" />
          <IconButton icon="more" label="더보기" />
        </div>
      </nav>

      <main className="flex flex-1 flex-col">
        <article className="flex flex-col gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-24">
          <div className="flex items-center gap-space-8">
            <Badge color={memo.color}>{memo.category}</Badge>
            <span className="text-caption-sm text-text-muted">{memo.detailDate}</span>
          </div>
          <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
          <hr className="h-px border-0 bg-border-default" />
          <MemoBody blocks={memo.blocks} />
        </article>
      </main>

      <ButtonPrimary label="수정하기" />
    </Screen>
  );
}
