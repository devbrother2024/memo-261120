import { Suspense } from "react";
import { MemoDetailView } from "@/components/memo-detail-view";
import { SavedMemoDetail } from "@/components/saved-memo-detail";
import { findMemo, memos } from "@/lib/memos";

export function generateStaticParams() {
  return memos.map((memo) => ({ id: memo.id }));
}

/** 메모 상세 — Figma Mobile/Detail */
export default function MemoDetailPage({ params }: PageProps<"/memos/[id]">) {
  return (
    <Suspense fallback={null}>
      <MemoDetail params={params} />
    </Suspense>
  );
}

async function MemoDetail({ params }: Pick<PageProps<"/memos/[id]">, "params">) {
  const { id } = await params;
  const memo = findMemo(id);
  // 샘플 메모는 서버에서, 그 밖의 id 는 이 브라우저에 저장한 메모인지 브라우저에서 찾는다
  return memo ? <MemoDetailView memo={memo} /> : <SavedMemoDetail id={id} />;
}
