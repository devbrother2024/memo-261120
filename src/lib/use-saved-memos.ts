"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Memo } from "./memos";
import { getMemosSnapshot, parseMemos, subscribe, toMemo } from "./memo-store";

/**
 * 이 브라우저에 저장한 메모 (최신순).
 * ready 가 false 인 동안은 서버 렌더/하이드레이션 중이라 아직 저장소를 읽지 못한 상태다.
 */
export function useSavedMemos(): { ready: boolean; memos: Memo[] } {
  // 서버에서는 저장소가 없어서 undefined(아직 모름), 브라우저에서는 문자열 또는 null(저장한 게 없음)
  const raw = useSyncExternalStore<string | null | undefined>(subscribe, getMemosSnapshot, () => undefined);

  return useMemo(() => {
    if (raw === undefined) return { ready: false, memos: [] };
    const now = new Date();
    const memos = parseMemos(raw)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((stored) => toMemo(stored, now));
    return { ready: true, memos };
  }, [raw]);
}
