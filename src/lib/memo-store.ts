import { toBlocks, toCategory, toColor } from "./memo-parse";
import type { Block, Category, LabelColor } from "./memos";

/**
 * 작성 중인 글(임시 저장)은 이 브라우저(localStorage)에만 둔다.
 *  - memo-app:draft : 작성 중인 글 (자동 저장)
 * 저장하기를 누른 메모는 Supabase 에 저장된다 (lib/memo-db.ts, lib/memo-actions.ts).
 */
const DRAFT_KEY = "memo-app:draft";
const CHANGE_EVENT = "memo-app:change";

export type Draft = {
  title: string;
  category: Category;
  color: LabelColor;
  blocks: Block[];
};

/* ───────── 저장소 읽기/쓰기 (localStorage 를 못 쓰는 환경에서도 죽지 않게) ───────── */

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): boolean {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event(CHANGE_EVENT)); // 같은 탭에서는 storage 이벤트가 안 와서 직접 알린다
    return true;
  } catch {
    return false;
  }
}

/** useSyncExternalStore 용: 다른 탭의 변경(storage)과 이 탭의 변경(CHANGE_EVENT)을 모두 알린다 */
export function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export const getDraftSnapshot = () => read(DRAFT_KEY);

export function parseDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  return {
    title: typeof d.title === "string" ? d.title : "",
    category: toCategory(d.category),
    color: toColor(d.color),
    blocks: toBlocks(d.blocks),
  };
}

export const saveDraft = (draft: Draft) => write(DRAFT_KEY, JSON.stringify(draft));
export const clearDraft = () => write(DRAFT_KEY, null);
