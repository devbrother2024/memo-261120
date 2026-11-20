import { blocksPreview } from "./blocks";
import { formatDetailDate, formatListDate } from "./format-date";
import { toBlocks, toCategory, toColor } from "./memo-parse";
import type { Memo } from "./memos";
import { createSupabase } from "./supabase";

/** Supabase memos 표의 한 줄 */
type MemoRow = {
  id: string;
  title: string;
  preview: string;
  category: string;
  color: string;
  pinned: boolean;
  blocks: unknown;
  created_at: string;
};

const COLUMNS = "id, title, preview, category, color, pinned, blocks, created_at";

function toMemo(row: MemoRow, now: Date): Memo {
  const created = new Date(row.created_at);
  const blocks = toBlocks(row.blocks);
  return {
    id: row.id,
    title: row.title,
    preview: row.preview || blocksPreview(blocks),
    listDate: formatListDate(created, now),
    detailDate: formatDetailDate(created),
    category: toCategory(row.category),
    color: toColor(row.color),
    pinned: row.pinned,
    blocks,
  };
}

/** 모든 메모 (최신순). 고정한 메모를 위로 올리는 일은 화면에서 한다 */
export async function getMemos(now: Date): Promise<Memo[]> {
  const { data, error } = await createSupabase().from("memos").select(COLUMNS).order("created_at", { ascending: false });
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  return (data as MemoRow[]).map((row) => toMemo(row, now));
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 메모 하나. 없거나 id 모양이 틀리면 null */
export async function getMemo(id: string, now: Date): Promise<Memo | null> {
  if (!UUID.test(id)) return null;
  const { data, error } = await createSupabase().from("memos").select(COLUMNS).eq("id", id).maybeSingle();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  return data ? toMemo(data as MemoRow, now) : null;
}
