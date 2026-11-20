import { blocksPreview } from "./blocks";
import { categories, labelColors, type Block, type Category, type LabelColor, type Memo, type TextPart } from "./memos";

/**
 * 이 브라우저(localStorage)에 메모를 저장한다.
 *  - memo-app:memos : 저장한 메모 목록
 *  - memo-app:draft : 작성 중인 글 (자동 저장)
 */
const MEMOS_KEY = "memo-app:memos";
const DRAFT_KEY = "memo-app:draft";
const CHANGE_EVENT = "memo-app:change";

export type StoredMemo = {
  id: string;
  title: string;
  category: Category;
  color: LabelColor;
  blocks: Block[];
  createdAt: number;
};

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

export const getMemosSnapshot = () => read(MEMOS_KEY);
export const getDraftSnapshot = () => read(DRAFT_KEY);

/* ───────── 저장된 글 검사 (손으로 고친 값이 들어 있어도 안전하게) ───────── */

const isPart = (x: unknown): x is TextPart =>
  typeof x === "object" && x !== null && typeof (x as TextPart).text === "string";

const isBlock = (x: unknown): x is Block => {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  switch (b.type) {
    case "heading":
    case "subheading":
      return typeof b.text === "string";
    case "paragraph":
      return Array.isArray(b.parts) && b.parts.every(isPart);
    case "list":
      return Array.isArray(b.items) && b.items.every((item) => Array.isArray(item) && item.every(isPart));
    default:
      return false;
  }
};

const toBlocks = (x: unknown): Block[] => (Array.isArray(x) ? x.filter(isBlock) : []);
const toCategory = (x: unknown): Category => (categories.includes(x as Category) ? (x as Category) : "개인");
const toColor = (x: unknown): LabelColor => (labelColors.includes(x as LabelColor) ? (x as LabelColor) : "green");

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseMemos(raw: string | null): StoredMemo[] {
  const data = parseJson(raw);
  if (!Array.isArray(data)) return [];
  const result: StoredMemo[] = [];
  for (const item of data) {
    if (typeof item !== "object" || item === null) continue;
    const m = item as Record<string, unknown>;
    if (typeof m.id !== "string" || typeof m.title !== "string" || typeof m.createdAt !== "number") continue;
    result.push({
      id: m.id,
      title: m.title,
      category: toCategory(m.category),
      color: toColor(m.color),
      blocks: toBlocks(m.blocks),
      createdAt: m.createdAt,
    });
  }
  return result;
}

export function parseDraft(raw: string | null): Draft | null {
  const data = parseJson(raw);
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  return {
    title: typeof d.title === "string" ? d.title : "",
    category: toCategory(d.category),
    color: toColor(d.color),
    blocks: toBlocks(d.blocks),
  };
}

/* ───────── 저장 / 임시 저장 ───────── */

export function saveMemo(input: Draft): boolean {
  const memo: StoredMemo = {
    id: `m-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    title: input.title,
    category: input.category,
    color: input.color,
    blocks: input.blocks,
    createdAt: Date.now(),
  };
  const current = parseMemos(read(MEMOS_KEY));
  return write(MEMOS_KEY, JSON.stringify([memo, ...current]));
}

export const saveDraft = (draft: Draft) => write(DRAFT_KEY, JSON.stringify(draft));
export const clearDraft = () => write(DRAFT_KEY, null);

/* ───────── 화면에 보일 Memo 로 바꾸기 ───────── */

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

function formatListDate(created: Date, now: Date): string {
  const days = Math.round((startOfDay(now) - startOfDay(created)) / 86_400_000);
  if (days <= 0) return "오늘";
  if (days === 1) return "어제";
  return `${created.getMonth() + 1}월 ${created.getDate()}일`;
}

function formatDetailDate(created: Date): string {
  const hours = created.getHours();
  const period = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(created.getMinutes()).padStart(2, "0");
  return `${created.getMonth() + 1}월 ${created.getDate()}일 ${period} ${hour12}:${minutes}`;
}

export function toMemo(stored: StoredMemo, now: Date): Memo {
  const created = new Date(stored.createdAt);
  return {
    id: stored.id,
    title: stored.title,
    preview: blocksPreview(stored.blocks),
    listDate: formatListDate(created, now),
    detailDate: formatDetailDate(created),
    category: stored.category,
    color: stored.color,
    pinned: false,
    blocks: stored.blocks,
  };
}
