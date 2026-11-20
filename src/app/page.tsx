import { ButtonPrimary } from "@/components/button-primary";
import { MemoBrowser } from "@/components/memo-browser";
import { Screen } from "@/components/screen";
import { memos } from "@/lib/memos";

/** 홈 — Figma Mobile/Home */
export default function Home() {
  return (
    <Screen className="pt-space-64">
      <main className="flex flex-1 flex-col gap-space-16">
        <header className="flex flex-col gap-space-8 px-space-8">
          <p className="text-caption-md text-text-muted">10월 30일 금요일</p>
          <h1 className="text-heading-xl text-text-primary">
            오늘까지 메모를
            <br />
            <span className="text-primary">128개</span> 남겼어요
          </h1>
        </header>
        <MemoBrowser memos={memos} />
      </main>
      <ButtonPrimary icon label="새 메모 쓰기" href="/write" />
    </Screen>
  );
}
