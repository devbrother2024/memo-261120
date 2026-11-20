"use client";

import { notFound } from "next/navigation";
import { useSavedMemos } from "@/lib/use-saved-memos";
import { MemoDetailView } from "./memo-detail-view";
import { Screen } from "./screen";

/** 이 브라우저(localStorage)에 저장한 메모의 상세. 서버는 저장소를 볼 수 없어서 브라우저에서 찾는다 */
export function SavedMemoDetail({ id }: { id: string }) {
  const { ready, memos } = useSavedMemos();
  if (!ready) return <Screen className="pt-space-48" />;

  const memo = memos.find((m) => m.id === id);
  if (!memo) notFound();
  return <MemoDetailView memo={memo} />;
}
