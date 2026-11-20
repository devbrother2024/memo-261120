import { Suspense } from "react";
import { connection } from "next/server";
import { ButtonPrimary } from "@/components/button-primary";
import { MemoBrowser } from "@/components/memo-browser";
import { Screen } from "@/components/screen";
import { formatToday } from "@/lib/format-date";
import { getMemos } from "@/lib/memo-db";

/** 홈 — Figma Mobile/Home */
export default function Home() {
  return (
    <Screen className="pt-space-64">
      <main className="flex flex-1 flex-col gap-space-16">
        {/* 메모와 오늘 날짜는 요청할 때마다 Supabase 에서 새로 읽는다 */}
        <Suspense fallback={null}>
          <HomeContent />
        </Suspense>
      </main>
      <ButtonPrimary icon label="새 메모 쓰기" href="/write" />
    </Screen>
  );
}

async function HomeContent() {
  await connection();
  const now = new Date();
  const memos = await getMemos(now);

  return (
    <>
      <header className="flex flex-col gap-space-8 px-space-8">
        <p className="text-caption-md text-text-muted">{formatToday(now)}</p>
        <h1 className="text-heading-xl text-text-primary">
          오늘까지 메모를
          <br />
          <span className="text-primary">{memos.length}개</span> 남겼어요
        </h1>
      </header>
      <MemoBrowser memos={memos} />
    </>
  );
}
