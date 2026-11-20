"use client";

import { useState } from "react";
import { categories, type Category, type Memo } from "@/lib/memos";
import { Card, CardHeader } from "./card";
import { Chip } from "./chip";
import { MemoItem } from "./memo-item";

const filters = ["전체", ...categories] as const;
type Selected = "전체" | Category;

/**
 * 분류 칩 + 메모 카드(고정한 메모, 최근 메모). 칩을 누르면 그 분류의 메모만 보인다.
 * 메모는 Supabase 에서 읽어 온 것이고, 최신순으로 들어온다.
 */
export function MemoBrowser({ memos }: { memos: Memo[] }) {
  const [selected, setSelected] = useState<Selected>("전체");

  const visible = selected === "전체" ? memos : memos.filter((memo) => memo.category === selected);
  const pinned = visible.filter((memo) => memo.pinned);
  const recent = visible.filter((memo) => !memo.pinned);

  return (
    <>
      <div role="group" aria-label="메모 분류" className="flex gap-space-8 px-space-4">
        {filters.map((filter) => (
          <Chip key={filter} selected={selected === filter} onClick={() => setSelected(filter)}>
            {filter}
          </Chip>
        ))}
      </div>

      {pinned.length > 0 && (
        <Card label="고정한 메모">
          <CardHeader title="고정한 메모" pin />
          {pinned.map((memo) => (
            <MemoItem key={memo.id} memo={memo} />
          ))}
        </Card>
      )}

      {recent.length > 0 && (
        <Card label="최근 메모">
          <CardHeader title="최근 메모" action />
          {recent.map((memo) => (
            <MemoItem key={memo.id} memo={memo} />
          ))}
        </Card>
      )}
    </>
  );
}
