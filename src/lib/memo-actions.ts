"use server";

import { revalidatePath } from "next/cache";
import { blocksPreview } from "./blocks";
import { isCategory, isLabelColor, toBlocks } from "./memo-parse";
import type { Block, Category, LabelColor } from "./memos";
import { createSupabase } from "./supabase";

export type NewMemo = {
  title: string;
  category: Category;
  color: LabelColor;
  blocks: Block[];
};

export type CreateMemoResult = { ok: true; id: string } | { ok: false; message: string };

/** 작성 화면의 저장하기: 새 메모를 Supabase 에 저장한다 */
export async function createMemo(input: NewMemo): Promise<CreateMemoResult> {
  // 서버 함수는 누구나 부를 수 있어서 받은 값을 다시 검사한다
  const title = typeof input?.title === "string" ? input.title.trim() : "";
  if (!title) return { ok: false, message: "제목을 입력해 주세요" };
  if (title.length > 100) return { ok: false, message: "제목은 100자까지 쓸 수 있어요" };
  if (!isCategory(input.category) || !isLabelColor(input.color)) {
    return { ok: false, message: "분류와 색을 다시 골라 주세요" };
  }

  const blocks = toBlocks(input.blocks);
  const { data, error } = await createSupabase()
    .from("memos")
    .insert({ title, preview: blocksPreview(blocks), category: input.category, color: input.color, blocks })
    .select("id")
    .single();
  if (error) return { ok: false, message: "메모를 저장하지 못했어요" };

  revalidatePath("/"); // 홈 목록과 메모 수가 바로 새로 보이게
  return { ok: true, id: data.id };
}
