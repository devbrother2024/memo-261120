import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { MemoDetailView } from "@/components/memo-detail-view";
import { getMemo } from "@/lib/memo-db";

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
  await connection();
  const memo = await getMemo(id, new Date());
  if (!memo) notFound();
  return <MemoDetailView memo={memo} />;
}
